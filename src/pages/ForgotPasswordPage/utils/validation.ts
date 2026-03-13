import * as z from 'zod';
import { emailString } from '@/lib/validation';

export const forgotPasswordSchema = z.object({
  email: emailString().min(1, 'Email is required'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
