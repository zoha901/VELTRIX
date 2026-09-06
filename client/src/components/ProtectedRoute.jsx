import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Wait while AuthContext checks the saved JWT.
  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card-wrapper">
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // No valid login → send to login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is logged in but has the wrong role.
  if (allowedRole && role !== allowedRole) {
    if (role === 'PATIENT') {
      return <Navigate to="/patient/dashboard" replace />;
    }

    if (role === 'THERAPIST') {
      return <Navigate to="/therapist/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}