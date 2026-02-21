import { isAxiosError } from 'axios';
import { AlertTriangleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Background } from '@/components/common/Background';
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

interface ErrorPageProps {
  error?: unknown;
  title?: string;
  description?: string;
  resetErrorBoundary?: () => void;
}

export function ErrorPage({ error, title, description, resetErrorBoundary }: ErrorPageProps) {
  const derived = getErrorMessage(error);
  const displayTitle = title ?? derived.title;
  const displayDescription = description ?? derived.description;

  return (
    <Background>
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangleIcon className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-semibold text-gray-900">{displayTitle}</h1>
        <p className="max-w-md text-gray-600">{displayDescription}</p>
        <div className="flex gap-2">
          {resetErrorBoundary && (
            <Button variant="outline" onClick={resetErrorBoundary}>
              Try Again
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/dashboard/all">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Background>
  );
}
