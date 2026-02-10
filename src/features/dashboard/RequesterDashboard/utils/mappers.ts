import type { Request } from '@/features/dashboard/RequesterDashboard/RequestsTable';
import type { RequestAllResponse } from '@/services/auth/types';

export function mapRequestResponseToRequest(
  response: RequestAllResponse,
): Request {
  return {
    id: response.id,
    title: response.title,
    type: response.type.name,
    subtype: response.subtype.name,
    status: response.status,
    lastUpdate: response.updated_at || response.created_at,
    priority: response.priority,
  };
}

export function mapRequestResponsesToRequests(
  responses: RequestAllResponse[],
): Request[] {
  return responses.map(mapRequestResponseToRequest);
}
