import { api } from '@/services/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

const TOKEN_KEY = 'access_token';

export const authService = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('api/v1/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('api/v1/auth/register', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
