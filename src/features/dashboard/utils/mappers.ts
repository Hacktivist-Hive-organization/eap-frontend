import type { Request } from '@/components/common/RequestsTable';
import type { RequestAllResponse } from '@/services/auth/types';
import { formatUserName } from './formatters';

function resolveActor(response: RequestAllResponse): string {
  if (response.assignee) return formatUserName(response.assignee);
  return formatUserName(response.requester);
}

export function mapRequestResponseToRequest(
  response: RequestAllResponse,
): Request {
  return {
    id: response.id,
    title: response.title,
    type: response.type.name,
    subtype: response.subtype.name,
    status: response.current_status,
    lastUpdate: response.updated_at || response.created_at,
    priority: response.priority,
    actor: resolveActor(response),
  };
}

export function mapRequestResponsesToRequests(
  responses: RequestAllResponse[],
): Request[] {
  return responses.map(mapRequestResponseToRequest);
}
