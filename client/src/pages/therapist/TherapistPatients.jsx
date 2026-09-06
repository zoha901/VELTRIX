import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const PATIENTS_DATA = [
  {
    id: 'pt-101',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    primaryDiagnosis: 'Post-Op Rotator Cuff Repair (Right Shoulder)',
    targetJoint: 'Shoulder',
    status: 'ACTIVE',
    adherenceRate: 88,
    activeAssignmentsCount: 3,
    lastPainScore: 3,
    lastSessionDate: 'Today, 09:45 AM',
    phase: 'Phase II: Active-Assisted ROM',
  },
  {
    id: 'pt-102',
    name: 'Sarah Smith',
    age: 28,
    gender: 'Female',
    primaryDiagnosis: 'ACL Reconstruction Rehab (Left Knee)',
    targetJoint: 'Knee',
    status: 'ATTENTION_NEEDED',
    adherenceRate: 92,
    activeAssignmentsCount: 4,
    lastPainScore: 7,
    lastSessionDate: 'Today, 08:30 AM',
    phase: 'Phase III: Functional Strengthening',
  },
  {
    id: 'pt-103',
    name: 'Michael Chen',
    age: 52,
    gender: 'Male',
    primaryDiagnosis: 'Lumbar Spine Disc Herniation & Stabilization',
    targetJoint: 'Spine',
    status: 'ATTENTION_NEEDED',
    adherenceRate: 58,
    activeAssignmentsCount: 2,
    lastPainScore: 5,
    lastSessionDate: '3 days ago',
    phase: 'Phase I: Core Activation',
  },
  {
    id: 'pt-104',
    name: 'Emma Watson',
    age: 34,
    gender: 'Female',
    primaryDiagnosis: 'Lateral Ankle Sprain & Chronic Instability',
    targetJoint: 'Ankle',
    status: 'ACTIVE',
    adherenceRate: 96,
    activeAssignmentsCount: 3,
    lastPainScore: 1,
    lastSessionDate: 'Yesterday, 04:15 PM',
    phase: 'Phase IV: Proprioceptive & Agility',
  },
  {
    id: 'pt-105',
    name: 'David Miller',
    age: 61,
    gender: 'Male',
    primaryDiagnosis: 'Cervical Spondylosis & Postural Syndrome',
    targetJoint: 'Spine',
    status: 'ACTIVE',
    adherenceRate: 75,
    activeAssignmentsCount: 2,
    lastPainScore: 4,
    lastSessionDate: 'Yesterday, 02:00 PM',
    phase: 'Phase II: Postural Correction',
  },
  {
    id: 'pt-106',
    name: 'Elena Rostova',
    age: 39,
    gender: 'Female',
    primaryDiagnosis: 'Total Hip Arthroplasty (Right Hip Post-Op)',
    targetJoint: 'Hip',
    status: 'ACTIVE',
    adherenceRate: 84,
    activeAssignmentsCount: 3,
    lastPainScore: 2,
    lastSessionDate: '2 days ago',
    phase: 'Phase II: Gait & Weight-Bearing',
  },
];

export default function TherapistPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [jointFilter, setJointFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NAME');

  const filteredPatients = useMemo(() => {
    return PATIENTS_DATA.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesJoint = jointFilter === 'ALL' || p.targetJoint === jointFilter;
      return matchesSearch && matchesStatus && matchesJoint;
    }).sort((a, b) => {
      if (sortBy === 'NAME') return a.name.localeCompare(b.name);
      if (sortBy === 'ADHERENCE') return b.adherenceRate - a.adherenceRate;
      if (sortBy === 'PAIN') return (b.lastPainScore || 0) - (a.lastPainScore || 0);
      return 0;
    });
  }, [searchTerm, statusFilter, jointFilter, sortBy]);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Patient Management Directory</h1>
          <p className="page-subtitle">
            Clinical caseload monitoring, protocol assignments, and rehabilitation progress.
          </p>
        </div>
        <div className="header-actions">
          <Link to={ROUTES.THERAPIST.ASSIGN} className="btn btn-primary">
            + Prescribe Exercise Plan
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-panel">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by patient name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">All Clinical Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ATTENTION_NEEDED">Attention Needed</option>
          </select>

          <select
            value={jointFilter}
            onChange={(e) => setJointFilter(e.target.value)}
            className="form-select"
          >
            <option value="ALL">All Target Joints</option>
            <option value="Knee">Knee</option>
            <option value="Shoulder">Shoulder</option>
            <option value="Spine">Spine</option>
            <option value="Ankle">Ankle</option>
            <option value="Hip">Hip</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="NAME">Sort by Name (A-Z)</option>
            <option value="ADHERENCE">Sort by Adherence (High-Low)</option>
            <option value="PAIN">Sort by Pain Score (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Patient Count Summary */}
      <div className="results-count-bar">
        <span>Showing {filteredPatients.length} of {PATIENTS_DATA.length} assigned patients</span>
      </div>

      {/* Patient Cards Grid */}
      <div className="card-grid">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            title={patient.name}
            subtitle={`${patient.age} yrs • ${patient.gender} • ${patient.targetJoint}`}
            className="patient-summary-card"
          >
            <div className="patient-card-details">
              <div className="detail-row">
                <span className="detail-label">Diagnosis:</span>
                <span className="detail-val font-medium">{patient.primaryDiagnosis}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Care Phase:</span>
                <span className="detail-val text-secondary font-medium">{patient.phase}</span>
              </div>

              {/* Adherence Progress Bar */}
              <div className="adherence-section">
                <div className="adherence-header">
                  <span className="detail-label">Adherence Rate:</span>
                  <span className="font-bold">{patient.adherenceRate}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${patient.adherenceRate >= 80 ? 'fill-green' : patient.adherenceRate >= 60 ? 'fill-yellow' : 'fill-red'}`}
                    style={{ width: `${patient.adherenceRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="metrics-pill-row">
                <span className={`badge ${patient.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                  {patient.status === 'ACTIVE' ? 'Active Case' : 'Attention Needed'}
                </span>
                <span className={`pain-badge pain-${patient.lastPainScore <= 3 ? 'low' : patient.lastPainScore <= 6 ? 'med' : 'high'}`}>
                  Pain: {patient.lastPainScore}/10
                </span>
                <span className="badge badge-info">
                  {patient.activeAssignmentsCount} Prescribed Exercises
                </span>
              </div>

              <div className="last-active-text">
                Last synchronized session: <strong>{patient.lastSessionDate}</strong>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="card-actions flex-wrap">
              <Link
                to={`/therapist/patients/${patient.id}`}
                className="btn btn-outline btn-sm"
              >
                Profile & Details
              </Link>
              <Link
                to={`/therapist/patients/${patient.id}/assign`}
                className="btn btn-secondary btn-sm"
              >
                Assign Exercise
              </Link>
              <Link
                to={`/therapist/patients/${patient.id}/progress`}
                className="btn btn-primary btn-sm"
              >
                Progress & Telemetry
              </Link>
              <Link
                to={`/therapist/patients/${patient.id}/notes`}
                className="btn btn-outline btn-sm"
              >
                Clinical Notes
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="empty-state-card">
          <div className="empty-icon">🔎</div>
          <h3>No patients matching filters</h3>
          <p>Try resetting the search terms or body region filters.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setJointFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
