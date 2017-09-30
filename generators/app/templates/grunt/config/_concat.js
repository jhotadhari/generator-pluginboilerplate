module.exports = {
	prepend_to__readme_hist: {
		options: {
			banner: '= <%%= pkg.version %> =\n<%%= global["commit_msg"] %>\n',
		},
		src: 'src/readme/dont_touch/_readme_hist.txt',
		dest: 'src/readme/dont_touch/_readme_hist.txt'
	},
	readme_and_hist: {
		options: {
			banner: '=== <%%= pkg.fullName %> ===\nTags: <%%= pkg.tags %>\nDonate link: <%%= pkg.donateLink %>\nContributors: <%%= pkg.contributors %>\nTested up to: <%%= pkg.wpVersionTested %>\nRequires at least: <%%= pkg.wpRequiresAtLeast%>\nStable tag: trunk\nLicense: <%%= pkg.license %>\nLicense URI: <%%= pkg.licenseUri %>\n\n<%%= pkg.description %>\n',
			separator: '\n\n== Changelog ==\n\n'
		},
		src: [
			'src/readme/readme.txt',
			'src/readme/dont_touch/_readme_hist.txt'
		],
		dest: 'src/readme/dont_touch/_readme.txt'			
	}
};