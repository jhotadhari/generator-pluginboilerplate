'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var fs = require('fs');
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
		
		var packageJson = this._readPackageJson();
			
		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addOptionsPage') + ' subgenerator!'
		));
		
		var prompts = [
			
			{
				name: 'title',
				message: 'What is the ' + chalk.green('title') + ' of the options page?',
				type: 'input',
				default: packageJson.fullName
			},
			{
				name: 'key',
				message: 'What is the ' + chalk.green('key') + ' of the options page?',
				type: 'input',
				default: packageJson.name,
				validate: function(str) { return slugg( str.trim(), '_' ) === str ? true : chalk.yellow('You need to provide a slugified string!') }			
			},
			{
				name: 'menuLevel',
				message: 'What is the ' + chalk.green('level') + ' of the options page?',
				type: 'list',
				choices: [
					{
						value: 'menuItem',
						name: 'Menu item'
					},
					{
						value: 'subMenuItem',
						name: 'Submenu item'
					}
				],
				validate: function(arr) {
					return arr.length > 0 ? true : 'Come on, just choose anything!';
				}
			},
			{
				when: function( answers ){
					return answers.menuLevel === 'subMenuItem';
				},
				type: 'list',
				name: 'parentMenu',
				message: 'What is the ' + chalk.green('parent menu') + '?',
				choices: [
					{
						value: 'settings',
						name: 'Settings'
					},					
					{
						value: 'tools',
						name: 'Tools'
					}
				],
				validate: function(arr) {
					return arr.length > 0 ? true : 'Come on, just choose anything!';
				}
			},	
			{
				name: 'type',
				message: 'What ' + chalk.green('type') + ' of options page do you want to have?',
				type: 'list',
				choices: [
					{
						value: 'simple',
						name: 'A simple options page'
					},
					{
						value: 'tabbed',
						name: 'A tabbed options page'
					}
				],	
			},
			{
				when: function( answers ){
					return answers.type === 'tabbed';
				},
				name: 'tabNames',
				message: 'What are the ' + chalk.green('tab names') + '? (A ";" seperated string of Names)',
				type: 'input',
				validate: function(str) {
					return str.length > 0 ? true : 'Come on, just give me a name!';
				}
			}
			
		];
		
		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	},
	
	writing: function () {

		
		// prepare data
		var packageJson = this._readPackageJson();
		var data = this.props;
		data.funcPrefix = packageJson.funcPrefix;
		data.pluginSlug = packageJson.name;
		data.pluginSlugLoDash = data.pluginSlug.replace('-', '_');
		data.textDomain = packageJson.textDomain;
		data.funcPrefixUpperCase = data.funcPrefix[0].toUpperCase() + data.funcPrefix.substring(1);
		data.pluginSlugUpperCase = packageJson.name[0].toUpperCase() + packageJson.name.substring(1);
		data.pluginSlugUpperCaseLoDash = data.pluginSlugUpperCase.replace('-', '_');
		data.pluginClass = data.funcPrefixUpperCase + '_' + data.pluginSlugUpperCaseLoDash;
		data.keyUpperCase = data.key[0].toUpperCase() + data.key.substring(1);
		
		if ( data.menuLevel === 'subMenuItem' ) {
			switch( data.parentMenu ) {
				case 'settings':
					data.parentMenuSlug = 'options-general.php';
					break;
				case 'tools':
					data.parentMenuSlug = 'tools.php';
					break;
			}
		}
		
		if ( data.type === 'simple' ) {
			// copy template
			this.fs.copyTpl(
				this.templatePath('src/inc/fun/autoload/_options_page_.php'),
				this.destinationPath('src/inc/fun/autoload/class-' + data.funcPrefix + '_options_page_' + data.key + '.php'),
				data
			);
		}
		
		if ( data.type === 'tabbed' ) {
			// prepare data.tabs 
			data.tabs = {};
			var tabNamesArr = data.tabNames.split(';');
			for ( var i = 0; i < tabNamesArr.length; i++ ){
				data.tabs[slugg( tabNamesArr[i].trim(), '_' )] = {
					slug: slugg( tabNamesArr[i].trim(), '_' ),
					title: tabNamesArr[i].trim(),
				};
			}
			
			this.log();
			this.log( 'tabs:');
			this.log( data.tabs);
			this.log();
			
			// copy template
			this.fs.copyTpl(
				this.templatePath('src/inc/fun/autoload/_options_page_tabbed_.php'),
				this.destinationPath('src/inc/fun/autoload/class-' + data.funcPrefix + '_options_page_' + data.key + '.php'),
				data
			);
		}
		
		// scss
		this.fs.copyTpl(
		this.templatePath('src/js/_options_page_.js'),
		this.destinationPath('src/js/' + data.funcPrefix + '_options_page_' + data.key + '.js'),
		data
		);
		// js
		this.fs.copyTpl(
		this.templatePath('src/sass/_options_page_.scss'),
		this.destinationPath('src/sass/' + data.funcPrefix + '_options_page_' + data.key + '.scss'),
		data
		);
		
	},
	
	install: function () {
		this.log('alright, I\'m done');
	}
});
