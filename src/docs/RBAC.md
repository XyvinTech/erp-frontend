# Role-Based Access Control (RBAC) System

This document explains how the role-based access control system works in the ERP application.

## Overview

The RBAC system controls which users can access which parts of the application based on their assigned roles. The system consists of several components:

1. **RoleGuard**: A component that protects routes based on user roles
2. **RoleBasedRenderer**: A component that conditionally renders UI elements based on user roles
3. **withRoleAccess**: A higher-order component (HOC) that protects individual components based on user roles
4. **useAuth**: A hook that provides authentication state and role-checking utilities
5. **roleUtils**: Utility functions for checking user roles
6. **rolePermissions**: A configuration file that defines which roles have access to which routes

## Available Roles

The system supports the following roles:

- ERP System Administrator
- IT Manager
- Project Manager
- Business Analyst
- Developer
- Quality Assurance Specialist
- HR Manager
- Finance Manager
- Sales Manager
- Employee

## Route Protection

Routes are protected using the `RoleGuard` component in the routing configuration. The `RoleGuard` checks if the user has the required roles to access a route and redirects to the login page or dashboard if they don't.

```jsx
// Example route configuration
<Route path="/" element={<ProtectedRoute />}>
  <Route element={<RoleGuard />}>
    <Route element={<DashboardLayout />}>
      <Route path="hrm/employees" element={<Employees />} />
    </Route>
  </Route>
</Route>
```

## Role-Based UI Rendering

UI elements can be conditionally rendered based on user roles using the `RoleBasedRenderer` component:

```jsx
// Example usage
<RoleBasedRenderer roles={["HR Manager", "ERP System Administrator"]}>
  <button>Add Employee</button>
</RoleBasedRenderer>
```

## Component Protection

Individual components can be protected using the `withRoleAccess` HOC:

```jsx
// Example usage
const ProtectedComponent = withRoleAccess(MyComponent, {
  roles: ["HR Manager"],
  redirectPath: "/dashboard",
  showUnauthorized: true,
});
```

## Role Checking in Components

You can check user roles in your components using the `useAuth` hook:

```jsx
// Example usage
import useAuth from "@/hooks/useAuth";

function MyComponent() {
  const { user, checkRole, isAdmin } = useAuth();

  // Check if user has a specific role
  const isHRManager = checkRole("HR Manager");

  return (
    <div>
      {isAdmin && <p>Admin content</p>}
      {isHRManager && <p>HR Manager content</p>}
    </div>
  );
}
```

## Role Permissions Configuration

Role permissions are defined in the `rolePermissions.js` file. This file maps roles to the routes they can access:

```js
// Example configuration
const rolePermissions = {
  "HR Manager": [
    "/dashboard",
    "/hrm/employees",
    "/hrm/departments",
    // ...
  ],
  // ...
};
```

## Adding a New Role

To add a new role:

1. Add the role to the backend enum
2. Add the role to the `rolePermissions.js` file with its allowed routes
3. Update any components that need to check for the new role

## Troubleshooting

If a user can't access a route they should have access to:

1. Check if the user has the correct role assigned
2. Check if the role has the route listed in `rolePermissions.js`
3. Check if the route path is correctly formatted (case-sensitive)
4. Check the browser console for any errors in the role-checking logic
