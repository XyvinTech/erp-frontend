import apiClient from '../apiClient';

/**
 * Project API endpoints
 */
const projectApi = {
    /**
     * Get all projects
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getProjects: (params = {}) => {
        return apiClient.get('/api/projects', { params });
    },

    /**
     * Get project by ID
     * @param {String} id - Project ID
     * @returns {Promise} - API response
     */
    getProjectById: (id) => {
        return apiClient.get(`/api/projects/${id}`);
    },

    /**
     * Create project
     * @param {Object} projectData - Project data
     * @returns {Promise} - API response
     */
    createProject: (projectData) => {
        return apiClient.post('/api/projects', projectData);
    },

    /**
     * Update project
     * @param {String} id - Project ID
     * @param {Object} projectData - Project data
     * @returns {Promise} - API response
     */
    updateProject: (id, projectData) => {
        return apiClient.patch(`/api/projects/${id}`, projectData);
    },

    /**
     * Delete project
     * @param {String} id - Project ID
     * @returns {Promise} - API response
     */
    deleteProject: (id) => {
        return apiClient.delete(`/api/projects/${id}`);
    },

    /**
     * Get project tasks
     * @param {String} id - Project ID
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getProjectTasks: (id, params = {}) => {
        return apiClient.get(`/api/projects/${id}/tasks`, { params });
    },

    /**
     * Assign project to employee
     * @param {String} id - Project ID
     * @param {Object} assignmentData - Assignment data
     * @returns {Promise} - API response
     */
    assignProject: (id, assignmentData) => {
        return apiClient.post(`/api/projects/${id}/assign`, assignmentData);
    },

    /**
     * Get project team members
     * @param {String} id - Project ID
     * @returns {Promise} - API response
     */
    getProjectTeam: (id) => {
        return apiClient.get(`/api/projects/${id}/team`);
    },

    /**
     * Get my projects
     * @param {Object} params - Query parameters
     * @returns {Promise} - API response
     */
    getMyProjects: (params = {}) => {
        return apiClient.get('/api/projects/me', { params });
    }
};

export default projectApi; 