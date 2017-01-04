<?php
/*
	grunt.concat_in_order.declare('<%= funcPrefixUpperCase %>_localize');
	grunt.concat_in_order.require('init');
*/

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
add_action( 'admin_init', '<%= funcPrefix %>_init_localize' , 3);
add_action( 'init', '<%= funcPrefix %>_init_localize' , 3);


?>