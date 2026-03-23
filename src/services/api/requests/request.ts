import { api } from '@/services/api';
import type {
  CreateRequestPayload,
  RequestAllResponse,
  RequestDetailResponse,
  RequestTypeSubTypes,
  TrackingEntry,
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

  getApproverRequests: async (
    statuses: Status[],
  ): Promise<RequestAllResponse[]> => {
    const response = await api.get<RequestAllResponse[]>(
      '/api/v1/requests/pending',
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

  getAdminRequests: async (
    statuses?: Status[],
    assigneeId?: number,
  ): Promise<RequestAllResponse[]> => {
    const response = await api.get<RequestAllResponse[]>('/api/v1/requests', {
      params: {
        ...(statuses?.length ? { statuses } : {}),
        ...(assigneeId ? { assignee_id: assigneeId } : {}),
      },
      paramsSerializer: { indexes: null },
    });
    return response.data;
  },

  getTrackingById: async (id: number): Promise<TrackingEntry[]> => {
    const response = await api.get<TrackingEntry[]>(`/api/v1/tracking/${id}`);
    return response.data;
  },

  submitDraft: async (id: number): Promise<RequestAllResponse> => {
    const response = await api.patch<RequestAllResponse>(
      `/api/v1/requests/${id}/submit`,
    );
    return response.data;
  },

  processRequest: async (
    id: number,
    status: Status,
    comment?: string,
  ): Promise<RequestAllResponse> => {
    const response = await api.patch<RequestAllResponse>(
      `/api/v1/requests/${id}/process`,
      null,
      { params: { status, ...(comment ? { comment } : {}) } },
    );
    return response.data;
  },

  reopenRequest: async (id: number): Promise<RequestAllResponse> => {
    const response = await api.patch<RequestAllResponse>(
      `/api/v1/requests/${id}/reopen`,
    );
    return response.data;
  },
};

export const createRequestService = {
  getRequestTypes: async (): Promise<RequestTypeSubTypes[]> => {
    const { data } = await api.get('/api/v1/types/');
    return data;
  },
  createRequest: async (
    payload: CreateRequestPayload,
  ): Promise<RequestAllResponse> => {
    const { data } = await api.post<RequestAllResponse>(
      '/api/v1/requests',
      payload,
    );
    return data;
  },

  submitRequest: async (
    payload: CreateRequestPayload,
  ): Promise<RequestAllResponse> => {
    const { data } = await api.post<RequestAllResponse>(
      '/api/v1/requests/submit',
      payload,
    );
    return data;
  },
};
