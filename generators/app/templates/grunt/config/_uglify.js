module.exports = {
	<%if ( scriptFrontend || scriptAdmin ) { %>
		<%if ( scriptFrontend ) { %>
		js_frontend: {
			files: {
					'<%%= dest_path %>/js/script.min.js': '<%%= pkg.dirs.src %>/js/frontend/dont_touch/_script_frontend.js'
				}
		},
		<% } %>
		<%if ( scriptAdmin ) { %>
		js_admin: {
			files: {
					'<%%= dest_path %>/js/script_admin.min.js': '<%%= pkg.dirs.src %>/js/admin/dont_touch/_script_admin.js'
				}
		},
		<% } %>
	<% } %>
};