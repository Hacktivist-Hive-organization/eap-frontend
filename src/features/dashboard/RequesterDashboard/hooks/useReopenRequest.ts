import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';

export function useReopenRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requestService.processRequest(id, 'draft'),
    onSuccess: (updatedRequest) => {
      queryClient.invalidateQueries({
        queryKey: ['request', updatedRequest.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['tracking', updatedRequest.id],
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
