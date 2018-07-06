
export const defaults = {
	<% if( examples.indexOf('serializedNameInput') !== -1 ) { %>name: {
		forename: 'Pippi',
		lastname: 'Långstrump',
	},<% } %>
};

export default defaults;