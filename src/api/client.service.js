import api from './api';

const BASE_URL = '/clients';

export const clientService = {
  createClient: async (clientData) => {
    try {
      const response = await api.post(BASE_URL, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClients: async () => {
    try {
      const response = await api.get(BASE_URL);
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw error;
    }
  },

  getClient: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 