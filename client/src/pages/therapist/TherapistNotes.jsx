import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';

const INITIAL_NOTES = [
  {
    id: 'note-1',
    author: 'Dr. Sarah Jenkins, PT, DPT',
    authorRole: 'Physical Therapist',
    date: '2026-08-28 14:30',
    category: 'Clinical Assessment',
    isPatientVisible: true,
    content:
      'Patient demonstrated 15-degree passive forward flexion improvement in right shoulder. Tolerating Phase II active-assisted exercises well with mild post-routine soreness (2/10). Proceeding with current prescription dosage.',
  },
  {
    id: 'note-2',
    author: 'Dr. Sarah Jenkins, PT, DPT',
    authorRole: 'Physical Therapist',
    date: '2026-08-15 10:15',
    category: 'Plan Modification',
    isPatientVisible: false,
    content:
      'Initiated towel-assisted external rotation routine. Cautioned against rapid eccentric loading to prevent stress on supraspinatus repair. Re-evaluate joint kinematics next Tuesday.',
  },
  {
    id: 'note-3',
    author: 'Dr. Sarah Jenkins, PT, DPT',
    authorRole: 'Physical Therapist',
    date: '2026-08-01 09:00',
    category: 'Initial Evaluation',
    isPatientVisible: true,
    content:
      'Initial rehabilitation baseline established following rotator cuff surgery. Prescribed passive pendulum routines and strict scapular setting cues. Patient instructed on home compliance protocol.',
  },
];

export default function TherapistNotes() {
  const { patientId = 'pt-101' } = useParams();
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('General Progress');
  const [isPatientVisible, setIsPatientVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const patientName =
    patientId === 'pt-102' ? 'Sarah Smith' : patientId === 'pt-103' ? 'Michael Chen' : 'John Doe';

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Dr. Sarah Jenkins, PT, DPT',
      authorRole: 'Physical Therapist',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      category: newNoteCategory,
      isPatientVisible,
      content: newNoteContent.trim(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setToastMessage('Clinical note successfully recorded.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredNotes = notes.filter((n) => {
    if (categoryFilter === 'ALL') return true;
    return n.category === categoryFilter;
  });

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link to={`/therapist/patients/${patientId}`} className="breadcrumb-link">
          &larr; Back to {patientName}'s Profile
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Clinical Documentation & Notes</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">Clinical Notes & Treatment Records</h1>
        <p className="page-subtitle">
          Record clinical evaluations, plan modifications, patient communications, and rehabilitation documentation for {patientName}.
        </p>
      </div>

      {toastMessage && (
        <div className="alert-banner alert-success">
          ✅ {toastMessage}
        </div>
      )}

      {/* New Note Form */}
      <Card title="Author New Clinical Note" subtitle="Record clinical documentation in patient record">
        <form onSubmit={handleAddNote}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Note Category:</label>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value)}
                className="form-select"
              >
                <option value="General Progress">General Progress</option>
                <option value="Plan Modification">Plan Modification</option>
                <option value="Clinical Assessment">Clinical Assessment</option>
                <option value="Check-in / Telehealth">Check-in / Telehealth</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPatientVisible}
                  onChange={(e) => setIsPatientVisible(e.target.checked)}
                />
                <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>
                  Make note visible to patient in portal
                </span>
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Clinical Observation / Notes:</label>
            <textarea
              rows="4"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="form-textarea"
              placeholder="Enter comprehensive clinical findings, objective measurements, patient tolerances, or plan updates..."
              required
            ></textarea>
          </div>

          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              Save Clinical Note
            </button>
          </div>
        </form>
      </Card>

      {/* Filter and Notes Timeline Feed */}
      <div className="notes-feed-header">
        <h3 className="section-title">Documentation History ({filteredNotes.length})</h3>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-select"
          style={{ width: 'auto' }}
        >
          <option value="ALL">All Documentation Categories</option>
          <option value="Clinical Assessment">Clinical Assessment</option>
          <option value="Plan Modification">Plan Modification</option>
          <option value="General Progress">General Progress</option>
          <option value="Initial Evaluation">Initial Evaluation</option>
        </select>
      </div>

      <div className="notes-timeline-list">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-timeline-item">
            <div className="note-timeline-header">
              <div className="note-author-info">
                <span className="note-author-name">{note.author}</span>
                <span className="note-timestamp">{note.date}</span>
              </div>
              <div className="note-badges">
                <span className="badge badge-info">{note.category}</span>
                {note.isPatientVisible ? (
                  <span className="badge badge-success">Visible to Patient</span>
                ) : (
                  <span className="badge badge-secondary">Clinician Only</span>
                )}
              </div>
            </div>
            <div className="note-body-text">
              {note.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
