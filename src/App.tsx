import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes } from 'react-router-dom';

import logo from '@/assets/logo_04_tr.png';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { RouteErrorFallback } from '@/components/common/RouteErrorFallback';
import { Spinner } from '@/components/ui/spinner';
import { queryClient } from '@/context/query-context';
import { useAuthInit } from '@/hooks/useAuthInit';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage/UnauthorizedPage';

function withRouteErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary
      FallbackComponent={RouteErrorFallback}
      onReset={() => queryClient.resetQueries()}
    >
      {component}
    </ErrorBoundary>
  );
}

function App() {
  const { isLoading, isError } = useAuthInit();

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <img src={logo} alt="Desk-X" className="h-16" />
        <Spinner className="size-6 text-primary" />
      </div>
    );

  if (isError)
    return (
      <ErrorPage
        title="Session could not be loaded"
        description="We had trouble loading your account. Please try again or sign in."
        resetErrorBoundary={() => queryClient.resetQueries({ queryKey: ['auth', 'me'] })}
      />
    );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/all" replace />} />
      <Route
        path="/dashboard/:view"
        element={
          <ProtectedRoute>
            {withRouteErrorBoundary(<DashboardPage />)}
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={withRouteErrorBoundary(<LoginPage />)} />
      <Route path="/register" element={withRouteErrorBoundary(<RegistrationPage />)} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
