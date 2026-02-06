import { api } from '@/services/api';
import type {
  CreateRequestPayload,
  RequestAllResponse,
  RequestTypeSubTypes,
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
};

export const createRequestService = {
  getRequestTypes: async (): Promise<RequestTypeSubTypes[]> => {
    const { data } = await api.get('api/v1/types');
    return data;
  },
  createRequest: async (payload: CreateRequestPayload): Promise<void> => {
    await api.post('/api/v1/requests', payload);
  },
};
