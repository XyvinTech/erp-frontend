import { create } from 'zustand';

/**
 * UI store using Zustand
 * This store manages UI state like sidebar, theme, etc.
 */
const useUiStore = create((set) => ({
    // Sidebar state
    isSidebarOpen: true,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    // Theme state
    theme: 'light',
    setTheme: (theme) => set({ theme }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

    // Modal state
    activeModal: null,
    modalData: null,
    openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),

    // Toast notifications
    toasts: [],
    addToast: (toast) => set((state) => ({
        toasts: [...state.toasts, { id: Date.now(), ...toast }]
    })),
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
    })),

    // Loading state
    loadingStates: {},
    setLoading: (key, isLoading) => set((state) => ({
        loadingStates: { ...state.loadingStates, [key]: isLoading }
    })),
    isLoading: (key) => set((state) => state.loadingStates[key] || false)
}));

export default useUiStore; 