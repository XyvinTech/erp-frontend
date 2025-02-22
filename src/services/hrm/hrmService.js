import ApiService from '../api.service';

const hrmService = new ApiService('/hrm');

// Employee Services
export const getEmployees = async (params) => {
  const response = await hrmService.get('/employees', params);
  return response.data?.employees || [];
};

export const getManagerEmployees = async () => {
  const response = await hrmService.get('/employees', { role: 'manager' });
  return response.data?.employees || [];
};

export const getEmployee = async (id) => {
  const response = await hrmService.get(`/employees/${id}`);
  return response.data?.employee;
};

export const createEmployee = async (data) => {
  const response = await hrmService.post('/employees', data);
  return response.data?.employee;
};

export const updateEmployee = async (id, data) => {
  try {
    if (!id) {
      throw new Error('Employee ID is required for update');
    }
    
    console.log('Starting employee update process:', {
      id,
      endpoint: `/employees/${id}`,
      requestData: data
    });

    // Validate required fields for update
    const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Remove any undefined or null values from data
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Ensure we don't send employeeId in updates
    delete cleanData.employeeId;

    console.log('Cleaned data for update:', cleanData);

    const response = await hrmService.put(`/employees/${id}`, cleanData);
    console.log('Raw update response:', response);
    
    if (!response || !response.data) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from server');
    }

    if (!response.data.employee) {
      console.error('No employee data in response:', response.data);
      throw new Error('No employee data returned from server');
    }
    
    console.log('Successfully updated employee:', response.data.employee);
    return response.data.employee;
  } catch (error) {
    console.error('Error updating employee:', {
      error,
      response: error.response?.data,
      status: error.response?.status,
      message: error.message,
      stack: error.stack
    });

    // Enhance error message based on response
    let errorMessage = error.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 404) {
      errorMessage = 'Employee not found';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid employee data';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized access';
    }

    throw new Error(errorMessage);
  }
};

export const deleteEmployee = async (id) => {
  const response = await hrmService.delete(`/employees/${id}`);
  return response.data;
};
export const deleteAttendance = async (id) => {
  const response = await hrmService.delete(`/attendance/${id}`);
  return response.data;
};

// Department Services
export const getDepartments = async () => {
  const response = await hrmService.get('/departments');
  return response.data?.departments || [];
};

export const getDepartment = async (id) => {
  const response = await hrmService.get(`/departments/${id}`);
  return response.data?.department;
};

export const createDepartment = async (data) => {
  const response = await hrmService.post('/departments', data);
  return response.data?.department;
};

export const updateDepartment = async (id, data) => {
  const response = await hrmService.put(`/departments/${id}`, data);
  return response.data?.department;
};

export const deleteDepartment = async (id) => {
  const response = await hrmService.delete(`/departments/${id}`);
  return response.data;
};

// Position Services
export const getPositions = async () => {
  const response = await hrmService.get('/positions');
  return response.data?.positions || [];
};

export const getPosition = async (id) => {
  const response = await hrmService.get(`/positions/${id}`);
  return response.data?.position;
};

export const createPosition = async (data) => {
  const response = await hrmService.post('/positions', data);
  return response.data?.position;
};

export const updatePosition = async (id, data) => {
  const response = await hrmService.put(`/positions/${id}`, data);
  return response.data?.position;
};

export const deletePosition = async (id) => {
  const response = await hrmService.delete(`/positions/${id}`);
  return response.data;
};

export const getNextPositionCode = async () => {
  try {
    console.log('Requesting next position code...');
    const response = await hrmService.get('/positions/code/next');
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching next position code:', error);
    console.error('Full error:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

// Attendance Services
export const getMyAttendance = async (params) => {
  try {
    console.log('Fetching my attendance with params:', params);
    const response = await hrmService.get('/attendance/my-attendance', params);
    console.log('Raw my attendance response:', response);
    return response;
  } catch (error) {
    console.error('Error in getMyAttendance:', error);
    throw error;
  }
};

export const getAttendance = async (params) => {
  try {
    console.log('Fetching attendance with params:', params); // Debug log
    const response = await hrmService.get('/attendance', params);
    console.log('Raw attendance response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Error in getAttendance:', error); // Debug log
    throw error;
  }
};

export const getAttendanceStats = async (params) => {
  try {
    console.log('Fetching attendance stats with params:', params);
    const response = await hrmService.get('/attendance/stats', params);
    console.log('Raw stats response:', response);
    return { stats: response.data.stats };
  } catch (error) {
    console.error('Error in getAttendanceStats:', error);
    throw error;
  }
};

export const updateAttendance = async (id, data) => {
  try {
    const response = await hrmService.put(`/attendance/${id}`, data);
    if (!response?.data?.attendance) {
      throw new Error('Invalid response format from server');
    }
    return response;
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    throw error;
  }
};

export const checkIn = async (data) => {
  const response = await hrmService.post('/attendance/check-in', data);
  return response.data;
};

export const checkOut = async (id) => {
  const response = await hrmService.post(`/attendance/${id}/check-out`);
  return response.data;
};

export const createBulkAttendance = async (data) => {
  const response = await hrmService.post('/attendance/bulk', data);
  return response.data;
};

// Leave Services
export const getLeaves = async (params) => {
  const response = await hrmService.get('/leaves', params);
  return response.data?.leaves || [];
};

export const getLeave = async (id) => {
  const response = await hrmService.get(`/leaves/${id}`);
  return response.data;
};

export const createLeave = async (data) => {
  const response = await hrmService.post('/leaves', data);
  return response.data;
};

export const updateLeave = async (id, data) => {
  const response = await hrmService.patch(`/leaves/${id}`, data);
  return response.data;
};

export const deleteLeave = async (id) => {
  const response = await hrmService.delete(`/leaves/${id}`);
  return response.data;
};

export const approveLeave = async (id) => {
  const response = await hrmService.post(`/leaves/${id}/approve`);
  return response.data;
};

export const rejectLeave = async (id) => {
  const response = await hrmService.post(`/leaves/${id}/reject`);
  return response.data;
};

export const reviewLeave = async (id, data) => {
  const response = await hrmService.patch(`/leaves/${id}/review`, data);
  return response.data;
};

// Payroll Services
export const getPayroll = async (params) => {
  const response = await hrmService.get('/payroll', params);
  return response.data;
};

export const getPayrollById = async (id) => {
  const response = await hrmService.get(`/payroll/${id}`);
  return response.data;
};

export const createPayroll = async (data) => {
  const response = await hrmService.post('/payroll', data);
  return response.data;
};

export const updatePayroll = async (id, data) => {
  const response = await hrmService.put(`/payroll/${id}`, data);
  return response.data;
};

export const deletePayroll = async (id) => {
  const response = await hrmService.delete(`/payroll/${id}`);
  return response.data;
};

export const generatePayroll = async (params) => {
  const response = await hrmService.post('/payroll/generate', params);
  return response.data;
};

export const getEmployeeSalary = async (employeeId) => {
  const response = await hrmService.get(`/payroll/employee/${employeeId}/salary`);
  return response.data;
};

export const downloadPayroll = async (id) => {
  const response = await hrmService.get(`/payroll/${id}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

export const getNextDepartmentCode = async () => {
  try {
    console.log('Requesting next department code...');
    const response = await hrmService.get('/departments/code/next');
    console.log('Response:', response);
    
    // Return the entire response to let the component handle the structure
    return response;
  } catch (error) {
    console.error('Error fetching next department code:', error);
    console.error('Full error:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const getNextEmployeeId = async () => {
  try {
    console.log('Requesting next employee ID...');
    const response = await hrmService.get('/employees/next-id');
    console.log('Next employee ID response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching next employee ID:', error);
    throw error;
  }
}; 