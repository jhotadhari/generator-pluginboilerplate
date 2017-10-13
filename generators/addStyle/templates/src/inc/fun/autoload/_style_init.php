<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Enqueue style <%= styleName %>
function <%= funcPrefix %>_style_init_<%= styleName %>() {
	wp_enqueue_style( '<%= funcPrefix %>_<%= styleName %>', WP_PLUGIN_URL . '/<%= pluginSlug %>/css/<%= funcPrefix %>_<%= styleName %>.min.css' );
}
add_action( '<%= actionHook %>', '<%= funcPrefix %>_style_init_<%= styleName %>' );

?>