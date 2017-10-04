<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class <%= funcPrefixUpperCase %>_defaults {


	protected $defaults = array();

	public function add_default( $arr ){
		$defaults = $this->defaults;
		$this->defaults = array_merge( $defaults , $arr);
	}
	
	public function get_default( $key ){
		if ( array_key_exists($key, $this->defaults) ){
			return $this->defaults[$key];

		}
			return null;
	}


}

function <%= funcPrefix %>_init_defaults(){
	global $<%= funcPrefix %>_defaults;
	
	$<%= funcPrefix %>_defaults = new <%= funcPrefixUpperCase %>_defaults();
	
	// $defaults = array(
	// 	// silence ...
	// );
	
	// $<%= funcPrefix %>_defaults->add_default( $defaults );	
}
add_action( 'admin_init', '<%= funcPrefix %>_init_defaults', 1 );
add_action( 'init', '<%= funcPrefix %>_init_defaults', 1 );



?>