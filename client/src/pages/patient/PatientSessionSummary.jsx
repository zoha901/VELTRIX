import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const EXERCISE_NAMES = {
  'ex-101': 'Seated Knee Extension with Quad Hold',
  'ex-102': 'Shoulder Pendulum & Circumduction',
  'ex-103': 'Assisted Shoulder External Rotation with Towel',
  'ex-104': 'Prone Pelvic Tilt & Lumbar Spine Stabilization',
};

export default function PatientSessionSummary() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exerciseName = EXERCISE_NAMES[exerciseId] || 'Rehabilitation Routine';

  const [postPain, setPostPain] = useState(2);
  const [difficulty, setDifficulty] = useState('MODERATE');
  const [patientNotes, setPatientNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSession = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      navigate(ROUTES.PATIENT.DASHBOARD);
    }, 1200);
  };

  return (
    <div className="page-container">
      {/* Breadcrumbs */}
      <div className="breadcrumb-bar">
        <Link to={ROUTES.PATIENT.DASHBOARD} className="breadcrumb-link">
          Dashboard
        </Link>
        <span className="breadcrumb-separator">/</span>
        <Link to={ROUTES.PATIENT.EXERCISES} className="breadcrumb-link">
          Prescribed Exercises
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Session Summary</span>
      </div>

      {/* Header Banner */}
      <div className="patient-header-banner">
        <div>
          <div className="patient-title-row">
            <h1 className="patient-name-heading">🎉 Session Completed!</h1>
            <span className="badge badge-success">Recorded</span>
          </div>
          <p className="patient-subtitle-meta">
            Exercise: <strong>{exerciseName}</strong> &bull; Completed Routine Summary Foundation
          </p>
        </div>
        <div className="patient-header-actions">
          <Link to={ROUTES.PATIENT.PROGRESS} className="btn btn-outline">
            View My Progress
          </Link>
          <Link to={ROUTES.PATIENT.DASHBOARD} className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {isSaved && (
        <div className="alert-banner alert-success" role="alert">
          <span>✅ Session feedback successfully saved! Returning to dashboard...</span>
        </div>
      )}

      {/* Metrics Summary Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Sets Completed</span>
            <span className="badge badge-success">Target Met</span>
          </div>
          <div className="metric-value">3 / 3</div>
          <span className="metric-subtext">100% of prescribed sets</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Repetitions</span>
            <span className="badge badge-info">Completed</span>
          </div>
          <div className="metric-value">30 Reps</div>
          <span className="metric-subtext">Prescribed volume achieved</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Session Duration</span>
            <span className="badge badge-secondary">Tracked</span>
          </div>
          <div className="metric-value">08:45</div>
          <span className="metric-subtext">Minutes:Seconds</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Consistency Streak</span>
            <span className="badge badge-warning">🔥 Day 4</span>
          </div>
          <div className="metric-value">+1 Day</div>
          <span className="metric-subtext">Added to recovery streak</span>
        </div>
      </div>

      {/* Feedback Form */}
      <Card
        title="Post-Exercise Feedback & Discomfort Rating"
        subtitle="Record how your body felt during and after this exercise session"
      >
        <form onSubmit={handleSaveSession}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="post-pain-slider">
                Post-Exercise Pain Rating (0 = No Pain, 10 = Severe):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  id="post-pain-slider"
                  type="range"
                  min="0"
                  max="10"
                  value={postPain}
                  onChange={(e) => setPostPain(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span
                  className={`pain-badge ${
                    postPain <= 3 ? 'pain-low' : postPain <= 6 ? 'pain-med' : 'pain-high'
                  }`}
                >
                  {postPain} / 10
                </span>
              </div>
              <span className="field-hint">
                Baseline prior to start was 2/10.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="difficulty-select">
                Perceived Difficulty (Borg Scale):
              </label>
              <select
                id="difficulty-select"
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="VERY_EASY">1 - Very Easy (Minimal effort)</option>
                <option value="EASY">2 - Easy (Comfortable)</option>
                <option value="MODERATE">3 - Moderate (Good challenge)</option>
                <option value="HARD">4 - Hard (Tiring)</option>
                <option value="VERY_HARD">5 - Very Hard (Maximal effort)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="patient-notes-input">
              Optional Notes for Your Physical Therapist:
            </label>
            <textarea
              id="patient-notes-input"
              rows={3}
              className="form-textarea"
              placeholder="e.g., Felt mild stiffness during the 3rd set, but pain decreased after resting..."
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
            />
          </div>

          <div className="card-actions" style={{ marginTop: '1.25rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSaved}>
              {isSaved ? 'Saving Session...' : 'Save & Complete Routine'}
            </button>
            <Link to={ROUTES.PATIENT.DASHBOARD} className="btn btn-outline">
              Return to Dashboard
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
