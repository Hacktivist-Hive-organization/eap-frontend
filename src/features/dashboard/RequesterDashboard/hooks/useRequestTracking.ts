import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';

export function useRequestTracking(id: number) {
  return useQuery({
    queryKey: ['tracking', id],
    queryFn: () => requestService.getTrackingById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
