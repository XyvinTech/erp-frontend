import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Default options for the QueryClient
 */
const defaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
};

/**
 * QueryProvider component that wraps the application with TanStack Query
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactNode} - Rendered component
 */
const QueryProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
