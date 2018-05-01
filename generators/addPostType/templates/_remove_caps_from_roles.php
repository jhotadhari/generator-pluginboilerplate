<?php

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

function <%= funcPrefix %>_remove_<%= key %>_caps_from_roles() {
	$post_type = '<%= key %>';

	$roles = <%- addCapToRolePhpArr %>;

	foreach($roles as $the_role) {
		$role = get_role($the_role);
		$role->remove_cap( 'read_' . $post_type );
		$role->remove_cap( 'read_private_' . $post_type . 's' );
		$role->remove_cap( 'edit_' . $post_type );
		$role->remove_cap( 'edit_' . $post_type . 's' );
		$role->remove_cap( 'edit_published_' . $post_type . 's' );
		$role->remove_cap( 'edit_others_' . $post_type . 's' );
		$role->remove_cap( 'delete_' . $post_type . 's' );
		$role->remove_cap( 'delete_others_' . $post_type . 's' );
		$role->remove_cap( 'delete_private_' . $post_type . 's' );
		$role->remove_cap( 'delete_published_' . $post_type . 's' );
		$role->remove_cap( 'publish_' . $post_type . 's' );
		$role->remove_cap( 'create_' . $post_type );
	}

}
add_action( '<%= funcPrefix %>_on_deactivate_before_flush', '<%= funcPrefix %>_remove_<%= key %>_caps_from_roles');

?>