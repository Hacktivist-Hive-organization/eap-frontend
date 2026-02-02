import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/RequesterDashboard/utils';
import { requestService } from '@/services/api/requests/request';
import type { Status } from '@/types/Status';

export function useRequestsByStatus(statuses: Status[]) {
  return useQuery({
    queryKey: ['requests', statuses],
    queryFn: () => requestService.getRequestsByStatus(statuses),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}
