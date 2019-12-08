module.exports = function(grunt){
	grunt.registerTask('dist', 'build into dist', function(vInc) {
		if ( (arguments.length === 0) || (! /^(major|minor|patch)$/.exec(vInc))) {
			grunt.warn("Version increment must be specified\n['major','minor','patch']\nlike: " + this.name + ":patch\n");
		}

		let tasks = [];

		tasks = tasks.concat([
			'bump-only:' + vInc,				// version bump
			'_updateConfig',
		]);

		tasks = tasks.concat([
			'_updateChangelog:dist',
			'string-replace:inc_update_src',	// will replace string and update file in source
		]);

		tasks = tasks.concat([
			'_setPaths:dist',					// build tasks
		]);

		// zip
		tasks = [
			...tasks,
			'compress',
		];

		// git tasks
		tasks = grunt.option('git') === false ? tasks : [
			...tasks,
			...( grunt.option('git:add') !== false  && ['git:add'] ),
			...( grunt.option('git:commit') !== false  && ['git:commit'] ),
			...( grunt.option('git:tag') !== false  && ['git:tag'] ),
		];

		// noticeReady
		tasks = [
			...tasks,
			'_noticeReady:dist',
		];

		grunt.task.run( tasks );				// run tasks

	});
};