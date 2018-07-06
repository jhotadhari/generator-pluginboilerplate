/**
 * External dependencies
 */
// import _ from 'underscore';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
<% if( examples.indexOf('RichText') !== -1 ) { %>const { RichText } = wp.editor;
<% } %><% if( examples.indexOf('TreeSelect') !== -1 ) { %>const { TreeSelect } = wp.components;<% } %>

/**
 * Internal dependencies
 */
import defaults from './<%= funcPrefix %>_block_<%= blockSlug %>_editor/defaults';
<% if( examples.indexOf('TreeSelect') !== -1 ) { %>import { tree, getTreeNodeLabel } from './<%= funcPrefix %>_block_<%= blockSlug %>_editor/tree';
<% } %>
<% if( examples.length > 0 ) { %>import Label 		from './<%= funcPrefix %>_block_<%= blockSlug %>_editor/components/Label.jsx';
<% } %>
<% if( examples.indexOf('serializedNameInput') !== -1 ) { %>import NameInput 	from './<%= funcPrefix %>_block_<%= blockSlug %>_editor/components/NameInput.jsx';
<% } %>
/**
 * Access Localized data: <%= funcPrefix %>Data
 */
// console.log( 'Localized data', <%= funcPrefix %>Data );

// https://wordpress.org/gutenberg/handbook/block-api/#register-block-type
registerBlockType( '<%= blockNamespace %>', {
	title: __( '<%= blockName %>' ),
	// icon: 'location-alt',	// https://wordpress.org/gutenberg/handbook/block-api/#icon-optional
	category: 'widgets',		// [ common | formatting | layout | widgets | embed ] https://wordpress.org/gutenberg/handbook/block-api/#category

	// https://wordpress.org/gutenberg/handbook/block-api/attributes/
    attributes: {
        <% if( examples.indexOf('RichText') !== -1 ) { %>content: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },<% } %>
        <% if( examples.indexOf('TreeSelect') !== -1 ) { %>selectedId: {
            type: 'string',
        },<% } %>
        <% if( examples.indexOf('serializedNameInput') !== -1 ) { %>name: {
            type: 'string',
            default: JSON.stringify( {...defaults.name} ),
        },<% } %>
    },

    // The edit function describes the structure of your block in the context of the editor.
    // This represents what the editor will render when the block is used.
    edit( { className, attributes, setAttributes } ) {

    	const { <%for (var i = 0; i < examples.length; i++) {
            switch( examples[i] ){
                case 'RichText':
					%>content<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
                case 'TreeSelect':
					%>selectedId<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
                case 'serializedNameInput':
					%>name<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
            }
		}%> } = attributes;
    	<% if( examples.indexOf('serializedNameInput') !== -1 ) { %>const nameObject = JSON.parse( undefined === name ? {...defaults.name} : name );
    	<% } %><% if( examples.indexOf('serializedNameInput') !== -1 ) { %>const setName = ( key, val ) => {
			setAttributes( { name:JSON.stringify( {
				...nameObject,
				[key]: val,
			} ) } );
		};
		<% } %>
        return ([
			<div className={ className }>

				<% if( examples.indexOf('RichText') !== -1 ) { %><Label tag="h3" title='Example RichText Component'/>
				<RichText
					tagName='p'
					placeholder='Example RichText Component ... is empty'
					value={ content }
					onChange={ ( content ) => setAttributes( { content } ) }
				/>
				<% } %>
				<% if( examples.indexOf('TreeSelect') !== -1 ) { %><Label tag="h3" title='Example TreeSelect Component'/>
				<TreeSelect
					noOptionLabel='None'
					onChange={ ( val ) => { setAttributes( { selectedId:val } ) } }
					selectedId={ selectedId }
					tree={tree}
				/>
				<% } %>
				<% if( examples.indexOf('serializedNameInput') !== -1 ) { %><Label tag="h3" title='Example for storing serialized object as block attribute'/>
				<NameInput
					nameObject={nameObject}
					onChange={ ( key, val ) => { setName( key, val ) } }
				/>
				<% } %>
			</div>
        ]);
    },

    // The save function defines the way in which the different attributes should be combined into the final markup,
    // which is then serialized by Gutenberg into post_content.
    save( { attributes } ) {

    	const { <%for (var i = 0; i < examples.length; i++) {
            switch( examples[i] ){
                case 'RichText':
					%>content<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
                case 'TreeSelect':
					%>selectedId<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
                case 'serializedNameInput':
					%>name<% if( i < ( examples.length - 1 ) ) {%>,<%}
                    break;
            }
		}%> } = attributes;
    	<% if( examples.indexOf('serializedNameInput') !== -1 ) { %>const nameObject = JSON.parse( undefined === name ? {...defaults.name} : name );
    	<% } %>
        return (
        	<div>
				<% if( examples.indexOf('RichText') !== -1 ) { %>
				<div className='<%= funcPrefix %>-<%= blockSlugUri %> rich-text-example'>
					<Label tag="h3" title='Example RichText Component'/>
					<RichText.Content tagName='p' value={ content } />
				</div>
				<% } %><% if( examples.indexOf('TreeSelect') !== -1 ) { %>
				<div className='<%= funcPrefix %>-<%= blockSlugUri %> tree-select-example'>
					<Label tag="h3" title='Example TreeSelect Component'/>
					<Label title='Selected option:'/>
					<span>{ getTreeNodeLabel( selectedId, tree ) }</span>
				</div>
				<% } %><% if( examples.indexOf('serializedNameInput') !== -1 ) { %>
				<div className='<%= funcPrefix %>-<%= blockSlugUri %> serialized-value-example'>
					<Label tag="h3" title='Example for storing serialized object as block attribute'/>
					<Label title='Forename:'/>
					<span>{ nameObject.forename }</span>
					<Label title='Lastname:'/>
					<span>{ nameObject.lastname }</span>
				</div>
				<% } %>
			</div>
		);
    }

});
