import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onReset={() => window.location.replace('/')}
    >
      {children}
    </ErrorBoundary>
  );
}
