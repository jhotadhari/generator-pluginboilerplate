<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * CMB2 Plugin Options
 * @version  taskRunner_set_version
 * @see      https://github.com/CMB2/CMB2-Snippet-Library/blob/59166b81693f4ab8651868e70cb29702576bd055/options-and-settings-pages/theme-options-cmb.php
 */
class <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %> {

	/**
 	 * Option key, and option page slug
 	 * @var string
 	 */
	private $key = '<%= key %>';

	/**
 	 * Options page metabox id
 	 * @var string
 	 */
	private $metabox_id = '<%= key %>_metabox';

	/**
	 * Options Page title
	 * @var string
	 */
	protected $title = '';

	/**
	 * Options Page hook
	 * @var string
	 */
	protected $options_page = '';

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
	 * @since taskRunner_set_version
	 */
	protected function __construct() {
		// Set our title
		$this->title = __( '<%= title %>', '<%= textDomain %>' );
	}

	/**
	 * Initiate our hooks
	 * @since taskRunner_set_version
	 */
	public function hooks() {
		add_action( 'admin_init', array( $this, 'init' ) );
		add_action( 'admin_menu', array( $this, 'add_options_page' ) );
		add_action( 'cmb2_admin_init', array( $this, 'add_options_page_metabox' ) );
		add_action( 'cmb2_after_options-page_form_' . $this->metabox_id, array( $this, 'enqueue_style_script'), 10, 2 );
	}

	/**
	 * Enqueue styles and scripts
	 * @since taskRunner_set_version
	 */
	public function enqueue_style_script( $post_id, $cmb ) {
		wp_enqueue_style( '<%= funcPrefix %>_options_page_<%= key %>', <%= pluginClass %>::plugin_dir_url() . '/css/<%= funcPrefix %>_options_page_<%= key %>.min.css', false );
		wp_enqueue_script('<%= funcPrefix %>_options_page_<%= key %>', <%= pluginClass %>::plugin_dir_url() . '/js/<%= funcPrefix %>_options_page_<%= key %>.min.js', array( 'jquery' ));
	}

	/**
	 * Register our setting to WP
	 * @since  taskRunner_set_version
	 */
	public function init() {
		register_setting( $this->key, $this->key );
	}

	/**
	 * Add menu options page
	 * @since taskRunner_set_version
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
	 * @since  taskRunner_set_version
	 */
	public function admin_page_display() {
		?>
		<div class="wrap cmb2-options-page <?php echo $this->key; ?>">
			<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
			<?php cmb2_metabox_form( $this->metabox_id, $this->key ); ?>
		</div>
		<?php
	}

	/**
	 * Add the options metabox to the array of metaboxes
	 * @since  taskRunner_set_version
	 */
	function add_options_page_metabox() {

		// hook in our save notices
		add_action( "cmb2_save_options-page_fields_{$this->metabox_id}", array( $this, 'settings_notices' ), 10, 2 );

		$cmb = new_cmb2_box( array(
			'id'         => $this->metabox_id,
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
			'id'   => 'test_text',
			'type' => 'text',
			'default' => 'Default Text',
		) );

		$cmb->add_field( array(
			'name'    => __( 'Test Color Picker', '<%= textDomain %>' ),
			'desc'    => __( 'field description (optional)', '<%= textDomain %>' ),
			'id'      => 'test_colorpicker',
			'type'    => 'colorpicker',
			'default' => '#bada55',
		) );

	}



	/**
	 * Register settings notices for display
	 *
	 * @since  taskRunner_set_version
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
	 * @since  taskRunner_set_version
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
 * @since  taskRunner_set_version
 * @return <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %> object
 */
function <%= funcPrefix %>_options_page_<%= key %>() {
	return <%= funcPrefixUpperCase %>_Options_Page_<%= keyUpperCase %>::get_instance();
}

/**
 * Wrapper function around cmb2_get_option
 * @since  taskRunner_set_version
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

	if ( 'all' == $key ) {
		$val = $opts;
	} elseif ( array_key_exists( $key, $opts ) && false !== $opts[ $key ] ) {
		$val = $opts[ $key ];
	}

	return $val;
}

// Get it started
<%= funcPrefix %>_options_page_<%= key %>();


?>