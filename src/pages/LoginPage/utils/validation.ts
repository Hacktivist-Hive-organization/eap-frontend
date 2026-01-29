import * as z from 'zod';
import { emailString } from '@/lib/validation';

export const loginFormSchema = z.object({
  email: emailString().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
