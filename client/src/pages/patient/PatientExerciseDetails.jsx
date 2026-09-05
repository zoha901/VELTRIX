import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const EXERCISE_DATA = {
  'ex-101': {
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
    restSeconds: 45,
    description: 'Active knee extension designed to isolate the vastus medialis oblique and restore full extension kinematics.',
    instructions: [
      'Sit upright on a sturdy chair with your back supported and feet flat on the floor.',
      'Slowly straighten your surgical/affected knee, lifting your foot until your leg is almost straight.',
      'Squeeze the thigh muscle (quadriceps) firmly at the top for the prescribed hold duration.',
      'Slowly lower your foot back to the starting position under control.',
    ],
    precautions: [
      'Do not swing or kick your leg up rapidly.',
      'Do not arch your lower back during the extension phase.',
      'Stop if you experience sharp or grinding anterior knee pain exceeding 4/10.',
    ],
  },
  'ex-102': {
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
    restSeconds: 30,
    description: 'Gentle passive pendular oscillations to decompress the subacromial space post-rotator cuff surgery.',
    instructions: [
      'Lean forward slightly and support your non-affected arm on a sturdy table or chair.',
      'Let your affected arm hang freely down towards the floor like a pendulum.',
      'Gently sway your body to initiate small, smooth clockwise circles with your arm.',
      'Perform the prescribed reps clockwise, then reverse to counter-clockwise.',
    ],
    precautions: [
      'Do not actively lift your arm using your shoulder muscles; allow gravity and body momentum to move the limb.',
      'Keep your shoulder relaxed throughout.',
    ],
  },
  'ex-103': {
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
    restSeconds: 45,
    description: 'Towel-supported external rotation to gently mobilize the anterior capsule while stabilizing scapular position.',
    instructions: [
      'Place a rolled towel between your elbow and your ribcage.',
      'Bend your elbow to 90 degrees with your forearm across your stomach.',
      'Slowly rotate your forearm outward away from your body while keeping the towel pinned against your side.',
      'Hold at the end range of comfortable motion, then return slowly.',
    ],
    precautions: [
      'Do not allow the towel roll to drop.',
      'Keep your shoulder blade retracted and depressed.',
    ],
  },
  'ex-104': {
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
    restSeconds: 45,
    description: 'Core activation drill targeting transverse abdominis and multifidus co-contraction.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Gently flatten your lower back against the floor by tightening your abdominal muscles.',
      'Hold the contraction while breathing normally.',
      'Relax back to the neutral spine position.',
    ],
    precautions: [
      'Do not hold your breath during the hold.',
      'Do not push down aggressively with your leg muscles.',
    ],
  },
};

export default function PatientExerciseDetails() {
  const { exerciseId } = useParams();
  const exercise = EXERCISE_DATA[exerciseId] || EXERCISE_DATA['ex-101'];

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
        <span className="breadcrumb-current">{exercise.name}</span>
      </div>

      {/* Header Banner */}
      <div className="patient-header-banner">
        <div>
          <div className="patient-title-row">
            <h1 className="patient-name-heading">{exercise.name}</h1>
            <span className="badge badge-info">{exercise.difficulty}</span>
          </div>
          <p className="patient-subtitle-meta">
            {exercise.category} &bull; Target Joint: {exercise.targetJoint} &bull; Type: {exercise.movementType}
          </p>
        </div>
        <div className="patient-header-actions">
          <Link
            to={`/patient/exercises/${exercise.id}/guided`}
            className="btn btn-primary"
          >
            ▶️ Begin Guided Exercise
          </Link>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="prescription-layout-grid">
        <div className="prescription-form-column">
          {/* Step-by-Step Instructions */}
          <Card title="Step-by-Step Movement Instructions" subtitle="Follow the clinical execution cues">
            <ol className="instructions-list">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="instruction-step">
                  <span className="step-num">{idx + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* Safety & Precautions */}
          <Card title="Clinical Safety Precautions" subtitle="Important contraindications and safety notes">
            <ul className="contraindications-list">
              {exercise.precautions.map((precaution, idx) => (
                <li key={idx} className="contraindication-item">
                  <span>⚠️</span>
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Prescription Summary Sidebar */}
        <div>
          <Card title="Prescription Parameters" subtitle="Assigned targets for this routine">
            <div className="preview-summary-box">
              <div className="preview-item">
                <span className="text-muted">Target Sets:</span>
                <span className="font-bold">{exercise.prescribedSets} Sets</span>
              </div>
              <div className="preview-item">
                <span className="text-muted">Target Reps:</span>
                <span className="font-bold">{exercise.prescribedReps} Reps / set</span>
              </div>
              {exercise.holdSeconds > 0 && (
                <div className="preview-item">
                  <span className="text-muted">Isometric Hold:</span>
                  <span className="font-bold">{exercise.holdSeconds} seconds</span>
                </div>
              )}
              <div className="preview-item">
                <span className="text-muted">Target ROM:</span>
                <span className="font-bold">{exercise.targetAngle}</span>
              </div>
              <div className="preview-item">
                <span className="text-muted">Rest Between Sets:</span>
                <span className="font-bold">{exercise.restSeconds} seconds</span>
              </div>
            </div>

            <div className="preview-cues-box">
              <strong>Clinical Note:</strong>
              <p className="preview-cues-text">
                &ldquo;Perform movements slowly and do not rush through the repetitions.&rdquo;
              </p>
            </div>

            <div className="prescription-actions">
              <Link
                to={`/patient/exercises/${exercise.id}/guided`}
                className="btn btn-primary btn-block"
              >
                Start Guided Exercise
              </Link>
              <Link
                to={ROUTES.PATIENT.EXERCISES}
                className="btn btn-outline btn-block"
              >
                Back to Exercise List
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
