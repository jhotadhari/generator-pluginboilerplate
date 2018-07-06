
const Label = (props) => <props.tag className='label'>{props.title}</props.tag>;

Label.propTypes = {
	tag: (props, propName) => typeof props[propName] === 'string',
	title: (props, propName) => typeof props[propName] === 'string',
}
Label.defaultProps = {
	tag: 'span',
	title: ''
}

export default Label;