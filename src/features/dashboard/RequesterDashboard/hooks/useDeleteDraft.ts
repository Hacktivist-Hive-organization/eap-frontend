import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/api/requests/request';

export function useDeleteDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => requestService.deleteDraft(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['request', id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
