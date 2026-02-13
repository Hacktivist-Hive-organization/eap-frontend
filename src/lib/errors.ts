import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  detail?: string;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    // Handle structured error response
    if (data?.detail) {
      return data.detail;
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
