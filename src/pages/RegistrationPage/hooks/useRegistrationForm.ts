import { useRegister } from '@/hooks/useAuth';
import { useAuthForm } from '@/hooks/useAuthForm';
import {
  type RegistrationFormData,
  registrationFormSchema,
} from '@/pages/RegistrationPage/utils';

export function useRegistrationForm() {
  return useAuthForm({
    schema: registrationFormSchema,
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    } as RegistrationFormData,
    mutation: useRegister(),
    errorToast: {
      id: 'registration-error',
      title: 'Registration failed',
    },
  });
}
