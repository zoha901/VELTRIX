import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function PatientDashboard() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Dashboard</h1>
        <p className="page-subtitle">Welcome back to your rehabilitation home.</p>
      </div>

      <div className="card-grid">
        <Card title="Today's Prescribed Routine" subtitle="Daily rehabilitation plan">
          <p className="placeholder-text">
            Placeholder for daily scheduled rehabilitation exercises and prescribed sets.
          </p>
          <div className="card-actions">
            <Link to={ROUTES.PATIENT.EXERCISES} className="btn btn-primary">
              View Exercises
            </Link>
          </div>
        </Card>

        <Card title="Recovery Overview" subtitle="Recent milestones & consistency">
          <p className="placeholder-text">
            Placeholder for summary charts, recovery streaks, and movement targets.
          </p>
          <div className="card-actions">
            <Link to={ROUTES.PATIENT.PROGRESS} className="btn btn-outline">
              View Progress Details
            </Link>
          </div>
        </Card>

        <Card title="Assigned Therapist" subtitle="Clinical care contact">
          <p className="placeholder-text">
            Placeholder for care team information, therapist notes, and upcoming appointments.
          </p>
        </Card>
      </div>
    </div>
  );
}
