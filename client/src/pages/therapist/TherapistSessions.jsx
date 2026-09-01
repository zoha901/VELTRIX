import Card from '../../components/Card';

export default function TherapistSessions() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Clinical Sessions</h1>
        <p className="page-subtitle">Schedule, track, and review rehabilitation sessions.</p>
      </div>

      <div className="card-grid">
        <Card title="Upcoming Session: John Doe" subtitle="Today at 10:30 AM &bull; Video & Progress Review">
          <p className="placeholder-text">
            Goal: Assess shoulder range of motion progression after 2 weeks of prescribed routine.
          </p>
          <div className="card-actions">
            <button className="btn btn-primary" type="button">Start Session</button>
            <button className="btn btn-outline" type="button">Reschedule</button>
          </div>
        </Card>

        <Card title="Upcoming Session: Sarah Smith" subtitle="Tomorrow at 2:00 PM &bull; Gait & Knee Stability">
          <p className="placeholder-text">
            Goal: Evaluate knee extension and prescribe next phase of resistance exercises.
          </p>
          <div className="card-actions">
            <button className="btn btn-secondary" type="button">View Notes</button>
            <button className="btn btn-outline" type="button">Reschedule</button>
          </div>
        </Card>

        <Card title="Recent Session Log: Michael Chen" subtitle="Completed Yesterday &bull; Duration: 40 min">
          <p className="placeholder-text">
            Summary: Completed core stability evaluation. Prescribed new pelvic tilt routine.
          </p>
        </Card>
      </div>
    </div>
  );
}
