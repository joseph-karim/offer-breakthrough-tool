import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WorkshopWizard } from './components/workshop/WorkshopWizard';
import { WorkshopLayout } from './components/layout/WorkshopLayout';
import { Step01_Intro } from './components/workshop/steps/Intro_LandingPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { AuthCallback } from './components/auth/AuthCallback';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  const location = useLocation();

  // Check if we're on an auth page
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="customercamp-theme">
        {isAuthPage ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        ) : (
          <WorkshopLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/intro"
                element={
                  <ProtectedRoute>
                    <Step01_Intro />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/step/:stepNumber"
                element={
                  <ProtectedRoute>
                    <WorkshopWizard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </WorkshopLayout>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
