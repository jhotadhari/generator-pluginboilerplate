'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var childProcess = require('child_process');
var glob = require('glob');
var path = require('path');
var slugg = require('slugg');
var fs = require('fs');
var dirTree = require('directory-tree');
var iterator = require('object-recursive-iterator');


module.exports = Generator.extend({
	// https://gist.github.com/codeitagile/19e7be070b6ef46c21d2
	_bulkCopyTpl: function( source, destination, data, options ) {

		// parse options
		var defaults = {
			prependFunctionPrefix: true,
		};
		options = Object.assign( defaults, ( options === undefined ? {} : options ) );

		// find files
		var files = glob.sync('**', { dot: true, cwd: source });

		// loop files
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			var src = path.join(source, f);
			var fileName, dest;
			if ( path.basename(f).indexOf('_') === 0 && path.basename(f).slice(-1) != '~' ){

				// define fileName
				fileName = path.basename(f);
				if ( options.prependFunctionPrefix === true ){
					if ( fileName.startsWith('_class-') ) {
						fileName = fileName.replace(/^_class-/, 'class-' + this.props.funcPrefix + '_');
					} else {
						fileName = fileName.replace(/^_/, this.props.funcPrefix + '_');
					}
				} else {
					fileName = fileName.replace(/^_/, '');
				}

				// define destination
				dest = path.join(
					destination,
					path.dirname(f),
					fileName
				);

				// copy template
				this.fs.copyTpl( src, dest, data);
			}
		}
	},

	_mkdirRec: function () {

		var tree = [];
		iterator.forAll(dirTree(this.templatePath(), {type:'directory'}), function (path, key, obj) {
			if ( obj.type === 'directory' && tree.indexOf(obj.path) === -1 ){
				tree.push(obj.path);
			}
		});
		for (var i = 0; i < tree.length; i++) {
			var dir = tree[i].replace(this.templatePath(), this.destinationPath());
			try {
				// dir exists
				fs.statSync(dir).isDirectory();
			}
			catch (err) {
				// dir does not exist
				console.log(chalk.yellow('   create dir: ') + dir);
				fs.mkdirSync(dir);
			}
		}
	},



	prompting: function () {

		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' generator!'
		));

		var prompts = [
			{
				type: 'input',
				name: 'pluginName',
				message: chalk.green('Name') + '\nThe name/title of your plugin, which will be displayed in the Plugins list in the WordPress Admin',
				default: path.basename(this.destinationPath())
			},
			{
				type: 'input',
				name: 'pluginSlug',
				message: chalk.green('Slug') + '\nYour Plugin slug, used for the main plugin file (hopefully same as the plugin directory)',
				default: slugg(path.basename(this.destinationPath()).trim()),
				validate: function(str) { return slugg(str.trim()) === str ? true : chalk.yellow('You need to provide a slugified string!');}
			},
			{
				type: 'input',
				name: 'funcPrefix',
				message: chalk.green('Function Prefix') + '\na slugified string',
				default: function (response) { return response.pluginSlug; },
				validate: function(str) { return slugg( str.trim(), '_' ) === str ? true : chalk.yellow('You need to provide a slugified string!');}
			},
			{
				type: 'input',
				name: 'pluginTextDomain',
				message: chalk.green('Text Domain') + '\nThe gettext text domain of the plugin.',
				default: function (response) { return response.pluginSlug; },
			},


			{
				type: 'input',
				name: 'vendorSlug',
				message: chalk.green('Vendor Slug') + '\nYour Vendor Slug (used for composer config)',
				default: 'example',
				store: true,
				validate: function(str) { return slugg(str.trim()) === str ? true : chalk.yellow('You need to provide a slugified string!');}
			},
			{
				type: 'input',
				name: 'pluginUri',
				message: chalk.green('Plugin Uri') + '\nThe home page of the plugin, which might be on WordPress.org or on your own website. This must be unique to your plugin.',
				default: 'http://example.com/' + slugg(path.basename(this.destinationPath()).trim())
			},
			{
				type: 'input',
				name: 'pluginDesc',
				message: chalk.green('Description') + '\nA short description of the plugin, as displayed in the Plugins section in the WordPress Admin. Keep this description to fewer than 140 characters.',
				default: 'This is a beautiful plugin'
			},
			{
				type: 'input',
				name: 'pluginAuthor',
				message: chalk.green('Author') + '\nThe name of the plugin author',
				store: true,
				default: 'authorname'
			},
			{
				type: 'input',
				name: 'pluginAuthorUri',
				message: chalk.green('Author Uri') + '\nThe author’s website or profile on another website, such as WordPress.org.',
				store: true,
				default: 'http://example.com/'
			},
			{
				type: 'input',
				name: 'donationLink',
				message: chalk.green('Donation Link') + '\nLink to Plugins donation page.',
				store: true,
				default: 'http://example.com/donate'
			},



			{
				type: 'input',
				name: 'wpRequiresAtLeast',
				message: chalk.green('Requires at least WP version ...?'),
				store: true,
				default: ''
			},
			{
				type: 'input',
				name: 'wpVersionTested',
				message: chalk.green('Tested up to WP Version ...?'),
				store: true,
				default: ''
			},
			{
				type: 'input',
				name: 'phpRequiresAtLeast',
				message: chalk.green('Requires at least php version ...?'),
				store: true,
				default: '5.6'
			},

		];

		return this.prompt(prompts).then(function (props) {
			this.props = props;

			// define uppercase slugs
			this.props.pluginSlugLoDash = this.props.pluginSlug.replace(/-/g, '_');
			this.props.pluginSlugUpperCase = this.props.pluginSlug[0].toUpperCase() + this.props.pluginSlug.substring(1);
			this.props.pluginSlugUpperCaseLoDash = this.props.pluginSlugUpperCase.replace(/-/g, '_');
			this.props.funcPrefixUpperCase = this.props.funcPrefix[0].toUpperCase() + this.props.funcPrefix.substring(1);
			this.props.pluginClass = this.props.funcPrefixUpperCase + '_' + this.props.pluginSlugUpperCaseLoDash;

			// get generator version
			try {
				// file exists
				var generatorPkgPath = path.join(this.sourceRoot(), '../../..', 'package.json' );
				fs.statSync( generatorPkgPath ).isFile();
				this.props.generatorVersion = require(generatorPkgPath).version;
			}
			catch (err) {
				// file does not exist
				console.log('Some error reading generator package.json: ', err);
				this.props.generatorVersion = '';
			}



		}.bind(this));
	},


	writing: {

		config: function () {

			var files, destination;

			// copy directory structure
			this._mkdirRec();



			// Gruntfile
			this.fs.copyTpl(
				this.templatePath('_Gruntfile.js'),
				this.destinationPath('Gruntfile.js'),
				this.props
			);
			this._bulkCopyTpl(
				this.templatePath('grunt/config/'),
				this.destinationPath('grunt/config/'),
				this.props, {
					prependFunctionPrefix: false
				}
			);
			this._bulkCopyTpl(
				this.templatePath('grunt/tasks/'),
				this.destinationPath('grunt/tasks/'),
				this.props, {
					prependFunctionPrefix: false
				}
			);

			// package.json
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				this.props
			);

			// wp_installs		???
			this.fs.copyTpl(
				this.templatePath('_wp_installs.json'),
				this.destinationPath('wp_installs.json'),
				this.props
			);

			// changelog.json
			this.fs.copyTpl(
				this.templatePath('_changelog.json'),
				this.destinationPath('changelog.json'),
				this.props
			);

			// gitignore
			this.fs.copy(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);

			// composer.json
			this.fs.copyTpl(
				this.templatePath('_composer.json'),
				this.destinationPath('composer.json'),
				this.props
			);

		},

		src_plugin_main_file: function () {
			this.fs.copyTpl(
				this.templatePath('src/root_files/_plugin_main_file.php'),
				this.destinationPath('src/root_files/' + this.props.pluginSlug + '.php'),
				this.props
			);
		},

		src_inc: function () {
			this._bulkCopyTpl(
				this.templatePath('src/inc/dep/autoload/'),
				this.destinationPath('src/inc/dep/autoload/'),
				this.props
			);
			this._bulkCopyTpl(
				this.templatePath('src/inc/fun/autoload/'),
				this.destinationPath('src/inc/fun/autoload/'),
				this.props
			);
		},


		src_readme: function () {
			// commit_msg
			this.fs.copyTpl(
				this.templatePath('src/readme/readme.txt'),
				this.destinationPath('src/readme/readme.txt'),
				this.props
			);
		},

		src_sass: function () {
			this._bulkCopyTpl(
				this.templatePath('src/sass/'),
				this.destinationPath('src/sass/'),
				this.props
			);
		},

	},



	install: function () {

		this.installDependencies({
			bower: false,
			npm: true,
			callback: function () {
				var cmd = '';

				cmd = 'grunt build';
				// cmd = 'grunt build --composer=false';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );

				cmd = 'git init';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );

				cmd = 'git add .';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );

				cmd = 'git commit -m "Hurray, just generated a new plugin!"';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );

				console.log('');
				console.log('Everything is ready!');
				console.log('');

			}
		});

	},

});
