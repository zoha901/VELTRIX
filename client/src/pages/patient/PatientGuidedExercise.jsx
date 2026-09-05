import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const EXERCISE_DATA = {
  'ex-101': {
    id: 'ex-101',
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body',
    targetJoint: 'Knee',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
  },
  'ex-102': {
    id: 'ex-102',
    name: 'Shoulder Pendulum & Circumduction',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    prescribedSets: 3,
    prescribedReps: 15,
    holdSeconds: 0,
  },
  'ex-103': {
    id: 'ex-103',
    name: 'Assisted Shoulder External Rotation with Towel',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
  },
  'ex-104': {
    id: 'ex-104',
    name: 'Prone Pelvic Tilt & Lumbar Spine Stabilization',
    category: 'Spine / Core',
    targetJoint: 'Spine',
    prescribedSets: 3,
    prescribedReps: 12,
    holdSeconds: 8,
  },
};

export default function PatientGuidedExercise() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = EXERCISE_DATA[exerciseId] || EXERCISE_DATA['ex-101'];

  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [prePainScore, setPrePainScore] = useState(2);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleStartSession = () => {
    setIsSessionStarted(true);
  };

  const handleIncrementRep = () => {
    if (currentRep + 1 >= exercise.prescribedReps) {
      if (currentSet < exercise.prescribedSets) {
        setCurrentSet((prev) => prev + 1);
        setCurrentRep(0);
      } else {
        // Complete session foundation
        navigate(`/patient/exercises/${exercise.id}/summary`);
      }
    } else {
      setCurrentRep((prev) => prev + 1);
    }
  };

  const handleFinishEarly = () => {
    navigate(`/patient/exercises/${exercise.id}/summary`);
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
        <Link to={`/patient/exercises/${exercise.id}`} className="breadcrumb-link">
          {exercise.name}
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Guided Session</span>
      </div>

      {/* Header Banner */}
      <div className="patient-header-banner">
        <div>
          <div className="patient-title-row">
            <h1 className="patient-name-heading">Guided Session: {exercise.name}</h1>
            <span className="badge badge-primary">Guided Mode</span>
          </div>
          <p className="patient-subtitle-meta">
            Target: {exercise.prescribedSets} Sets &bull; {exercise.prescribedReps} Reps &bull; Target Joint: {exercise.targetJoint}
          </p>
        </div>
        <div className="patient-header-actions">
          <button
            type="button"
            onClick={handleFinishEarly}
            className="btn btn-outline btn-sm"
          >
            End Session &amp; View Summary
          </button>
        </div>
      </div>

      {/* Main Guided Mode Layout */}
      {!isSessionStarted ? (
        <Card
          title="Pre-Exercise Safety Check"
          subtitle="Please assess your baseline discomfort before starting"
        >
          <div className="form-group" style={{ maxWidth: '400px' }}>
            <label className="form-label" htmlFor="pre-pain-input">
              Current Baseline Pain Level (0 = No Pain, 10 = Severe):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                id="pre-pain-input"
                type="range"
                min="0"
                max="10"
                value={prePainScore}
                onChange={(e) => setPrePainScore(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span className={`pain-badge ${prePainScore <= 3 ? 'pain-low' : prePainScore <= 6 ? 'pain-med' : 'pain-high'}`}>
                {prePainScore} / 10
              </span>
            </div>
          </div>

          <div className="card-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleStartSession}
              className="btn btn-primary"
            >
              Begin Guided Workout
            </button>
            <Link to={`/patient/exercises/${exercise.id}`} className="btn btn-outline">
              Back to Instructions
            </Link>
          </div>
        </Card>
      ) : (
        <div className="prescription-layout-grid">
          <div className="prescription-form-column">
            <Card
              title="Active Exercise Rhythm & Guidance"
              subtitle="Follow the step pacing and complete each repetition"
            >
              {/* Visual Rhythm / Movement Guide Container */}
              <div
                style={{
                  padding: '3rem 2rem',
                  backgroundColor: 'var(--bg)',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center',
                  border: '2px dashed var(--border)',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                  🧘
                </div>
                <h3 className="font-bold" style={{ fontSize: '1.4rem' }}>
                  Set {currentSet} of {exercise.prescribedSets}
                </h3>
                <p className="placeholder-text" style={{ margin: '0.5rem 0 1.5rem' }}>
                  Controlled Extension &bull; Smooth concentric hold &bull; Controlled eccentric release
                </p>

                {/* Big Rep Counter */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      fontSize: '3rem',
                      fontWeight: '800',
                      color: 'var(--primary)',
                      lineHeight: 1,
                    }}
                  >
                    {currentRep} / {exercise.prescribedReps}
                  </div>
                  <span className="text-muted font-bold">Reps Done</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-actions" style={{ marginTop: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleIncrementRep}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}
                >
                  ➕ Tap to Count +1 Rep
                </button>
                <button
                  type="button"
                  onClick={handleFinishEarly}
                  className="btn btn-outline"
                >
                  Finish Workout Early
                </button>
              </div>
            </Card>
          </div>

          <div>
            <Card title="Prescribed Target" subtitle="Session Parameters">
              <div className="preview-summary-box">
                <div className="preview-item">
                  <span className="text-muted">Target Sets:</span>
                  <span className="font-bold">{exercise.prescribedSets}</span>
                </div>
                <div className="preview-item">
                  <span className="text-muted">Target Reps:</span>
                  <span className="font-bold">{exercise.prescribedReps}</span>
                </div>
                <div className="preview-item">
                  <span className="text-muted">Pre-Exercise Pain:</span>
                  <span className="pain-badge pain-low">{prePainScore} / 10</span>
                </div>
                <div className="preview-item">
                  <span className="text-muted">Mode:</span>
                  <span className="font-bold text-primary">Guided (Standard)</span>
                </div>
              </div>

              <div className="preview-cues-box">
                <strong>Safety Reminder:</strong>
                <p className="preview-cues-text">
                  Do not push into severe sharp pain. Stop immediately if discomfort exceeds tolerable levels.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
