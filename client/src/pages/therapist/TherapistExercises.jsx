import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const EXERCISE_LIBRARY = [
  {
    id: 'ex-101',
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body',
    targetJoint: 'Knee',
    movementType: 'Strength & ROM',
    difficulty: 'BEGINNER',
    targetAngle: '0° - 90°',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
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
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldSeconds: 0,
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
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
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
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: 8,
    description: 'Core activation drill targeting transverse abdominis and multifidus co-contraction.',
  },
  {
    id: 'ex-105',
    name: 'Ankle Dorsiflexion with Resistance Band',
    category: 'Lower Body',
    targetJoint: 'Ankle',
    movementType: 'Strength',
    difficulty: 'INTERMEDIATE',
    targetAngle: '0° - 20°',
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldSeconds: 3,
    description: 'Concentric and eccentric anterior tibialis loading to improve talocrural stability.',
  },
  {
    id: 'ex-106',
    name: 'Cervical Spine Lateral Rotation & Postural Setting',
    category: 'Spine / Core',
    targetJoint: 'Spine',
    movementType: 'Active ROM',
    difficulty: 'BEGINNER',
    targetAngle: '-45° to +45°',
    defaultSets: 2,
    defaultReps: 10,
    defaultHoldSeconds: 3,
    description: 'Gentle horizontal cervical rotation to relieve suboccipital tension and restore sagittal alignment.',
  },
];

export default function TherapistExercises() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoint, setSelectedJoint] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJoint = selectedJoint === 'ALL' || ex.targetJoint === selectedJoint;
      const matchesDiff = selectedDifficulty === 'ALL' || ex.difficulty === selectedDifficulty;
      return matchesSearch && matchesJoint && matchesDiff;
    });
  }, [searchTerm, selectedJoint, selectedDifficulty]);

  const jointCategories = ['ALL', 'Knee', 'Shoulder', 'Spine', 'Ankle'];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Rehabilitation Exercise Library</h1>
          <p className="page-subtitle">
            Curate movement protocols, configure AI tracking landmarks, and prescribe exercises to patient cohorts.
          </p>
        </div>
        <div className="header-actions">
          <Link to={ROUTES.THERAPIST.ASSIGN} className="btn btn-primary">
            + Prescribe Exercise Plan
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-panel">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search exercise library by name or focus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input search-input"
          />
        </div>

        <div className="joint-pills-row">
          {jointCategories.map((joint) => (
            <button
              type="button"
              key={joint}
              onClick={() => setSelectedJoint(joint)}
              className={`filter-pill ${selectedJoint === joint ? 'filter-pill-active' : ''}`}
            >
              {joint === 'ALL' ? 'All Joints' : joint}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-select"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="card-grid">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            title={exercise.name}
            subtitle={`${exercise.category} • Target Joint: ${exercise.targetJoint}`}
            className="exercise-library-card"
          >
            <p className="placeholder-text">{exercise.description}</p>

            <div className="exercise-meta-box">
              <div className="meta-row">
                <span className="text-muted text-sm">Movement Type:</span>
                <span className="font-medium text-sm">{exercise.movementType}</span>
              </div>
              <div className="meta-row">
                <span className="text-muted text-sm">Target ROM Angle:</span>
                <span className="font-bold text-primary text-sm">{exercise.targetAngle}</span>
              </div>
              <div className="meta-row">
                <span className="text-muted text-sm">Default Dosage:</span>
                <span className="font-medium text-sm">
                  {exercise.defaultSets} Sets × {exercise.defaultReps} Reps ({exercise.defaultHoldSeconds}s hold)
                </span>
              </div>
            </div>

            <div className="metrics-pill-row">
              <span
                className={`badge ${
                  exercise.difficulty === 'BEGINNER'
                    ? 'badge-success'
                    : exercise.difficulty === 'INTERMEDIATE'
                    ? 'badge-warning'
                    : 'badge-danger'
                }`}
              >
                {exercise.difficulty}
              </span>
              <span className="badge badge-info">{exercise.targetJoint}</span>
            </div>

            <div className="card-actions">
              <Link
                to={`/therapist/exercises/${exercise.id}`}
                className="btn btn-outline btn-sm"
              >
                View Instructions & Telemetry &rarr;
              </Link>
              <Link
                to={ROUTES.THERAPIST.ASSIGN}
                className="btn btn-primary btn-sm"
              >
                Prescribe
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
