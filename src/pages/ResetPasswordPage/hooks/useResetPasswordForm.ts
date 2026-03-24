import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useResetPassword } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '@/pages/ResetPasswordPage/utils';

export function useResetPasswordForm(token: string) {
  const mutation = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    // biome-ignore lint/suspicious/noExplicitAny: Zod 4 types incompatible with zodResolver
    resolver: zodResolver(resetPasswordSchema as any),
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  function onSubmit(data: ResetPasswordFormData) {
    mutation.mutate(
      { token, new_password: data.new_password },
      {
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response) {
            toast.error('Password reset failed', {
              id: 'reset-password-error',
              description: getErrorMessage(error),
            });
          }
        },
      },
    );
  }

  return { form, onSubmit, isPending: mutation.isPending };
}
