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
				name: 'frontendAdmin',
				message: chalk.green('Where') + ' to enqueue the style?',
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
				],	
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
		data.funcPrefixUpperCase = packageJson.funcPrefix[0].toUpperCase() + packageJson.funcPrefix.substring(1);
		data.pluginSlugUpperCase = packageJson.name[0].toUpperCase() + packageJson.name.substring(1);
		data.scriptSlug = slugg( data.scriptName.trim(), '_' );
		
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
			
	},
	
	install: function () {
		// this.installDependencies();
	}
});
