import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="login-container">
      <div className="login-card-wrapper" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: '#3b82f6' }}>404</h1>
        <h2>Page Not Found</h2>
        <p className="placeholder-text" style={{ margin: '1rem 0 2rem 0' }}>
          The requested page does not exist in the VELTRIX system.
        </p>
        <Link to="/login" className="btn btn-primary">
          Back to Portal Selection
        </Link>
      </div>
    </div>
  );
}
