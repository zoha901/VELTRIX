import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { ROUTES } from '../utils/constants';

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card-wrapper">
        <div className="login-header">
          <h1 className="brand-title">VELTRIX</h1>
          <p className="brand-subtitle">
            Vitality &bull; Elevation &bull; Tracking &bull; Intelligent Experience
          </p>
          <p className="app-desc">Rehabilitation Management Web Application</p>
        </div>

        <Card title="Portal Entry (Placeholder)" subtitle="Select a role to preview the frontend interface">
          <div className="portal-selection">
            <div className="portal-choice">
              <h4>Patient Interface</h4>
              <p>View rehabilitation routines, track progress, and practice exercises.</p>
              <Link to={ROUTES.PATIENT.DASHBOARD} className="btn btn-primary btn-block">
                Enter as Patient &rarr;
              </Link>
            </div>

            <div className="portal-divider"></div>

            <div className="portal-choice">
              <h4>Therapist Interface</h4>
              <p>Manage patient cohorts, customize exercise regimens, and review clinical sessions.</p>
              <Link to={ROUTES.THERAPIST.DASHBOARD} className="btn btn-secondary btn-block">
                Enter as Therapist &rarr;
              </Link>
            </div>
          </div>
        </Card>

        <p className="foundation-note">
          Frontend foundation mode. Authentication logic will be integrated in future phases.
        </p>
      </div>
    </div>
  );
}
