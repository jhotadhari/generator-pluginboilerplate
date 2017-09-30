module.exports = function(grunt){
	
	// _create_readme
	// used by	dist
	grunt.registerTask('_create_readme', 'sub task', function() {
		grunt.task.run([
			// append commit msg to _readme_hist.txt
			'concat:prepend_to__readme_hist',
			// concat readme parts to _readme.txt
			'concat:readme_and_hist'
		]);
	});
	
};