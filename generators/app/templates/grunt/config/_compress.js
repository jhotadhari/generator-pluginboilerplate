var path = require('path');

module.exports = {
	trunk_to_releases: {
		options: {
			archive: 'releases/<%%= global["pkg"].name %>-<%%= global["pkg"].version %>.zip',
			mode: 'zip',
			pretty: true,
		},
		files: [
		  {
			  expand: true,
		  	  cwd: 'dist/trunk',
			  src: ['*','**/*'],
			  dest: '<%%= global["pkg"].name %>',
		  },
		],
	},
};
