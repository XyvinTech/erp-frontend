import ApiService from './api.service';

const api = new ApiService('/api');
const BASE_URL = '/projects';

export const projectService = {
  createProject: async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      const response = await api.post(BASE_URL, projectData);
      console.log('Create project response:', response);
      const data = response.data || response;
      console.log('Create project data:', data);
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || { message: error.message };
    }
  },

  getProjects: async () => {
    try {
      console.log('Fetching projects with all details...');
      const response = await api.get(`${BASE_URL}?populate=client,team,tasks,tasks.assignee,tasks.comments,tasks.attachments&sort=-createdAt`);
      console.log('Get projects raw response:', response);
      const data = response.data || response;
      console.log('Get projects data:', data);
      return Array.isArray(data) ? data : data.projects || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || { message: error.message };
    }
  },

  getProject: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}?populate=client,team,tasks`);
      console.log(`Get project ${id} response:`, response);
      const data = response.data || response;
      console.log(`Get project ${id} data:`, data);
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  updateProject: async (id, projectData) => {
    try {
      console.log(`Updating project ${id} with data:`, projectData);
      const response = await api.put(`${BASE_URL}/${id}`, projectData);
      console.log('Update project response:', response);
      const data = response.data || response;
      console.log('Update project data:', data);
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      console.log(`Delete project ${id} response:`, response);
      const data = response.data || response;
      console.log(`Delete project ${id} data:`, data);
      return data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  assignEmployees: async (projectId, employeeIds) => {
    try {
      console.log(`Assigning employees to project ${projectId}:`, employeeIds);
      const response = await api.post(`${BASE_URL}/${projectId}/assign-team`, {
        employees: employeeIds
      });
      console.log('Assign employees response:', response);
      const data = response.data || response;
      console.log('Assign employees data:', data);
      return data;
    } catch (error) {
      console.error('Error assigning employees:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  getProjectWithDetails: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}/details`);
      console.log(`Get project details ${id} response:`, response);
      const data = response.data || response;
      console.log(`Get project details ${id} data:`, data);
      return data;
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error.response?.data || { message: error.message };
    }
  }
}; 