import Card from '../../components/Card';

export default function TherapistPatients() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Patient Management</h1>
        <p className="page-subtitle">Monitor patient progress, assign protocols, and manage care plans.</p>
      </div>

      <div className="card-grid">
        <Card title="Patient: John Doe" subtitle="Condition: Post-Op Rotator Cuff Repair">
          <p className="placeholder-text">
            Status: Active &bull; Compliance: 85% &bull; Last Session: Yesterday
          </p>
          <div className="card-actions">
            <button className="btn btn-outline" type="button">View Profile</button>
            <button className="btn btn-primary" type="button">Edit Protocol</button>
          </div>
        </Card>

        <Card title="Patient: Sarah Smith" subtitle="Condition: ACL Reconstruction Rehab">
          <p className="placeholder-text">
            Status: Active &bull; Compliance: 92% &bull; Last Session: 2 days ago
          </p>
          <div className="card-actions">
            <button className="btn btn-outline" type="button">View Profile</button>
            <button className="btn btn-primary" type="button">Edit Protocol</button>
          </div>
        </Card>

        <Card title="Patient: Michael Chen" subtitle="Condition: Lumbar Spine Stabilization">
          <p className="placeholder-text">
            Status: Review Needed &bull; Compliance: 60% &bull; Last Session: 5 days ago
          </p>
          <div className="card-actions">
            <button className="btn btn-outline" type="button">View Profile</button>
            <button className="btn btn-primary" type="button">Edit Protocol</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
