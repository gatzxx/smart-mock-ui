import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { ThemedToaster } from "./components/ThemedToaster";
import { AppProviders } from "./providers/AppProviders";
import { ThemeProvider } from "./providers/ThemeProvider";
import { QUERY_STALE_TIME_MS } from "./constants/query";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: QUERY_STALE_TIME_MS,
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProviders>
          <BrowserRouter>
            <AppErrorBoundary>
              <App />
            </AppErrorBoundary>
          </BrowserRouter>
        </AppProviders>
        <ThemedToaster />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
