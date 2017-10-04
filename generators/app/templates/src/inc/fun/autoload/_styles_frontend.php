<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

<%if ( styleFrontend ) { %>
// Enqueue frontend styles
function <%= funcPrefix %>_styles_frontend() {
	wp_enqueue_style( '<%= funcPrefix %>_style', WP_PLUGIN_URL . '/<%= pluginSlug %>/' . 'css/style.css' );
}
add_action( 'wp_enqueue_scripts', '<%= funcPrefix %>_styles_frontend' );
<% } %>

?>