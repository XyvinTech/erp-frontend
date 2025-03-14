import apiClient from '../apiClient';

/**
 * Employee API endpoints
 */
const employeeApi = {
    /**
     * Get all employees
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getEmployees: (params = {}) => {
        return apiClient.get('/api/hrm/employees', { params });
    },

    /**
     * Get employee by ID
     * @param {String} id - Employee ID
     * @returns {Promise} - API response
     */
    getEmployeeById: (id) => {
        return apiClient.get(`/api/hrm/employees/${id}`);
    },

    /**
     * Create employee
     * @param {Object} employeeData - Employee data
     * @returns {Promise} - API response
     */
    createEmployee: (employeeData) => {
        return apiClient.post('/api/hrm/employees', employeeData);
    },

    /**
     * Update employee
     * @param {String} id - Employee ID
     * @param {Object} employeeData - Employee data
     * @returns {Promise} - API response
     */
    updateEmployee: (id, employeeData) => {
        return apiClient.patch(`/api/hrm/employees/${id}`, employeeData);
    },

    /**
     * Delete employee
     * @param {String} id - Employee ID
     * @returns {Promise} - API response
     */
    deleteEmployee: (id) => {
        return apiClient.delete(`/api/hrm/employees/${id}`);
    },

    /**
     * Get employee attendance
     * @param {String} id - Employee ID
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getEmployeeAttendance: (id, params = {}) => {
        return apiClient.get(`/api/hrm/employees/${id}/attendance`, { params });
    },

    /**
     * Get employee leave
     * @param {String} id - Employee ID
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getEmployeeLeave: (id, params = {}) => {
        return apiClient.get(`/api/hrm/employees/${id}/leave`, { params });
    },

    /**
     * Get employee payslips
     * @param {String} id - Employee ID
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getEmployeePayslips: (id, params = {}) => {
        return apiClient.get(`/api/hrm/employees/${id}/payslips`, { params });
    }
};

export default employeeApi; 