import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';

export function useRequestById(id: number) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => requestService.getRequestById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
