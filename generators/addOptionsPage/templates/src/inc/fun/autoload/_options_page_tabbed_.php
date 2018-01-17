<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * CMB2 Plugin Options
 * @version  taskRunner_setVersion
 * @see      https://github.com/CMB2/CMB2-Snippet-Library/blob/59166b81693f4ab8651868e70cb29702576bd055/options-and-settings-pages/theme-options-cmb.php
 */
class <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %> {

	/**
 	 * Option key, and option page slug
 	 * @var string
 	 */
	private $key = '<%= key %>';
	
	private $tabs = array(
		<% for ( var tabKey in tabs ) { %>
		'<%= tabs[tabKey].slug %>' => array(
			'<%= tabs[tabKey].slug %>' => '<%= tabs[tabKey].title %>',
			//'metabox_form_args' => array(
			//	'save_button' => __('Save','<%= textDomain %>')
			//)
		),
		<% } %>
	);	

	/**
 	 * Options page metabox ids
 	 * @var array
 	 */
	private $metabox_ids = array();

	/**
	 * Options Page title
	 * @var string
	 */
	protected $title = '';

	/**
	 * Options Pages hook
	 * @var array
	 */
	protected $options_pages = array();

	/**
	 * Holds an instance of the object
	 *
	 * @var <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %>
	 */
	protected static $instance = null;

	/**
	 * Returns the running object
	 *
	 * @return <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %>
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
	 * @since taskRunner_setVersion
	 */
	protected function __construct() {
		// Set our title
		$this->title = __( '<%= title %>', '<%= textDomain %>' );
		
		foreach( $this->tabs as $key => $val ) {
			$this->metabox_ids[$key] = array( 'metabox_id'	=>	$this->key . '_' . $key );
			foreach( $val as $k => $v ) {
				$this->metabox_ids[$key][$k] = $v;
			}
		}		
	}

	/**
	 * Initiate our hooks
	 * @since taskRunner_setVersion
	 */
	public function hooks() {
		add_action( 'admin_init', array( $this, 'init' ) );
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		
		foreach( $this->metabox_ids as $key => $val ) {
			add_action( 'cmb2_admin_init', array( $this, 'add_options_page_metabox' . '__' . $key ) );
			add_action( 'cmb2_after_options-page_form_' . $val['metabox_id'], array( $this, 'enqueue_style_script'), 10, 2 );
		}		
		
		add_action( 'cmb2_after_init', array( $this, 'handle_submission') );
	}
	
	/**
	 * Enqueue styles and scripts
	 * @since taskRunner_setVersion
	 */	
	public function enqueue_style_script( $post_id, $cmb ) {
		wp_enqueue_style( '<%= funcPrefix %>_options_page_<%= key %>', <%= pluginClass %>::plugin_dir_url() . '/css/<%= funcPrefix %>_options_page_<%= key %>.min.css', false );
		wp_enqueue_script('<%= funcPrefix %>_options_page_<%= key %>', <%= pluginClass %>::plugin_dir_url() . '/js/<%= funcPrefix %>_options_page_<%= key %>.min.js', array( 'jquery' ));
	}	

	/**
	 * Register our setting to WP
	 * @since  taskRunner_setVersion
	 */
	public function init() {
		register_setting( $this->key, $this->key );
	}

	/**
	 * Add menu options page
	 * @since taskRunner_setVersion
	 */
	public function add_options_page() {
		
		<%if ( menuLevel === 'menuItem' ) { %>$this->options_page = add_menu_page(
			$this->title, 
			$this->title, 
			'manage_options', 
			$this->key, 
			array( $this, 'admin_page_display' ),
			''	// string $icon_url 
		);<% } %>
		<%if ( menuLevel === 'subMenuItem' ) { %>$this->options_page = add_submenu_page( 
			'<%= parentMenuSlug %>', 
			$this->title, 
			$this->title, 
			'manage_options', 
			$this->key, 
			array( $this, 'admin_page_display' )
		);<% } %>
		
		// Include CMB CSS in the head to avoid FOUC
		add_action( "admin_print_styles-{$this->options_page}", array( 'CMB2_hookup', 'enqueue_cmb_css' ) );
	}

	/**
	 * Admin page markup. Mostly handled by CMB2
	 * @since  taskRunner_setVersion
	 */
	public function admin_page_display() {
		
		// get active tab
		$active_tab = isset( $_GET[ 'tab' ] ) ? $_GET[ 'tab' ] : array_keys( $this->metabox_ids )[0];
		
		echo '<div class="wrap cmb2-options-page ' . $this->key . '">';
			echo '<h2>' . esc_html( get_admin_page_title() ) . '</h2>';
			
			// navigation tabs
			echo '<h2 class="nav-tab-wrapper">';
				foreach( $this->metabox_ids as $key => $val) {
					echo '<a href="?page=<%= key %>&tab=' . $key . '" class="nav-tab' . ($key === $active_tab ? ' nav-tab-active' : '') . '">' . __( $val[$key], '<%= textDomain %>') . '</a>';
				}
			echo '</h2>';

			// form
			cmb2_metabox_form(
				$this->metabox_ids[$active_tab]['metabox_id'],
				$this->key,
				isset( $this->metabox_ids[$active_tab]['metabox_form_args'] ) ? $this->metabox_ids[$active_tab]['metabox_form_args'] : array()
			);
			
		echo '</div>';
	}
	
	<% for ( var tabKey in tabs ) { %>
	public function add_options_page_metabox__<%= tabs[tabKey].slug %>() {
		$tab = '<%= tabs[tabKey].slug %>';
		
		$metabox_id = $this->key . '_' . $tab;
		
		// hook in our save notices
		add_action( "cmb2_save_options-page_fields_{$metabox_id}", array( $this, 'settings_notices' ), 10, 2 );

		$cmb = new_cmb2_box( array(
			'id'         => $metabox_id,
			'hookup'     => false,
			'cmb_styles' => false,
			'show_on'    => array(
				// These are important, don't remove
				'key'   => 'options-page',
				'value' => array( $this->key, )
			),
		) );
		
		// Set our CMB2 fields
		$cmb->add_field( array(
			'name' => __( 'Test Text', '<%= textDomain %>' ),
			'desc' => __( 'field description (optional)', '<%= textDomain %>' ),
			'id'   => '<%= tabs[tabKey].slug %>_test_text',
			'type' => 'text',
			'default' => 'Default Text',
		) );

		$cmb->add_field( array(
			'name'    => __( 'Test Color Picker', '<%= textDomain %>' ),
			'desc'    => __( 'field description (optional)', '<%= textDomain %>' ),
			'id'      => '<%= tabs[tabKey].slug %>_test_colorpicker',
			'type'    => 'colorpicker',
			'default' => '#bada55',
		) );
	
	}
	
	<% } %>
	
	
	protected function get_metabox_by_nonce( $nonce, $return = 'metabox' ) {
		if (! $nonce || ! strpos($nonce, 'nonce_CMB2php') === 0 )
			return false;
		
		$metabox_id = str_replace( 'nonce_CMB2php', '', $nonce );
		
		switch ( $return ){
			case 'metabox':
				return cmb2_get_metabox( $metabox_id, $this->key );
				break;
			case 'metabox_id':
				return $metabox_id;
				break;				
			case 'tab_name':
				return str_replace( $this->key . '_', '', $metabox_id );
				break;
			default:
				// silence ...
		}
		
	}
	
	public function handle_submission() {
		
		// is form submission?
		if ( empty( $_POST ) || ! isset( $_POST['submit-cmb'], $_POST['object_id'] ) ) return false;
		// is <%= key %> form submission?
		if ( ! $_POST['object_id'] == $this->key ) return false;
		
		// get nonce, metabox, tab_name
		$nonce = array_keys( $this->preg_grep_keys('/nonce_CMB2php\w+/', $_POST ) )[0];
		$tab_name = $this->get_metabox_by_nonce( $nonce, 'tab_name');
		$cmb = $this->get_metabox_by_nonce( $nonce );
		if (! $cmb ) return false;
		
		// Check security nonce
		if ( ! isset( $_POST[ $cmb->nonce() ] ) || ! wp_verify_nonce( $_POST[ $cmb->nonce() ], $cmb->nonce() ) ) {
			new Remp_Admin_Notice( array('Something went wrong.','Nonce verification failed.'), true );
			return;
		}
		
		// Fetch sanitized values
		$sanitized_values = $cmb->get_sanitized_values( $_POST );

		switch ( $tab_name ){
			<% for ( var tabKey in tabs ) { %>
			case '<%= tabs[tabKey].slug %>':
				break;
			<% } %>
			default:
				// silence ...
		}
		
	}
	
	public function preg_grep_keys( $pattern, $input, $flags = 0 ){
		$keys = preg_grep( $pattern, array_keys( $input ), $flags );
		$vals = array();
		foreach ( $keys as $key )    {
			$vals[$key] = $input[$key];
		}
		return $vals;
	}	


	/**
	 * Register settings notices for display
	 *
	 * @since  taskRunner_setVersion
	 * @param  int   $object_id Option key
	 * @param  array $updated   Array of updated fields
	 * @return void
	 */
	public function settings_notices( $object_id, $updated ) {
		if ( $object_id !== $this->key || empty( $updated ) ) {
			return;
		}

		add_settings_error( $this->key . '-notices', '', __( 'Settings updated.', '<%= textDomain %>' ), 'updated' );
		settings_errors( $this->key . '-notices' );
	}

	/**
	 * Public getter method for retrieving protected/private variables
	 * @since  taskRunner_setVersion
	 * @param  string  $field Field to retrieve
	 * @return mixed          Field value or exception is thrown
	 */
	public function __get( $field ) {
		// Allowed fields to retrieve
		if ( in_array( $field, array( 'key', 'metabox_id', 'title', 'options_page' ), true ) ) {
			return $this->{$field};
		}

		throw new Exception( 'Invalid property: ' . $field );
	}

}

/**
 * Helper function to get/return the <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %> object
 * @since  taskRunner_setVersion
 * @return <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %> object
 */
function <%= funcPrefix %>_options_page_<%= key %>() {
	return <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %>::get_instance();
}

/**
 * Wrapper function around cmb2_get_option
 * @since  taskRunner_setVersion
 * @param  string $key     Options array key
 * @param  mixed  $default Optional default value
 * @return mixed           Option value
 */
function <%= funcPrefix %>_<%= key %>_get_option( $key = '', $default = null ) {
	if ( function_exists( 'cmb2_get_option' ) ) {
		// Use cmb2_get_option as it passes through some key filters.
		return cmb2_get_option( <%= funcPrefix %>_options_page_<%= key %>()->key, $key, $default );
	}

	// Fallback to get_option if CMB2 is not loaded yet.
	$opts = get_option( <%= funcPrefix %>_options_page_<%= key %>()->key, $key, $default );

	$val = $default;

	if ( gettype($opts) === 'array' && !empty($opts) ){
		if ( 'all' == $key ) {
			$val = $opts;
		} elseif ( array_key_exists( $key, $opts ) && false !== $opts[ $key ] ) {
			$val = $opts[ $key ];
		}
	}

	return $val;
}

// Get it started
<%= funcPrefix %>_options_page_<%= key %>();


?>