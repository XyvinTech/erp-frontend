import { create } from 'zustand';
import api from '../services/api';

export const useEmployeeStore = create((set) => ({
  employees: [],
  isLoading: false,
  error: null,

  // Fetch all employees
  fetchEmployees: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/hrm/employees');
      console.log('Fetched employees:', response.data);
      
      // Handle nested data structure
      const employees = response.data?.data?.employees || [];
      console.log('Processed employees:', employees);
      
      set({ 
        employees: employees,
        isLoading: false, 
        error: null 
      });
      return employees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch employees',
        isLoading: false,
        employees: []
      });
      throw error;
    }
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/hrm/employees', employeeData);
      const newEmployee = response.data?.data || response.data;
      set((state) => ({
        employees: [...state.employees, newEmployee],
        isLoading: false,
        error: null
      }));
      return newEmployee;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add employee',
        isLoading: false
      });
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (employeeId, employeeData) => {
    try {
      set({ isLoading: true });
      const response = await api.patch(`/hrm/employees/${employeeId}`, employeeData);
      const updatedEmployee = response.data?.data || response.data;
      set((state) => ({
        employees: state.employees.map((emp) =>
          emp._id === employeeId ? updatedEmployee : emp
        ),
        isLoading: false,
        error: null
      }));
      return updatedEmployee;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update employee',
        isLoading: false
      });
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      set({ isLoading: true });
      await api.delete(`/hrm/employees/${employeeId}`);
      set((state) => ({
        employees: state.employees.filter((emp) => emp._id !== employeeId),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete employee',
        isLoading: false
      });
      throw error;
    }
  },

  // Reset store
  reset: () => {
    set({
      employees: [],
      isLoading: false,
      error: null
    });
  }
})); 