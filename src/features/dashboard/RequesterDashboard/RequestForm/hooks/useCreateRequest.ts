import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequestService } from '@/services/api/requests/request';
import type { CreateRequestPayload } from '@/services/auth/types';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) =>
      createRequestService.createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
