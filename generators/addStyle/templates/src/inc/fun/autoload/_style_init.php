<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Enqueue style <%= styleSlug %>
function <%= funcPrefix %>_style_init_<%= styleSlug %>() {
	wp_enqueue_style( '<%= funcPrefix %>_<%= styleSlug %>',  <%= pluginClass %>::plugin_dir_url() . '/css/<%= funcPrefix %>_<%= styleSlug %>.min.css' );
}
add_action( '<%= actionHook %>', '<%= funcPrefix %>_style_init_<%= styleSlug %>' );

?>