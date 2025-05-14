import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Lazy load components to reduce initial bundle size
const WorkshopWizard = lazy(() => import('./components/workshop/WorkshopWizard').then(module => ({ default: module.WorkshopWizard })));
const WorkshopLayout = lazy(() => import('./components/layout/WorkshopLayout').then(module => ({ default: module.WorkshopLayout })));
const Step01_Intro = lazy(() => import('./components/workshop/steps/Intro_LandingPage').then(module => ({ default: module.Step01_Intro })));
const Login = lazy(() => import('./components/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./components/auth/Register').then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword').then(module => ({ default: module.ResetPassword })));
const AuthCallback = lazy(() => import('./components/auth/AuthCallback').then(module => ({ default: module.AuthCallback })));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-yellow mx-auto mb-4"></div>
      <p className="text-lg">Loading...</p>
    </div>
  </div>
);

function App() {
  const location = useLocation();

  // Check if we're on an auth page
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/callback'].includes(location.pathname);

  // Check if we're in Stackbit visual editor mode
  const isStackbitEditor = window.location.hostname === 'create.netlify.com' ||
                          window.location.search.includes('stackbit-editor') ||
                          window.location.hostname === 'localhost' && window.location.search.includes('stackbit');

  return (
    <AuthProvider>
      <div className="customercamp-theme">
        <Suspense fallback={<Loading />}>
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
                <Route path="/" element={<Navigate to="/intro" replace />} />

                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected routes - bypass protection in Stackbit editor */}
                <Route
                  path="/dashboard"
                  element={
                    isStackbitEditor ? (
                      <Dashboard />
                    ) : (
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    )
                  }
                />
                {/* Intro page accessible without authentication */}
                <Route
                  path="/intro"
                  element={<Step01_Intro />}
                />
                <Route
                  path="/step/:stepNumber"
                  element={
                    isStackbitEditor ? (
                      <WorkshopWizard />
                    ) : (
                      <ProtectedRoute>
                        <WorkshopWizard />
                      </ProtectedRoute>
                    )
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/intro" replace />} />
              </Routes>
            </WorkshopLayout>
          )}
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
