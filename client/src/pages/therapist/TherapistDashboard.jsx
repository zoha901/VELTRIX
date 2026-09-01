import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function TherapistDashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Therapist Dashboard</h1>
        <p className="page-subtitle">Clinical care management and patient cohort overview.</p>
      </div>

      <div className="card-grid">
        <Card title="Active Patients" subtitle="Assigned rehabilitation cohort">
          <p className="placeholder-text">
            Placeholder for total active patient count, recovery alerts, and status summaries.
          </p>
          <div className="card-actions">
            <Link to={ROUTES.THERAPIST.PATIENTS} className="btn btn-primary">
              View Patient List
            </Link>
          </div>
        </Card>

        <Card title="Clinical Sessions" subtitle="Upcoming and past appointments">
          <p className="placeholder-text">
            Placeholder for today's scheduled consultations, live sessions, and patient reviews.
          </p>
          <div className="card-actions">
            <Link to={ROUTES.THERAPIST.SESSIONS} className="btn btn-secondary">
              Manage Sessions
            </Link>
          </div>
        </Card>

        <Card title="Exercise Protocols" subtitle="Custom treatment plans">
          <p className="placeholder-text">
            Placeholder for exercise library, custom protocols, and movement templates.
          </p>
          <div className="card-actions">
            <Link to={ROUTES.THERAPIST.EXERCISES} className="btn btn-outline">
              Open Exercise Library
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
