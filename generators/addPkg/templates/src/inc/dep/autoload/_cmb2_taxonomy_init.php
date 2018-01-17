<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// <%= funcPrefix %>_cmb2_taxonomy_init
function <%= funcPrefix %>_cmb2_taxonomy_init() {
	if (! class_exists('CMB2_Taxonomy')) {
		include_once( <%= pluginClass %>::plugin_dir_path() . 'vendor/jcchavezs/cmb2-taxonomy/init.php' );
	}
}
add_action('admin_init', '<%= funcPrefix %>_cmb2_taxonomy_init', 3);
add_action('init', '<%= funcPrefix %>_cmb2_taxonomy_init', 3);

?>