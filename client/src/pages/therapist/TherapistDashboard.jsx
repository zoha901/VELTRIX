import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function TherapistDashboard() {
  const kpiMetrics = [
    { label: 'Active Patients', value: '24', change: '+2 this month', status: 'normal' },
    { label: 'Caseload Adherence', value: '87.5%', change: '+3.2% vs last wk', status: 'success' },
    { label: 'High Pain / Risk Alerts', value: '3', change: 'Action required', status: 'danger' },
    { label: 'Sessions Completed Today', value: '12', change: 'On track', status: 'primary' },
  ];

  const criticalAlerts = [
    {
      id: 'alt-1',
      patient: 'John Doe',
      patientId: 'pt_404',
      issue: 'Reported Pain Level 8/10 on Straight Leg Raise',
      time: '25 mins ago',
      severity: 'high',
    },
    {
      id: 'alt-2',
      patient: 'Michael Chen',
      patientId: 'pt_406',
      issue: 'Missed 3 consecutive scheduled rehabilitation routines',
      time: '2 hours ago',
      severity: 'medium',
    },
    {
      id: 'alt-3',
      patient: 'Emily Davis',
      patientId: 'pt_408',
      issue: 'Extension ROM regression (-8°) detected during morning session',
      time: '4 hours ago',
      severity: 'high',
    },
  ];

  const recentSessions = [
    {
      id: 'sess-1',
      patient: 'Sarah Smith',
      patientId: 'pt_405',
      exercise: 'Quadriceps Strengthening & Knee Extension',
      score: '94%',
      pain: '2 / 10',
      time: '15 mins ago',
      status: 'Reviewed',
    },
    {
      id: 'sess-2',
      patient: 'John Doe',
      patientId: 'pt_404',
      exercise: 'Seated Knee Extension with Quad Hold',
      score: '92%',
      pain: '3 / 10',
      time: '1 hour ago',
      status: 'Reviewed',
    },
    {
      id: 'sess-3',
      patient: 'Robert Wilson',
      patientId: 'pt_407',
      exercise: 'Shoulder Abduction & Flexion',
      score: '86%',
      pain: '4 / 10',
      time: '3 hours ago',
      status: 'Needs Review',
    },
  ];

  return (
    <div className="page-container">
      {/* Clinician Welcome Banner */}
      <div className="dashboard-hero-card">
        <div className="hero-text-content">
          <span className="badge badge-primary">Clinician Portal</span>
          <h1 className="hero-title">Good morning, Dr. Sarah Jenkins</h1>
          <p className="hero-subtitle">
            You have <strong className="text-danger">3 patients requiring attention</strong> today and 12 sessions completed across your caseload.
          </p>
        </div>
        <div className="hero-action-buttons">
          <Link to={ROUTES.THERAPIST.PATIENTS} className="btn btn-primary">
            + View Patients
          </Link>
          <Link to={ROUTES.THERAPIST.EXERCISES} className="btn btn-secondary">
            + Exercise Library
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="metrics-strip-grid">
        {kpiMetrics.map((kpi, idx) => (
          <div key={idx} className="kpi-stat-card">
            <span className="kpi-label">{kpi.label}</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpi.value}</span>
              <span className={`kpi-change badge badge-${kpi.status}`}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two-Column Clinical Feed Section */}
      <div className="dashboard-dual-grid">
        {/* High-Priority Clinical Alerts Card */}
        <Card title="High-Priority Clinical Alerts" subtitle="Patients flagged for high pain, non-compliance, or ROM regression">
          <div className="alert-feed-list">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className={`alert-feed-item alert-border-${alert.severity}`}>
                <div className="alert-item-header">
                  <strong className="alert-patient-name">{alert.patient}</strong>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <p className="alert-issue-text">{alert.issue}</p>
                <div className="alert-actions-row">
                  <Link to={`/therapist/patients/${alert.patientId}`} className="btn btn-outline btn-sm">
                    Review Patient Hub &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Completed Patient Sessions */}
        <Card title="Recent Completed Sessions" subtitle="Latest AI motion analysis telemetry feeds">
          <div className="table-responsive">
            <table className="data-table data-table-compact">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Exercise</th>
                  <th>Accuracy</th>
                  <th>Pain</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/therapist/patients/${s.patientId}`} className="table-link">
                        <strong>{s.patient}</strong>
                      </Link>
                    </td>
                    <td>{s.exercise}</td>
                    <td><span className="badge badge-success">{s.score}</span></td>
                    <td><span className="badge badge-neutral">{s.pain}</span></td>
                    <td>
                      <Link to={ROUTES.THERAPIST.SESSIONS} className="btn btn-outline btn-sm">
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-actions" style={{ marginTop: '0.75rem' }}>
            <Link to={ROUTES.THERAPIST.SESSIONS} className="btn btn-outline btn-block">
              View All Completed Sessions &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
