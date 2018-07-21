<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * script/style for frontend
 *
 * - Registers the script/style in wp_enqueue_scripts hook.
 * - Collects localization data during page rendering through add_loc_data method.
 * 		-> use the add_loc_data() method in shortcode- or template-tag-functions.
 * - If has $loc_data, localizes script and enqueues the script/style in footer
 *
 */
class <%= funcPrefixUpperCase %>_Script_<%= scriptSlugUpperCase %> {

	/**
	 * Holds an instance of the object
	 * @var <%= funcPrefixUpperCase %>_Script_<%= scriptSlugUpperCase %>
	 */
	protected static $instance = null;

	/**
	 * Handle for script/style
 	 * @var string
	 */
	protected $handle;

	/**
	 * The Array that will be localized for the script
 	 * @var array
	 */
	protected $loc_data = array();

	/**
	 * Returns the running object
	 *
	 * @return <%= funcPrefixUpperCase %>_Script_<%= scriptSlugUpperCase %>
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 * @since taskRunner_set_version
	 */
	function __construct() {
		$this->handle = '<%= funcPrefix %>_<%= scriptSlug %>';

		// // some sample data that will be localized
		// // add more data for localization during page rendering through the add_loc_data method
		// $this->loc_data = array (
		// 	'sample' => array(
		// 		'foo' => 'bar',
		// 	)
		// );
	}

	/**
	 * Initiate our hooks
	 * @since taskRunner_set_version
	 */
	protected function hooks() {
		add_action( '<%= actionHookEnqueue %>', array( $this, 'register_script' ) );
		add_action( '<%= actionHookPrint %>', array( $this, 'print_script' ) );
		// add_action( '<%= actionHookFooter %>', array( $this, 'print_style' ) );
	}

	/**
	 * Adds an array to the $loc_data
	 * @since taskRunner_set_version
	 * @param  array	$data	Array to be added
	 */
	public function add_loc_data( $data ){
		if ( empty( $data ) || ! is_array( $data ) )
			return;
		foreach( $data as $key => $val ){
			$this->loc_data[$key] = $val;
		}
	}

	/**
	 * Register script/style
	 * @since taskRunner_set_version
	 */
	public function register_script(){
		wp_register_script(
			$this->handle,
			<%= pluginClass %>::plugin_dir_url() . '/js/' . $this->handle . '.min.js',
			array(
				'jquery',
				// 'wp-backbone',
				// 'wp-api'
			),
			false,
			true
		);

		/*
		wp_register_style(
			$this->handle,
			<%= pluginClass %>::plugin_dir_url() . '/css/' . $this->handle . '.min.css'
		);
		*/
	}

	/**
	 * Localize and print script
	 *
	 */
	public function print_script(){
		// if ( empty( $this->loc_data ) )
		// 	return;
		wp_localize_script( $this->handle, '<%= funcPrefix %>_<%= scriptSlug %>_data', $this->loc_data );
		wp_print_scripts( $this->handle );
	}

	/**
	 * Print style
	 *
	 */
	/*
	public function print_style(){
		if ( empty( $this->loc_data ) )
			return;
		wp_enqueue_style( $this->handle );
	}
	*/

}

function <%= funcPrefix %>_script_<%= scriptSlug %>_init() {
	return <%= funcPrefixUpperCase %>_Script_<%= scriptSlugUpperCase %>::get_instance();
}
<%= funcPrefix %>_script_<%= scriptSlug %>_init();

?>