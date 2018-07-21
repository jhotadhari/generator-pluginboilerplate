import {$} from './vendor/vendor';
// import App from './<%= funcPrefix %>_<%= scriptSlug %>/App';

// <%= funcPrefix %>_<%= scriptSlug %>_data;		// access the localized data

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

	console.log( '<%= funcPrefix %>_<%= scriptSlug %> script loaded', <%= funcPrefix %>_<%= scriptSlug %>_data );

});
