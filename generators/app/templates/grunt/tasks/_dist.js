module.exports = function(grunt){
	grunt.registerTask('dist', 'build into dist', function(vInc) {
		if ( (arguments.length === 0) || (! /^(major|minor|patch)$/.exec(vInc))) {
			grunt.warn("Version increment must be specified\n['major','minor','patch']\nlike: " + this.name + ":patch\n");
		}

		// run tasks
		grunt.task.run([
			// version bump
				'bump-only:' + vInc,
			// run other dist tasks ... needs to be seperated for bumb versioning
				'_updateChangelog:dist',
				// 'concat:readme',	// '_create_readme',
				'_setPaths:dist',
				'_dist_git_tasks'
		]);
		
	});
};