import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import { type LoginFormData, loginFormSchema } from '@/pages/LoginPage/utils';
export function useLoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data, {
      onError: (error) => {
        toast.error('Login failed', {
          description: getErrorMessage(error),
        });
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending: loginMutation.isPending,
  };
}
