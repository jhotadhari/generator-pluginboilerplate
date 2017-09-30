module.exports = function(grunt){
	grunt.registerTask('dist', 'build into dist', function(vInc) {
		if ( (arguments.length === 0) || (! /^(major|minor|patch)$/.exec(vInc))) {
			grunt.warn("Version increment must be specified\n['major','minor','patch']\nlike: " + this.name + ":patch\n");
		}
		
		var msg_obj_path = 'src/readme/commit_msg.json';
		global['msg_obj_path'] = msg_obj_path;
		var msg_obj = grunt.file.readJSON( msg_obj_path );
		
		var commit_msg = '';
		var key;

		for (key in msg_obj) {
			if ( (msg_obj.hasOwnProperty(key)) && ( key != 'test') ) {
				commit_msg += msg_obj[key] + '\n';
			}
		}
		
		if ( commit_msg.length == 0 ) {
			grunt.warn("No commit info found in: " + msg_obj_path + "\n");
		}
		
		global['commit_msg'] = commit_msg;
		
		/*
			run tasks
		*/
		
		grunt.task.run([
			// version bump
				'bump:' + vInc,
			// run other dist tasks ... needs to be seperated for bumb versioning
				'_create_readme',
				'_setPaths:dist',
						
			]);
				
	});
};