import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-spinner"></div>
        <p className="auth-loading-text">Verifying clinical session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Cross-role protection
  if (requiredRole) {
    const currentRole = role ? String(role).toUpperCase() : '';
    const targetRole = String(requiredRole).toUpperCase();

    if (currentRole !== targetRole) {
      if (currentRole === 'PATIENT') {
        return <Navigate to={ROUTES.PATIENT.DASHBOARD} replace />;
      }
      if (currentRole === 'THERAPIST') {
        return <Navigate to={ROUTES.THERAPIST.DASHBOARD} replace />;
      }
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return children ? children : <Outlet />;
}
