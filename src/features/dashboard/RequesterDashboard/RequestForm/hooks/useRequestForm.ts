import { zodResolver } from '@hookform/resolvers/zod';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  type RequestFormData,
  requestFormSchema,
} from '@/features/dashboard/RequesterDashboard/RequestForm/utils';
import { getErrorMessage } from '@/lib/errors';
import { useCreateRequest } from './useCreateRequest';

interface UseRequestFormOptions {
  onSuccess?: () => void;
}

export function useRequestForm({ onSuccess }: UseRequestFormOptions = {}) {
  const mutation = useCreateRequest();

  const form = useForm<RequestFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod 4 types incompatible with zodResolver
    resolver: zodResolver(
      requestFormSchema as any,
    ) as Resolver<RequestFormData>,
    defaultValues: {
      title: '',
      description: '',
      justification: '',
      priority: 'medium',
    },
  });

  function onSubmit(data: RequestFormData) {
    mutation.mutate(
      {
        type_id: data.type_id,
        subtype_id: data.subtype_id,
        title: data.title,
        description: data.description,
        business_justification: data.justification,
        priority: data.priority,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error('Failed to create request', {
            id: 'create-request-error',
            description: getErrorMessage(error),
          });
        },
      },
    );
  }

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
