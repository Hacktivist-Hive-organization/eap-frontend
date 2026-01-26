import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/errors';
import { type RegistrationFormData, registrationFormSchema } from '../utils';

export function useRegistrationForm() {
  const registerMutation = useRegister();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: RegistrationFormData) {
    registerMutation.mutate(data, {
      onError: (error) => {
        toast.error('Registration failed', {
          description: getErrorMessage(error),
        });
      },
    });
  }

  return {
    form,
    onSubmit,
    isPending: registerMutation.isPending,
  };
}
