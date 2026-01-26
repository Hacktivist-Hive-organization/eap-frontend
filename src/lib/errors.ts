import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    // Handle structured error response
    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    // Handle validation errors
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (firstError?.[0]) {
        return firstError[0];
      }
    }

    // Handle HTTP status codes
    switch (error.response?.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid credentials.';
      case 403:
        return 'Access denied.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This email is already registered.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        break;
    }

    // Network error
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}
