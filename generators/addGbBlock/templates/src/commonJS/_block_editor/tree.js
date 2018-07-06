/**
 * External dependencies
 */
import _ from 'underscore';

export const tree = [
	{
		name: 'Option 1',
		id: 'p1',
		children: [
			{ name: 'Descend 1 of option 1', id: 'p11' },
			{ name: 'Descend 2 of option 1', id: 'p12' },
		],
	},
	{
		name: 'Option 2',
		id: 'p2',
		children: [
			{
				name: 'Descend 1 of option 2',
				id: 'p21',
				children: [
					{
						name: 'Descend 1 of Descend 1 of option 2',
						id: 'p211',
					},
				],
			},
		],
	},
];

export const getTreeNodeLabel = ( id, tree ) => {
	if ( undefined === id || !id.length ) return 'no option selected';

	let label = '';
	_.mapObject( tree, ( node ) => {
		if ( ! label.length ) {
			if ( node.id === id ) {
				label = node.name;
			} else {
				if ( node.children && node.children.length )
					label = getTreeNodeLabel( id, node.children )
			}
		}
	});
	return label;
};