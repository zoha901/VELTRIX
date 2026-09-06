import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      } else if (result.user.role === 'THERAPIST') {
        navigate('/therapist/dashboard');
      }
    }
  };

  const fillTherapistDemo = () => {
    setEmail('therapist.test@veltrix.com');
    setPassword('TestTherapist123');
  };

  const fillPatientDemo = () => {
    setEmail('patient.test@veltrix.com');
    setPassword('TestPatient123');
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1 className="brand-title">VELTRIX</h1>

        <p className="brand-subtitle">
          VITALITY • ELEVATION • TRACKING • INTELLIGENT EXPERIENCE
        </p>

        <p className="app-desc">
          Rehabilitation Management Web Application
        </p>
      </div>

      <div className="login-card">
        <h2>Portal Authentication</h2>

        <p className="login-subtitle">
          Sign in to access your clinical or patient workspace
        </p>

        {error && (
          <div className="login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email Address:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD - BELOW EMAIL */}
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In to VELTRIX'}
          </button>

        </form>

        <div className="demo-section">
          <h3>QUICK DEMO LOGINS (TESTING):</h3>

          <div className="demo-buttons">
            <button
              type="button"
              onClick={fillTherapistDemo}
              className="demo-button"
            >
              Fill Therapist Demo
            </button>

            <button
              type="button"
              onClick={fillPatientDemo}
              className="demo-button"
            >
              Fill Patient Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}