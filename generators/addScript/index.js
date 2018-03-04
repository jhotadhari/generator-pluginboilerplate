'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var slugg = require('slugg');

module.exports = Generator.extend({

	_readPackageJson: function() {
		var packageJsonPath = path.join(this.destinationRoot(),'package.json');
		try {
			// file exists
			fs.statSync( packageJsonPath ).isFile();
			return require(packageJsonPath);
		}
		catch (err) {
			// file does not exist
			this.log('Some error reading package.json: ', err);
			return err;
		}
	},

	prompting: function () {

		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addScript') + ' subgenerator!'
		));

		var prompts = [

			{
				type: 'input',
				name: 'scriptName',
				message: chalk.green('Name') + ' of the script (will be prefixed automatically)',
				default: 'script'
			},
			{
				name: 'scriptType',
				message: chalk.green('Type') + ' of script?',
				default: 'js',
				type: 'list',
				choices: [
					{
						value: 'js',
						name: 'JavaScript and some libraries like jQuery'
					},
					{
						value: 'commonJS',
						name: 'commonJS, ES2015'
					},
				],
			},
			{
				when: function( answers ){
					return answers.scriptType === 'js';
				},
				type: 'list',
				name: 'frontendAdmin',
				message: chalk.green('Where') + ' to enqueue the script?',
				type: 'list',
				choices: [
					{
						value: 'frontend',
						name: 'Frontend'
					},
					{
						value: 'admin',
						name: 'Admin'
					},
					{
						value: 'none',
						name: 'ooouu I don\'t want any scripts, but give me the localize class, please',
						checked: false
					}
				]
			},
			{
				when: function( answers ){
					return answers.scriptType === 'commonJS';
				},
				type: 'list',
				name: 'frontendAdmin',
				message: chalk.green('Where') + ' to enqueue the script?',
				type: 'list',
				choices: [
					{
						value: 'frontend',
						name: 'Frontend'
					},
					{
						value: 'admin',
						name: 'Admin'
					}
				]
			},
		];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	},

	writing: function () {

		// get data
		var packageJson = this._readPackageJson();
		var data = this.props;
		data.funcPrefix = packageJson.funcPrefix;
		data.pluginSlug = packageJson.name;
		data.pluginSlugLoDash = data.pluginSlug.replace('-', '_');
		data.funcPrefixUpperCase = packageJson.funcPrefix[0].toUpperCase() + packageJson.funcPrefix.substring(1);
		data.pluginSlugUpperCase = packageJson.name[0].toUpperCase() + packageJson.name.substring(1);
		data.pluginSlugUpperCaseLoDash = data.pluginSlugUpperCase.replace(/-/g, '_');
		data.pluginClass = data.funcPrefixUpperCase + '_' + data.pluginSlugUpperCaseLoDash;
		data.scriptSlug = slugg( data.scriptName.trim(), '_' );
		data.scriptSlugUpperCase = data.scriptSlug[0].toUpperCase() + data.scriptSlug.substring(1);

		if ( data.scriptType === 'js' ) {
			// localizeClass
			this.fs.copyTpl(
				this.templatePath('src/inc/fun/autoload/_class-localize.php'),
				this.destinationPath('src/inc/fun/autoload/class-' + data.funcPrefix + '_localize.php'),
				data
			);

			if ( data.frontendAdmin != 'none' ) {

				data.actionHookEnqueue = data.frontendAdmin === 'frontend' ? 'wp_enqueue_scripts' : 'admin_enqueue_scripts';
				data.actionHookPrint = data.frontendAdmin === 'frontend' ? 'wp_print_footer_scripts' : 'admin_print_footer_scripts';

				this.fs.copyTpl(
					this.templatePath('src/js/_script.js'),
					this.destinationPath('src/js/' + data.funcPrefix + '_' + data.scriptSlug + '.js'),
					data
				);

				this.fs.copyTpl(
					this.templatePath('src/inc/fun/autoload/_script_init.php'),
					this.destinationPath('src/inc/fun/autoload/' + data.funcPrefix + '_script_init_' + data.scriptSlug + '.php'),
					data
				);

			}
		}

		if ( data.scriptType === 'commonJS' ) {

			if ( data.frontendAdmin != 'none' ) {

				data.actionHookEnqueue = data.frontendAdmin === 'frontend' ? 'wp_enqueue_scripts' : 'admin_enqueue_scripts';
				data.actionHookPrint = data.frontendAdmin === 'frontend' ? 'wp_print_footer_scripts' : 'admin_print_footer_scripts';
				data.actionHookFooter = data.frontendAdmin === 'frontend' ? 'get_footer' : 'in_admin_footer';

				this.fs.copyTpl(
					this.templatePath('src/commonJS/_script.js'),
					this.destinationPath('src/commonJS/' + data.funcPrefix + '_' + data.scriptSlug + '.js'),
					data
				);

				this.fs.copyTpl(
					this.templatePath('src/inc/fun/autoload/_class-script.php'),
					this.destinationPath('src/inc/fun/autoload/class-' + data.funcPrefix + '_script_' + data.scriptSlug + '.php'),
					data
				);

			}
		}

	},

	install: function () {
		// this.installDependencies();
	}
});
