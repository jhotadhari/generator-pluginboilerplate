'use strict';
var path = require('path');
var chalk = require('chalk');

var PkgManager = {

	
	init: function ( sourceRoot, destinationRoot) {
		this.sourceRoot = sourceRoot;
		this.destinationRoot = destinationRoot;
		this.composerJson = require(path.join(this.destinationRoot,'composer.json'));
		this.available = require(path.join(path.dirname(path.dirname(this.sourceRoot)),'pkgManager.json')).available;
	
		this.getInstalled();
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
					name: this.available[key].desc,
				});
			}
		}
		return this.availableChoices;
	},
	
};

module.exports = PkgManager;