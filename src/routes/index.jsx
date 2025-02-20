import { Routes, Route } from 'react-router-dom';
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          
          {/* Employee Routes */}
          <Route path="/employee">
            <Route path="profile" element={<Profile />} />
            <Route path="myAttendance" element={<MyAttendance />} />
            <Route path="LeaveApplication" element={<LeaveApplication />} />
            <Route path="payslip" element={<PaySlip />} />
          </Route>

          {/* HRM Routes */}
          <Route path="/hrm">
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<Departments />} />
            <Route path="positions" element={<Positions />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave" element={<Leave />} />
            <Route path="payroll" element={<Payroll />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes; 