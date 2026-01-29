import * as z from 'zod';

export const trimmedString = () => z.string().trim();

export const emailString = () =>
  z.string().trim().toLowerCase().email('Please enter a valid email address');
