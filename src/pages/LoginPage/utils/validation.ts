import * as z from 'zod';
import { emailString, trimmedString } from '@/lib/validation';

export const loginFormSchema = z.object({
  email: emailString().min(1, 'Email is required'),
  password: trimmedString().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
