/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { TextControl } = wp.components;

/**
 * Internal dependencies
 */
import defaults from '../defaults';

const NameInput = (props) => {

	const { nameObject, onChange } = props;

	const style = {
		width: '45%',
		float: 'left',
	};

	return ([

		<div style={ style }>
			<TextControl
				label={ __( 'Forename' ) }

				value={ nameObject.forename }
				onChange={ ( val ) => { onChange( 'forename', val ) } }
			/>
		</div>,

		<div style={{ ...style, marginLeft: '5px' }}>
			<TextControl
				label={ __( 'Lastname' ) }
				value={ nameObject.lastname }
				onChange={ ( val ) => { onChange( 'lastname', val ) } }
			/>
		</div>,

		<div style={{ clear: 'both' }}></div>
	]);

};

NameInput.propTypes = {
	nameObject: (props, propName) => typeof props[propName] === 'object' && props[propName]['forename'] && props[propName]['lastname'],
	onChange: (props, propName) => typeof props[propName] === 'function',
}

NameInput.defaultProps = {
	nameObject: {...defaults.name},
	onChange: ( key, val ) => null,
}

export default NameInput;