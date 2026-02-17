import { Navigate, Route, Routes } from 'react-router-dom';

import logo from '@/assets/logo_04_tr.png';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Spinner } from '@/components/ui/spinner';
import { useAuthInit } from '@/hooks/useAuthInit';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { ErrorPage } from '@/pages/ErrorPage/ErrorPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage/UnauthorizedPage';

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
        error={new Error('Failed to load user session')}
        resetErrorBoundary={() => window.location.reload()}
      />
    );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/all" replace />} />
      <Route
        path="/dashboard/:view"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
