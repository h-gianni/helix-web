import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized globally
      // You can import your auth store here if needed
      // useAuthStore.getState().setAuthError('Session expired')
    }
    return Promise.reject(error);
  }
);
