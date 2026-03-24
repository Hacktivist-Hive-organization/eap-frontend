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
import { useSubmitRequest } from './useSubmitRequest';

interface UseRequestFormOptions {
  onSuccess?: () => void;
}

export function useRequestForm({ onSuccess }: UseRequestFormOptions = {}) {
  const draftMutation = useCreateRequest();
  const submitMutation = useSubmitRequest();

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

  function buildPayload(data: RequestFormData) {
    return {
      type_id: data.type_id,
      subtype_id: data.subtype_id,
      title: data.title,
      description: data.description,
      business_justification: data.justification,
      priority: data.priority,
    };
  }

  function onSaveAsDraft(data: RequestFormData) {
    draftMutation.mutate(buildPayload(data), {
      onSuccess: () => {
        form.reset();
        toast.success('Request saved as draft');
        onSuccess?.();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          toast.error('Failed to save draft', {
            id: 'create-request-error',
            description: getErrorMessage(error),
          });
        }
      },
    });
  }

  function onSubmitRequest(data: RequestFormData) {
    submitMutation.mutate(buildPayload(data), {
      onSuccess: () => {
        form.reset();
        toast.success('Request submitted successfully');
        onSuccess?.();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          toast.error('Failed to submit request', {
            id: 'submit-request-error',
            description: getErrorMessage(error),
          });
        }
      },
    });
  }

  return {
    form,
    onSaveAsDraft,
    onSubmitRequest,
    isSavingDraft: draftMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
}
