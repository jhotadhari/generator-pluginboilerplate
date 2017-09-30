'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var childProcess = require('child_process');
var glob = require('glob');
var path = require('path');


function arrayContains( array, needle ) {
	var i;
	for (i in array) {
		if (array[i] == needle) return true;
	}
	return false;
}


var slug = {
	slugify: function( str ){
		return str.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of str
			.replace(/-+$/, '');            // Trim - from end of str	
	},
	isSlugified: function( str ){
		if (
			/[A-Z]/.exec(str)
			|| /\s+/.exec(str)
			|| /[^\w\-]+/.exec(str)
			|| /\-\-+/.exec(str)
			|| /^-+/.exec(str)
			|| /-+$/.exec(str)
			) {
			return false;
		}
		return true;		
	},
	validateIsSlugified: function( str ){
		if (! slug.isSlugified( str )) {
			return chalk.yellow('You need to provide a slugified string!');
		}
		return true;
	}
}

var composerPkgs = {
	pkgs:  {
		cmb2Tax: {
			name: "jcchavezs/cmb2-taxonomy",
			version:"*",
			repository:{
				type: "package",
				package: {
					name: "jcchavezs/cmb2-taxonomy",
					version: "0.0.0",
					source: {
						url: "https://github.com/jcchavezs/cmb2-taxonomy.git",
						type: "git",
						reference: "master"
					}
				}
			}
		},
		cmb2qTrans: {
			name: "jmarceli/integration-cmb2-qtranslate",
			version:"0.1.1",
			repository:{
				type: "package",
				package: {
					name: "jmarceli/integration-cmb2-qtranslate",
					version: "0.1.1",
					source: {
						url: "https://github.com/jmarceli/integration-cmb2-qtranslate.git",
						type: "git",
						reference: "0.1.1"
					}
				}
			}
		},
		cmb2: {
			name: "webdevstudios/cmb2",
			version:"2.2.3.1",
			installerPath:"vendor/{$vendor}/{$name}",
		},
		composerInstallers: {
			name: "composer/installers",
			version:"1.1.0",
		}
	},
	
	getPkgsKeys: function () {
		var pkgsKeys = [];
		for (var key in this.pkgs) {
			if (this.pkgs.hasOwnProperty(key)) {
				pkgsKeys.push(key);
			}
		}
		return pkgsKeys;	
	},
	getRepositories: function ( include, returnType ) {
		var i;
		var repositories = [];
		for (i = 0; i < include.length; i++) {
			if ( typeof this.pkgs[include[i]].repository != 'undefined' ){
				repositories.push(this.pkgs[include[i]].repository);
			}
		}

		switch(returnType) {
			case 'array':
				return repositories;
				break;
			default:
				var returnStr = JSON.stringify(repositories);
				if ( returnStr.length == 0 ){
					returnStr = '[]';
				}
				return returnStr;
				
		}		
	
	},
	getRequire: function ( include ) {
		var i;
		var require = {};
		for (i = 0; i < include.length; i++) {
			if ( typeof this.pkgs[include[i]].version != 'undefined' ){
				this.pkgs[include[i]].version = '*';
			}
			if ( typeof this.pkgs[include[i]].name != 'undefined' ){
				require[this.pkgs[include[i]].name] = this.pkgs[include[i]].version;
			}
		}
		return JSON.stringify(require);
	},
	getInstallerPaths: function ( include ) {
		var i;
		var installerPaths = {};
		for (i = 0; i < include.length; i++) {
			if ( typeof this.pkgs[include[i]].installerPath != 'undefined' ){
				installerPaths[this.pkgs[include[i]].installerPath] = [this.pkgs[include[i]].name];
			}
		}
		return JSON.stringify(installerPaths);	
	}
}

		
module.exports = Generator.extend({
	
	// https://gist.github.com/codeitagile/19e7be070b6ef46c21d2
	_bulkCopyTpl: function( source, destination, data) {
		var files = glob.sync('**', { dot: true, cwd: source });
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			var src = path.join(source, f);
			var dest;
			if (path.basename(f).indexOf('_') === 0 && path.basename(f).slice(-1) != '~'){
				dest = path.join(
					destination,
					path.dirname(f),
					path.basename(f).replace(/^_/, '')
				);
				this.fs.copyTpl( src, dest, data);
			}
		}
	},
	_bulkCopy: function( source, destination, rmLowdash) {
		var files = glob.sync('**', { dot: true, cwd: source });
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			var src = path.join(source, f);
			var dest;
			if (path.basename(f).slice(-1) != '~'){
				if (rmLowdash === true){
					dest = path.join(
						destination,
						path.dirname(f),
						path.basename(f).replace(/^_/, '')
					);
				} else {
					dest = path.join(
						destination,
						f
					);
				}
				this.fs.copy( src, dest);
			}
		}
	},	
	
	prompting: function () {
		
		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' generator!'
		));
		
		var dirName = this.options.env.cwd.split("/").pop();
		
		var prompts = [
			{
				type: 'input',
				name: 'pluginName',
				message: chalk.green('Name') + '\nThe name/title of your plugin, which will be displayed in the Plugins list in the WordPress Admin',
				default: dirName
			},
			{
				type: 'input',
				name: 'pluginSlug',
				message: chalk.green('Slug') + '\nYour Plugin slug, used for the main plugin file (hopefully same as the plugin directory)',
				default: slug.slugify(dirName),
				validate: slug.validateIsSlugified
			},
			{
				type: 'input',
				name: 'funcPrefix',
				message: chalk.green('Function Prefix') + '\na slugified string',
				default: function (response) { return response.pluginSlug; },
				validate: slug.validateIsSlugified
			},
			{
				type: 'input',
				name: 'pluginTextDomain',
				message: chalk.green('Text Domain') + '\nThe gettext text domain of the plugin.',
				default: function (response) { return response.pluginSlug; },
			},
			{
				type: 'input',
				name: 'vendorName',
				message: chalk.green('Vendor Name') + '\nYour Vendor name (used for composer config)',
				default: 'Waterproof-Webdesign'
			},			
			{
				type: 'input',
				name: 'vendorSlug',
				message: chalk.green('Vendor Slug') + '\nYour Vendor Slug (used for composer config)',
				default: 'waterproof',
				validate: slug.validateIsSlugified
			},				
			{
				type: 'input',
				name: 'pluginUri',
				message: chalk.green('Plugin Uri') + '\nThe home page of the plugin, which might be on WordPress.org or on your own website. This must be unique to your plugin.',
				default: 'http://waterproof-webdesign.info/' + slug.slugify(dirName)
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
				default: 'jhotadhari'
			},	
			{
				type: 'input',
				name: 'pluginAuthorUri',
				message: chalk.green('Author Uri') + '\nThe author’s website or profile on another website, such as WordPress.org.',
				default: 'http://waterproof-webdesign.info/'
			},
			
			
			{
				type: 'input',
				name: 'donationLink',
				message: chalk.green('Donation Link') + '\nLink to Plugins donation page.',
				default: 'http://waterproof-webdesign.info/donate'
			},
			
			
	
			{
				type: 'input',
				name: 'wpRequiresAtLeast',
				message: chalk.green('Requires at least WP version ...?'),
				default: ''
			},	
			{
				type: 'input',
				name: 'wpVersionTested',
				message: chalk.green('Tested up to WP Version ...?'),
				default: ''
			},		
			
			

			
			{
				name: 'styles',
				message: chalk.green('Styles') + '\nBuild styles from scss and enqueue.',
				type: 'checkbox',
				choices: [
					{
						value: 'styleFrontend',
						name: 'Build and enqueue a single concatinated and compressed frontend stylesheet.',
						checked: true
					},
					{
						value: 'styleAdmin',
						name: 'Build and enqueue a single concatinated and compressed admin stylesheet.',
						checked: true
					},
					{
						value: 'styleOptionsPage',
						name: 'Build and enqueue compressed stylesheet for the ... if optionspage',
						checked: true
					},
				],	
			},
			
			{
				when: function(response){
					return response.styles.length > 0;
				},
				name: 'inclSassLibs',
				message: chalk.green('Sass libraries') + '\nInclude some sass libraries?',
				type: 'checkbox',
				choices: [
					{
						value: 'susy',
						name: 'Susy http://susy.oddbird.net/',
						checked: true
					},
					{
						value: 'breakpoint',
						name: 'breakpoint http://breakpoint-sass.com/',
						checked: true
					},
					{
						value: 'bourbon',
						name: 'bourbon http://bourbon.io/',
						checked: true
					},
				],	
			},
			
			
			{
				name: 'scripts',
				message: chalk.green('Scripts') + '\nBuild scripts and register, localize and print them.\nAdds localize class to store values during pageload for localisation in footer.',
				type: 'checkbox',
				choices: [
					{
						value: 'scriptFrontend',
						name: 'Build and enqueue a single concatinated linted and compressed frontend script.',
						checked: true
					},
					{
						value: 'scriptAdmin',
						name: 'Build and enqueue a single concatinated linted and compressed admin script.',
						checked: true
					},
				],	
			},
			
			{
				type: 'confirm',
				name: 'hasImages',
				message: chalk.green('Has Images') + '\nAdd images tasks to Gruntfile.',
				default: 'y'
			},		
			{
				type: 'confirm',
				name: 'hasFonts',
				message: chalk.green('Has Fonts') + '\nAdd fonts tasks to Gruntfile.',
				default: 'y'
			},		
				
			
			
			
			
			
			
			{
				type: 'confirm',
				name: 'inclCMB2',
				message: chalk.green('include CMB2') + '\ninclude CMB2 library https://github.com/WebDevStudios/CMB2',
				default: 'y'
			},
			{
				when: function(response){
					return response.inclCMB2;
				},
				name: 'inclCMB2includes',
				message: chalk.green('OK, so what else to include?') + '\nAll that fancy stuff depends on CMB2',
				type: 'checkbox',
				choices: [
					{
						value: 'cmb2Tax',
						name: 'CMB2 Taxonomy https://github.com/jcchavezs/cmb2-taxonomy',
						checked: true
					},
					{
						value: 'cmb2qTrans',
						name: 'Integration CMB2-qTranslate https://github.com/jmarceli/integration-cmb2-qtranslate',
						checked: true
					},
					{
						value: 'cmb2Options',
						name: 'Options Page',
						checked: true
					},
				],	
			}
		];

		return this.prompt(prompts).then(function (props) {
			this.props = props;
			
			// define uppercase slugs
			this.props.pluginSlugUpperCase = this.props.pluginSlug[0].toUpperCase() + this.props.pluginSlug.substring(1);
			this.props.funcPrefixUpperCase = this.props.funcPrefix[0].toUpperCase() + this.props.funcPrefix.substring(1);
			
			// define composerReps ... the required composer pkgs
			this.props.composerReps = ['composerInstallers'];
			if (this.props.inclCMB2) {
				this.props.composerReps.push('cmb2');
			}
			if (arrayContains( props.inclCMB2includes, 'cmb2Tax' )){
				this.props.composerReps.push('cmb2Tax');
			}
			if (arrayContains( props.inclCMB2includes, 'cmb2qTrans' )){
				this.props.composerReps.push('cmb2qTrans');
			}
			
		}.bind(this));
	},
	

	writing: {
		
		config: function () {
			
			var gruntFileConditions = {
				funcPrefix: this.props.funcPrefix,
				
				hasFonts: this.props.hasFonts,
				hasImages: this.props.hasImages,
				
				styleFrontend: arrayContains( this.props.styles, 'styleFrontend' ),
				styleAdmin: arrayContains( this.props.styles, 'styleAdmin' ),
				styleOptionsPage: arrayContains( this.props.styles, 'styleOptionsPage' ) && arrayContains( this.props.inclCMB2includes, 'cmb2Options' ),
				scriptFrontend: arrayContains( this.props.scripts, 'scriptFrontend' ),
				scriptAdmin: arrayContains( this.props.scripts, 'scriptAdmin' ),
				
				sass_susy: arrayContains( this.props.inclSassLibs, 'susy' ),
				sass_breakpoint: arrayContains( this.props.inclSassLibs, 'breakpoint' ),
				sass_bourbon: arrayContains( this.props.inclSassLibs, 'bourbon' ),
				
				hasComposer: this.props.inclCMB2,
			
			};
			var files, destination;
			
			// wp_installs
			this.fs.copy(
				this.templatePath('wp_installs.json'),
				this.destinationPath('wp_installs.json')
			);
			
			// gitignore
			this.fs.copy(
				this.templatePath('gitignore'),
				this.destinationPath('.gitignore')
			);

			// Gruntfile
			this.fs.copyTpl(
				this.templatePath('_Gruntfile.js'),
				this.destinationPath('Gruntfile.js'),
				gruntFileConditions
			);
			this._bulkCopyTpl(
				this.templatePath('grunt/config/'),
				this.destinationPath('grunt/config/'),
				gruntFileConditions
			);
			this._bulkCopyTpl(
				this.templatePath('grunt/tasks/'),
				this.destinationPath('grunt/tasks/'),
				gruntFileConditions
			);
			
			// package.json
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'), {
					pluginName: this.props.pluginName,
					pluginSlug: this.props.pluginSlug,
					funcPrefix: this.props.funcPrefix,
					pluginUri: this.props.pluginUri,
					pluginDesc: this.props.pluginDesc,
					pluginAuthor: this.props.pluginAuthor,
					pluginAuthorUri: this.props.pluginAuthorUri,
					pluginTextDomain: this.props.pluginTextDomain,
					donationLink: this.props.donationLink,
					wpRequiresAtLeast: this.props.wpRequiresAtLeast,
					wpVersionTested: this.props.wpVersionTested,
				}
			);
			
			// composer.json
			this.fs.copyTpl(
				this.templatePath('_composer.json'),
				this.destinationPath('composer.json'), {
					pluginSlug: this.props.pluginSlug,
					vendorSlug: this.props.vendorSlug,
					
					repositories: composerPkgs.getRepositories(this.props.composerReps),
					require: composerPkgs.getRequire(this.props.composerReps),
					installerPaths: composerPkgs.getInstallerPaths(this.props.composerReps)
					
				}
			);			
			
		},
		
		src_functions: function () {
			
			// init
			this.fs.copyTpl(
				this.templatePath('src/functions/_init.php'),
				this.destinationPath('src/functions/init.php'), {
					funcPrefix: this.props.funcPrefix,
					pluginTextDomain: this.props.pluginTextDomain,
					
					styleFrontend: arrayContains( this.props.styles, 'styleFrontend' ),
					styleAdmin: arrayContains( this.props.styles, 'styleAdmin' ),
					scriptFrontend: arrayContains( this.props.scripts, 'scriptFrontend' ),
					scriptAdmin: arrayContains( this.props.scripts, 'scriptAdmin' ),
				}
			);

			// _defaults
			this.fs.copyTpl(
				this.templatePath('src/functions/_defaults.php'),
				this.destinationPath('src/functions/' + this.props.funcPrefixUpperCase + '_defaults.php'), {
					funcPrefix: this.props.funcPrefix,
					pluginSlugUpperCase: this.props.pluginSlugUpperCase,
					funcPrefixUpperCase: this.props.funcPrefixUpperCase
				}
			);
			
			// _localize
			if ( typeof this.props.scripts === 'object'
				&& this.props.scripts.length > 0 ) 
			{
				this.fs.copyTpl(
					this.templatePath('src/functions/_localize.php'),
					this.destinationPath('src/functions/' + this.props.funcPrefixUpperCase + '_localize.php'), {
						funcPrefix: this.props.funcPrefix,
						pluginSlugUpperCase: this.props.pluginSlugUpperCase,
						funcPrefixUpperCase: this.props.funcPrefixUpperCase
					}
				);
			}
				
			// _options_page
			if ( arrayContains( this.props.inclCMB2includes, 'cmb2Options' ) ) {
				this.fs.copyTpl(
					this.templatePath('src/functions/_options_page.php'),
					this.destinationPath('src/functions/' + this.props.funcPrefix + '_options_page.php'), {
						pluginName: this.props.pluginName,
						funcPrefix: this.props.funcPrefix,
						pluginTextDomain: this.props.pluginTextDomain,
						pluginSlugUpperCase: this.props.pluginSlugUpperCase,
						funcPrefixUpperCase: this.props.funcPrefixUpperCase,
						styleOptionsPage: arrayContains( this.props.styles, 'styleOptionsPage' ),
					}
				);			
			}
			
			
		},
		
		src_js: function () {
			
			// admin/init
			if ( arrayContains( this.props.scripts, 'scriptAdmin' ) ) {
				this.fs.copy(
					this.templatePath('src/js/admin/init.js'),
					this.destinationPath('src/js/admin/init.js')
				);
			}
			// frontend/init
			if ( arrayContains( this.props.scripts, 'scriptFrontend' ) ) {
				this.fs.copy(
					this.templatePath('src/js/frontend/init.js'),
					this.destinationPath('src/js/frontend/init.js')
				);
			}
		},
		
		src_plugin_main_file: function () {
			// init
			this.fs.copy(
				this.templatePath('src/plugin_main_file/init.php'),
				this.destinationPath('src/plugin_main_file/init.php')
			);
			
			// cmb2_init
			this.fs.copyTpl(
				this.templatePath('src/plugin_main_file/_cmb2_init.php'),
				this.destinationPath('src/plugin_main_file/cmb2_init.php'), {
					funcPrefix: this.props.funcPrefix,
					inclCMB2: this.props.inclCMB2,
					cmb2Tax: arrayContains( this.props.inclCMB2includes, 'cmb2Tax' ),
					cmb2qTrans: arrayContains( this.props.inclCMB2includes, 'cmb2qTrans' )
				}
			);
			
			// load_functions
			this.fs.copy(
				this.templatePath('src/plugin_main_file/load_functions.php'),
				this.destinationPath('src/plugin_main_file/load_functions.php')
			);
		},
		
		src_readme: function () {
			// commit_msg
			this.fs.copy(
				this.templatePath('src/readme/commit_msg.json'),
				this.destinationPath('src/readme/commit_msg.json')
			);
		},

		
		src_sass: function () {
			// style_admin
			if ( arrayContains( this.props.styles, 'styleAdmin' ) ) {
				this.fs.copy(
					this.templatePath('src/sass/style_admin.scss'),
					this.destinationPath('src/sass/style_admin.scss')
				);
			}
			// style_frontend
			if ( arrayContains( this.props.styles, 'styleFrontend' ) ) {
				this.fs.copy(
					this.templatePath('src/sass/style_frontend.scss'),
					this.destinationPath('src/sass/style_frontend.scss')
				);
			}
			
			// custom_modules/admin/init.scss
			if ( arrayContains( this.props.styles, 'styleAdmin' ) ) {
				this.fs.copy(
					this.templatePath('src/sass/custom_modules/admin/init.scss'),
					this.destinationPath('src/sass/custom_modules/admin/init.scss')
				);
			}
			// custom_modules/frontend/init.scss
			if ( arrayContains( this.props.styles, 'styleFrontend' ) ) {
				this.fs.copy(
					this.templatePath('src/sass/custom_modules/frontend/init.scss'),
					this.destinationPath('src/sass/custom_modules/frontend/init.scss')
				);
			}
			
			// _options_page.scss
			if ( arrayContains( this.props.styles, 'styleOptionsPage') 
				&& arrayContains( this.props.inclCMB2includes, 'cmb2Options' )
			) {
				this.fs.copy(
					this.templatePath('src/sass/custom_modules/frontend/init.scss'),
					this.destinationPath('src/sass/' + this.props.funcPrefix + '_options_page.scss')
				);
			}
		},
		
			
	},
	


	install: function () {
		
		this.installDependencies({
			bower: false,
			npm: true,
			callback: function () {
				
				var cmd = 'grunt build';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );

				var cmd = 'git init';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );				

				var cmd = 'git add .';
				console.log('');
				console.log(chalk.green('running ') + chalk.yellow(cmd));
				console.log('');
				childProcess.execSync( cmd, { stdio:'inherit' } );	
				
				var cmd = 'git commit -m "initial commit"';
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
