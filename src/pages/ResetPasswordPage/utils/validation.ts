import * as z from 'zod';
import { trimmedString } from '@/lib/validation';

export const resetPasswordSchema = z
  .object({
    new_password: trimmedString().min(
      8,
      'Password must be at least 8 characters',
    ),
    confirm_password: trimmedString().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
