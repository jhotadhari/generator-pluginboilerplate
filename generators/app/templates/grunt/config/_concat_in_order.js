module.exports = {
	options: {
		extractRequired: function (filepath, filecontent) {
			return this.getMatches(/grunt\.concat_in_order\.require\(['"]([^'"]+)['"]/g, filecontent);
		},
		extractDeclared: function (filepath, filecontent) {
			return this.getMatches(/grunt\.concat_in_order\.declare\(['"]([^'"]+)['"]/g, filecontent);
		}
	},
	functions: {
		files: {
			'<%%= dest_path %>/functions.php': [
				'<%%= pkg.dirs.src %>/functions/**/*.php',
				'<%%= pattern.global_exclude %>',
			]
		}
	},
	plugin_main_file: {
		files: {
			'<%%= dest_path %>/<%%= pkg.name %>.php': [
				'<%%= pkg.dirs.src %>/plugin_main_file/**/*.php',
				'<%%= pattern.global_exclude %>',
			]
		}
	},			
	<%if ( scriptFrontend ) { %>
	// js
	js_frontend: {
		files: {
			'<%%= pkg.dirs.src %>/js/frontend/dont_touch/_script_frontend.js': [
				'<%%= pkg.dirs.src %>/js/frontend/**/*.js',
				'!**/dont_touch/**/*.js',
				'<%%= pattern.global_exclude %>',
			]
		}
	},	
	<% } %>
	<%if ( scriptAdmin ) { %>
	js_admin: {
		files: {
			'<%%= pkg.dirs.src %>/js/admin/dont_touch/_script_admin.js': [
				'<%%= pkg.dirs.src %>/js/admin/**/*.js',
				'!**/dont_touch/**/*.js',
				'<%%= pattern.global_exclude %>',
			]
		}
	},	
	<% } %>
	<%if ( styleFrontend ) { %>
	sass_custom_modules_frontend: {
		files: {
			'<%%= pkg.dirs.src %>/sass/custom_modules/frontend/dont_touch/custom_modules.scss': [
				'<%%= pkg.dirs.src %>/sass/custom_modules/frontend/**/*.scss',
				'!**/dont_touch/**/*.scss',
				'<%%= pattern.global_exclude %>',
			]
		}			
	},
	<% } %>
	<%if ( styleAdmin ) { %>
	sass_custom_modules_admin: {
		files: {
			'<%%= pkg.dirs.src %>/sass/custom_modules/admin/dont_touch/custom_modules.scss': [
				'<%%= pkg.dirs.src %>/sass/custom_modules/admin/**/*.scss',
				'!**/dont_touch/**/*.scss',
				'<%%= pattern.global_exclude %>',
			]
		}			
	}
	<% } %>
};