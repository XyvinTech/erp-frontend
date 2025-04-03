import api from './api';

// Employees
export const getEmployees = async () => {
    const response = await api.get('hrm/employees');
    // Return the employees array from the nested data structure
    return response.data?.data?.employees || [];
};

export const getEmployee = async (id) => {
    const response = await api.get(`hrm/employees/${id}`);
    return response.data;
};

export const createEmployee = async (data) => {
    const response = await api.post('hrm/employees', data);
    return response.data;
};

export const updateEmployee = async (id, data) => {
    const response = await api.put(`hrm/employees/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(`hrm/employees/${id}`);
    return response.data;
};

// Departments
export const getDepartments = async () => {
    const response = await api.get('hrm/departments');
    // Return the full response to maintain the data structure
    return response.data;
};

export const getDepartment = async (id) => {
    const response = await api.get(`hrm/departments/${id}`);
    return response.data;
};

export const createDepartment = async (data) => {
    const response = await api.post('hrm/departments', data);
    return response.data;
};

export const updateDepartment = async (id, data) => {
    const response = await api.put(`hrm/departments/${id}`, data);
    return response.data;
};

export const deleteDepartment = async (id) => {
    const response = await api.delete(`hrm/departments/${id}`);
    return response.data;
};

export const getPositions = async () => {
    const response = await api.get('hrm/positions');
    // Ensure we return an array of positions
    const positions = response.data?.data?.positions || response.data?.positions || response.data || [];
    return Array.isArray(positions) ? positions : [];
};

export const getPosition = async (id) => {
    const response = await api.get(`hrm/positions/${id}`);
    return response.data;
};

export const createPosition = async (data) => {
    const response = await api.post('hrm/positions', data);
    return response.data;
};

export const updatePosition = async (id, data) => {
    const response = await api.put(`hrm/positions/${id}`, data);
    return response.data;
};

export const deletePosition = async (id) => {
    const response = await api.delete(`hrm/positions/${id}`);
    return response.data;
};

// Attendance
export const getAttendance = async () => {
    const response = await api.get('hrm/attendance');
    return response.data;
};

export const getAttendanceStats = async () => {
    const response = await api.get('hrm/attendance/stats');
    return response.data;
};

export const getMyAttendance = async (params) => {
    const response = await api.get('hrm/attendance/my-attendance', { params });
    return response.data;
};

export const updateAttendance = async (id, data) => {
    const response = await api.put(`hrm/attendance/${id}`, data);
    return response.data;
};

export const checkIn = async (data) => {
    const response = await api.post('hrm/attendance/check-in', data);
    return response.data;
};

export const checkOut = async (id) => {
    const response = await api.post(`hrm/attendance/${id}/check-out`);
    return response.data;
};

export const createBulkAttendance = async (data) => {
    const response = await api.post('hrm/attendance/bulk', data);
    return response.data;
};

export const getLeaves = async () => {
    const response = await api.get('hrm/leaves');
    // Ensure we return an array
    const leaves = response.data?.leaves || response.data;
    return Array.isArray(leaves) ? leaves : [];
};

export const getMyLeave = async () => {
    const response = await api.get('hrm/leaves/my');
    // Ensure we return an array
    const leaves = response.data?.data?.leaves || response.data?.leaves || response.data || [];
    return Array.isArray(leaves) ? { data: { leaves } } : { data: { leaves: [] } };
};

export const getLeave = async (id) => {
    const response = await api.get(`hrm/leaves/${id}`);
    return response.data;
};

export const createLeave = async (data) => {
    const response = await api.post('hrm/leaves', data);
    return response.data;
};

export const updateLeave = async (id, data) => {
    const response = await api.put(`hrm/leaves/${id}`, data);
    return response.data;
};

export const deleteLeave = async (id) => {
    const response = await api.delete(`hrm/leaves/${id}`);
    return response.data;
};

export const approveLeave = async (id) => {
    const response = await api.post(`hrm/leaves/${id}/approve`);
    return response.data;
};

export const rejectLeave = async (id) => {
    const response = await api.post(`hrm/leaves/${id}/reject`);
    return response.data;
};

export const reviewLeave = async (id, data) => {
    const response = await api.patch(`hrm/leaves/${id}/review`, data);
    return response.data;
};

// Payroll
export const getPayroll = async () => {
    const response = await api.get('hrm/payroll');
    return response.data?.data || [];
};

export const getPayrollById = async (id) => {
    const response = await api.get(`hrm/payroll/${id}`);
    return response.data;
};

export const createPayroll = async (data) => {
    const response = await api.post('hrm/payroll', data);
    return response.data;
};

export const updatePayroll = async (id, data) => {
    const response = await api.put(`hrm/payroll/${id}`, data);
    return response.data;
};

export const deletePayroll = async (id) => {
    const response = await api.delete(`hrm/payroll/${id}`);
    return response.data;
};

export const generatePayroll = async (data) => {
    const response = await api.post('hrm/payroll/generate', data);
    return response.data;
};

export const getEmployeeSalary = async (employeeId) => {
    const response = await api.get(`hrm/payroll/employee/${employeeId}/salary`);
    return response.data;
};

export const downloadPayroll = async (id) => {
    const response = await api.get(`hrm/payroll/${id}/download`, {
        responseType: 'blob'
    });
    return response.data;
};

// Next Department Code
export const getNextDepartmentCode = async () => {
    const response = await api.get('hrm/departments/code/next');
    return response.data;
};

// Next Employee Id
export const getNextEmployeeId = async () => {
    const response = await api.get('hrm/employees/next-id');
    console.log('Next employee ID response:', response);
    return response.data;
};

// Next Position Code
export const getNextPositionCode = async () => {
    const response = await api.get('hrm/positions/code/next');
    return response.data;
};

// Events
export const getEvents = async () => {
    const response = await api.get('hrm/events');
    console.log('Events:', response.data);
    return response.data;
};

export const getEvent = async (id) => {
    const response = await api.get(`hrm/events/${id}`);
    return response.data;
};

export const createEvent = async (data) => {
    const response = await api.post('hrm/events', data);
    return response.data;
};

export const updateEvent = async (id, data) => {
    const response = await api.put(`hrm/events/${id}`, data);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await api.delete(`hrm/events/${id}`);
    return response.data;
};

export const getCurrentEmployee = async () => {
    const response = await api.get('hrm/employees/me');
    return response.data;
};











































