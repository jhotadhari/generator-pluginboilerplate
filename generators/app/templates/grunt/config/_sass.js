module.exports = {
	<%if ( styleFrontend || styleAdmin || styleOptionsPage ) { %>
		options: {
			<%if ( sass_susy || sass_breakpoint ) { %>
			require: [
				<%if ( sass_susy ) { %>
				'susy',
				<% } %>
				<%if ( sass_breakpoint ) { %>
				'breakpoint'
				<% } %>
			],
			<% } %>
			<%if ( sass_bourbon ) { %>
			loadPath: require('node-bourbon').includePaths,
			<% } %>
		},
		main: {
			options: {
				sourcemap: 'none',
				style: 'compressed'
			},
			files:{
				<%if ( styleFrontend ) { %>
				'<%%= dest_path %>/css/style.css': '<%%= pkg.dirs.src %>/sass/style_frontend.scss',
				<% } %>
				<%if ( styleAdmin ) { %>
				'<%%= dest_path %>/css/style_admin.css': '<%%= pkg.dirs.src %>/sass/style_admin.scss',
				<% } %>
				<%if ( styleOptionsPage ) { %>
				'<%%= dest_path %>/css/<%= funcPrefix %>_options_page.css': '<%%= pkg.dirs.src %>/sass/<%= funcPrefix %>_options_page.scss',
				<% } %>
			}
		}
	<% } %>
};