module.exports = {
	//	src/root_files to ...
	root_files: {		
		expand: true,
		cwd: '<%%= pkg.dirs.src %>/root_files/',
		src: ['**/*','<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>'	
	},
	<%if ( hasComposer ) { %>
	//	vendor to ...
	vendor: {		
		expand: true,
		cwd: 'vendor/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/vendor/'	
	},
	<% } %>
	
	inc: {		
		expand: true,
		cwd: '<%%= pkg.dirs.src %>/inc/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/inc/'	
	},
	
	
	//	images to ...
	images: {		
		expand: true,
		cwd: '<%%= pkg.dirs.src %>/images/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/images/'	
	},
	//	fonts to ...
	fonts: {		
		expand: true,
		cwd: '<%%= pkg.dirs.src %>/fonts/',
		src: ['**/*', '<%%= pattern.global_exclude %>'],
		dest: '<%%= dest_path %>/fonts/'	
	},
	//	readme to ...
	readme: {		
		src: ['<%%= pkg.dirs.src %>/readme/dont_touch/_readme.txt'],
		dest: '<%%= dest_path %>/readme.txt'
	},
};