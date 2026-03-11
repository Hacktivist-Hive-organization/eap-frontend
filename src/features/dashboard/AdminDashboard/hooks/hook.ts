import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/utils';
import { requestService } from '@/services/api/requests/request';
import { userService } from '@/services/api/requests/user';
import type { Status } from '@/types/Status';

export function useAdminRequestsByStatus(statuses: Status[], assigneeId?: number) {
  return useQuery({
    queryKey: ['admin-requests', statuses, assigneeId],
    queryFn: () => requestService.getAdminRequests(statuses, assigneeId),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}

export function useAdminRequestById(id: number) {
  return useQuery({
    queryKey: ['admin-request', id],
    queryFn: () => requestService.getRequestById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userService.getAll(),
  });
}
