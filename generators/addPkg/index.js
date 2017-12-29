'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var pkgManager = require('./../pkgManager');
var childProcess = require('child_process');

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
	
	_addToComposerJson: function ( pkg ) {
		
		// add 'require' property
		if ( 'name' in pkg ) {
			// add 'require' property if not existing 
			if ( !('require' in pkgManager.composerJson) ) {
				pkgManager.composerJson.require = {};
			}
			pkgManager.composerJson.require[pkg.name] = pkg.version;
		}
		
		// add 'repository' property
		if ( 'repository' in pkg) {
			// add 'repositories' property if not existing 
			if ( !('repositories' in pkgManager.composerJson) ) {
				pkgManager.composerJson.repositories = [];
			}
			pkgManager.composerJson.repositories.push(pkg.repository);
		}
		
		// add 'extra' property
		if ( 'extra' in pkg ) {
			// installer-path
			if ( 'installer-path' in pkg.extra ) {
				// add 'extra' property if not existing 
				if ( !('extra' in pkgManager.composerJson) ) {
					pkgManager.composerJson.extra = {};
				}
				// add 'installer-paths' property if not existing 
				if ( !('installer-paths' in pkgManager.composerJson.extra) ) {
					pkgManager.composerJson.extra['installer-paths'] = {};
				}
				// add the installer-path property if not existing 
				if ( !(pkg.extra['installer-path'] in pkgManager.composerJson.extra['installer-paths']) ) {
					pkgManager.composerJson.extra['installer-paths'][pkg.extra['installer-path']] = [];
				}
				// add name to installer-path if not existing
				if ( pkgManager.composerJson.extra['installer-paths'][pkg.extra['installer-path']].indexOf(pkg.name) === -1 ){
					pkgManager.composerJson.extra['installer-paths'][pkg.extra['installer-path']].push(pkg.name);
				}
			}
		}
		
		// write composerJson
		pkgManager.writeComposerJson();
		this.log(chalk.yellow('   updated: ') + pkgManager.composerJsonPath);
		
	},
	
	_processTemplates: function ( pkg ) {
		
		// get data
		var packageJson = this._readPackageJson();
		var data = {
			funcPrefix: packageJson.funcPrefix,
			pluginSlug: packageJson.name,
			pluginSlugUpperCase: packageJson.name[0].toUpperCase() + packageJson.name.substring(1),
			funcPrefixUpperCase: packageJson.funcPrefix[0].toUpperCase() + packageJson.funcPrefix.substring(1)
		};
		
		switch( pkg.name ) {
			case 'webdevstudios/cmb2':
				this.fs.copyTpl(
					this.templatePath('src/inc/dep/autoload/_cmb2_init.php'),
					this.destinationPath('src/inc/dep/autoload/' + data.funcPrefix +'_cmb2_init.php'),
					data
				);
				break;
			case 'jcchavezs/cmb2-taxonomy':
				this.fs.copyTpl(
					this.templatePath('src/inc/dep/autoload/_cmb2_taxonomy_init.php'),
					this.destinationPath('src/inc/dep/autoload/' + data.funcPrefix +'_cmb2_taxonomy_init.php'),
					data
				);
				break;
			case 'jmarceli/integration-cmb2-qtranslate':
				this.fs.copyTpl(
					this.templatePath('src/inc/dep/autoload/_integration_cmb2_qtranslate_init.php'),
					this.destinationPath('src/inc/dep/autoload/' + data.funcPrefix +'_integration_cmb2_qtranslate_init.php'),
					data
				);
				break;
			default:
				// ... silence
		}
	
	},
	
	prompting: function () {
		
		pkgManager.init(
			this.sourceRoot(),
			this.destinationRoot()
		);
		
		this.log(yosay(
			'Welcome to the ' + chalk.yellow('pluginboilerplate') + ' ' + chalk.green('addPkg') + ' subgenerator!'
		));
		
		var prompts = [];
		
		var availableChoices = pkgManager.getAvailableChoices();
		
		if ( availableChoices.length > 0 ){
			prompts.push({
				name: 'pkgs',
				message: chalk.green('Packages') + '\nWhat kind of package do you want to add?',
				type: 'checkbox',
				choices: availableChoices,
			});
		} else {
			this.log(chalk.yellow('hurray') + ', all available packages are installed');
		}
		
		return this.prompt(prompts).then(function (props) {
			// To access props later use this.props.someAnswer;
			this.props = props;
		}.bind(this));
	},
	
	writing: function () {
		
		if ( !( 'pkgs' in this.props ) || this.props.pkgs.length === 0 ){
			this.log();
			this.log('nothing to install... well, you can add some manually');
		} else {
			
			for (var i = 0; i < this.props.pkgs.length; i++) {
				
				var pkg = pkgManager.available.find(pkg => pkg.name === this.props.pkgs[i]);
				
				// add package to composer.json
				this._addToComposerJson(pkg);
				
				// process templates to inc dep autoload
				this._processTemplates(pkg);
				
			}
		}
		
	},
	
	install: function () {
		
		if ( ( 'pkgs' in this.props ) && this.props.pkgs.length > 0 ){
			
			// composer update
			var cmd = 'composer update';
			console.log('');
			console.log(chalk.green('running ') + chalk.yellow(cmd));
			console.log('');
			childProcess.execSync( cmd, { stdio:'inherit' } );
		}		
		
		this.log('alright, I\'m done');
	}
});
