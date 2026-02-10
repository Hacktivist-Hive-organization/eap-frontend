import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/utils';
import { requestService } from '@/services/api/requests/request';
import type { Status } from '@/types/Status';

export function useApproverRequestsByStatus(statuses: Status[]) {
  return useQuery({
    queryKey: ['approver-requests', statuses],
    queryFn: () => requestService.getRequestsByStatus(statuses),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}
