import { api } from '@/services/api';
import type {
  RequestAllResponse,
  RequestDetailResponse,
} from '@/services/auth/types';
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

  getRequestById: async (id: number): Promise<RequestDetailResponse> => {
    const response = await api.get<RequestDetailResponse>(
      `/api/v1/requests/${id}`,
    );
    return response.data;
  },
};
