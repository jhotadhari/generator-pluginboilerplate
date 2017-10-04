<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

<%if ( styleAdmin ) { %>
// Enqueue admin styles
function <%= funcPrefix %>_styles_admin() {
	wp_register_style( '<%= funcPrefix %>_style_admin', WP_PLUGIN_URL . '<%= pluginSlug %>' . 'css/style_admin.css', false );
	wp_enqueue_style( '<%= funcPrefix %>_style_admin' );
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_styles_admin');	
<% } %>

?>