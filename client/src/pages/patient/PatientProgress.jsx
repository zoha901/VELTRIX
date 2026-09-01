import Card from '../../components/Card';

export default function PatientProgress() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Recovery Progress</h1>
        <p className="page-subtitle">Track your rehabilitation journey, adherence, and mobility trends.</p>
      </div>

      <div className="card-grid">
        <Card title="Adherence & Completion Rate" subtitle="Weekly Consistency">
          <p className="placeholder-text">
            Placeholder for adherence metrics and completed rehabilitation sessions.
          </p>
        </Card>

        <Card title="Range of Motion (ROM) Improvement" subtitle="Joint Mobility Angle">
          <p className="placeholder-text">
            Placeholder for mobility angle progression graphs (Recharts integration placeholder).
          </p>
        </Card>

        <Card title="Session History" subtitle="Past recordings and feedback">
          <p className="placeholder-text">
            Placeholder for historical session logs, duration, and therapist reviews.
          </p>
        </Card>
      </div>
    </div>
  );
}
