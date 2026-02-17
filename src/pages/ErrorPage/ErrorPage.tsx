import { AlertTriangleIcon } from 'lucide-react';

import { Background } from '@/components/common/Background';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error?: unknown;
  resetErrorBoundary?: () => void;
}

export function ErrorPage({ error, resetErrorBoundary }: ErrorPageProps) {
  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <Background>
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangleIcon className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Something Went Wrong
        </h1>
        <p className="max-w-md text-gray-600">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        {errorMessage && (
          <pre className="max-w-lg rounded-md bg-gray-100 p-3 text-left text-sm text-gray-700">
            {errorMessage}
          </pre>
        )}
        <div className="flex gap-2">
          {resetErrorBoundary && (
            <Button variant="outline" onClick={resetErrorBoundary}>
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.replace('/')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </Background>
  );
}
