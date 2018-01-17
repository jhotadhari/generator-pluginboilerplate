<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// <%= funcPrefix %>_integration_cmb2_qtranslate_init
function <%= funcPrefix %>_integration_cmb2_qtranslate_init() {
	wp_enqueue_script('cmb2_qtranslate_main', <%= pluginClass %>::plugin_dir_url() . '/vendor/jmarceli/integration-cmb2-qtranslate/dist/scripts/main.js', array('jquery'));
}
add_action('admin_enqueue_scripts', '<%= funcPrefix %>_integration_cmb2_qtranslate_init');

?>