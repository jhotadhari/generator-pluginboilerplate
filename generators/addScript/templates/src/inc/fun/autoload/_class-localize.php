<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class <%= funcPrefixUpperCase %>_localize {

	protected $datas = array();

	public function add_datas( $arr ){
		$datas = $this->datas;
		$this->datas = array_merge( $datas , $arr);
	}
	
	public function get_datas( $key = null ){
		
		if ( $key === null ){
			return $this->datas;
		} elseif ( array_key_exists( $key, $this->datas) ) {
			return $this->datas[$key];

		} else {
			return false;
		}
	
	}
}

function <%= funcPrefix %>_init_localize(){
	global $<%= funcPrefix %>_localize;
	$<%= funcPrefix %>_localize = new <%= funcPrefixUpperCase %>_localize();
}
add_action( 'init', '<%= funcPrefix %>_init_localize' , 3);



/*
// example to add some stuff to access it later in the scrpts
function <%= funcPrefix %>_localize_example(){
	global $<%= funcPrefix %>_localize;
	
	$some_data = array(
		'cup' => 'coffe',
		'sky' => array(
			'day' => 'sun',
			'night' => 'moon'
		)	
	);
	
	$<%= funcPrefix %>_localize->add_datas( $some_data );
}
add_action( 'init', '<%= funcPrefix %>_localize_example' , 10);
*/


?>