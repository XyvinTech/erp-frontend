import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import RoleGuard from "@/components/common/RoleGuard";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Dashboard Pages
import Dashboard from "@/pages/Dashboard";

// Employee Pages
import Profile from "@/pages/employee/Profile";
import EmployeeDashboard from "@/pages/employee/EmployeeDashboard";
import PaySlip from "@/pages/employee/PaySlip";
import LeaveApplication from "@/pages/employee/LeaveApplication";
import MyAttendance from "@/pages/employee/MyAttendance";
import MyProjects from "@/pages/employee/MyProjects";
import MyProjectKanban from "@/pages/employee/MyProjectKanban";

// HRM Pages
import HRMDashboard from "@/pages/hrm/Dashboard";
import Employees from "@/pages/hrm/Employees";
import Departments from "@/pages/hrm/Departments";
import Positions from "@/pages/hrm/Positions";
import Attendance from "@/pages/hrm/Attendance";
import Leave from "@/pages/hrm/Leave";
import Payroll from "@/pages/hrm/Payroll";

// Client Pages
import ClientList from "@/pages/clients/ClientList";

// Project Management Pages
import ProjectList from "@/pages/projects/ProjectList";
import ProjectKanban from "@/pages/projects/ProjectKanban";
import AssignProject from "@/pages/projects/AssignProject";
import AssignedProjects from "@/pages/projects/AssignedProjects";
import ProjectDetails from "@/pages/projects/ProjectDetails";

// FRM Pages
import FRMDashboard from "@/pages/frm/Dashboard";
import Expenses from "@/pages/frm/Expenses";
import PersonalLoans from "@/pages/frm/PersonalLoans";
import OfficeLoans from "@/pages/frm/OfficeLoans";
import Profits from "@/pages/frm/Profits";
import Events from "@/pages/hrm/Events";

const router = createBrowserRouter(
  [
    // Public routes (no authentication required)
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },

    // Protected routes (authentication required)
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        // Role-protected routes
        {
          element: <RoleGuard />,
          children: [
            {
              element: <DashboardLayout />,
              children: [
                {
                  path: "/",
                  element: <Dashboard />,
                },
                // Employee Routes
                {
                  path: "employee",
                  children: [
                    {
                      path: "dashboard",
                      element: <EmployeeDashboard />,
                    },
                    {
                      path: "profile",
                      element: <Profile />,
                    },
                    {
                      path: "LeaveApplication",
                      element: <LeaveApplication />,
                    },
                    {
                      path: "myAttendance",
                      element: <MyAttendance />,
                    },
                    {
                      path: "payslip",
                      element: <PaySlip />,
                    },
                    {
                      path: "projects",
                      element: <MyProjects />,
                    },
                    {
                      path: "projects/kanban/:projectId",
                      element: <MyProjectKanban />,
                    },
                  ],
                },
                // HRM Routes
                {
                  path: "hrm",
                  children: [
                    {
                      path: "dashboard",
                      element: <HRMDashboard />,
                    },
                    {
                      path: "employees",
                      element: <Employees />,
                    },
                    {
                      path: "departments",
                      element: <Departments />,
                    },
                    {
                      path: "positions",
                      element: <Positions />,
                    },
                    {
                      path: "attendance",
                      element: <Attendance />,
                    },
                    {
                      path: "leave",
                      element: <Leave />,
                    },
                    {
                      path: "payroll",
                      element: <Payroll />,
                    },
                    {
                      path: "events",
                      element: <Events />,
                    },
                  ],
                },
                // Client Routes
                {
                  path: "clients",
                  children: [
                    {
                      path: "list",
                      element: <ClientList />,
                    },
                  ],
                },
                // Project Routes
                {
                  path: "projects",
                  children: [
                    {
                      path: "list",
                      element: <ProjectList />,
                    },
                    {
                      path: "assign",
                      element: <AssignProject />,
                    },
                    {
                      path: "kanban/:projectId",
                      element: <ProjectKanban />,
                    },
                    {
                      path: "details/:projectId",
                      element: <ProjectDetails />,
                    },
                    {
                      path: "projecta/details",
                      element: <ProjectDetails />,
                    },
                  ],
                },
                // FRM Routes
                {
                  path: "frm",
                  children: [
                    {
                      path: "dashboard",
                      element: <FRMDashboard />,
                    },
                    {
                      path: "expenses",
                      element: <Expenses />,
                    },
                    {
                      path: "personal-loans",
                      element: <PersonalLoans />,
                    },
                    {
                      path: "office-loans",
                      element: <OfficeLoans />,
                    },
                    {
                      path: "profits",
                      element: <Profits />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
