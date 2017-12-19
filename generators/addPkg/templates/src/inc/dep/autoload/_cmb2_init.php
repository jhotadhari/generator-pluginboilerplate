<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// cmb2 init
function <%= funcPrefix %>_cmb2_init() {
	include_once( WP_PLUGIN_DIR . '/<%= pluginSlug %>' . '/vendor/webdevstudios/cmb2/init.php' );
}
add_action('admin_init', '<%= funcPrefix %>_cmb2_init', 3);
add_action('init', '<%= funcPrefix %>_cmb2_init', 3);

?>