import { api } from '@/services/api';
import type { RequestResponse } from '@/services/auth/types';
import type { Status } from '@/types/Status';

export const requestService = {
  getRequestsByStatus: async (status: Status): Promise<RequestResponse[]> => {
    const response = await api.get<RequestResponse[]>(
      '/api/v1/requests/my-requests',
      {
        params: { status },
      },
    );
    return response.data;
  },
};
