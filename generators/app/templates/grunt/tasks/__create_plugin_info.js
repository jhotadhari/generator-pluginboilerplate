module.exports = function(grunt){
	
	// _create_plugin_info
	// used by	_tasks
	grunt.registerTask('_create_plugin_info', 'sub task', function(dest) {
		if (arguments.length === 0) {
			grunt.log.writeln("ERROR " + this.name + " needs an destionationPath as argument");
			return;
		}
		
		var pkg = grunt.file.readJSON("package.json");
		var infoStr = '';
		infoStr += '<?php' + '\n';
		infoStr += '/*' + '\n';
		infoStr += 'Plugin Name: ' + pkg.fullName + '\n';
		infoStr += 'Plugin URI: ' + pkg.uri + '\n';
		infoStr += 'Description: ' + pkg.description + '\n';


		infoStr += 'Version: ' + pkg.version + '\n';
		infoStr += 'Author: ' + pkg.author + '\n';
		infoStr += 'Author URI: ' + pkg.authorUri + '\n';
		infoStr += 'License: ' + pkg.license + '\n';
		infoStr += 'License URI: ' + pkg.licenseUri + '\n';
		infoStr += 'Text Domain: ' + pkg.textDomain + '\n';
		infoStr += 'Domain Path: ' + pkg.domainPath + '\n';
		infoStr += 'Tags: ' + pkg.tags + '\n';
		infoStr += '*/' + '\n';
		infoStr += '\n';

		infoStr += '/*' + '\n';
		infoStr += "	grunt.concat_in_order.declare('_plugin_info');" + '\n';
		infoStr += '*/' + '\n';
		
		infoStr += '\n';
		infoStr += '?>';

		// grunt.file.write( dest + 'style.css', infoStr);
		grunt.file.write( dest + 'plugin_main_file/dont_touch/_plugin_info.php', infoStr);
		
		grunt.log.writeln("version: " + pkg.version);
	});
};