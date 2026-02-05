import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/RequesterDashboard/utils';
import { requestService } from '@/services/api/requests/request';
import type { RequestDetailResponse } from '@/services/auth/types';
import type { Status } from '@/types/Status';

export function useRequestsByStatus(statuses: Status[]) {
  return useQuery({
    queryKey: ['requests', statuses],
    queryFn: () => requestService.getRequestsByStatus(statuses),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}

export function useRequestById(id: number) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(id),
    select: (data): RequestDetailResponse => data,
    enabled: id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh, no refetch on reopen
    refetchOnWindowFocus: false,
  });
}
