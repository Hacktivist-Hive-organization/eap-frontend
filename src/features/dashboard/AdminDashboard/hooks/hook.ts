import { useQuery } from '@tanstack/react-query';
import type { Request } from '@/components/common/RequestsTable';
import { mapRequestResponsesToRequests } from '@/features/dashboard/utils';
import { requestService } from '@/services/api/requests/request';
import { userService } from '@/services/api/requests/user';

export function useAdminRequests() {
  return useQuery({
    queryKey: ['admin-requests'],
    queryFn: () => requestService.getAdminRequests(),
    select: (data): Request[] => mapRequestResponsesToRequests(data),
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userService.getAll(),
  });
}
