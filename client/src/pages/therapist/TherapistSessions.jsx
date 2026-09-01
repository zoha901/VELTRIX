import { useState } from 'react';
import Card from '../../components/Card';

export default function TherapistSessions() {
  const [selectedSessionId, setSelectedSessionId] = useState('sess-1');
  const [sessionNotes, setSessionNotes] = useState({
    'sess-1': 'Patient showed high extension precision. Valgus drift on Rep 9 resolved with cue.',
    'sess-2': '',
    'sess-3': 'Fatigue evident by rep 8. Consider reducing target hold from 5s to 3s if soreness persists.',
  });
  const [noteInput, setNoteInput] = useState('');

  const sessions = [
    {
      id: 'sess-1',
      patient: 'John Doe',
      patientId: 'pt_404',
      exercise: 'Seated Knee Extension with Quad Hold',
      timestamp: 'Today, 09:15 AM',
      duration: '6m 45s',
      prescribedSets: 3,
      completedSets: 3,
      prescribedReps: 10,
      completedReps: 10,
      accuracy: 92.0,
      maxRom: 88.5,
      pain: 3,
      patientComment: 'Felt good overall; minor fatigue on the last 2 reps.',
      isReviewed: true,
      isFlagged: false,
      aiFeedback: 'Strong quadriceps peak activation. Minor backward trunk compensation observed on Rep 9 & 10.',
      repData: [
        { rep: 1, rom: '89.0°', duration: '4.8s', flags: [] },
        { rep: 2, rom: '90.2°', duration: '5.0s', flags: [] },
        { rep: 3, rom: '88.5°', duration: '5.1s', flags: [] },
        { rep: 4, rom: '89.1°', duration: '4.9s', flags: [] },
        { rep: 5, rom: '88.0°', duration: '5.0s', flags: [] },
        { rep: 8, rom: '86.5°', duration: '4.7s', flags: [] },
        { rep: 9, rom: '84.0°', duration: '4.5s', flags: ['Trunk Lean Backward'] },
        { rep: 10, rom: '83.2°', duration: '4.3s', flags: ['Trunk Lean Backward'] },
      ],
    },
    {
      id: 'sess-2',
      patient: 'Sarah Smith',
      patientId: 'pt_405',
      exercise: 'Shoulder Abduction & Flexion',
      timestamp: 'Today, 08:30 AM',
      duration: '8m 10s',
      prescribedSets: 3,
      completedSets: 3,
      prescribedReps: 12,
      completedReps: 12,
      accuracy: 94.5,
      maxRom: 158.0,
      pain: 2,
      patientComment: 'No sharp pain. Scapular movement felt smoother.',
      isReviewed: true,
      isFlagged: false,
      aiFeedback: 'Excellent scapular plane tracking. Smooth ascent and controlled eccentric lowering.',
      repData: [
        { rep: 1, rom: '155.0°', duration: '5.2s', flags: [] },
        { rep: 2, rom: '157.0°', duration: '5.0s', flags: [] },
        { rep: 6, rom: '158.0°', duration: '5.1s', flags: [] },
        { rep: 12, rom: '156.5°', duration: '4.9s', flags: [] },
      ],
    },
    {
      id: 'sess-3',
      patient: 'Michael Chen',
      patientId: 'pt_406',
      exercise: 'Prone Hamstring Curl',
      timestamp: 'Yesterday, 05:20 PM',
      duration: '5m 30s',
      prescribedSets: 3,
      completedSets: 2,
      prescribedReps: 10,
      completedReps: 8,
      accuracy: 78.5,
      maxRom: 72.0,
      pain: 7,
      patientComment: 'Stopped set 3 early due to anterior lumbar pressure.',
      isReviewed: false,
      isFlagged: true,
      aiFeedback: 'Incomplete routine. Pelvic elevation compensation flagged during knee flexion. High reported pain.',
      repData: [
        { rep: 1, rom: '75.0°', duration: '3.5s', flags: [] },
        { rep: 4, rom: '72.0°', duration: '3.1s', flags: ['Pelvic Arching'] },
        { rep: 8, rom: '68.0°', duration: '2.8s', flags: ['Pelvic Arching', 'Early Termination'] },
      ],
    },
  ];

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setSessionNotes({
      ...sessionNotes,
      [selectedSession.id]: noteInput.trim(),
    });
    setNoteInput('');
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Session Telemetry & Progress Inspector</h1>
          <p className="page-subtitle">
            Inspect completed patient sessions, review AI motion telemetry, track compensation flags, and document notes.
          </p>
        </div>
      </div>

      {/* Dual Panel Layout */}
      <div className="session-dual-layout">
        {/* Left Panel: Sessions Feed List */}
        <div className="session-sidebar-col">
          <Card title="Completed Sessions" subtitle="Select a session to inspect telemetry">
            <div className="session-select-list">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`session-select-item ${
                    s.id === selectedSession.id ? 'session-select-active' : ''
                  }`}
                  onClick={() => {
                    setSelectedSessionId(s.id);
                    setNoteInput('');
                  }}
                >
                  <div className="session-select-header">
                    <strong className="session-select-patient">{s.patient}</strong>
                    <span className="session-select-time">{s.timestamp}</span>
                  </div>
                  <p className="session-select-exercise">{s.exercise}</p>
                  <div className="session-select-badges">
                    <span className="badge badge-primary">{s.accuracy}% Accuracy</span>
                    <span
                      className={`badge ${
                        s.pain > 5 ? 'badge-danger' : s.pain > 2 ? 'badge-warning' : 'badge-neutral'
                      }`}
                    >
                      Pain: {s.pain}/10
                    </span>
                    {s.isFlagged && <span className="badge badge-danger">Flagged</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel: Telemetry & Detail Inspector */}
        <div className="session-inspector-col">
          {/* Header Summary Card */}
          <div className="inspector-card">
            <div className="inspector-header">
              <div>
                <div className="inspector-title-row">
                  <h2 className="inspector-patient-name">{selectedSession.patient}</h2>
                  <span className="badge badge-primary">{selectedSession.timestamp}</span>
                  {selectedSession.isFlagged && (
                    <span className="badge badge-danger">High Risk / Flagged</span>
                  )}
                </div>
                <p className="inspector-exercise-title">
                  <strong>Exercise:</strong> {selectedSession.exercise}
                </p>
              </div>
            </div>

            {/* Metrics KPI Grid */}
            <div className="telemetry-metrics-grid">
              <div className="telemetry-metric-item">
                <span className="metric-label">AI POSE ACCURACY</span>
                <span className="metric-val text-primary">{selectedSession.accuracy}%</span>
              </div>
              <div className="telemetry-metric-item">
                <span className="metric-label">PEAK ROM ANGLE</span>
                <span className="metric-val text-success">{selectedSession.maxRom}&deg;</span>
              </div>
              <div className="telemetry-metric-item">
                <span className="metric-label">COMPLETED LOAD</span>
                <span className="metric-val">
                  {selectedSession.completedSets}/{selectedSession.prescribedSets} Sets &bull;{' '}
                  {selectedSession.completedReps}/{selectedSession.prescribedReps} Reps
                </span>
              </div>
              <div className="telemetry-metric-item">
                <span className="metric-label">REPORTED PAIN</span>
                <span
                  className={`metric-val ${
                    selectedSession.pain > 5 ? 'text-danger' : 'text-warning'
                  }`}
                >
                  {selectedSession.pain} / 10
                </span>
              </div>
            </div>

            {/* AI Summary Feedback */}
            <div className="ai-feedback-banner">
              <div className="ai-feedback-header">
                <strong>AI Motion Feedback Summary</strong>
              </div>
              <p className="ai-feedback-text">{selectedSession.aiFeedback}</p>
            </div>

            {/* Patient Self Feedback */}
            {selectedSession.patientComment && (
              <div className="patient-comment-box">
                <strong>Patient Post-Session Note:</strong> &ldquo;{selectedSession.patientComment}&rdquo;
              </div>
            )}

            {/* Rep-by-Rep Telemetry Breakdown Table */}
            <div className="rep-breakdown-section">
              <h3 className="section-title">Repetition-by-Repetition Telemetry Breakdown</h3>
              <div className="table-responsive">
                <table className="data-table data-table-compact">
                  <thead>
                    <tr>
                      <th>Rep #</th>
                      <th>Peak ROM Angle</th>
                      <th>Rep Duration</th>
                      <th>Form Deviations / AI Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSession.repData.map((r, i) => (
                      <tr key={i}>
                        <td>Rep {r.rep}</td>
                        <td><strong>{r.rom}</strong></td>
                        <td>{r.duration}</td>
                        <td>
                          {r.flags.length > 0 ? (
                            r.flags.map((f, fi) => (
                              <span key={fi} className="badge badge-danger" style={{ marginRight: '4px' }}>
                                {f}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-success">Optimal Form</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Therapist Session Annotation Form */}
            <div className="session-annotation-section">
              <h3 className="section-title">Therapist Review & Clinical Notes</h3>
              {sessionNotes[selectedSession.id] ? (
                <div className="note-card" style={{ marginBottom: '1rem' }}>
                  <p className="note-content">
                    <strong>Therapist Note:</strong> {sessionNotes[selectedSession.id]}
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSaveNote} className="annotation-form">
                <div className="form-group">
                  <label htmlFor="session-note-input">Add / Update Clinical Note for this Session</label>
                  <textarea
                    id="session-note-input"
                    rows={3}
                    className="form-input form-textarea"
                    placeholder="Enter observation regarding compensation patterns or progress..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-secondary">
                    Save Session Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
