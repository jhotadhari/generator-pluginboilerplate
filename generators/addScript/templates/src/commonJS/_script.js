import {$} from './vendor/vendor';
// import App from './<%= funcPrefix %>_<%= scriptSlug %>/App';

document.addEventListener('DOMContentLoaded', () => {
	/*
	wp.api.loadPromise.done( function() {

		$('.selector-handle').each( function(){
			let <%= funcPrefix %>_<%= scriptSlug %> = new App({
				id: $( this ).attr('id').replace( 'selector-handle-', '' )
			});
			<%= funcPrefix %>_<%= scriptSlug %>.start();
		});
	});
	*/

	console.log( '<%= funcPrefix %>_<%= scriptSlug %> script loaded' );

});
