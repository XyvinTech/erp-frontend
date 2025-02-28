import ApiService from './api.service';

const api = new ApiService('/api');
const BASE_URL = '/hrm/employees';

export const employeeService = {
  getEmployees: async () => {
    try {
      console.log('Fetching employees from:', BASE_URL);
      const response = await api.get(BASE_URL);
      console.log('Raw API response:', response);
      
      // Handle different response formats
      let employees = [];
      
      if (response?.data?.data?.employees) {
        employees = response.data.data.employees;
      } else if (response?.data?.employees) {
        employees = response.data.employees;
      } else if (Array.isArray(response)) {
        employees = response;
      } else if (response?.data && Array.isArray(response.data)) {
        employees = response.data;
      }
      
      if (!Array.isArray(employees)) {
        console.warn('Employees is not an array:', employees);
        employees = [];
      }
      
      // Filter valid employees and format them
      const validEmployees = employees.filter(emp => {
        const isValid = emp && 
          typeof emp === 'object' && 
          (emp.id || emp._id);
          
        if (!isValid) {
          console.warn('Invalid employee data:', emp);
        }
        return isValid;
      }).map(emp => ({
        id: emp.id || emp._id,
        _id: emp.id || emp._id,
        name: emp.name || emp.fullName || `${emp.firstName} ${emp.lastName}`,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        email: emp.email || '',
        position: emp.position ? {
          id: emp.position._id || emp.position.id,
          title: emp.position.title || '',
          code: emp.position.code || '',
          description: emp.position.description || ''
        } : null,
        department: emp.department ? {
          id: emp.department._id || emp.department.id,
          name: emp.department.name || ''
        } : null,
        role: emp.role || '',
        status: emp.status || 'active'
      }));
      
      console.log('Processed employees:', validEmployees);
      return validEmployees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getEmployee: async (id) => {
    try {
      console.log(`Fetching employee ${id}`);
      const response = await api.get(`${BASE_URL}/${id}`);
      console.log(`Employee ${id} response:`, response);
      
      const rawEmployee = response?.data?.data || response?.data?.employee || response?.data || response;
      
      if (!rawEmployee || (!rawEmployee.name && !rawEmployee.firstName && !rawEmployee.fullName)) {
        throw new Error('Invalid employee data received');
      }
      
      return {
        id: rawEmployee._id || rawEmployee.id,
        _id: rawEmployee._id || rawEmployee.id,
        name: rawEmployee.name || rawEmployee.fullName || `${rawEmployee.firstName} ${rawEmployee.lastName}`,
        firstName: rawEmployee.firstName || '',
        lastName: rawEmployee.lastName || '',
        email: rawEmployee.email || '',
        position: rawEmployee.position ? {
          id: rawEmployee.position._id || rawEmployee.position.id,
          title: rawEmployee.position.title || '',
          code: rawEmployee.position.code || '',
          description: rawEmployee.position.description || ''
        } : null,
        department: rawEmployee.department ? {
          id: rawEmployee.department._id || rawEmployee.department.id,
          name: rawEmployee.department.name || ''
        } : null,
        role: rawEmployee.role || '',
        status: rawEmployee.status || 'active'
      };
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error.response?.data || { message: error.message };
    }
  }
}; 