import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Check if we're in Stackbit visual editor mode
  const isStackbitEditor =
    typeof window !== 'undefined' && (
      window.location.hostname === 'create.netlify.com' ||
      window.location.search.includes('stackbit-editor') ||
      (window.location.hostname === 'localhost' && window.location.search.includes('stackbit'))
    );

  // If we're in Stackbit editor, bypass authentication
  if (isStackbitEditor) {
    return <>{children}</>;
  }

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page with the return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
