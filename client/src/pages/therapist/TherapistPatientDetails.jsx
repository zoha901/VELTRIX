import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

export default function TherapistPatientDetails() {
  const { patientId = 'pt-101' } = useParams();

  // Mock patient detailed data aligned with DATABASE-CONTRACT.md and API-CONTRACT.md
  const patient = {
    id: patientId,
    name: patientId === 'pt-102' ? 'Sarah Smith' : patientId === 'pt-103' ? 'Michael Chen' : 'John Doe',
    email: 'patient@example.com',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    primaryDiagnosis: 'Post-Op Rotator Cuff Repair (Right Shoulder)',
    targetJoint: 'Shoulder',
    surgicalDate: '2026-07-15',
    startDate: '2026-08-01',
    currentPhase: 'Phase II: Active-Assisted Range of Motion',
    assignedTherapist: 'Dr. Sarah Jenkins, PT, DPT',
    adherenceRate: 88,
    lastPainScore: 3,
    assignedExercises: [
      {
        id: 'asg-1',
        exerciseId: 'ex-101',
        name: 'Shoulder Pendulum & Circumduction',
        targetSets: 3,
        targetReps: 15,
        targetHoldSeconds: 0,
        frequency: '2x daily',
        targetRom: '0° - 45°',
        status: 'active',
        dueDate: '2026-09-30',
        therapistNotes: 'Allow arm to hang naturally; use gentle torso momentum.',
      },
      {
        id: 'asg-2',
        exerciseId: 'ex-102',
        name: 'Assisted Shoulder External Rotation with Towel',
        targetSets: 3,
        targetReps: 10,
        targetHoldSeconds: 5,
        frequency: '1x daily',
        targetRom: '0° - 30°',
        status: 'active',
        dueDate: '2026-09-30',
        therapistNotes: 'Keep elbow tucked close to ribcage throughout motion.',
      },
      {
        id: 'asg-3',
        exerciseId: 'ex-103',
        name: 'Scapular Retraction & Setting',
        targetSets: 3,
        targetReps: 12,
        targetHoldSeconds: 5,
        frequency: '2x daily',
        targetRom: 'Neutral',
        status: 'active',
        dueDate: '2026-09-30',
        therapistNotes: 'Squeeze shoulder blades gently down and back. Avoid shrugging.',
      },
    ],
    therapistNotes: [
      {
        id: 'note-1',
        author: 'Dr. Sarah Jenkins, PT, DPT',
        date: '2026-08-28',
        category: 'Clinical Assessment',
        content: 'Patient showed 15-degree passive forward flexion improvement. Tolerating Phase II active-assisted exercises well with mild post-routine soreness (2/10).',
        isPatientVisible: true,
      },
      {
        id: 'note-2',
        author: 'Dr. Sarah Jenkins, PT, DPT',
        date: '2026-08-15',
        category: 'Plan Modification',
        content: 'Initiated towel-assisted external rotation. Emphasized maintaining strict elbow flexion to prevent anterior capsule strain.',
        isPatientVisible: false,
      },
    ],
  };

  return (
    <div className="page-container">
      {/* Breadcrumbs & Title */}
      <div className="breadcrumb-bar">
        <Link to={ROUTES.THERAPIST.PATIENTS} className="breadcrumb-link">
          &larr; Back to Patient Directory
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{patient.name}</span>
      </div>

      {/* Patient Profile Header Card */}
      <div className="patient-header-banner">
        <div className="patient-avatar-box">
          <div className="patient-avatar-placeholder">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="patient-title-row">
              <h1 className="patient-name-heading">{patient.name}</h1>
              <span className="badge badge-success">Active Protocol</span>
            </div>
            <p className="patient-subtitle-meta">
              ID: {patient.id} &bull; {patient.age} yrs &bull; {patient.gender} &bull; {patient.primaryDiagnosis}
            </p>
          </div>
        </div>

        <div className="patient-header-actions">
          <Link
            to={`/therapist/patients/${patient.id}/assign`}
            className="btn btn-primary"
          >
            + Assign Exercise
          </Link>
          <Link
            to={`/therapist/patients/${patient.id}/progress`}
            className="btn btn-secondary"
          >
            View Progress & Telemetry
          </Link>
          <Link
            to={`/therapist/patients/${patient.id}/notes`}
            className="btn btn-outline"
          >
            Clinical Notes ({patient.therapistNotes.length})
          </Link>
        </div>
      </div>

      {/* Demographics & Clinical Summary Grid */}
      <div className="card-grid">
        <Card title="Clinical Summary" subtitle="Rehabilitation protocol parameters">
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Primary Diagnosis:</span>
              <span className="info-value font-medium">{patient.primaryDiagnosis}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Target Joint:</span>
              <span className="info-value">{patient.targetJoint}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Protocol Phase:</span>
              <span className="info-value text-secondary font-medium">{patient.currentPhase}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Surgery / Onset Date:</span>
              <span className="info-value">{patient.surgicalDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rehab Start Date:</span>
              <span className="info-value">{patient.startDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Lead Clinician:</span>
              <span className="info-value">{patient.assignedTherapist}</span>
            </div>
          </div>
        </Card>

        <Card title="Compliance & Pain Status" subtitle="Longitudinal patient metrics">
          <div className="stat-summary-box">
            <div className="stat-row">
              <div>
                <span className="stat-title">Overall Adherence</span>
                <div className="stat-big-number text-primary">{patient.adherenceRate}%</div>
              </div>
              <div>
                <span className="stat-title">Last Reported Pain</span>
                <div className="stat-big-number" style={{ color: '#10b981' }}>{patient.lastPainScore} / 10</div>
              </div>
            </div>

            <div className="progress-bar-bg" style={{ marginTop: '1rem' }}>
              <div
                className="progress-bar-fill fill-green"
                style={{ width: `${patient.adherenceRate}%` }}
              ></div>
            </div>
            <p className="placeholder-text" style={{ marginTop: '0.75rem' }}>
              Patient has completed 22 of 25 prescribed exercise sets this week with no acute adverse events logged.
            </p>
          </div>
        </Card>
      </div>

      {/* Active Prescribed Exercises Section */}
      <Card
        title="Active Prescribed Rehabilitation Plan"
        subtitle={`Embedded assignedExercises[] (${patient.assignedExercises.length} active prescriptions)`}
      >
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Target Sets × Reps</th>
                <th>Hold Duration</th>
                <th>Daily Frequency</th>
                <th>Target ROM</th>
                <th>Clinical Guidance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {patient.assignedExercises.map((asg) => (
                <tr key={asg.id}>
                  <td>
                    <Link
                      to={`/therapist/exercises/${asg.exerciseId}`}
                      className="table-link font-bold"
                    >
                      {asg.name}
                    </Link>
                  </td>
                  <td>{asg.targetSets} Sets × {asg.targetReps} Reps</td>
                  <td>{asg.targetHoldSeconds ? `${asg.targetHoldSeconds}s hold` : 'Fluid motion'}</td>
                  <td>{asg.frequency}</td>
                  <td>{asg.targetRom}</td>
                  <td className="text-muted text-sm">{asg.therapistNotes}</td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Clinical Notes Snapshot */}
      <Card
        title="Latest Clinical Notes"
        subtitle="Recent clinical documentation and progress records"
      >
        <div className="notes-feed-snapshot">
          {patient.therapistNotes.map((note) => (
            <div key={note.id} className="note-card-mini">
              <div className="note-mini-header">
                <span className="badge badge-info">{note.category}</span>
                <span className="text-muted text-sm">{note.date} &bull; {note.author}</span>
                {note.isPatientVisible ? (
                  <span className="badge badge-success">Visible to Patient</span>
                ) : (
                  <span className="badge badge-secondary">Clinician Only</span>
                )}
              </div>
              <p className="note-mini-body">{note.content}</p>
            </div>
          ))}
        </div>
        <div className="card-actions" style={{ marginTop: '1rem' }}>
          <Link to={`/therapist/patients/${patient.id}/notes`} className="btn btn-outline btn-sm">
            Manage All Notes &rarr;
          </Link>
        </div>
      </Card>
    </div>
  );
}
