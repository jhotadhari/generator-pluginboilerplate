<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Register frontend script
function <%= funcPrefix %>_script_init_<%= scriptSlug %>_register() {
	wp_register_script('<%= funcPrefix %>_<%= scriptSlug %>', <%= funcPrefixUpperCase %>_<%= pluginSlugUpperCase %>::plugin_dir_url() . '/js/<%= funcPrefix %>_<%= scriptSlug %>.min.js', apply_filters('<%= funcPrefix %>_<%= scriptSlug %>_deps', array('jquery') ));
}
add_action( '<%= actionHookEnqueue %>', '<%= funcPrefix %>_script_init_<%= scriptSlug %>_register' );

// Enqueue admin scripts
function <%= funcPrefix %>_script_init_<%= scriptSlug %>_print() {
	global $<%= funcPrefix %>_localize;
	
	// hook
	do_action('<%= funcPrefix %>_print_script_<%= scriptSlug %>');
	
	// localize
	$parse_data = $<%= funcPrefix %>_localize->get_datas();
	wp_localize_script( '<%= funcPrefix %>_<%= scriptSlug %>', 'parse_data', $parse_data );
	
	// print
	wp_print_scripts( '<%= funcPrefix %>_<%= scriptSlug %>');
}
add_action('<%= actionHookPrint %>', '<%= funcPrefix %>_script_init_<%= scriptSlug %>_print');	

?>