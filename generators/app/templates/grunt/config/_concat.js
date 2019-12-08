
const configReadme = {
	options: {
		banner: [
			'=== <%%= global["pkg"].fullName %> ===',
			'Tags: <%%= global["pkg"].tags %>',
			'Donate link: <%%= global["pkg"].donateLink %>',
			'Contributors: <%%= global["pkg"].contributors %>',
			'Tested up to: <%%= global["pkg"].wpVersionTested %>',
			'Requires at least: <%%= global["pkg"].wpRequiresAtLeast%>',
			'Requires PHP: <%%= global["pkg"].phpRequiresAtLeast%>',
			'Stable tag: trunk\nLicense: <%%= global["pkg"].license %>',
			'License: <%%= global["pkg"].license %>',
			'License URI: <%%= global["pkg"].licenseUri %>',
			'',
			'<%%= global["pkg"].description %>',
			'',
			'',
			'',
		].join( '\n' ),
		footer: [
			'',
			'',
			'== Changelog ==',
			'',
			'',
			'<%%= changelog %>',
		].join( '\n' ),
	},
	src: [
		'src/readme/readme.txt',
	],
};

const configPlugin_main_file = {
	options: {
		banner: [
			'<?php',
			'/*',
			'Plugin Name: <%%= global["pkg"].fullName %>',
			'Plugin URI: <%%= global["pkg"].uri %>',
			'Description: <%%= global["pkg"].description %>',
			'Version: <%%= global["pkg"].version %>',
			'Author: <%%= global["pkg"].author %>',
			'Author URI: <%%= global["pkg"].authorUri %>',
			'License: <%%= global["pkg"].license %>',
			'License URI: <%%= global["pkg"].licenseUri %>',
			'Text Domain: <%%= global["pkg"].textDomain %>',
			'Domain Path: <%%= global["pkg"].domainPath %>',
			'Tags: <%%= global["pkg"].tags %>',
			'GitHub Plugin URI: <%%= global["pkg"].gitHubPluginURI %>',
			'Release Asset: true',
			'*/',
			'?>',
		].join( '\n' ),
	},
};

module.exports = {

	readme: {
		...configReadme,
		dest: '<%%= dest_path %>/readme.txt',
	},

	readmeMd: {
		...configReadme,
		dest: '<%%= dest_path %>/README.md',
	},

	plugin_main_file: {
		...configPlugin_main_file,
		src: ['<%%= dest_path %>/<%%= global["pkg"].name %>.php' ],
		dest: '<%%= dest_path %>/<%%= global["pkg"].name %>.php',
	},

	dummy_plugin_main_file: {
		...configPlugin_main_file,
		src: ['<%%= global["pkg"].name %>.php' ],
		dest: '<%%= global["pkg"].name %>.php',
	},

};