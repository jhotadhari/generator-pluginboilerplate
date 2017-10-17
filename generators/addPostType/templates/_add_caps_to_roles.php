<?php

function <%= funcPrefix %>_add_<%= key %>_caps_to_roles() {
    $roles = <%- addCapToRolePhpArr %>;
    
    foreach ( $roles as $role ) {
		$role = get_role( $role );
		$role->add_cap( 'edit_<%= key %>' ); 
		$role->add_cap( 'edit_<%= key %>s' ); 
		$role->add_cap( 'edit_other_<%= key %>s' ); 
		$role->add_cap( 'publish_<%= key %>s' ); 
		$role->add_cap( 'read_<%= key %>' ); 
		$role->add_cap( 'read_private_<%= key %>s' ); 
		$role->add_cap( 'delete_<%= key %>' );    
    }

}
add_action( '<%= funcPrefix %>_on_activate_before_flush', '<%= funcPrefix %>_add_<%= key %>_caps_to_roles');

?>