module.exports = {
	<%if ( scriptFrontend || scriptAdmin ) { %>
	jshint: {
		all: [
			'<%%= pkg.dirs.src %>/js/**/*.js',
			'!<%%= pkg.dirs.src %>/js/**/noLint/**/*.js',
			'!<%%= pkg.dirs.src %>/js/**/dont_touch/**/*.js',
			'<%%= pattern.global_exclude %>',
		]
	},
	<% } %>
};