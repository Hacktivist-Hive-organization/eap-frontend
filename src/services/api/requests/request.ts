import { api } from '@/services/api';
import type { RequestAllResponse } from '@/services/auth/types';
import type { Status } from '@/types/Status';

export const requestService = {
  getRequestsByStatus: async (
    statuses: Status[],
  ): Promise<RequestAllResponse[]> => {
    const response = await api.get<RequestAllResponse[]>(
      '/api/v1/requests/my-requests',
      {
        params: { statuses },
        paramsSerializer: {
          indexes: null,
        },
      },
    );
    return response.data;
  },
};
