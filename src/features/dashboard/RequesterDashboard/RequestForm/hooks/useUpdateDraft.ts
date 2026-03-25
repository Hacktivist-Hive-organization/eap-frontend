import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';
import type { CreateRequestPayload } from '@/services/auth/types';

interface UpdateDraftVariables {
  id: number;
  payload: CreateRequestPayload;
}

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateDraftVariables) =>
      requestService.updateDraft(id, payload),
    onSuccess: (updatedRequest) => {
      queryClient.invalidateQueries({
        queryKey: ['request', updatedRequest.id],
      });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
