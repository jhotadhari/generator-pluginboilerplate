<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Register frontend script
function <%= funcPrefix %>_script_init_<%= scriptName %>_register() {
	wp_register_script('<%= funcPrefix %>_<%= scriptName %>', WP_PLUGIN_URL . '/<%= pluginSlug %>/js/<%= funcPrefix %>_<%= scriptName %>.min.js', apply_filters('<%= funcPrefix %>_<%= scriptName %>_deps', array('jquery') ));
}
add_action( '<%= actionHookEnqueue %>', '<%= funcPrefix %>_script_init_<%= scriptName %>_register' );

// Enqueue admin scripts
function <%= funcPrefix %>_script_init_<%= scriptName %>_print() {
	global $<%= funcPrefix %>_localize;
	
	// hook
	do_action('<%= funcPrefix %>_print_script_<%= scriptName %>');
	
	// localize
	$parse_data = $<%= funcPrefix %>_localize->get_datas();
	wp_localize_script( '<%= funcPrefix %>_<%= scriptName %>', 'parse_data', $parse_data );
	
	// print
	wp_print_scripts( '<%= funcPrefix %>_<%= scriptName %>');
}
add_action('<%= actionHookPrint %>', '<%= funcPrefix %>_script_init_<%= scriptName %>_print');	

?>