module.exports = function(grunt){

	// _tasks
	// used by	_setPaths.js
	grunt.registerTask('_tasks', 'sub task', function(dest_path, process) {
		
		var pkg = grunt.file.readJSON("package.json");
		
		global['dest_path'] = dest_path;
		
		grunt.task.run([
			// clean up dest folder
			'clean',
			
			//	composer	??? !!!
			// 'composer:update',
			
			// readme
			'concat:readme',
			
			'copy',
				
			// assets
			'jshint',
			'uglify:main',
			
			// style
			'sass:main',

			// banner plugin_main_file
			'concat:plugin_main_file',
			
			// potomo
			'pot',
			'_potomo',
			
		]);
		
	});
};