/**
 * Authorization Roles
 */

const initRoleParams = {
    name: null,
    can_view: false,
    can_view_own: false,
    can_edit: false,
    can_create: false,
    can_delete: false,
}

const authRoles = {
    allierh          : [initRoleParams],
    permissions      : [initRoleParams],
    users            : [initRoleParams],
    config           : [initRoleParams],
    onlyGuest        : [],
};

// Set the admin tabs
authRoles.admin_tab = (
    authRoles.permissions.can_view
    && authRoles.config.can_view
);

export default authRoles;
