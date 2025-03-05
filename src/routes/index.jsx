import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Dashboard Pages
import Dashboard from '@/pages/Dashboard';

// Employee Pages
import Profile from '@/pages/employee/Profile';

// HRM Pages
import Employees from '@/pages/hrm/Employees';
import Departments from '@/pages/hrm/Departments';
import Positions from '@/pages/hrm/Positions';
import Attendance from '@/pages/hrm/Attendance';
import Leave from '@/pages/hrm/Leave';
import Payroll from '@/pages/hrm/Payroll';
import PaySlip from '@/pages/employee/PaySlip';
import LeaveApplication from '@/pages/employee/LeaveApplication';
import MyAttendance from '@/pages/employee/MyAttendance';

// Client Pages
import ClientList from '@/pages/clients/ClientList';

// Project Management Pages
import ProjectList from '@/pages/projects/ProjectList';
import AssignProject from '@/pages/projects/AssignProject';
import AssignedProjects from '@/pages/projects/AssignedProjects';
import ProjectKanban from '@/pages/projects/ProjectKanban';

// FRM Pages
import FRMDashboard from '@/pages/frm/Dashboard';
import Expenses from '@/pages/frm/Expenses';
import PersonalLoans from '@/pages/frm/PersonalLoans';
import OfficeLoans from '@/pages/frm/OfficeLoans';
import Profits from '@/pages/frm/Profits';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/employee/profile", element: <Profile /> },
          { path: "/employee/myAttendance", element: <MyAttendance /> },
          { path: "/employee/LeaveApplication", element: <LeaveApplication /> },
          { path: "/employee/payslip", element: <PaySlip /> },
          { path: "/hrm/employees", element: <Employees /> },
          { path: "/hrm/departments", element: <Departments /> },
          { path: "/hrm/positions", element: <Positions /> },
          { path: "/hrm/attendance", element: <Attendance /> },
          { path: "/hrm/leave", element: <Leave /> },
          { path: "/hrm/payroll", element: <Payroll /> },
          { path: "/clients/list", element: <ClientList /> },
          { path: "/projects/list", element: <ProjectList /> },
          { path: "/projects/assigned", element: <AssignedProjects /> },
          { path: "/projects/assign/:id", element: <AssignProject /> },
          { path: "/projects/kanban/:projectId", element: <ProjectKanban /> },
          // FRM Routes
          { path: "/frm/dashboard", element: <FRMDashboard /> },
          { path: "/frm/expenses", element: <Expenses /> },
          { path: "/frm/personal-loans", element: <PersonalLoans /> },
          { path: "/frm/office-loans", element: <OfficeLoans /> },
          { path: "/frm/profits", element: <Profits /> }
        ]
      }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes; 