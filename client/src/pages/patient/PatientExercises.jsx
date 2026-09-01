import Card from '../../components/Card';

export default function PatientExercises() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Prescribed Exercises</h1>
        <p className="page-subtitle">Your active therapy exercises prescribed by your therapist.</p>
      </div>

      <div className="card-grid">
        <Card title="Shoulder Flexion & Extension" subtitle="Prescribed: 3 sets &bull; 10 reps">
          <p className="placeholder-text">
            Placeholder for exercise guidance instructions, target range of motion, and practice module.
          </p>
        </Card>

        <Card title="Knee Extension Therapy" subtitle="Prescribed: 2 sets &bull; 15 reps">
          <p className="placeholder-text">
            Placeholder for exercise guidance instructions, target range of motion, and practice module.
          </p>
        </Card>

        <Card title="Cervical Spine Rotation" subtitle="Prescribed: 3 sets &bull; 8 reps">
          <p className="placeholder-text">
            Placeholder for exercise guidance instructions, target range of motion, and practice module.
          </p>
        </Card>
      </div>
    </div>
  );
}
