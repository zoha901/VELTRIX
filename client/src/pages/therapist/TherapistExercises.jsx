import Card from '../../components/Card';

export default function TherapistExercises() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Exercise Management & Library</h1>
        <p className="page-subtitle">Configure rehabilitation exercises, movement angles, and target sets.</p>
      </div>

      <div className="card-grid">
        <Card title="Shoulder Abduction & Flexion" subtitle="Category: Upper Body / Shoulder">
          <p className="placeholder-text">
            Target Angle: 0&deg; - 160&deg; &bull; Difficulty: Moderate &bull; Prescribed to 4 patients
          </p>
        </Card>

        <Card title="Quadriceps Strengthening & Knee Extension" subtitle="Category: Lower Body / Knee">
          <p className="placeholder-text">
            Target Angle: 0&deg; - 90&deg; &bull; Difficulty: Beginner &bull; Prescribed to 6 patients
          </p>
        </Card>

        <Card title="Cervical Spine Rotation" subtitle="Category: Neck / Spine">
          <p className="placeholder-text">
            Target Angle: -45&deg; to +45&deg; &bull; Difficulty: Gentle &bull; Prescribed to 2 patients
          </p>
        </Card>
      </div>
    </div>
  );
}
