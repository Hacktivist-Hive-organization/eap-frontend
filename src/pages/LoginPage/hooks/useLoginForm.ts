import { useLogin } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import { type LoginFormData, loginFormSchema } from '@/pages/LoginPage/utils';

export function useLoginForm() {
  return useAuthForm({
    schema: loginFormSchema,
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    mutation: useLogin(),
    errorToast: {
      id: 'login-error',
      title: 'Login failed',
    },
  });
}
