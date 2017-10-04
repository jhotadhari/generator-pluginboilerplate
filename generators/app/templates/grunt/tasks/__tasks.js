module.exports = function(grunt){

	// _tasks
	// used by	_setPaths.js
	grunt.registerTask('_tasks', 'sub task', function(dest_path, process) {
		
		var pkg = grunt.file.readJSON("package.json");
		var src_path = pkg.dirs.src;
		
		global['dest_path'] = dest_path;
		
		grunt.task.run([
			// clean up dest folder
			'clean',
			
			<%if ( hasComposer ) { %>
			//	composer
			// 'composer:update',
			<% } %>
			
			'copy',
				
			// assets from src to testingDir
			<%if ( scriptAdmin || scriptFrontend ) { %>
			'jshint',
			<% } %>

			<%if ( scriptFrontend ) { %>
			'concat_in_order:js_frontend',
			'uglify:js_frontend',
			<% } %>

			<%if ( scriptAdmin ) { %>
			'concat_in_order:js_admin',
			'uglify:js_admin',
			<% } %>

			<%if ( styleFrontend ) { %>
			'concat_in_order:sass_custom_modules_frontend',
			<% } %>

			<%if ( styleAdmin ) { %>
			'concat_in_order:sass_custom_modules_admin',
			<% } %>

			<%if ( styleAdmin || styleFrontend) { %>
			'sass:main',
			<% } %>

			// banner plugin_main_file
			'concat:plugin_main_file',
			
			// potomo
			'_pot',
			'_potomo',
			
		]);
		
	});
};