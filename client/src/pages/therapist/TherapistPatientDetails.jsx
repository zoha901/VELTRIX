import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

export default function TherapistPatientDetails() {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'routine' | 'sessions' | 'notes'
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('General Progress');
  const [isPatientVisible, setIsPatientVisible] = useState(true);
  const [notesList, setNotesList] = useState([
    {
      id: 'nt-1',
      author: 'Dr. Sarah Jenkins, PT, DPT',
      date: 'Aug 28, 2026 • 2:45 PM',
      type: 'Plan Modification',
      visible: true,
      content: 'Patient demonstrating excellent extension recovery (88.5° ROM). Increased knee extension prescription to 3 sets × 12 reps with 5s hold. Emphasized avoiding trunk compensation during fatigued sets.',
    },
    {
      id: 'nt-2',
      author: 'Dr. Sarah Jenkins, PT, DPT',
      date: 'Aug 14, 2026 • 10:15 AM',
      type: 'Clinical Assessment',
      visible: false,
      content: 'Initial 4-week post-op clearance evaluation. Joint effusion resolving well. Passive ROM to 95° flexion achieved without acute pain spike.',
    },
  ]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const createdNote = {
      id: `nt-${Date.now()}`,
      author: 'Dr. Sarah Jenkins, PT, DPT',
      date: 'Just now',
      type: noteType,
      visible: isPatientVisible,
      content: newNote.trim(),
    };

    setNotesList([createdNote, ...notesList]);
    setNewNote('');
  };

  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <Link to={ROUTES.THERAPIST.PATIENTS} className="back-link">
          &larr; Back to Patient Directory
        </Link>
      </div>

      {/* Patient Profile Header Card */}
      <div className="patient-header-card">
        <div className="patient-header-main">
          <div className="patient-avatar-large">JD</div>
          <div className="patient-header-info">
            <div className="patient-title-row">
              <h1 className="patient-name">John Doe</h1>
              <span className="badge badge-success">Active Protocol</span>
              <span className="badge badge-neutral">ID: {patientId || 'PT-404'}</span>
            </div>
            <p className="patient-diagnosis">
              <strong>Primary Diagnosis:</strong> Post-Op ACL Reconstruction (Right Knee) &bull; Hamstring Autograft
            </p>
            <div className="patient-meta-grid">
              <div><strong>Age / Gender:</strong> 36 yrs &bull; Male</div>
              <div><strong>Surgery Date:</strong> July 15, 2026</div>
              <div><strong>Care Phase:</strong> Phase 2 (Week 6)</div>
              <div><strong>Adherence Rate:</strong> <span className="text-success font-semibold">88.5%</span></div>
            </div>
          </div>
        </div>
        <div className="patient-header-actions">
          <Link to={ROUTES.THERAPIST.EXERCISES} className="btn btn-secondary">
            + Prescribe Exercise
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-button ${activeTab === 'overview' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Recovery Progress
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'routine' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('routine')}
        >
          Active Regimen (3)
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'sessions' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Completed Sessions (14)
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'notes' ? 'tab-button-active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Clinical Notes ({notesList.length})
        </button>
      </div>

      {/* Tab Content: Overview & Recovery Progress */}
      {activeTab === 'overview' && (
        <div className="tab-content-grid">
          <Card title="Range of Motion (ROM) Trajectory" subtitle="Right Knee Extension & Flexion">
            <div className="metrics-highlight-grid">
              <div className="metric-box">
                <span className="metric-label">BASELINE ROM</span>
                <span className="metric-value">65.0&deg;</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">CURRENT ROM</span>
                <span className="metric-value text-primary">88.5&deg;</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">TARGET ROM</span>
                <span className="metric-value text-success">90.0&deg;</span>
              </div>
            </div>
            <p className="placeholder-text">
              Longitudinal ROM analytics placeholder: +23.5&deg; recovery gain over the last 4 weeks. Patient on track to achieve full active knee extension benchmark.
            </p>
          </Card>

          <Card title="Adherence & Pain Trajectory" subtitle="Compliance & Subjective Symptom Index">
            <div className="metrics-highlight-grid">
              <div className="metric-box">
                <span className="metric-label">WEEKLY COMPLIANCE</span>
                <span className="metric-value text-success">92%</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">LATEST PAIN SCORE</span>
                <span className="metric-value text-warning">3 / 10</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">AVG POSE ACCURACY</span>
                <span className="metric-value text-primary">91.4%</span>
              </div>
            </div>
            <p className="placeholder-text">
              Pain index has decreased steadily from moderate (6/10) at post-op week 2 to mild (3/10) during active resistance exercises.
            </p>
          </Card>
        </div>
      )}

      {/* Tab Content: Active Regimen */}
      {activeTab === 'routine' && (
        <div className="card-grid">
          <Card title="Seated Knee Extension with Quad Hold" subtitle="Lower Body / Knee • Strength & ROM">
            <div className="protocol-dosage-pill">
              <span>3 Sets &times; 12 Reps</span>
              <span>5s Hold</span>
              <span>2&times; Daily (Mon-Fri)</span>
            </div>
            <p className="placeholder-text">
              <strong>Clinical Cue:</strong> Focus on complete quad contraction at peak extension (target: 90&deg;). Avoid trunk leaning when fatigued.
            </p>
            <div className="card-actions">
              <button className="btn btn-outline" type="button">Modify Dosage</button>
              <button className="btn btn-outline text-danger" type="button">Deactivate</button>
            </div>
          </Card>

          <Card title="Prone Hamstring Curl" subtitle="Lower Body / Knee • Strength">
            <div className="protocol-dosage-pill">
              <span>3 Sets &times; 10 Reps</span>
              <span>3s Hold</span>
              <span>1&times; Daily (Mon, Wed, Fri)</span>
            </div>
            <p className="placeholder-text">
              <strong>Clinical Cue:</strong> Maintain neutral pelvic alignment; avoid hiking hips off table during flexion phase.
            </p>
            <div className="card-actions">
              <button className="btn btn-outline" type="button">Modify Dosage</button>
              <button className="btn btn-outline text-danger" type="button">Deactivate</button>
            </div>
          </Card>

          <Card title="Straight Leg Raise with Quad Lock" subtitle="Lower Body / Hip & Knee • ROM">
            <div className="protocol-dosage-pill">
              <span>2 Sets &times; 10 Reps</span>
              <span>5s Hold</span>
              <span>Daily</span>
            </div>
            <p className="placeholder-text">
              <strong>Clinical Cue:</strong> Keep leg completely straight throughout the lift. Stop lift if knee begins to sag.
            </p>
            <div className="card-actions">
              <button className="btn btn-outline" type="button">Modify Dosage</button>
              <button className="btn btn-outline text-danger" type="button">Deactivate</button>
            </div>
          </Card>
        </div>
      )}

      {/* Tab Content: Completed Sessions */}
      {activeTab === 'sessions' && (
        <div className="card-container">
          <div className="card-header">
            <h3 className="card-title">Completed Session Telemetry History</h3>
            <p className="card-subtitle">Telemetry records and AI motion analysis logs for John Doe</p>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Exercise</th>
                  <th>Sets & Reps</th>
                  <th>Pose Accuracy</th>
                  <th>Max ROM</th>
                  <th>Reported Pain</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Today, 09:15 AM</td>
                  <td>Seated Knee Extension</td>
                  <td>3 sets &times; 12 reps</td>
                  <td><span className="badge badge-success">92.0%</span></td>
                  <td>88.5&deg;</td>
                  <td><span className="badge badge-neutral">3/10 (Mild)</span></td>
                  <td><span className="badge badge-success">Reviewed</span></td>
                </tr>
                <tr>
                  <td>Yesterday, 04:30 PM</td>
                  <td>Straight Leg Raise</td>
                  <td>2 sets &times; 10 reps</td>
                  <td><span className="badge badge-success">94.5%</span></td>
                  <td>45.0&deg;</td>
                  <td><span className="badge badge-neutral">2/10 (Mild)</span></td>
                  <td><span className="badge badge-success">Reviewed</span></td>
                </tr>
                <tr>
                  <td>Aug 27, 10:00 AM</td>
                  <td>Prone Hamstring Curl</td>
                  <td>3 sets &times; 10 reps</td>
                  <td><span className="badge badge-warning">84.0%</span></td>
                  <td>78.0&deg;</td>
                  <td><span className="badge badge-warning">5/10 (Mod)</span></td>
                  <td><span className="badge badge-danger">Needs Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-actions" style={{ marginTop: '1rem' }}>
            <Link to={ROUTES.THERAPIST.SESSIONS} className="btn btn-primary">
              Open Full Session Inspector &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Tab Content: Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="page-container">
          {/* Add Note Form Card */}
          <Card title="Add Clinical Note" subtitle="Record observations, progress evaluations, and regimen adjustments">
            <form onSubmit={handleAddNote} className="note-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="note-type">Note Category</label>
                  <select
                    id="note-type"
                    className="form-input"
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                  >
                    <option value="General Progress">General Progress</option>
                    <option value="Plan Modification">Plan Modification</option>
                    <option value="Clinical Assessment">Clinical Assessment</option>
                    <option value="Patient Check-in">Patient Check-in</option>
                  </select>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isPatientVisible}
                      onChange={(e) => setIsPatientVisible(e.target.checked)}
                    />
                    <span>Share note with Patient in their portal</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="note-body">Clinical Observations & Guidance</label>
                <textarea
                  id="note-body"
                  rows={4}
                  className="form-input form-textarea"
                  placeholder="Enter clinical assessment, movement quality observations, or dosage adjustments..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-secondary">
                  Save Clinical Note
                </button>
              </div>
            </form>
          </Card>

          {/* Existing Notes Feed */}
          <div className="notes-feed">
            <h3 className="section-title">Clinical Notes History</h3>
            <div className="notes-list">
              {notesList.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <div className="note-meta">
                      <strong className="note-author">{note.author}</strong>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <div className="note-badges">
                      <span className="badge badge-primary">{note.type}</span>
                      <span className={`badge ${note.visible ? 'badge-success' : 'badge-neutral'}`}>
                        {note.visible ? 'Patient Visible' : 'Internal Only'}
                      </span>
                    </div>
                  </div>
                  <p className="note-content">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
