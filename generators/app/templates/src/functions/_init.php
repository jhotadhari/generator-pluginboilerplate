<?php
/*
	grunt.concat_in_order.declare('init');
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// load_plugin_textdomain
function <%= funcPrefix %>_load_textdomain(){
	
	load_plugin_textdomain(
		'<%= pluginTextDomain %>',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', '<%= funcPrefix %>_load_textdomain' );


<%if ( styleAdmin ) { %>
// Enqueue admin styles
function <%= funcPrefix %>_styles_admin() {
	wp_register_style( '<%= funcPrefix %>_style_admin', plugin_dir_url( __FILE__ ) . 'css/style_admin.css', false );
	wp_enqueue_style( '<%= funcPrefix %>_style_admin' );
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_styles_admin');	
<% } %>
<%if ( scriptAdmin ) { %>
// Enqueue admin scripts
function <%= funcPrefix %>_scripts_admin() {
	wp_register_script('<%= funcPrefix %>_script_admin', plugin_dir_url( __FILE__ ) . 'js/script_admin.min.js', array('jquery'));
	wp_enqueue_script( '<%= funcPrefix %>_script_admin');
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_scripts_admin');	
<% } %>
<%if ( styleFrontend ) { %>
// Enqueue frontend styles
function <%= funcPrefix %>_styles_frontend() {
	wp_enqueue_style( '<%= funcPrefix %>_style', plugin_dir_url( __FILE__ ) . 'css/style.css' );
}
add_action( 'wp_enqueue_scripts', '<%= funcPrefix %>_styles_frontend' );
<% } %>
<%if ( scriptFrontend ) { %>
// Register frontend scripts
function <%= funcPrefix %>_scripts_frontend_register() {
	wp_register_script( '<%= funcPrefix %>_script', plugin_dir_url( __FILE__ ) . 'js/script.min.js', apply_filters('<%= funcPrefix %>_script_frontend_deps', array('jquery') ), false , true);
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