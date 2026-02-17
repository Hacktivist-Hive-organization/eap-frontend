import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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
    // TODO: Remove casts when @hookform/resolvers supports Zod v4 natively
    resolver: zodResolver(
      requestFormSchema as any,
    ) as Resolver<RequestFormData>,
    defaultValues: {
      type_id: undefined,
      subtype_id: undefined,
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
          toast.success('Request created successfully');
          onSuccess?.();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            toast.error('Failed to create request', {
              id: 'create-request-error',
              description: getErrorMessage(error),
            });
          }
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
