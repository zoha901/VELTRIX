import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const TODAY_EXERCISES = [
  {
    id: 'ex-101',
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body',
    targetJoint: 'Knee',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
    status: 'PENDING',
    difficulty: 'BEGINNER',
    estDuration: '10 mins',
  },
  {
    id: 'ex-102',
    name: 'Shoulder Pendulum & Circumduction',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    prescribedSets: 3,
    prescribedReps: 15,
    holdSeconds: 0,
    status: 'COMPLETED',
    difficulty: 'BEGINNER',
    estDuration: '8 mins',
  },
  {
    id: 'ex-103',
    name: 'Assisted Shoulder External Rotation with Towel',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
    status: 'PENDING',
    difficulty: 'INTERMEDIATE',
    estDuration: '12 mins',
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const patientName = user?.name || 'Rehabilitation Patient';

  return (
    <div className="page-container">
      {/* Patient Welcome Header */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1 className="page-title">Welcome back, {patientName}</h1>
          <p className="page-subtitle">
            Rehabilitation Plan &bull; Active Recovery &bull; Phase 2 Foundation
          </p>
        </div>
        <div className="dashboard-quick-actions">
          <Link to={ROUTES.PATIENT.EXERCISES} className="btn btn-primary">
            View Today&apos;s Exercises
          </Link>
          <Link to={ROUTES.PATIENT.PROGRESS} className="btn btn-outline">
            My Recovery Progress
          </Link>
        </div>
      </div>

      {/* Quick Summary Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Current Streak</span>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="metric-value">4 Days</div>
          <span className="metric-subtext">Keep up the daily consistency!</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Weekly Adherence</span>
            <span className="badge badge-info">On Track</span>
          </div>
          <div className="metric-value">85%</div>
          <span className="metric-subtext">5 of 6 scheduled routines completed</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Today&apos;s Routine</span>
            <span className="badge badge-warning">In Progress</span>
          </div>
          <div className="metric-value">1 / 3</div>
          <span className="metric-subtext">1 exercise completed today</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Latest Pain Level</span>
            <span className="pain-badge pain-low">Low (2/10)</span>
          </div>
          <div className="metric-value">2.0</div>
          <span className="metric-subtext">Reported during last session</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="card-grid">
        {/* Today's Prescribed Exercises */}
        <Card
          title="Today's Prescribed Routine"
          subtitle="Assigned exercises scheduled for your recovery session today"
        >
          <div className="alerts-list">
            {TODAY_EXERCISES.map((exercise) => (
              <div
                key={exercise.id}
                className={`alert-item ${
                  exercise.status === 'COMPLETED' ? 'alert-medium' : 'alert-high'
                }`}
              >
                <div style={{ flex: 1 }}>
                  <div className="alert-title-row">
                    <span className="font-bold">{exercise.name}</span>
                    <span
                      className={`badge ${
                        exercise.status === 'COMPLETED'
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}
                    >
                      {exercise.status}
                    </span>
                    <span className="badge badge-secondary">{exercise.targetJoint}</span>
                  </div>
                  <p className="alert-description">
                    Prescribed: {exercise.prescribedSets} sets &times; {exercise.prescribedReps} reps
                    {exercise.holdSeconds > 0 ? ` (${exercise.holdSeconds}s hold)` : ''} &bull; Est: {exercise.estDuration}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link
                    to={`/patient/exercises/${exercise.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/patient/exercises/${exercise.id}/guided`}
                    className={`btn btn-sm ${
                      exercise.status === 'COMPLETED' ? 'btn-outline' : 'btn-primary'
                    }`}
                  >
                    {exercise.status === 'COMPLETED' ? 'Redo' : 'Start'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="card-actions" style={{ marginTop: '0.5rem' }}>
            <Link to={ROUTES.PATIENT.EXERCISES} className="btn btn-outline btn-sm">
              View All Exercises &rarr;
            </Link>
          </div>
        </Card>

        {/* Clinical Guidance Note */}
        <Card
          title="Therapist Guidance & Notes"
          subtitle="Clinical instructions from your assigned care provider"
        >
          <div className="ai-feedback-banner">
            <span className="ai-feedback-icon">👨‍⚕️</span>
            <div>
              <strong className="text-primary">Clinical Note from Dr. Sarah (Physical Therapist):</strong>
              <p className="ai-feedback-text">
                &ldquo;Focus on smooth, controlled movements with proper breathing. If you experience sharp discomfort exceeding 4/10 on the pendulum circles, stop and rest immediately.&rdquo;
              </p>
            </div>
          </div>

          <div className="info-list" style={{ marginTop: '1rem' }}>
            <div className="info-item">
              <span className="info-label">Care Provider</span>
              <span className="info-value font-medium">Dr. Sarah Jenkins, DPT</span>
            </div>
            <div className="info-item">
              <span className="info-label">Active Protocol</span>
              <span className="info-value font-medium">Rotator Cuff & Knee ROM Rehab</span>
            </div>
            <div className="info-item">
              <span className="info-label">Next Check-in</span>
              <span className="info-value font-medium">Thursday, 10:30 AM (Virtual)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
