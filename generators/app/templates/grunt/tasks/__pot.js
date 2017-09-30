module.exports = function(grunt){
	
	// _pot
	// used by	_tasks.js
	grunt.registerTask('_pot', 'sub task', function() {
		var dir = grunt.config.get('potomo').main.files[0].cwd;
		
		if( grunt.file.expand( dir ).length === 0 ){
			grunt.file.mkdir( dir )
		}	
		
		grunt.task.run(['pot']);
	});
};