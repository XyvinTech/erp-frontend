import ApiService from './api.service';

const api = new ApiService('/api');
const BASE_URL = '/clients';

export const clientService = {
  createClient: async (clientData) => {
    try {
      console.log('Creating client with data:', clientData);
      const response = await api.post(BASE_URL, clientData);
      console.log('Create client response:', response);
      // Handle both response formats
      const data = response.data || response;
      console.log('Create client data:', data);
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || { message: error.message };
    }
  },

  getClients: async () => {
    try {
      console.log('Fetching clients...');
      const response = await api.get(BASE_URL);
      console.log('Get clients raw response:', response);
      // Handle both response formats
      const data = response.data || response;
      console.log('Get clients data:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      console.error('Error response:', error.response);
      throw error.response?.data || { message: error.message };
    }
  },

  getClient: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      console.log(`Get client ${id} response:`, response);
      // Handle both response formats
      const data = response.data || response;
      console.log(`Get client ${id} data:`, data);
      return data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  updateClient: async (id, clientData) => {
    try {
      console.log(`Updating client ${id} with data:`, clientData);
      const response = await api.put(`${BASE_URL}/${id}`, clientData);
      console.log('Update client response:', response);
      // Handle both response formats
      const data = response.data || response;
      console.log('Update client data:', data);
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      console.log(`Delete client ${id} response:`, response);
      // Handle both response formats
      const data = response.data || response;
      console.log(`Delete client ${id} data:`, data);
      return data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error.response?.data || { message: error.message };
    }
  }
}; 