import type { Request } from '@/components/common/RequestsTable';
import type { RequestAllResponse } from '@/services/auth/types';
import { formatUserName } from './formatters';

function resolveAssignee(response: RequestAllResponse): string | undefined {
  if (!response.assignee) return undefined;
  return formatUserName(response.assignee);
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
    assignee: resolveAssignee(response),
    assigneeId: response.assignee?.id,
    assigneeAvatarUrl: response.assignee?.avatar_url,
  };
}

export function mapRequestResponsesToRequests(
  responses: RequestAllResponse[],
): Request[] {
  return responses.map(mapRequestResponseToRequest);
}
