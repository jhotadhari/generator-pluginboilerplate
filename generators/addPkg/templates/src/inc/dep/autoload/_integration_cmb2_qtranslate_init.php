<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// _integration_cmb2_qtranslate_init
function <%= funcPrefix %>_integration_cmb2_qtranslate_init() {
		
	wp_register_script('cmb2_qtranslate_main', WP_PLUGIN_URL . '<%= pluginSlug %>' . '/vendor/jmarceli/integration-cmb2-qtranslate/dist/scripts/main.js', array('jquery'));
	wp_enqueue_script('cmb2_qtranslate_main');
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_integration_cmb2_qtranslate_init');

?>