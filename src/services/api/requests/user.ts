import { api } from '@/services/api';

interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  is_out_of_office?: boolean;
}

export const userService = {
  updateMe: async (payload: UpdateUserPayload): Promise<void> => {
    await api.patch('/api/v1/users/me', payload);
  },
};
