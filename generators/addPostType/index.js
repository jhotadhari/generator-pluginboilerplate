'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const slugg = require('slugg');
const path = require('path');
const fs = require('fs');

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

	_promptsChoicesBool() {
		return [
			{
				value: true,
				name: 'yes'
			},
			{
				value: false,
				name: 'no'
			}
		];
	}

	prompting() {

		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addPostType') + ' subgenerator!'
		));

		var prompts = [
			{
				type: 'input',
				name: 'singular_name',
				message: 'What is the ' + chalk.green('singular name') + ' of your new post type?',
				default: '',
				validate: function(str) {
					if ( slugg( str.trim(), '_' ).length <= 0 ) return chalk.yellow('That\'s to short!');
					if ( slugg( str.trim(), '_' ).length >= 20 ) return chalk.yellow('That\'s to long!');
					return true;
				}

			},
			{
				type: 'list',
				name: 'hierarchical',
				message: 'Is your Post Type ' + chalk.green('hierarchical') + '? Allows Parent to be specified.',
				choices: [
					{
						value: false,
						name: 'No, like posts'
					},
					{
						value: true,
						name: 'Yes, like pages'
					}
				]
			},
			{
				type: 'checkbox',
				name: 'supports',
				message: 'What does your Post Type ' + chalk.green('support') + '?',
				default: ['title','page-attributes','editor'],
				choices: [
					{
						value: 'title',
						name: 'title'
					},
					{
						value: 'editor',
						name: 'editor (content)'
					},
					{
						value: 'excerpt',
						name: 'excerpt'
					},
					{
						value: 'author',
						name: 'author'
					},
					{
						value: 'thumbnail',
						name: 'thumbnail (featured image, current theme must also support post-thumbnails)'
					},
					{
						value: 'comments',
						name: 'comments (also will see comment count balloon on edit screen)'
					},
					{
						value: 'trackbacks',
						name: 'trackbacks'
					},
					{
						value: 'revisions',
						name: 'revisions'
					},
					{
						value: 'custom-fields',
						name: 'custom-fields'
					},
					{
						value: 'page-attributes',
						name: 'page-attributes'
					},
					{
						value: 'post-formats',
						name: 'post-formats'
					}
				],
			},
			{
				type: 'list',
				name: 'public',
				message: chalk.green('Public') + ' Controls how the type is visible to authors (show_in_nav_menus, show_ui) and readers (exclude_from_search, publicly_queryable).',
				choices: this._promptsChoicesBool(),
			},
			{
				type: 'list',
				name: 'has_archive',
				message: 'Does the Post type has ' + chalk.green('archives') + '?',
				choices: this._promptsChoicesBool(),
			},
			{
				type: 'list',
				name: 'can_export',
				message: chalk.green('can_export') + ': Can this post_type be exported?',
				choices: this._promptsChoicesBool(),
			},

			{
				type: 'list',
				name: 'show_in_rest',
				message: 'Whether to expose this post type in the ' + chalk.green('REST API') + '?',
				choices: this._promptsChoicesBool(),
			},

			{
				type: 'list',
				name: 'capability_type',
				message: chalk.green('capability_type') + ': The string to use to build the read, edit, and delete capabilities?',
				choices: [
					{
						value: 'post',
						name: 'post'
					},
					{
						value: 'page',
						name: 'page'
					},
					{
						value: 'custom',
						name: 'custom'	// ???
					}

				]
			},
			{
				when: function( answers ){
					return answers.capability_type === 'custom';
				},
				type: 'checkbox',
				name: 'addCapToRole',
				message: 'I will add all the custom capabilities to the following ' + chalk.green('roles') + ':',
				choices: [
					{
						value: 'administrator',
						name: 'administrator'
					},
					{
						value: 'editor',
						name: 'editor'
					},
					{
						value: 'author',
						name: 'author'
					},
					{
						value: 'contributor',
						name: 'contributor'
					},
					{
						value: 'subscriber',
						name: 'subscriber'
					}

				],
				validate: function(arr) {
					return arr.length > 0 ? true : 'Come on, just choose anything!';
				}
			},
		];

		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	}

	writing() {

		// prepare data
		var data = this.props;
		var packageJson = this._readPackageJson();
		data.funcPrefix = packageJson.funcPrefix;
		data.textDomain = packageJson.textDomain;
		data.key = slugg( data.singular_name.trim(), '_' );
		if ( data.public ) {
			data.show_ui = true;
			data.show_in_nav_menus = true;
			data.publicly_queryable = true;
			data.exclude_from_search = false;
			data.show_in_menu = true;
			data.show_in_admin_bar = true;
		} else {
			data.show_ui = false;
			data.show_in_nav_menus = false;
			data.publicly_queryable = false;
			data.exclude_from_search = true;
			data.show_in_menu = false;
			data.show_in_admin_bar = false;
		}
		data.supportsPhpArr = 'array(\'' + data.supports.join('\',\'') + '\')';

		// copy templates
		this.fs.copyTpl(
			this.templatePath('_add_post_type.php'),
			this.destinationPath('src/inc/post_types_taxs/autoload/' + data.funcPrefix + '_add_post_type_' + data.key + '.php'),
			data
		);
		if ( data.capability_type === 'custom' ) {
			data.addCapToRolePhpArr = 'array(\'' + data.addCapToRole.join('\',\'') + '\')';
			this.fs.copyTpl(
				this.templatePath('_add_caps_to_roles.php'),
				this.destinationPath('src/inc/roles_capabilities/autoload/' + data.funcPrefix + '_add_' + data.key + '_caps_to_roles.php'),
				data
			);
		}

	}

	install() {
		this.log('ok, I\'m done.');
	}

};
