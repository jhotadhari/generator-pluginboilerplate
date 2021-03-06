'use strict';

var replacements = require("../replacements");

module.exports = {
	options: {
		replacements: replacements.get(),
	},

	// will replace string and copy plugin_main_file to destination
	plugin_main_file: {
		files: {'<%%= dest_path %>/<%%= global["pkg"].name %>.php':'src/root_files/<%%= global["pkg"].name %>.php'}
	},

	// will replace string and update file in source. should only run on dist
	// usefull for phpDoc "@since taskRunner_set_version"
	inc_update_src: {
		options: {
			replacements: [{
				pattern: /taskRunner_set_version/g,
				replacement:  '<%%= global["pkg"].version %>'
			}]
		},
		files: [{
			expand: true,
			cwd: 'src/inc/',
			src: ['**/*.php','<%%= pattern.global_exclude %>'],
			dest: 'src/inc/'
		}],
	},

	// will replace and copy inc to destination
	inc_to_dest: {
		files: [{
			expand: true,
			cwd: 'src/inc/',
			src: ['**/*.php','<%%= pattern.global_exclude %>'],
			dest: '<%%= dest_path %>/inc/'
		}],
	},
};