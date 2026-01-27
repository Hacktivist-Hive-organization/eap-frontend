import { Navigate, Route, Routes } from 'react-router-dom';
import { RequesterDashboard } from '@/features/dashboard/RequesterDashboard';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { RegistrationPage } from '@/pages/RegistrationPage/RegistrationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/draft" replace />} />
      <Route
        path="/dashboard/:view"
        element={
          //<ProtectedRoute>
          <RequesterDashboard />
          //</ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
