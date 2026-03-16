import { useForgotPassword } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/pages/ForgotPasswordPage/utils';

export function useForgotPasswordForm() {
  const mutation = useForgotPassword();
  const authForm = useAuthForm({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: '',
    } as ForgotPasswordFormData,
    mutation,
    errorToast: {
      id: 'forgot-password-error',
      title: 'Request failed',
    },
  });

  return { ...authForm, isSuccess: mutation.isSuccess };
}
