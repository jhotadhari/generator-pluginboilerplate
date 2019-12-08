'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs');
const path = require('path');
const slugg = require('slugg');

const mkDir = require('../mkDir');

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
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addGbBlock') + ' subgenerator!' + '\n\n' + 'Let\'s create a new ' + chalk.green('Gutenberg Block') + '!'
		));

		var prompts = [
			{
				type: 'input',
				name: 'blockName',
				message: chalk.green('Name') + ' of the block',
				default: 'My Block'
			},
			{
				type: 'checkbox',
				name: 'examples',
				message: chalk.green('Examples') + 'Include some of these components?',
				choices: [
					{
						value: 'RichText',
						name: ' ' + chalk.yellow('RichText') + ' Example usage for an wp.editor component'
					},
					{
						value: 'TreeSelect',
						name: ' ' + chalk.yellow('TreeSelect') + ' Example usage for an wp.components component'
					},
					{
						value: 'serializedNameInput',
						name: ' ' + chalk.yellow('NameInput Component') + ' Exampe component that stores data as serialized object as block attributes'
					},
				],
			},
			{
				type: 'list',
				name: 'enqueueFrontend',
				message: chalk.green('Enqueue Frontend Assets'),
				choices: [
					{
						value: 'occasionally',
						name: ' ' + chalk.yellow('Occasionally') + ' Only when global post has that block? Will not be enqueued on archives so.'
					},
					{
						value: 'always',
						name: ' ' + chalk.yellow('Always') + ' Enqueue frontend assets always'
					},
				],
			},
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
		data.textDomain = packageJson.textDomain;
		data.pluginSlug = packageJson.name;
		data.pluginSlugLoDash = data.pluginSlug.replace('-', '_');
		data.funcPrefixUpperCase = data.funcPrefix[0].toUpperCase() + data.funcPrefix.substring(1);
		data.pluginSlugUpperCase = packageJson.name[0].toUpperCase() + packageJson.name.substring(1);
		data.pluginSlugUpperCaseLoDash = data.pluginSlugUpperCase.replace(/-/g, '_');
		data.pluginClass = data.funcPrefixUpperCase + '_' + data.pluginSlugUpperCaseLoDash;
		data.blockSlug =  slugg( data.blockName.trim(), '_' );
		data.blockSlugUri =  slugg( data.blockName.trim(), '-' );
		data.blockNamespace =  data.funcPrefix + '/' + data.blockSlugUri;
		data.blockSlugUpperCase = data.blockSlug[0].toUpperCase() + data.blockSlug.substring(1);

		// create dirs
		[
			// commonJS
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug,
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '/components',
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor',
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor/components',
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_frontend',
			'src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_frontend/components',
			// sass
			'src/sass/' + data.funcPrefix + '_block_' + data.blockSlug,
			'src/sass/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor',
			'src/sass/' + data.funcPrefix + '_block_' + data.blockSlug + '_frontend',
		].map( dir => path.join( this.destinationRoot(), dir ) ).map( dir => mkDir( dir, {log:this.log} ) );

		// copy templates
		this._copyTpls( data );

	}

	_copyTpls( data ){

		// inc
		this.fs.copyTpl(
			this.templatePath('src/inc/fun/autoload/_class-block.php'),
			this.destinationPath('src/inc/fun/autoload/class-' + data.funcPrefix + '_block_' + data.blockSlug + '.php'),
			data
			);

		// commonJS editor
		this.fs.copyTpl(
			this.templatePath('src/commonJS/_block_editor.js'),
			this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor.js'),
			data
		);

		this.fs.copyTpl(
			this.templatePath('src/commonJS/_block_editor/defaults.js'),
			this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor/defaults.js'),
			data
		);

		if( data.examples.indexOf('TreeSelect') !== -1 ) {
			this.fs.copyTpl(
				this.templatePath('src/commonJS/_block_editor/tree.js'),
				this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor/tree.js'),
				data
			);
		}

		if( data.examples.indexOf('serializedNameInput') !== -1 ) {
			this.fs.copyTpl(
				this.templatePath('src/commonJS/_block_editor/components/NameInput.jsx'),
				this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor/components/NameInput.jsx'),
				data
			);
		}

		if( data.examples.length > 0 ) {
			this.fs.copyTpl(
				this.templatePath('src/commonJS/_block_editor/components/Label.jsx'),
				this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor/components/Label.jsx'),
				data
			);
		}

		// commonJS frontend
		this.fs.copyTpl(
			this.templatePath('src/commonJS/_block_frontend.js'),
			this.destinationPath('src/commonJS/' + data.funcPrefix + '_block_' + data.blockSlug + '_frontend.js'),
			data
		);

		// sass
		this.fs.copyTpl(
			this.templatePath('src/sass/_block_editor.scss'),
			this.destinationPath('src/sass/' + data.funcPrefix + '_block_' + data.blockSlug + '_editor.scss'),
			data
		);

		this.fs.copyTpl(
			this.templatePath('src/sass/_block_frontend.scss'),
			this.destinationPath('src/sass/' + data.funcPrefix + '_block_' + data.blockSlug + '_frontend.scss'),
			data
		);

		if( data.examples.length > 0 ) {
			this.fs.copyTpl(
				this.templatePath('src/sass/_block/_label.scss'),
				this.destinationPath('src/sass/' + data.funcPrefix + '_block_' + data.blockSlug + '/_label.scss'),
				data
			);
		}

	}

	install() {
		this.log('alright, I\'m done');
	}
};
