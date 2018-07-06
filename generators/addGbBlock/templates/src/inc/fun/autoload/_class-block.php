<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class <%= funcPrefixUpperCase %>_Block_<%= blockSlugUpperCase %> {

	protected static $instance = null;
	protected $namspace = '<%= blockNamespace %>';

	protected $handles = array(
		'editor' => '<%= funcPrefix %>_block_<%= blockSlug %>_editor',
		'frontend' => '<%= funcPrefix %>_block_<%= blockSlug %>_frontend',
	);

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
			self::$instance->hooks();
		}

		return self::$instance;
	}

	protected function __construct() {
		// ... silence
	}

	public function hooks() {
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_frontend_assets' ) );
	}

	public function register_block() {
		register_block_type( $this->namspace, array(
			'editor_script' => $this->get_handle( 'editor' ),
			'editor_style' => $this->get_handle( 'editor' ),
			// 'style' => '<%= funcPrefix %>_block_<%= blockSlug %>',		// dont set a style here. use hook instead and check if post_has_block
			// 'script' => '<%= funcPrefix %>_block_<%= blockSlug %>',	// dont set a style here. use hook instead and check if post_has_block
			'render_callback' => array( $this, 'render' ),
		) );

	}

	protected function get_handle( $key ){
		$handles = $this->handles;
		if ( array_key_exists( $key, $handles ) ){
			return $handles[$key];
		}

	}

	protected function post_has_block(){
		global $post;

		if ( strlen( $post->post_content ) === 0 )
			return false;

		$block_pattern = (
			'/<!--\s+wp:(' .
			str_replace( '/', '\/',                 // Escape namespace, not handled by preg_quote.
				preg_quote( $this->namspace )
				) .
			')(\s+(\{.*?\}))?\s+(\/)?-->/'
			);
		return preg_match( $block_pattern, $post->post_content, $block_matches ) === 1;
	}

	protected function get_localize_data(){
		// global $post;
		// $current_user = wp_get_current_user();
		// return array(
		// 	'pluginDirUrl' => <%= pluginClass %>::plugin_dir_url(),
		// 	'user' => array(
		// 		'id' => $current_user->ID,
		// 	),
		// 	'post' => array(
		// 		'id' => $post->ID,
		// 	)
		// );
		return array();
	}


	// hooked on enqueue_block_assets. So function will run in admin and frontend.
	// But we will use it only on frontend if the post has this block
	public function enqueue_frontend_assets() {

		// check if we are on frontend and the post has a block
		if ( is_admin() || ! $this->post_has_block() )
			return;

		$handle = $this->get_handle( 'frontend' );

		wp_enqueue_style(
			$handle,
			<%= pluginClass %>::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array( 'wp-blocks' ),
			filemtime( <%= pluginClass %>::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);

		wp_register_script(
			$handle,
			<%= pluginClass %>::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				// 'wp-backbone',
				// 'wp-api',
				// 'utils',
				),
			filemtime( <%= pluginClass %>::plugin_dir_path() . 'js/' . $handle . '.min.js' )
		);

		wp_localize_script( $handle, '<%= funcPrefix %>Data', $this->get_localize_data() );

		wp_enqueue_script( $handle );
	}

	// hooked on enqueue_block_editor_assets. So function will only run in admin
	public function enqueue_editor_assets() {
		$handle = $this->get_handle( 'editor' );


		wp_register_script(
			$handle,
			<%= pluginClass %>::plugin_dir_url() . '/js/' . $handle . '.min.js',
			array(
				'wp-blocks',
				'wp-i18n',
				'wp-element',
			),
			filemtime( <%= pluginClass %>::plugin_dir_path() . 'js/' . $handle . '.min.js' )
		);

		wp_localize_script( $handle, '<%= funcPrefix %>Data', $this->get_localize_data() );

		wp_enqueue_script( $handle );

		wp_enqueue_style(
			$handle,
			<%= pluginClass %>::plugin_dir_url() . '/css/' . $handle . '.min.css',
			array( 'wp-edit-blocks' ),
			filemtime( <%= pluginClass %>::plugin_dir_path() . 'css/' . $handle . '.min.css' )
		);
	}

}

function <%= funcPrefix %>_block_<%= blockSlug %>_init() {
	return <%= funcPrefixUpperCase %>_Block_<%= blockSlugUpperCase %>::get_instance();
}

<%= funcPrefix %>_block_<%= blockSlug %>_init();

?>