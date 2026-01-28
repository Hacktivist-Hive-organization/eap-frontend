import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/RequesterDashboard/utils';
import { requestService } from '@/services/api/requests/request';
import type { Status } from '@/types/Status';

export function useRequestsByStatus(status: Status) {
  return useQuery({
    queryKey: ['requests', status],
    queryFn: () => requestService.getRequestsByStatus(status),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}
