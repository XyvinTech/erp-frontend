import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import * as authService from '../services/auth.service';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      // Auth Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          console.log(response, "response");
          set({
            user: response.data.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          set({
            user: response.data.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(userData);
          set({
            user: response.data.user,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Profile update failed',
            isLoading: false
          });
          throw error;
        }
      },

      updatePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updatePassword(passwordData);
          set({
            token: response.token,
            isLoading: false
          });
          return response;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Password update failed',
            isLoading: false
          });
          throw error;
        }
      },

      // Selectors
      getUser: () => get().user,
      getToken: () => get().token,
      isUserAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: 'auth-storage',
      storage: localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore; 