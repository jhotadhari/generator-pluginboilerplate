module.exports = {
    options: {
        format: 'jed',
    },
    all: {
		files: [{
			expand: true,
			cwd: 'src/languages/',
			src: ['*.po'],
			dest: '<%%= dest_path %>/languages',
			rename: ( dst, src ) => dst + '/' + src.replace( src, ''),
		}]
    }
};
