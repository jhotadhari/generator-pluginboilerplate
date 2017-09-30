module.exports = function(grunt){
	// load plugins
	require('load-grunt-tasks')(grunt);
	// load tasks
	grunt.loadTasks('grunt/tasks');
	// load config
	initConfigs(grunt, 'grunt/config');
};

function initConfigs(grunt, folderPath) {
				
	var config = {
		pattern: {
			global_exclude: [
				'!*~',
				'!**/*~',
				'!_test*',
				'!_del_*',
				'!**/_del_*',
			]
		},
		pkg: grunt.file.readJSON("package.json"),
		wp_installs: grunt.file.readJSON("wp_installs.json"),
		dest_path:  "<%%= global['dest_path'] %>",
		commit_msg: "<%%= global['commit_msg'] %>",
	};
	
    grunt.file.expand(folderPath + '/**/*.js').forEach(function(filePath) {
        var fileName = filePath.split('/').pop().split('.')[0]
        var fileData = require('./' + filePath)
        config[fileName] = fileData
    })
    grunt.initConfig(config)
}