import { Navigate, Route, Routes } from 'react-router-dom';

import logo from '@/assets/logo_04_tr.png';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Spinner } from '@/components/ui/spinner';
import { useAuthInit } from '@/hooks/useAuthInit';
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage/UnauthorizedPage';

function App() {
  const { isLoading } = useAuthInit();

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <img src={logo} alt="Desk-X" className="h-16" />
        <Spinner className="size-6 text-primary" />
      </div>
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
    </Routes>
  );
}

export default App;
