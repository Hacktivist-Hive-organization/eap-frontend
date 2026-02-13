import * as z from 'zod';
import { trimmedString } from '@/lib/validation';

export const requestFormSchema = z.object({
  type_id: z.coerce
    .number({ message: 'Type is required' })
    .int()
    .positive('Type is required'),
  subtype_id: z
    .number({ message: 'Subtype is required' })
    .int()
    .positive('Subtype is required'),
  title: trimmedString()
    .min(5, 'Title must be more than 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: trimmedString()
    .min(20, 'Description must be more than 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  justification: trimmedString()
    .min(20, 'Business justification must be more than 20 characters')
    .max(1000, 'Business justification must be less than 1000 characters'),
  priority: z.string({
    error: 'Priority is required',
  }),
});

export type RequestFormData = z.infer<typeof requestFormSchema>;
