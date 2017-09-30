module.exports = function(grunt){
	
	// _reset_commit_msg_json
	// used by _setPaths.js
	grunt.registerTask('_reset_commit_msg_json', 'sub task', function() {
		var reseted_commit_msg_json =
			{
				"test": "test",
			};
			
			grunt.file.write(global['msg_obj_path'], JSON.stringify(reseted_commit_msg_json, null, 2));
	
	});
};