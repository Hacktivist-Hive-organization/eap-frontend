import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from './pages/HomePage/LoginPage/LoginPage';
import { RegistrationPage } from './pages/HomePage/RegistrationPage/RegistrationPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
