import * as z from 'zod';
import { emailString, trimmedString } from '@/lib/validation';

export const registrationFormSchema = z.object({
  first_name: trimmedString().min(1, 'First name is required'),
  last_name: trimmedString().min(1, 'Last name is required'),
  email: emailString().min(1, 'Email is required'),
  password: trimmedString()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
