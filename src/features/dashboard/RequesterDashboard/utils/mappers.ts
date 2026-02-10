import type { Request } from '@/components/common/RequestsTable';
import type { RequestAllResponse } from '@/services/auth/types';
import { formatUserName } from './formatters';

function resolveAssignee(response: RequestAllResponse): string {
  if (response.admin) return formatUserName(response.admin);
  if (response.approver) return formatUserName(response.approver);
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
    status: response.status,
    lastUpdate: response.updated_at || response.created_at,
    priority: response.priority,
    assignee: resolveAssignee(response),
  };
}

export function mapRequestResponsesToRequests(
  responses: RequestAllResponse[],
): Request[] {
  return responses.map(mapRequestResponseToRequest);
}
