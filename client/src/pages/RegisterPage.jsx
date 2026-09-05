import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { register, isAuthenticated, role, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'THERAPIST') {
        navigate(ROUTES.THERAPIST.DASHBOARD, { replace: true });
      } else if (role === 'PATIENT') {
        navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const validateForm = () => {
    if (!name.trim()) {
      return 'Please enter your full name.';
    }
    if (!email.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address format.';
    }
    if (!password) {
      return 'Please enter a password.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match. Please re-enter.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    clearError();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    // Explicitly enforce role as PATIENT — no silent role mutation
    const result = await register(name, email, password, 'PATIENT');
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Registration successful! Redirecting to sign in...');
      setTimeout(() => {
        navigate(ROUTES.LOGIN, {
          state: { registeredEmail: email.trim(), message: 'Account created successfully! Please sign in.' },
        });
      }, 1500);
    } else {
      setFormError(result.error || 'Registration failed. Please try again.');
    }
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
          <p className="app-desc">Patient Portal Self-Registration</p>
        </div>

        <Card title="Create Patient Account" subtitle="Register to begin your personalized rehabilitation program">
          {displayedError && (
            <div className="alert-banner alert-danger" role="alert">
              <span>⚠️ {displayedError}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert-banner alert-success" role="alert">
              <span>✅ {successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">
                Full Name:
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="e.g. Jane Patient"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formError) setFormError(null);
                }}
                className="form-input"
                autoComplete="name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email Address:
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="jane.patient@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                }}
                className="form-input"
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password (minimum 8 characters):
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  className="form-input password-input"
                  autoComplete="new-password"
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password-input">
                Confirm Password:
              </label>
              <input
                id="confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                className="form-input"
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <span className="field-hint">
                Account role: <strong className="text-primary">PATIENT</strong> (Standard rehabilitation account)
              </span>
            </div>

            <div className="form-actions" style={{ marginTop: '1.25rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-loading-text">
                    <span className="btn-spinner"></span> Creating Account...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p className="placeholder-text">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="table-link font-bold">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        <p className="foundation-note">
          🔒 Secure HIPAA-compliant session encryption. Patient rehabilitation workspace.
        </p>
      </div>
    </div>
  );
}
