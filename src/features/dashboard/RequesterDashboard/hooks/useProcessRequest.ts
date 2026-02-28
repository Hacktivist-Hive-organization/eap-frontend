import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';
import type { Status } from '@/types/Status';

interface ProcessRequestVariables {
  id: number;
  status: Status;
  comment?: string;
}

export function useProcessRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, comment }: ProcessRequestVariables) =>
      requestService.processRequest(id, status, comment),
    onSuccess: (updatedRequest) => {
      queryClient.invalidateQueries({
        queryKey: ['request', updatedRequest.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['approver-request', updatedRequest.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['tracking', updatedRequest.id],
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['approver-requests'] });
    },
  });
}
