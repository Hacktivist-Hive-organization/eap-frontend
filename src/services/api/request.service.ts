import { api } from './api';

export interface RequestSubtype {
  id: number;
  name: string;
}

export interface RequestType {
  id: number;
  name: string;
  subtypes: RequestSubtype[];
}

export type CreateRequestPayload = {
  type_id: number;
  subtype_id: number;
  title: string;
  description: string;
  business_justification: string;
  priority: string;
  requester_id: number;
};

export const requestService = {
  getRequestTypes: async (): Promise<RequestType[]> => {
    const { data } = await api.get('api/v1/types');
    return data;
  },
  createRequest: async (
    payload: CreateRequestPayload
  ): Promise<void> => {
    await api.post('/api/v1/requests', payload);
  },
};