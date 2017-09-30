module.exports = {
	git: {
		add: {
			options: {
				A: true,
			},
		},
		commit: {
			options: {
				m: 'v<%%= pkg.version %>\n\n<%%= commit_msg %>'
			}
		},	
		tag: {
			options: {
				a: ['v<%%= pkg.version %>'],
				m: ['<%%= commit_msg %>']
			}
		},
	},
};