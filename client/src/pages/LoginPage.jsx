import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function LoginPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(location.state?.message || null);

  const { login, isAuthenticated, role, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'THERAPIST') {
        navigate(ROUTES.THERAPIST.DASHBOARD, { replace: true });
      } else if (role === 'PATIENT') {
        navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const userRole = result.user?.role ? String(result.user.role).toUpperCase() : '';
      if (userRole === 'THERAPIST') {
        navigate(ROUTES.THERAPIST.DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
      }
    } else {
      setFormError(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  // Demo credential autofillers for testing and demonstration
  const handleFillTherapistDemo = () => {
    setEmail('sarah.therapist@hospital.org');
    setPassword('TherapistPass123!');
    setFormError(null);
    clearError();
  };

  const handleFillPatientDemo = () => {
    setEmail('john.patient@example.com');
    setPassword('PatientPass123!');
    setFormError(null);
    clearError();
  };

  const displayedError = formError || authError;

  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <div className="login-header">
          <h1 className="brand-title">VELTRIX</h1>
          <p className="brand-subtitle">
            Vitality &bull; Elevation &bull; Tracking &bull; Intelligent Experience
          </p>
          <p className="app-desc">Clinical Rehabilitation & Care Management Platform</p>
        </div>

        <Card title="Portal Authentication" subtitle="Sign in to access your clinical or patient workspace">
          {infoMessage && (
            <div className="alert-banner alert-success" role="alert">
              <span>✅ {infoMessage}</span>
            </div>
          )}

          {displayedError && (
            <div className="alert-banner alert-danger" role="alert">
              <span>⚠️ {displayedError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email Address:
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="clinician@hospital.org or patient@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                  if (infoMessage) setInfoMessage(null);
                }}
                className="form-input"
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password:
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError(null);
                    if (infoMessage) setInfoMessage(null);
                  }}
                  className="form-input password-input"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: '1.25rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading-text">
                    <span className="btn-spinner"></span> Authenticating...
                  </span>
                ) : (
                  'Log In to VELTRIX'
                )}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <p className="placeholder-text">
              New patient?{' '}
              <Link to={ROUTES.REGISTER} className="table-link font-bold">
                Register for patient portal
              </Link>
            </p>
          </div>

          {/* Testing / Pair-programming Quick Fill Toolbar */}
          <div className="demo-credentials-box">
            <span className="demo-title">Quick Demo Logins (Testing):</span>
            <div className="demo-buttons-row">
              <button
                type="button"
                onClick={handleFillTherapistDemo}
                className="btn btn-outline btn-sm"
              >
                Fill Clinician Demo
              </button>
              <button
                type="button"
                onClick={handleFillPatientDemo}
                className="btn btn-outline btn-sm"
              >
                Fill Patient Demo
              </button>
            </div>
          </div>
        </Card>

        <p className="foundation-note">
          🔒 Secure HIPAA-compliant session encryption. Protected clinical workspace.
        </p>
      </div>
    </div>
  );
}
