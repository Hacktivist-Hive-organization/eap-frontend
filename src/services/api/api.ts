import axios from 'axios';
import { toast } from 'sonner';

const TOKEN_KEY = 'access_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login')
        window.location.href = '/login';
    }

    if (status === 403) {
      window.location.href = '/unauthorized';
    }

    if (error.code === 'ERR_NETWORK') {
      toast.error('Unable to connect to server', {
        id: 'network-error',
        description:
          'Please check your internet connection or try again later.',
      });
    }

    console.error('API error:', error);
    return Promise.reject(error);
  },
);

export { api };
