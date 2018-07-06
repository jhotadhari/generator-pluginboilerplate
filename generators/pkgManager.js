'use strict';
var path = require('path');
var chalk = require('chalk');
var fs = require('fs');

var PkgManager = {

	init: function ( sourceRoot, destinationRoot) {
		// define paths
		this.sourceRoot = sourceRoot;
		this.destinationRoot = destinationRoot;
		this.composerJsonPath = path.join(this.destinationRoot,'composer.json');
		// read composerJson
		this.readComposerJson();
		// get available pkgs from pkgManager.json
		this.available = require(path.join(path.dirname(path.dirname(this.sourceRoot)),'pkgManager.json')).available;
		// get array of installed pks
		this.getInstalled();
	},

	readComposerJson: function() {
		try {
			// file exists
			fs.statSync( this.composerJsonPath ).isFile();
			this.composerJson = require(this.composerJsonPath);
		}
		catch (err) {
			// file does not exist
			console.log('Some error reading composer.json: ', err);
			console.log('... but I don\'t care');
			this.composerJson = {};
		}
	},

	writeComposerJson: function() {
		fs.writeFileSync( this.composerJsonPath, JSON.stringify( this.composerJson, null, 2 ) );
	},




	getInstalled: function () {
		this.installed = [];
		for ( var key in this.composerJson.require) {
			this.installed.push(key);
		}
		return this.installed;
	},

	getUnInstalled: function () {
		this.unInstalled = [];
		for (var i = 0; i < this.available.length; i++) {
			var name = this.available[i].name;
			if ( this.installed.indexOf(name) == -1 ) {
				this.unInstalled.push(name);
			}
		}
		return this.unInstalled;
	},

	getAvailableChoices: function () {
		if ( this.unInstalled == null ){
			this.getUnInstalled();
		}
		this.availableChoices = [];
		for ( var key in this.available ) {
			if ( this.unInstalled.indexOf(this.available[key].name) != -1 ) {
				this.availableChoices.push({
					value: this.available[key].name,
					name: ' ' + chalk.yellow(this.available[key].name) + ': ' + this.available[key].desc + '\n' + chalk.green('website: ') + this.available[key].website + '',
				});
			}
		}
		return this.availableChoices;
	},



};

module.exports = PkgManager;