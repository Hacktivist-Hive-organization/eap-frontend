import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSubmitDraft } from '@/features/dashboard/RequesterDashboard/hooks/useSubmitDraft';
import {
  type RequestFormData,
  requestFormSchema,
} from '@/features/dashboard/RequesterDashboard/RequestForm/utils';
import { getErrorMessage } from '@/lib/errors';
import { useUpdateDraft } from './useUpdateDraft';

interface UseEditRequestFormOptions {
  requestId: number;
  initialValues: RequestFormData;
  onSuccess?: () => void;
}

export function useEditRequestForm({
  requestId,
  initialValues,
  onSuccess,
}: UseEditRequestFormOptions) {
  const updateMutation = useUpdateDraft();
  const submitMutation = useSubmitDraft();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(
      requestFormSchema as any,
    ) as Resolver<RequestFormData>,
    defaultValues: initialValues,
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

  function onSaveChanges(data: RequestFormData) {
    updateMutation.mutate(
      { id: requestId, payload: buildPayload(data) },
      {
        onSuccess: () => {
          toast.success('Draft saved');
          onSuccess?.();
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            toast.error('Failed to save draft', {
              description: getErrorMessage(error),
            });
          }
        },
      },
    );
  }

  function onSubmitRequest(data: RequestFormData) {
    updateMutation.mutate(
      { id: requestId, payload: buildPayload(data) },
      {
        onSuccess: () => {
          submitMutation.mutate(requestId, {
            onSuccess: () => {
              toast.success('Request submitted successfully');
              onSuccess?.();
            },
            onError: (error) => {
              if (axios.isAxiosError(error) && error.response) {
                toast.error('Failed to submit request', {
                  description: getErrorMessage(error),
                });
              }
            },
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            toast.error('Failed to save draft', {
              description: getErrorMessage(error),
            });
          }
        },
      },
    );
  }

  return {
    form,
    onSaveChanges,
    onSubmitRequest,
    isSaving: updateMutation.isPending,
    isSubmitting: updateMutation.isPending || submitMutation.isPending,
  };
}
