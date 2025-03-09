import ApiService from '../api.service';
import axios from 'axios';

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

// Event Services
export const getEvents = async () => {
  try {
    console.log('Calling getEvents API...');
    const response = await hrmService.get('/events');
    console.log('Raw API response:', response);
    
    if (!response || !response.success) {
      console.error('Invalid API response:', response);
      throw new Error('Invalid API response structure');
    }

    if (!Array.isArray(response.events)) {
      console.error('Events data is not an array:', response);
      throw new Error('Invalid events data format');
    }

    // Transform MongoDB document structure with proper handling of $oid and $date fields
    const events = response.events.map(event => ({
      _id: event._id?.$oid || event._id,
      title: event.title,
      description: event.description,
      startDate: event.startDate?.$date || event.startDate,
      endDate: event.endDate?.$date || event.endDate,
      status: event.status,
      createdBy: event.createdBy?.$oid || event.createdBy?._id || event.createdBy,
      createdAt: event.createdAt?.$date || event.createdAt,
      updatedAt: event.updatedAt?.$date || event.updatedAt
    }));

    console.log('Transformed events:', events);
    return events;
  } catch (error) {
    console.error('Error in getEvents service:', error);
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access to events');
    } else if (error.response?.status === 404) {
      throw new Error('Events endpoint not found');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const getEvent = async (id) => {
  try {
    const response = await hrmService.get(`/events/${id}`);
    return response.data?.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (data) => {
  try {
    const response = await hrmService.post('/events', data);
    return response.data?.event;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, data) => {
  try {
    console.log('Updating event with data:', { id, data });

    // Format dates to ISO string if they exist
    const formattedData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined
    };

    // Remove any undefined values
    const cleanData = Object.entries(formattedData).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    console.log('Formatted data for update:', cleanData);

    const response = await hrmService.put(`/events/${id}`, cleanData);
    console.log('Update response:', response);

    if (!response || !response.success) {
      console.error('Invalid response format:', response);
      throw new Error(response?.message || 'Failed to update event');
    }

    const updatedEvent = response.event || response.data?.event;
    if (!updatedEvent) {
      throw new Error('No event data in response');
    }

    // Transform the response data
    const transformedEvent = {
      _id: updatedEvent._id?.$oid || updatedEvent._id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      startDate: updatedEvent.startDate?.$date || updatedEvent.startDate,
      endDate: updatedEvent.endDate?.$date || updatedEvent.endDate,
      status: updatedEvent.status,
      createdBy: updatedEvent.createdBy?.$oid || updatedEvent.createdBy?._id || updatedEvent.createdBy,
      createdAt: updatedEvent.createdAt?.$date || updatedEvent.createdAt,
      updatedAt: updatedEvent.updatedAt?.$date || updatedEvent.updatedAt
    };

    console.log('Transformed updated event:', transformedEvent);
    return transformedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await hrmService.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}; 