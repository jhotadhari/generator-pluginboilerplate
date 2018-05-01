<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Register a <%= key %> post type.
 *
 * @link http://codex.wordpress.org/Function_Reference/register_post_type
 */
function <%= funcPrefix %>_add_post_type_<%= key %>() {

	$post_type = '<%= key %>';
	$labels = array(
		'name'                  => _x( '<%= singular_name %>s', 'Post Type General Name', '<%= textDomain %>' ),
		'singular_name'         => _x( '<%= singular_name %>', 'Post Type Singular Name', '<%= textDomain %>' ),
		'menu_name'             => __( '<%= singular_name %>s', '<%= textDomain %>' ),
		'name_admin_bar'        => __( '<%= singular_name %>', '<%= textDomain %>' ),
		'archives'              => __( '<%= singular_name %>s', '<%= textDomain %>' ),
		'attributes'            => __( '<%= singular_name %> Attributes', '<%= textDomain %>' ),
		'parent_item_colon'     => __( 'Parent <%= singular_name %>:', '<%= textDomain %>' ),
		'all_items'             => __( 'All <%= singular_name %>s', '<%= textDomain %>' ),
		'add_new_item'          => __( 'Add New <%= singular_name %>', '<%= textDomain %>' ),
		'add_new'               => __( 'Add New', '<%= textDomain %>' ),
		'new_item'              => __( 'New <%= singular_name %>', '<%= textDomain %>' ),
		'edit_item'             => __( 'Edit <%= singular_name %>', '<%= textDomain %>' ),
		'update_item'           => __( 'Update <%= singular_name %>', '<%= textDomain %>' ),
		'view_item'             => __( 'View <%= singular_name %>', '<%= textDomain %>' ),
		'view_items'            => __( 'View <%= singular_name %>s', '<%= textDomain %>' ),
		'search_items'          => __( 'Search <%= singular_name %>', '<%= textDomain %>' ),
		'not_found'             => __( 'Not found', '<%= textDomain %>' ),
		'not_found_in_trash'    => __( 'Not found in Trash', '<%= textDomain %>' ),
		'featured_image'        => __( 'Featured Image', '<%= textDomain %>' ),
		'set_featured_image'    => __( 'Set featured image', '<%= textDomain %>' ),
		'remove_featured_image' => __( 'Remove featured image', '<%= textDomain %>' ),
		'use_featured_image'    => __( 'Use as featured image', '<%= textDomain %>' ),
		'insert_into_item'      => __( 'Insert into <%= singular_name %>', '<%= textDomain %>' ),
		'uploaded_to_this_item' => __( 'Uploaded to this <%= singular_name %>', '<%= textDomain %>' ),
		'items_list'            => __( '<%= singular_name %>s list', '<%= textDomain %>' ),
		'items_list_navigation' => __( '<%= singular_name %>s list navigation', '<%= textDomain %>' ),
		'filter_items_list'     => __( 'Filter <%= singular_name %>s list', '<%= textDomain %>' ),
	);

	$args = array(
		'label'                 => __( '<%= singular_name %>', '<%= textDomain %>' ),
		'description'           => __( '<%= singular_name %> description', '<%= textDomain %>' ),
		'labels'                => $labels,
		'supports'              => <%- supportsPhpArr %>,
		'hierarchical'          => <%= hierarchical %>,
		'public'                => <%= public %>,
		'show_ui'               => <%= show_ui %>,
		'show_in_menu'          => <%= show_in_menu %>,
		'menu_position'         => 5,
		'show_in_admin_bar'     => <%= show_in_admin_bar %>,
		'show_in_nav_menus'     => <%= show_in_nav_menus %>,
		'can_export'            => <%= can_export %>,
		'has_archive'           => <%= has_archive %>,
		'exclude_from_search'   => <%= exclude_from_search %>,
		'publicly_queryable'    => <%= publicly_queryable %>,
		'menu_icon'             => null,	// https://developer.wordpress.org/resource/dashicons/#admin-page
		'show_in_rest'          => <%= show_in_rest %>,
		<% if ( show_in_rest ) { %>'rest_base'          	=> $post_type . 's', <% } %>
		<% if ( capability_type === 'custom' ) { %>'capability_type'		=> array( $post_type, $post_type . 's' ),
		'map_meta_cap'		=> true, <% } else { %>'capability_type'		=> '<%= capability_type %>',<% } %>
	);
	register_post_type( $post_type, $args );

}
add_action( 'init', '<%= funcPrefix %>_add_post_type_<%= key %>' );
add_action( '<%= funcPrefix %>_on_activate_before_flush', '<%= funcPrefix %>_add_post_type_<%= key %>' );

?>