import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRequestService } from '@/services/api/requests/request';
import type {
  CreateRequestPayload,
  RequestAllResponse,
} from '@/services/auth/types';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) =>
      createRequestService.createRequest(payload),
    onSuccess: (newRequest) => {
      queryClient.setQueriesData<RequestAllResponse[]>(
        { queryKey: ['requests'] },
        (old) => (old ? [newRequest, ...old] : [newRequest]),
      );
    },
  });
}
