import { zodResolver } from '@hookform/resolvers/zod';
import type { UseMutationResult } from '@tanstack/react-query';
import {
  type DefaultValues,
  type FieldValues,
  type Resolver,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { getErrorMessage } from '@/lib/errors';

interface UseAuthFormOptions<
  TFormData extends FieldValues,
  TResponse,
  TMutationData extends TFormData = TFormData,
> {
  schema: z.ZodType<TFormData>;
  defaultValues: DefaultValues<TFormData>;
  mutation: UseMutationResult<TResponse, Error, TMutationData>;
  errorToast: {
    id: string;
    title: string;
  };
}

export function useAuthForm<
  TFormData extends FieldValues,
  TResponse,
  TMutationData extends TFormData = TFormData,
>({
  schema,
  defaultValues,
  mutation,
  errorToast,
}: UseAuthFormOptions<TFormData, TResponse, TMutationData>) {
  const form = useForm<TFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod 4 types incompatible with zodResolver
    resolver: zodResolver(schema as any) as Resolver<TFormData>,
    defaultValues,
  });

  function onSubmit(data: TFormData) {
    mutation.mutate(data as TMutationData, {
      onError: (error) => {
        toast.error(errorToast.title, {
          id: errorToast.id,
          description: getErrorMessage(error),
        });
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
}
