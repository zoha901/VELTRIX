import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

export default function TherapistExerciseDetails() {
  const { exerciseId = 'ex-101' } = useParams();

  const exercise = {
    id: exerciseId,
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body / Knee Rehabilitation',
    targetJoint: 'Knee',
    movementType: 'Strength & Range of Motion',
    difficulty: 'BEGINNER',
    targetAngle: '0° (Full Extension) to 90° (Flexion)',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
    defaultRestSeconds: 30,
    description:
      'A fundamental open-kinetic chain rehabilitation exercise designed to isolate and strengthen the quadriceps femoris group, particularly the vastus medialis oblique (VMO), crucial for patellar tracking and post-operative knee recovery.',
    anatomicalFocus: 'Quadriceps (Rectus Femoris, Vastus Medialis, Vastus Lateralis), Patellar Tendon',
    instructions: [
      'Sit tall in a sturdy chair with your back flat against the backrest and knees bent at 90 degrees.',
      'Slowly straighten your surgical/target knee until the leg is fully extended parallel to the floor.',
      'Hold the knee locked in full extension for 5 seconds, actively squeezing the front thigh muscles.',
      'Slowly lower the leg back to the starting 90-degree position over a controlled 3-second duration.',
      'Maintain an upright torso without leaning back or shifting pelvis during the movement.',
    ],
    aiCheckpoints: [
      'Monitors hip-to-knee-to-ankle angle in sagittal plane from 90° flexion to 0° full extension.',
      'Detects pelvic backward tilt or compensatory trunk extension during peak hold.',
      'Evaluates hold duration consistency at terminal extension (minimum 5.0 seconds).',
    ],
    contraindications: [
      'Acute patellofemoral pain syndrome during terminal 30 degrees of extension.',
      'Unrepaired patellar tendon rupture or acute graft fixation laxity.',
    ],
  };

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link to={ROUTES.THERAPIST.EXERCISES} className="breadcrumb-link">
          &larr; Back to Exercise Library
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{exercise.name}</span>
      </div>

      {/* Header */}
      <div className="patient-header-banner">
        <div>
          <div className="patient-title-row">
            <h1 className="patient-name-heading">{exercise.name}</h1>
            <span className="badge badge-success">{exercise.difficulty}</span>
            <span className="badge badge-info">{exercise.targetJoint}</span>
          </div>
          <p className="patient-subtitle-meta">
            {exercise.category} &bull; Movement Type: {exercise.movementType}
          </p>
        </div>

        <div className="patient-header-actions">
          <Link to={ROUTES.THERAPIST.ASSIGN} className="btn btn-primary">
            + Prescribe to Patient
          </Link>
          <Link to={ROUTES.THERAPIST.EXERCISES} className="btn btn-outline">
            Library Catalog
          </Link>
        </div>
      </div>

      {/* Exercise Details Grid */}
      <div className="card-grid">
        {/* Anatomical & Clinical Overview */}
        <Card title="Clinical Overview" subtitle="Anatomical targets and therapeutic goals">
          <p className="placeholder-text">{exercise.description}</p>

          <div className="info-list" style={{ marginTop: '1rem' }}>
            <div className="info-item">
              <span className="info-label">Target Joint:</span>
              <span className="info-value font-bold">{exercise.targetJoint}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Anatomical Focus:</span>
              <span className="info-value">{exercise.anatomicalFocus}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Target Angle Range:</span>
              <span className="info-value font-bold text-primary">{exercise.targetAngle}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Default Protocol:</span>
              <span className="info-value">
                {exercise.defaultSets} Sets × {exercise.defaultReps} Reps ({exercise.defaultHoldSeconds}s hold)
              </span>
            </div>
          </div>
        </Card>

        {/* AI Landmark Tracking Checkpoints */}
        <Card title="AI Posture Tracking Landmarks" subtitle="Automated computer vision checkpoints">
          <div className="ai-feedback-banner" style={{ marginBottom: '1rem' }}>
            <div className="ai-feedback-icon">👁️</div>
            <div>
              <span className="font-bold text-sm">Computer Vision Guidance:</span>
              <p className="ai-feedback-text">
                VELTRIX pose-tracking monitors joint angles to measure range of motion and identify common compensatory movements.
              </p>
            </div>
          </div>

          <ul className="checkpoints-list">
            {exercise.aiCheckpoints.map((cp, idx) => (
              <li key={idx} className="checkpoint-item">
                <span className="checkpoint-icon">🎯</span>
                <span>{cp}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Execution Instructions */}
      <Card title="Patient Execution Instructions" subtitle="Step-by-step guidance provided to patients">
        <ol className="instructions-list">
          {exercise.instructions.map((step, idx) => (
            <li key={idx} className="instruction-step">
              <span className="step-num">{idx + 1}</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Contraindications */}
      <Card title="Contraindications & Clinical Cautions" subtitle="Conditions requiring exercise modification">
        <ul className="contraindications-list">
          {exercise.contraindications.map((ci, idx) => (
            <li key={idx} className="contraindication-item">
              <span className="ci-icon">⚠️</span>
              <span>{ci}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
