import type { Request } from '@/components/common/RequestsTable';
import type { RequestResponse } from '@/services/auth/types';

export function mapRequestResponseToRequest(
  response: RequestResponse,
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
  responses: RequestResponse[],
): Request[] {
  return responses.map(mapRequestResponseToRequest);
}
