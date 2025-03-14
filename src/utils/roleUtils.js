/**
 * Utility functions for role-based access control
 */

/**
 * Check if a user has a specific role
 * @param {Object} user - The user object
 * @param {String} roleName - The role name to check
 * @returns {Boolean} - Whether the user has the role
 */
export const hasRole = (user, roleName) => {
    if (!user || !user.roles || user.roles.length === 0) {
        return false;
    }

    return user.roles.some(role => role.name === roleName);
};

/**
 * Check if a user has any of the specified roles
 * @param {Object} user - The user object
 * @param {Array} roleNames - Array of role names to check
 * @returns {Boolean} - Whether the user has any of the roles
 */
export const hasAnyRole = (user, roleNames) => {
    if (!user || !user.roles || user.roles.length === 0 || !roleNames || roleNames.length === 0) {
        return false;
    }

    return user.roles.some(role => roleNames.includes(role.name));
};

/**
 * Get user's role names as an array
 * @param {Object} user - The user object
 * @returns {Array} - Array of role names
 */
export const getUserRoles = (user) => {
    if (!user || !user.roles || user.roles.length === 0) {
        return [];
    }

    return user.roles.map(role => role.name);
};

/**
 * Check if user is an administrator
 * @param {Object} user - The user object
 * @returns {Boolean} - Whether the user is an administrator
 */
export const isAdmin = (user) => {
    return hasRole(user, 'ERP System Administrator');
};

/**
 * Check if user is an HR manager
 * @param {Object} user - The user object
 * @returns {Boolean} - Whether the user is an HR manager
 */
export const isHRManager = (user) => {
    return hasRole(user, 'HR Manager');
};

/**
 * Check if user is a project manager
 * @param {Object} user - The user object
 * @returns {Boolean} - Whether the user is a project manager
 */
export const isProjectManager = (user) => {
    return hasRole(user, 'Project Manager');
};

/**
 * Check if user is a finance manager
 * @param {Object} user - The user object
 * @returns {Boolean} - Whether the user is a finance manager
 */
export const isFinanceManager = (user) => {
    return hasRole(user, 'Finance Manager');
};

/**
 * Check if user is a manager (any type)
 * @param {Object} user - The user object
 * @returns {Boolean} - Whether the user is a manager
 */
export const isManager = (user) => {
    const managerRoles = [
        'ERP System Administrator',
        'IT Manager',
        'Project Manager',
        'HR Manager',
        'Finance Manager',
        'Sales Manager'
    ];

    return hasAnyRole(user, managerRoles);
}; 