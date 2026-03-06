import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';

export function useApproverRequestById(id: number) {
  return useQuery({
    queryKey: ['approver-request', id],
    queryFn: () => requestService.getApproverRequestById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
