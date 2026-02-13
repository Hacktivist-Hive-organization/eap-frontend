import { useQuery } from '@tanstack/react-query';
import { createRequestService } from '@/services/api/requests/request';

export function useRequestTypes() {
  return useQuery({
    queryKey: ['requestTypes'],
    queryFn: () => createRequestService.getRequestTypes(),
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
