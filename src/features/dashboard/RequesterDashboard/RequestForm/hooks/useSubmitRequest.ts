import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequestService } from '@/services/api/requests/request';
import type { CreateRequestPayload } from '@/services/auth/types';

export function useSubmitRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) =>
      createRequestService.submitRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
