'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const slugg = require('slugg');

module.exports = class extends Generator {

	_readPackageJson() {
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
	}

	prompting() {

		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addStyle') + ' subgenerator!'
		));

		var prompts = [
			{
				type: 'input',
				name: 'styleName',
				message: chalk.green('Name') + ' of the stylesheet (will be prefixed automatically)',
				default: 'style'
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
					}
				],
			}
		];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	}

	writing() {

		// get data
		var packageJson = this._readPackageJson();

		var data = this.props;
		data.funcPrefix = packageJson.funcPrefix;
		data.pluginSlug = packageJson.name;
		data.pluginSlugLoDash = data.pluginSlug.replace('-', '_');
		data.funcPrefixUpperCase = data.funcPrefix[0].toUpperCase() + data.funcPrefix.substring(1);
		data.actionHook = data.frontendAdmin === 'frontend' ? 'wp_enqueue_scripts' : 'admin_enqueue_scripts';
		data.pluginSlugUpperCase = packageJson.name[0].toUpperCase() + packageJson.name.substring(1);
		data.pluginSlugUpperCaseLoDash = data.pluginSlugUpperCase.replace(/-/g, '_');
		data.pluginClass = data.funcPrefixUpperCase + '_' + data.pluginSlugUpperCaseLoDash;
		data.styleSlug =  slugg( data.styleName.trim(), '_' );

		this.fs.copyTpl(
			this.templatePath('src/sass/_style.scss'),
			this.destinationPath('src/sass/' + data.funcPrefix + '_' + data.styleSlug + '.scss'),
			data
		);

		this.fs.copyTpl(
			this.templatePath('src/inc/fun/autoload/_style_init.php'),
			this.destinationPath('src/inc/fun/autoload/' + data.funcPrefix + '_style_init_' + data.styleSlug + '.php'),
			data
		);

	}

	install() {
		this.log('alright, I\'m done');
	}
};
