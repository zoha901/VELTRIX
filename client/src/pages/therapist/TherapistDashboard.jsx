import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export default function TherapistDashboard() {
  const { user } = useAuth();
  const clinicianName = user?.name || 'Dr. Sarah Jenkins';

  const summaryMetrics = {
    activePatients: 24,
    overallAdherence: 87.5,
    criticalAlerts: 3,
    sessionsCompletedToday: 12,
  };

  const highPriorityAlerts = [
    {
      id: 'alt-1',
      patientId: 'pt-101',
      patientName: 'John Doe',
      alertType: 'High Pain Rating',
      severity: 'high',
      description: 'Reported pain level 8/10 on Seated Knee Extension (Target Flexion 90°)',
      time: '25 min ago',
    },
    {
      id: 'alt-2',
      patientId: 'pt-103',
      patientName: 'Michael Chen',
      alertType: 'Adherence Warning',
      severity: 'medium',
      description: 'Missed 3 consecutive scheduled rehabilitation sessions for Lumbar Stabilization',
      time: '2 hours ago',
    },
    {
      id: 'alt-3',
      patientId: 'pt-102',
      patientName: 'Sarah Smith',
      alertType: 'ROM Regression',
      severity: 'high',
      description: 'Shoulder abduction ROM dropped by 15° compared to baseline post-op week 3',
      time: 'Yesterday',
    },
  ];

  const recentSessions = [
    {
      id: 'sess-1',
      patientId: 'pt-101',
      patientName: 'John Doe',
      exerciseName: 'Seated Knee Extension with Quad Hold',
      accuracyScore: 92,
      painScore: 3,
      completedAt: 'Today at 09:45 AM',
      status: 'Completed',
    },
    {
      id: 'sess-2',
      patientId: 'pt-102',
      patientName: 'Sarah Smith',
      exerciseName: 'Shoulder Abduction & Scapular Setting',
      accuracyScore: 88,
      painScore: 2,
      completedAt: 'Today at 08:30 AM',
      status: 'Completed',
    },
    {
      id: 'sess-3',
      patientId: 'pt-104',
      patientName: 'Emma Watson',
      exerciseName: 'Ankle Dorsiflexion & Plantarflexion',
      accuracyScore: 95,
      painScore: 1,
      completedAt: 'Yesterday at 04:15 PM',
      status: 'Completed',
    },
    {
      id: 'sess-4',
      patientId: 'pt-105',
      patientName: 'David Miller',
      exerciseName: 'Cervical Spine Gentle Lateral Rotation',
      accuracyScore: 84,
      painScore: 4,
      completedAt: 'Yesterday at 02:00 PM',
      status: 'Completed',
    },
  ];

  return (
    <div className="page-container">
      {/* Clinician Welcome Header */}
      <div className="dashboard-welcome-banner">
        <div>
          <h1 className="page-title">Welcome back, {clinicianName}</h1>
          <p className="page-subtitle">
            Rehabilitation Command Center &bull; {summaryMetrics.criticalAlerts} patients require clinical review today.
          </p>
        </div>
        <div className="dashboard-quick-actions">
          <Link to={ROUTES.THERAPIST.ASSIGN} className="btn btn-primary">
            + Assign Exercise
          </Link>
          <Link to={ROUTES.THERAPIST.EXERCISES} className="btn btn-outline">
            Exercise Catalog
          </Link>
          <Link to={ROUTES.THERAPIST.PATIENTS} className="btn btn-secondary">
            Patient Directory
          </Link>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Active Patients</span>
            <span className="metric-icon">👥</span>
          </div>
          <div className="metric-value">{summaryMetrics.activePatients}</div>
          <p className="metric-subtext">Assigned active care cohort</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Caseload Adherence</span>
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-value">{summaryMetrics.overallAdherence}%</div>
          <p className="metric-subtext">+4.2% vs previous 30 days</p>
        </div>

        <div className="metric-card metric-alert">
          <div className="metric-header">
            <span className="metric-label">Pain & Risk Alerts</span>
            <span className="metric-icon">⚠️</span>
          </div>
          <div className="metric-value" style={{ color: '#ef4444' }}>
            {summaryMetrics.criticalAlerts}
          </div>
          <p className="metric-subtext">Requiring immediate clinical triage</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Today</span>
            <span className="metric-icon">✅</span>
          </div>
          <div className="metric-value">{summaryMetrics.sessionsCompletedToday}</div>
          <p className="metric-subtext">Telemetry logs synchronized</p>
        </div>
      </div>

      {/* High-Priority Clinical Alerts Section */}
      <Card
        title="High-Priority Clinical Alerts"
        subtitle="Unresolved symptoms, high pain scores, or compliance anomalies"
      >
        <div className="alerts-list">
          {highPriorityAlerts.map((alert) => (
            <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
              <div className="alert-content">
                <div className="alert-title-row">
                  <span className="alert-patient-name">{alert.patientName}</span>
                  <span className={`badge badge-${alert.severity}`}>{alert.alertType}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <p className="alert-description">{alert.description}</p>
              </div>
              <div className="alert-actions">
                <Link
                  to={`/therapist/patients/${alert.patientId}/progress`}
                  className="btn btn-outline btn-sm"
                >
                  Review Patient &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Completed Patient Sessions Feed */}
      <Card
        title="Recent Completed Rehab Sessions"
        subtitle="Live telemetry feed and AI movement accuracy checkpoints"
      >
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Prescribed Exercise</th>
                <th>AI Form Accuracy</th>
                <th>Pain Level</th>
                <th>Completed Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((sess) => (
                <tr key={sess.id}>
                  <td>
                    <Link
                      to={`/therapist/patients/${sess.patientId}`}
                      className="table-link font-bold"
                    >
                      {sess.patientName}
                    </Link>
                  </td>
                  <td>{sess.exerciseName}</td>
                  <td>
                    <span className="accuracy-badge accuracy-high">
                      {sess.accuracyScore}%
                    </span>
                  </td>
                  <td>
                    <span className={`pain-badge pain-${sess.painScore <= 3 ? 'low' : sess.painScore <= 6 ? 'med' : 'high'}`}>
                      {sess.painScore} / 10
                    </span>
                  </td>
                  <td className="text-muted">{sess.completedAt}</td>
                  <td>
                    <Link
                      to={`/therapist/patients/${sess.patientId}/progress`}
                      className="btn btn-outline btn-sm"
                    >
                      View Telemetry
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
