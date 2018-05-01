<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function <%= funcPrefix %>_add_<%= key %>_caps_to_roles() {
	$post_type = '<%= key %>';

	$roles = <%- addCapToRolePhpArr %>;

	foreach($roles as $the_role) {
		$role = get_role($the_role);
		$role->add_cap( 'read_' . $post_type );
		$role->add_cap( 'read_private_' . $post_type . 's' );
		$role->add_cap( 'edit_' . $post_type );
		$role->add_cap( 'edit_' . $post_type . 's' );
		$role->add_cap( 'edit_published_' . $post_type . 's' );
		$role->add_cap( 'edit_others_' . $post_type . 's' );
		$role->add_cap( 'delete_' . $post_type . 's' );
		$role->add_cap( 'delete_others_' . $post_type . 's' );
		$role->add_cap( 'delete_private_' . $post_type . 's' );
		$role->add_cap( 'delete_published_' . $post_type . 's' );
		$role->add_cap( 'publish_' . $post_type . 's' );
		$role->add_cap( 'create_' . $post_type );
	}

}
add_action( '<%= funcPrefix %>_on_activate_before_flush', '<%= funcPrefix %>_add_<%= key %>_caps_to_roles');

?>