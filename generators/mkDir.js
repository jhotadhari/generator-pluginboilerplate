'use strict';
const chalk = require('chalk');
const fs = require('fs');

module.exports = function mkDir( dir, options ) {
	let { log } = options;
	log = undefined === log ? console.log : options.log;

	try {
		// dir exists
		fs.statSync(dir).isDirectory();
	}
	catch (err) {
		// dir does not exist
		log(chalk.yellow('   create dir: ') + dir);
		fs.mkdirSync(dir);
	}
};