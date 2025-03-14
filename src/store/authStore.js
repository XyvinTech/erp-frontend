import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication store using Zustand
 * This store manages authentication state like user, token, etc.
 */
const useAuthStore = create(
    persist(
        (set) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            // Login action
            login: (userData, token) => {
                set({
                    user: userData,
                    token,
                    isAuthenticated: true,
                    error: null
                });
            },

            // Logout action
            logout: () => {
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Reset state
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                });
            },

            // Register action
            register: (userData, token) => {
                set({
                    user: userData,
                    token,
                    isAuthenticated: true,
                    error: null
                });
            },

            // Update user action
            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData }
                }));
            }
        }),
        {
            name: 'auth-storage', // Name for localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore; 