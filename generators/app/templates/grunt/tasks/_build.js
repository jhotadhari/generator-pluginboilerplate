module.exports = function(grunt){

	grunt.registerTask('build', 'build into test', function(){
	
		grunt.task.run([
			'_setPaths:build',
		]);
		
	});
};