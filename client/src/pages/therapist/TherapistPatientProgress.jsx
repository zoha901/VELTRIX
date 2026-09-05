import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

export default function TherapistPatientProgress() {
  const { patientId = 'pt-101' } = useParams();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | sessions | pain | notes
  const [selectedSessionId, setSelectedSessionId] = useState('sess-101');

  // Patient context mock data
  const patient = {
    id: patientId,
    name: patientId === 'pt-102' ? 'Sarah Smith' : patientId === 'pt-103' ? 'Michael Chen' : 'John Doe',
    age: 45,
    primaryDiagnosis: 'Post-Op Rotator Cuff Repair (Right Shoulder)',
    targetJoint: 'Shoulder',
    currentPhase: 'Phase II: Active-Assisted Range of Motion',
    adherenceRate: 88,
    averageAccuracy: 91,
    baselineRom: 45,
    currentRom: 125,
    targetRom: 160,
  };

  const sessionsHistory = [
    {
      id: 'sess-101',
      date: 'Today, 09:45 AM',
      exerciseName: 'Shoulder Pendulum & Circumduction',
      durationSeconds: 480,
      completedSets: 3,
      targetSets: 3,
      completedReps: 15,
      accuracyScore: 94,
      maxRom: 52,
      painScore: 2,
      aiFeedback: 'Excellent fluid cadence. Scapular compensation was minimal on set 3.',
      repsTelemetry: [
        { rep: 1, rom: 48, duration: 4.2, flag: 'Normal motion' },
        { rep: 2, rom: 50, duration: 4.1, flag: 'Normal motion' },
        { rep: 3, rom: 52, duration: 4.4, flag: 'Normal motion' },
        { rep: 4, rom: 51, duration: 4.0, flag: 'Mild trunk lean' },
      ],
    },
    {
      id: 'sess-102',
      date: 'Yesterday, 04:30 PM',
      exerciseName: 'Assisted Shoulder External Rotation with Towel',
      durationSeconds: 600,
      completedSets: 3,
      targetSets: 3,
      completedReps: 10,
      accuracyScore: 89,
      maxRom: 28,
      painScore: 3,
      aiFeedback: 'Elbow tuck maintained well. Slight anterior shoulder hitch on reps 8–10.',
      repsTelemetry: [
        { rep: 1, rom: 25, duration: 6.0, flag: 'Good posture' },
        { rep: 2, rom: 27, duration: 5.8, flag: 'Good posture' },
        { rep: 3, rom: 28, duration: 6.2, flag: 'Slight elbow flare' },
      ],
    },
    {
      id: 'sess-103',
      date: '3 days ago, 10:15 AM',
      exerciseName: 'Scapular Retraction & Setting',
      durationSeconds: 420,
      completedSets: 3,
      targetSets: 3,
      completedReps: 12,
      accuracyScore: 92,
      maxRom: 0,
      painScore: 1,
      aiFeedback: 'Symmetrical rhomboid engagement with stable cervical spine posture.',
      repsTelemetry: [
        { rep: 1, rom: 0, duration: 5.0, flag: 'Optimal setting' },
        { rep: 2, rom: 0, duration: 5.0, flag: 'Optimal setting' },
      ],
    },
  ];

  const painLogs = [
    {
      id: 'pain-1',
      date: 'Today, 09:45 AM',
      score: 2,
      associatedExercise: 'Shoulder Pendulum',
      type: 'Mild dull ache at end-range circumduction',
    },
    {
      id: 'pain-2',
      date: 'Yesterday, 04:30 PM',
      score: 3,
      associatedExercise: 'Assisted Shoulder External Rotation',
      type: 'Tension in posterior deltoid during hold',
    },
    {
      id: 'pain-3',
      date: '5 days ago, 08:00 AM',
      score: 4,
      associatedExercise: 'Morning Stiffness Check-in',
      type: 'Post-sleep joint stiffness resolving after warm shower',
    },
  ];

  const selectedSession =
    sessionsHistory.find((s) => s.id === selectedSessionId) || sessionsHistory[0];

  return (
    <div className="page-container">
      {/* Breadcrumb Bar */}
      <div className="breadcrumb-bar">
        <Link to={ROUTES.THERAPIST.PATIENTS} className="breadcrumb-link">
          &larr; Patient Directory
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{patient.name} &bull; Clinical Progress</span>
      </div>

      {/* Patient Header Banner */}
      <div className="patient-header-banner">
        <div className="patient-avatar-box">
          <div className="patient-avatar-placeholder">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h1 className="patient-name-heading">{patient.name}</h1>
            <p className="patient-subtitle-meta">
              {patient.primaryDiagnosis} &bull; {patient.currentPhase}
            </p>
          </div>
        </div>

        <div className="patient-header-actions">
          <Link
            to={`/therapist/patients/${patient.id}/assign`}
            className="btn btn-primary"
          >
            + Prescribe Exercise
          </Link>
          <Link
            to={`/therapist/patients/${patient.id}/notes`}
            className="btn btn-outline"
          >
            Clinical Notes
          </Link>
          <Link
            to={`/therapist/patients/${patient.id}`}
            className="btn btn-outline"
          >
            Patient Profile
          </Link>
        </div>
      </div>

      {/* 4 Synchronized Clinical Navigation Tabs */}
      <div className="tabs-navigation-bar">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`tab-item-btn ${activeTab === 'analytics' ? 'tab-item-active' : ''}`}
        >
          📊 1. Overview & Recovery Analytics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`tab-item-btn ${activeTab === 'sessions' ? 'tab-item-active' : ''}`}
        >
          ⏱️ 2. Session Telemetry & AI Form Scores
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pain')}
          className={`tab-item-btn ${activeTab === 'pain' ? 'tab-item-active' : ''}`}
        >
          🩺 3. Pain History & Subjective Logs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`tab-item-btn ${activeTab === 'notes' ? 'tab-item-active' : ''}`}
        >
          📝 4. Therapist Clinical Notes
        </button>
      </div>

      {/* TAB 1: OVERVIEW & RECOVERY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="tab-content-container">
          <div className="card-grid">
            <Card title="Range of Motion (ROM) Trajectory" subtitle="Active-assisted flexion curve vs target">
              <div className="rom-stat-box">
                <div className="rom-stat-item">
                  <span className="text-muted text-sm">Baseline ROM:</span>
                  <span className="font-bold text-lg">{patient.baselineRom}°</span>
                </div>
                <div className="rom-stat-item">
                  <span className="text-muted text-sm">Current ROM:</span>
                  <span className="font-bold text-lg text-primary">{patient.currentRom}°</span>
                </div>
                <div className="rom-stat-item">
                  <span className="text-muted text-sm">Target ROM:</span>
                  <span className="font-bold text-lg text-secondary">{patient.targetRom}°</span>
                </div>
              </div>

              {/* Graphical ROM Visual Bar */}
              <div className="rom-visual-bar-wrapper">
                <div className="rom-visual-bar">
                  <div
                    className="rom-visual-fill"
                    style={{ width: `${(patient.currentRom / patient.targetRom) * 100}%` }}
                  >
                    <span>{patient.currentRom}°</span>
                  </div>
                </div>
                <div className="rom-bar-labels">
                  <span>0°</span>
                  <span>Target: {patient.targetRom}°</span>
                </div>
              </div>
              <p className="placeholder-text" style={{ marginTop: '0.75rem' }}>
                +80° flexion gained since post-op week 1. Patient is tracking on target for Phase II exit milestones.
              </p>
            </Card>

            <Card title="Adherence & Movement Quality Trends" subtitle="Session completion rate & AI posture consistency">
              <div className="metrics-grid" style={{ marginBottom: '1rem' }}>
                <div className="metric-card" style={{ padding: '0.75rem' }}>
                  <div className="metric-label">Adherence</div>
                  <div className="metric-value text-primary">{patient.adherenceRate}%</div>
                </div>
                <div className="metric-card" style={{ padding: '0.75rem' }}>
                  <div className="metric-label">Form Accuracy</div>
                  <div className="metric-value text-secondary">{patient.averageAccuracy}%</div>
                </div>
              </div>
              <p className="placeholder-text">
                AI movement telemetry indicates consistent joint tracking with decreasing compensatory trunk movements over the last 14 days.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SESSION TELEMETRY & AI FORM SCORES */}
      {activeTab === 'sessions' && (
        <div className="tab-content-container">
          <div className="sessions-telemetry-layout">
            {/* Session List Selector */}
            <div className="session-history-column">
              <Card title="Completed Sessions Log" subtitle="Select a session to inspect raw telemetry">
                <div className="session-picker-list">
                  {sessionsHistory.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => setSelectedSessionId(sess.id)}
                      className={`session-picker-item ${sess.id === selectedSession.id ? 'session-item-selected' : ''}`}
                    >
                      <div className="session-item-header">
                        <span className="font-medium text-sm">{sess.exerciseName}</span>
                        <span className="accuracy-badge accuracy-high">{sess.accuracyScore}%</span>
                      </div>
                      <div className="session-item-meta">
                        <span>{sess.date}</span>
                        <span className="pain-badge pain-low">Pain {sess.painScore}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Selected Session Inspector */}
            <div className="session-inspector-column">
              <Card
                title={`Telemetry Inspector: ${selectedSession.exerciseName}`}
                subtitle={`Recorded ${selectedSession.date} • Duration: ${Math.round(selectedSession.durationSeconds / 60)} min`}
              >
                <div className="ai-feedback-banner">
                  <div className="ai-feedback-icon">🤖</div>
                  <div>
                    <span className="font-bold text-sm">AI Form Telemetry Summary:</span>
                    <p className="ai-feedback-text">"{selectedSession.aiFeedback}"</p>
                  </div>
                </div>

                <div className="stat-summary-row" style={{ marginTop: '1rem' }}>
                  <div className="stat-box-mini">
                    <span className="text-muted text-xs">Sets Completed</span>
                    <span className="font-bold">{selectedSession.completedSets} / {selectedSession.targetSets}</span>
                  </div>
                  <div className="stat-box-mini">
                    <span className="text-muted text-xs">Reps Completed</span>
                    <span className="font-bold">{selectedSession.completedReps}</span>
                  </div>
                  <div className="stat-box-mini">
                    <span className="text-muted text-xs">Max ROM Achieved</span>
                    <span className="font-bold text-primary">{selectedSession.maxRom}°</span>
                  </div>
                  <div className="stat-box-mini">
                    <span className="text-muted text-xs">Self-Reported Pain</span>
                    <span className="font-bold" style={{ color: '#10b981' }}>{selectedSession.painScore} / 10</span>
                  </div>
                </div>

                {/* Rep-by-rep telemetry table */}
                <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  Repetition Breakdown & Joint Kinematics:
                </h4>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rep #</th>
                        <th>Peak Joint Angle</th>
                        <th>Hold / Duration</th>
                        <th>AI Posture Checkpoint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSession.repsTelemetry.map((rep) => (
                        <tr key={rep.rep}>
                          <td className="font-bold">Repetition {rep.rep}</td>
                          <td>{rep.rom}°</td>
                          <td>{rep.duration}s</td>
                          <td>
                            <span className={`badge ${rep.flag.includes('Normal') || rep.flag.includes('Good') || rep.flag.includes('Optimal') ? 'badge-success' : 'badge-warning'}`}>
                              {rep.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAIN HISTORY & SUBJECTIVE LOGS */}
      {activeTab === 'pain' && (
        <div className="tab-content-container">
          <Card
            title="Subjective Pain Score Tracking (VAS 0–10)"
            subtitle="Correlated with exercise volume and load changes"
          >
            <div className="pain-log-feed">
              {painLogs.map((log) => (
                <div key={log.id} className="pain-log-item">
                  <div className="pain-score-box">
                    <span className={`pain-large-badge pain-${log.score <= 3 ? 'low' : log.score <= 6 ? 'med' : 'high'}`}>
                      {log.score}
                    </span>
                    <span className="text-xs text-muted">VAS Score</span>
                  </div>
                  <div className="pain-log-details">
                    <div className="pain-log-title-row">
                      <span className="font-bold text-sm">{log.associatedExercise}</span>
                      <span className="text-muted text-xs">{log.date}</span>
                    </div>
                    <p className="pain-log-desc">"{log.type}"</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: THERAPIST CLINICAL NOTES */}
      {activeTab === 'notes' && (
        <div className="tab-content-container">
          <Card
            title="Clinical Notes & Treatment History"
            subtitle="Confidential therapist documentation and patient instructions"
          >
            <p className="placeholder-text" style={{ marginBottom: '1rem' }}>
              Access full clinical documentation history, authoring tools, and patient visibility controls.
            </p>
            <Link to={`/therapist/patients/${patient.id}/notes`} className="btn btn-primary">
              Open Full Clinical Notes Hub &rarr;
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
