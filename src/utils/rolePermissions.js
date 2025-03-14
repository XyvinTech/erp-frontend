/**
 * Role-based permissions for routes
 * This file defines which roles have access to which routes
 */

const rolePermissions = {
    // Admin has access to everything
    'ERP System Administrator': [
        '/',
        '/employee',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban',
        '/hrm',
        '/hrm/dashboard',
        '/hrm/employees',
        '/hrm/departments',
        '/hrm/positions',
        '/hrm/attendance',
        '/hrm/leave',
        '/hrm/payroll',
        '/hrm/events',
        '/clients',
        '/clients/list',
        '/projects',
        '/projects/list',
        '/projects/assign',
        '/projects/kanban',
        '/projects/details',
        '/frm',
        '/frm/dashboard',
        '/frm/expenses',
        '/frm/personal-loans',
        '/frm/office-loans',
        '/frm/profits'
    ],

    // IT Manager has access to IT-related routes
    'IT Manager': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban',
        '/projects',
        '/projects/list',
        '/projects/assign',
        '/projects/kanban',
        '/projects/details'
    ],

    // Project Manager has access to project-related routes
    'Project Manager': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban',
        '/projects',
        '/projects/list',
        '/projects/assign',
        '/projects/kanban',
        '/projects/details',
        '/clients',
        '/clients/list'
    ],

    // Business Analyst has access to business-related routes
    'Business Analyst': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban',
        '/projects',
        '/projects/list',
        '/projects/kanban',
        '/projects/details',
        '/clients',
        '/clients/list'
    ],

    // Developer has access to development-related routes
    'Developer': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban'
    ],

    // QA Specialist has access to QA-related routes
    'Quality Assurance Specialist': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban'
    ],

    // HR Manager has access to HR-related routes
    'HR Manager': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/hrm',
        '/hrm/dashboard',
        '/hrm/employees',
        '/hrm/departments',
        '/hrm/positions',
        '/hrm/attendance',
        '/hrm/leave',
        '/hrm/payroll',
        '/hrm/events'
    ],

    // Finance Manager has access to finance-related routes
    'Finance Manager': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/frm',
        '/frm/dashboard',
        '/frm/expenses',
        '/frm/personal-loans',
        '/frm/office-loans',
        '/frm/profits'
    ],

    // Sales Manager has access to sales-related routes
    'Sales Manager': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/clients',
        '/clients/list'
    ],

    // Regular employee has limited access
    'Employee': [
        '/',
        '/employee/dashboard',
        '/employee/profile',
        '/employee/leaveapplication',
        '/employee/myattendance',
        '/employee/payslip',
        '/employee/projects',
        '/employee/projects/kanban'
    ]
};

export default rolePermissions; 