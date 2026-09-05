import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';

const PRESCRIBED_EXERCISES = [
  {
    id: 'ex-101',
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body',
    targetJoint: 'Knee',
    movementType: 'Strength & ROM',
    difficulty: 'BEGINNER',
    targetAngle: '0° - 90°',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
    status: 'PENDING',
    frequency: 'Daily',
    description: 'Active knee extension designed to isolate the vastus medialis oblique and restore full extension kinematics.',
  },
  {
    id: 'ex-102',
    name: 'Shoulder Pendulum & Circumduction',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    movementType: 'Passive ROM',
    difficulty: 'BEGINNER',
    targetAngle: '0° - 45°',
    prescribedSets: 3,
    prescribedReps: 15,
    holdSeconds: 0,
    status: 'COMPLETED',
    frequency: 'Daily',
    description: 'Gentle passive pendular oscillations to decompress the subacromial space post-rotator cuff surgery.',
  },
  {
    id: 'ex-103',
    name: 'Assisted Shoulder External Rotation with Towel',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    movementType: 'Active-Assisted ROM',
    difficulty: 'INTERMEDIATE',
    targetAngle: '0° - 30°',
    prescribedSets: 3,
    prescribedReps: 10,
    holdSeconds: 5,
    status: 'PENDING',
    frequency: '3x / week',
    description: 'Towel-supported external rotation to gently mobilize the anterior capsule while stabilizing scapular position.',
  },
  {
    id: 'ex-104',
    name: 'Prone Pelvic Tilt & Lumbar Spine Stabilization',
    category: 'Spine / Core',
    targetJoint: 'Spine',
    movementType: 'Neuromuscular',
    difficulty: 'BEGINNER',
    targetAngle: 'Neutral',
    prescribedSets: 3,
    prescribedReps: 12,
    holdSeconds: 8,
    status: 'PENDING',
    frequency: 'Daily',
    description: 'Core activation drill targeting transverse abdominis and multifidus co-contraction.',
  },
];

export default function PatientExercises() {
  const [selectedJoint, setSelectedJoint] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const joints = ['ALL', 'KNEE', 'SHOULDER', 'SPINE'];

  const filteredExercises = useMemo(() => {
    return PRESCRIBED_EXERCISES.filter((ex) => {
      const matchJoint =
        selectedJoint === 'ALL' || ex.targetJoint.toUpperCase() === selectedJoint;
      const matchSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchJoint && matchSearch;
    });
  }, [selectedJoint, searchTerm]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Prescribed Therapy Exercises</h1>
          <p className="page-subtitle">
            Exercises prescribed by your therapist for your daily rehabilitation program.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-panel">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search exercises by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="joint-pills-row">
            {joints.map((joint) => (
              <button
                key={joint}
                type="button"
                className={`filter-pill ${
                  selectedJoint === joint ? 'filter-pill-active' : ''
                }`}
                onClick={() => setSelectedJoint(joint)}
              >
                {joint === 'ALL' ? 'All Joints' : joint}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="card-grid">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            title={exercise.name}
            subtitle={`${exercise.category} • Target Joint: ${exercise.targetJoint}`}
          >
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                className={`badge ${
                  exercise.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'
                }`}
              >
                {exercise.status}
              </span>
              <span className="badge badge-secondary">{exercise.difficulty}</span>
              <span className="badge badge-info">{exercise.frequency}</span>
            </div>

            <p className="placeholder-text">{exercise.description}</p>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Prescription:</span>
                <span className="info-value font-bold">
                  {exercise.prescribedSets} sets &times; {exercise.prescribedReps} reps
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Target ROM:</span>
                <span className="info-value">{exercise.targetAngle}</span>
              </div>
              {exercise.holdSeconds > 0 && (
                <div className="info-item">
                  <span className="info-label">Isometric Hold:</span>
                  <span className="info-value">{exercise.holdSeconds}s per rep</span>
                </div>
              )}
            </div>

            <div className="card-actions" style={{ marginTop: 'auto' }}>
              <Link
                to={`/patient/exercises/${exercise.id}`}
                className="btn btn-outline"
              >
                View Instructions
              </Link>
              <Link
                to={`/patient/exercises/${exercise.id}/guided`}
                className="btn btn-primary"
              >
                Start Guided Mode
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
