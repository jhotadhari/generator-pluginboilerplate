<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// load textdomain
function <%= funcPrefix %>_load_textdomain(){
	load_plugin_textdomain(
		'<%= pluginTextDomain %>',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', '<%= funcPrefix %>_load_textdomain' );

// include dir
function <%= funcPrefix %>_include_dir($directory){
	$files =  glob( $directory . '*.php');
	if ( count($files) > 0 ){
		foreach ( $files as $file) {
			include_once( $file );
		}
    }
}

// include inc dep autoload
<%= funcPrefix %>_include_dir(  WP_PLUGIN_DIR . '/<%= pluginSlug %>/' . 'inc/dep/autoload/');

// include inc fun autoload
<%= funcPrefix %>_include_dir(  WP_PLUGIN_DIR . '/<%= pluginSlug %>/' . 'inc/fun/autoload/');

?>