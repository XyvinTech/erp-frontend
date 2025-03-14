import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { useCurrentUser } from "./api/hooks/useAuth";
import useAuthStore from "./store/authStore";
import useUiStore from "./store/uiStore";

function App() {
  // TanStack Query hook for fetching current user
  const { data: currentUser, isLoading } = useCurrentUser();

  // Zustand stores
  const { setUser, setIsAuthenticated } = useAuthStore();
  const { toasts, removeToast } = useUiStore();

  // Update auth store when current user changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, [currentUser, setUser, setIsAuthenticated]);

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      {/* Custom toast notifications from UI store */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded shadow-md ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <p>{toast.message}</p>
              <button
                className="ml-4 text-white"
                onClick={() => removeToast(toast.id)}
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main app routes */}
      <AppRoutes />
    </>
  );
}

export default App;
