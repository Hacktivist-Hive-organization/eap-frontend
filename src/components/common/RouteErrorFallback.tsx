import { isAxiosError } from 'axios';
import { AlertTriangleIcon } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

function getErrorMessage(error: unknown): { title: string; description: string } {
  if (isAxiosError(error)) {
    if (!error.response || error.code === 'ERR_NETWORK') {
      return {
        title: 'Connection problem',
        description:
          'We could not reach the server. Please check your internet connection and try again.',
      };
    }
    const status = error.response.status;
    if (status >= 500) {
      return {
        title: 'Server error',
        description: 'Something went wrong on our end. Please try again in a moment.',
      };
    }
    if (status === 404) {
      return {
        title: 'Resource not found',
        description: 'The page or resource you were looking for could not be found.',
      };
    }
  }
  return {
    title: 'Something went wrong',
    description:
      'An unexpected error occurred. Please try again or contact support if the problem persists.',
  };
}

export function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { title, description } = getErrorMessage(error);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertTriangleIcon className="h-12 w-12 text-red-500" />
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="max-w-md text-gray-600">{description}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={resetErrorBoundary}>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/all">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
