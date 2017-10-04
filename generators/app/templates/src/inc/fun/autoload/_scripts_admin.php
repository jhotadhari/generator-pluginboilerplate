<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

<%if ( scriptAdmin ) { %>
// Enqueue admin scripts
function <%= funcPrefix %>_scripts_admin() {
	wp_register_script('<%= funcPrefix %>_script_admin', WP_PLUGIN_URL . '<%= pluginSlug %>' . 'js/script_admin.min.js', array('jquery'));
	wp_enqueue_script( '<%= funcPrefix %>_script_admin');
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_scripts_admin');	
<% } %>

?>