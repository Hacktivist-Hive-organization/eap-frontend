import { api } from '@/services/api';
import type { Role } from '@/types/Role';

interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  is_out_of_office?: boolean;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_out_of_office: boolean;
  created: string;
  updated: string;
  is_active: boolean;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
}

export const userService = {
  updateMe: async (payload: UpdateUserPayload): Promise<void> => {
    await api.patch('/api/v1/users/me', payload);
  },
  updateProfile: async (payload: UpdateProfilePayload): Promise<void> => {
    await api.put('/api/v1/users/me', payload);
  },
  getAll: async (): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>('/api/v1/users/');
    return response.data;
  },
};
