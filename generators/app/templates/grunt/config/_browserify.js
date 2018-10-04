'use strict';

const files = [{
	expand: true,
	cwd: 'src/commonJS',
	src: [
		'*.js',
		'*.jsx',
	],
	dest: '<%%= dest_path %>/js',
	rename: function (dst, src) {
		return dst + '/' + src.replace('.js', '.min.js');
	}
}];

const transform = [
	[ 'browserify-shim', {global: true}],
	[ 'babelify', {
		plugins: [
		],
		presets: [
			'@babel/preset-env',
			'@babel/preset-react',
		],
	}],
	[ 'jstify' ],
	[ 'uglifyify' ]
];

module.exports = {

	dist: {
		files,
        options: {
        	transform,
        	browserifyOptions: {
        		debug: false,
        	}
        },
	},

	debug: {
		files,
        options: {
        	transform,
        	browserifyOptions: {
        		debug: true,
        	}
        },
	}

};
