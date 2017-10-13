module.exports = {
	root_files: {
		expand: true,
		cwd: 'src/root_files/',
		src: ['**/*','<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>'	
	},
	
	vendor: {		
		expand: true,
		cwd: 'vendor/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/vendor/'	
	},
	
	inc: {		
		expand: true,
		cwd: 'src/inc/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/inc/'	
	},
	
	
	images: {		
		expand: true,
		cwd: 'src/images/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/images/'	
	},
	
	fonts: {		
		expand: true,
		cwd: 'src/fonts/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/fonts/'	
	},
	
};