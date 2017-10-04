module.exports = {
	// watch task does the same like build...
	
	// copy from src to root
		copy_root_files: {
			files: [
				'<%%= pkg.dirs.src %>/root_files/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:root_files',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		<%if ( hasComposer ) { %>
		copy_vendor: {
			files: [
				'vendor/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:vendor',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		<% } %>
		copy_images: {
			files: [
				'<%%= pkg.dirs.src %>/images/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:images',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		copy_fonts: {
			files: [
				'<%%= pkg.dirs.src %>/fonts/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:fonts',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		copy_readme: {
			files: [
				'<%%= pkg.dirs.src %>/readme/**/*',
				'!**/dont_touch/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:readme',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		
		
		
		copy_inc: {
			files: [
				'<%%= pkg.dirs.src %>/inc/**/*',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'copy:inc',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
		
		
	// assets
	<%if ( scriptFrontend ) { %>
	assets_js_frontend: {
		files: [
				'<%%= pkg.dirs.src %>/js/frontend/**/*.js',
				'!**/dont_touch/**/*',
				'<%%= pattern.global_exclude %>',
		],
		tasks: [
			'jshint',
			'concat_in_order:js_frontend',
			'uglify:js_frontend',
			'local_sync:<%%= local_sync.wp_install %>:<%%= local_sync.version %>'
		]
	},
	<% } %>
	<%if ( scriptAdmin ) { %>
	assets_js_admin: {
		files: [
				'<%%= pkg.dirs.src %>/js/admin/**/*.js',
				'!**/dont_touch/**/*',
				'<%%= pattern.global_exclude %>',
		],
		tasks: [
			'jshint',
			'concat_in_order:js_admin',
			'uglify:js_admin',
			'local_sync:<%%= local_sync.wp_install %>'
		]
	},
	<% } %>
	<%if ( styleFrontend || styleAdmin || styleOptionsPage ) { %>
	assets_styles: {
		files: [
			'<%%= pkg.dirs.src %>/sass/**/*.scss',
			'!**/dont_touch/**/*',
			'<%%= pattern.global_exclude %>',
		],
		tasks: [
			<%if ( styleFrontend || styleAdmin ) { %>
			'concat_in_order:sass_custom_modules_frontend',
			<% } %>
			'sass:build',
			'local_sync:<%%= local_sync.wp_install %>'
		]
	},
	<% } %>		
	
	// plugin_main_file
		plugin_main_file: {
			files: [
				'<%%= pkg.dirs.src %>/<%%= pkg.name %>.php',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'concat:plugin_main_file',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		},
	
	// potomo
		potomo_pos: {
			files: [
				'<%%= pkg.dirs.src %>/languages/**/*.po',
				'<%%= pattern.global_exclude %>',
			],
			tasks: [
				'potomo:main',
				'local_sync:<%%= local_sync.wp_install %>'
			]
		}
};