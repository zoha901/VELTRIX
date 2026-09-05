import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const SESSION_HISTORY = [
  {
    id: 'sess-01',
    date: 'Today, 2:30 PM',
    exercise: 'Shoulder Pendulum & Circumduction',
    targetJoint: 'Shoulder',
    setsCompleted: '3 / 3',
    repsCompleted: 45,
    painBefore: 3,
    painAfter: 1,
    difficulty: 'EASY',
    duration: '08:45',
  },
  {
    id: 'sess-02',
    date: 'Yesterday, 10:15 AM',
    exercise: 'Seated Knee Extension with Quad Hold',
    targetJoint: 'Knee',
    setsCompleted: '3 / 3',
    repsCompleted: 30,
    painBefore: 2,
    painAfter: 2,
    difficulty: 'MODERATE',
    duration: '11:20',
  },
  {
    id: 'sess-03',
    date: 'Sep 2, 2026, 4:00 PM',
    exercise: 'Assisted Shoulder External Rotation with Towel',
    targetJoint: 'Shoulder',
    setsCompleted: '3 / 3',
    repsCompleted: 30,
    painBefore: 4,
    painAfter: 2,
    difficulty: 'MODERATE',
    duration: '10:05',
  },
  {
    id: 'sess-04',
    date: 'Sep 1, 2026, 11:30 AM',
    exercise: 'Prone Pelvic Tilt & Lumbar Spine Stabilization',
    targetJoint: 'Spine',
    setsCompleted: '3 / 3',
    repsCompleted: 36,
    painBefore: 3,
    painAfter: 1,
    difficulty: 'EASY',
    duration: '09:15',
  },
];

export default function PatientProgress() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Rehabilitation Progress &amp; History</h1>
          <p className="page-subtitle">
            Track your recovery milestones, compliance streak, and session logs over time.
          </p>
        </div>
        <div>
          <Link to={ROUTES.PATIENT.DASHBOARD} className="btn btn-outline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Sessions</span>
            <span className="badge badge-success">All Time</span>
          </div>
          <div className="metric-value">24</div>
          <span className="metric-subtext">Total rehabilitation workouts</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">30-Day Adherence</span>
            <span className="badge badge-info">Excellent</span>
          </div>
          <div className="metric-value">88%</div>
          <span className="metric-subtext">22 of 25 prescribed days completed</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pain Level Trend</span>
            <span className="badge badge-success">&darr; Improving</span>
          </div>
          <div className="metric-value">2.1 / 10</div>
          <span className="metric-subtext">Down from 5.8 baseline average</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Current Streak</span>
            <span className="badge badge-warning">🔥 Day 4</span>
          </div>
          <div className="metric-value">4 Days</div>
          <span className="metric-subtext">Longest streak: 12 days</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="card-grid">
        {/* Range of Motion Progress */}
        <Card
          title="Range of Motion (ROM) Mobility Trends"
          subtitle="Kinematic mobility progression measured across rehabilitation milestones"
        >
          <div className="rom-stat-box">
            <div>
              <span className="text-muted text-sm">Shoulder Flexion ROM</span>
              <div className="font-bold" style={{ fontSize: '1.25rem' }}>145° / 180°</div>
            </div>
            <span className="badge badge-success">+25° this month</span>
          </div>

          <div className="rom-visual-bar-wrapper">
            <div className="rom-visual-bar">
              <div className="rom-visual-fill" style={{ width: '80%' }}>
                80% Normal ROM
              </div>
            </div>
            <div className="rom-bar-labels">
              <span>Baseline: 90°</span>
              <span>Current: 145°</span>
              <span>Goal: 180°</span>
            </div>
          </div>

          <div className="rom-stat-box" style={{ marginTop: '1.25rem' }}>
            <div>
              <span className="text-muted text-sm">Knee Extension ROM</span>
              <div className="font-bold" style={{ fontSize: '1.25rem' }}>85° / 90°</div>
            </div>
            <span className="badge badge-success">+15° this month</span>
          </div>

          <div className="rom-visual-bar-wrapper">
            <div className="rom-visual-bar">
              <div className="rom-visual-fill" style={{ width: '94%' }}>
                94% Normal ROM
              </div>
            </div>
            <div className="rom-bar-labels">
              <span>Baseline: 55°</span>
              <span>Current: 85°</span>
              <span>Goal: 90°</span>
            </div>
          </div>
        </Card>

        {/* Adherence & Recovery Insights */}
        <Card
          title="Clinical Recovery Insights"
          subtitle="Summary observations for your therapist check-in"
        >
          <div className="ai-feedback-banner">
            <span className="ai-feedback-icon">📈</span>
            <div>
              <strong className="text-primary">Consistency Milestone Achieved:</strong>
              <p className="ai-feedback-text">
                Your post-exercise pain scores have steadily trended downward over the past 14 days, demonstrating positive adaptation to the current volume.
              </p>
            </div>
          </div>

          <div className="info-list" style={{ marginTop: '1rem' }}>
            <div className="info-item">
              <span className="info-label">Active Program:</span>
              <span className="info-value font-bold">Rotator Cuff & Knee ROM Rehab</span>
            </div>
            <div className="info-item">
              <span className="info-label">Prescription Start:</span>
              <span className="info-value">August 15, 2026</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Phase:</span>
              <span className="info-value font-medium text-primary">Phase 2: Active-Assisted ROM</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Historical Session Logs Table */}
      <Card
        title="Recent Rehabilitation Session Logs"
        subtitle="Detailed log of your completed exercise routines"
      >
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Exercise Routine</th>
                <th>Target Joint</th>
                <th>Sets / Reps</th>
                <th>Pain (Before &rarr; After)</th>
                <th>Difficulty</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {SESSION_HISTORY.map((sess) => (
                <tr key={sess.id}>
                  <td className="font-medium">{sess.date}</td>
                  <td className="font-bold">{sess.exercise}</td>
                  <td>
                    <span className="badge badge-secondary">{sess.targetJoint}</span>
                  </td>
                  <td>{sess.setsCompleted} sets ({sess.repsCompleted} reps)</td>
                  <td>
                    <span className="pain-badge pain-med">{sess.painBefore}/10</span>
                    {' '}&rarr;{' '}
                    <span className="pain-badge pain-low">{sess.painAfter}/10</span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        sess.difficulty === 'EASY'
                          ? 'badge-success'
                          : sess.difficulty === 'MODERATE'
                          ? 'badge-info'
                          : 'badge-warning'
                      }`}
                    >
                      {sess.difficulty}
                    </span>
                  </td>
                  <td className="text-muted">{sess.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
