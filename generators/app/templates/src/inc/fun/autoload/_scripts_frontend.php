<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


<%if ( scriptFrontend ) { %>
// Register frontend scripts
function <%= funcPrefix %>_scripts_frontend_register() {
	wp_register_script( '<%= funcPrefix %>_script', WP_PLUGIN_URL . '/<%= pluginSlug %>/' . 'js/script.min.js', apply_filters('<%= funcPrefix %>_script_frontend_deps', array('jquery') ), false , true);
}
add_action( 'wp_enqueue_scripts', '<%= funcPrefix %>_scripts_frontend_register' );


// Print frontend scripts
function <%= funcPrefix %>_scripts_frontend_print() {
	global $<%= funcPrefix %>_localize;
	
	// hook
	do_action('<%= funcPrefix %>_print_script');
	
	// <%= funcPrefix %>_script
	$parse_data = $<%= funcPrefix %>_localize->get_datas();
	wp_localize_script( '<%= funcPrefix %>_script', 'parse_data', $parse_data );
	wp_print_scripts('<%= funcPrefix %>_script');
	
}
add_action('wp_footer', '<%= funcPrefix %>_scripts_frontend_print');	
<% } %>

?>