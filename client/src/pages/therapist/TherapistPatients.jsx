import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

export default function TherapistPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jointFilter, setJointFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const patients = [
    {
      id: 'pt_404',
      name: 'John Doe',
      age: 36,
      gender: 'Male',
      initials: 'JD',
      diagnosis: 'Post-Op ACL Reconstruction',
      joint: 'Knee',
      phase: 'Phase 2: Strength & ROM',
      exercisesCount: 3,
      adherence: 88.5,
      lastPain: 3,
      lastActive: 'Today, 09:15 AM',
      status: 'Active',
    },
    {
      id: 'pt_405',
      name: 'Sarah Smith',
      age: 29,
      gender: 'Female',
      initials: 'SS',
      diagnosis: 'Rotator Cuff Tendinopathy',
      joint: 'Shoulder',
      phase: 'Phase 1: Mobility & Pain Relief',
      exercisesCount: 2,
      adherence: 94.0,
      lastPain: 2,
      lastActive: 'Today, 08:30 AM',
      status: 'Active',
    },
    {
      id: 'pt_406',
      name: 'Michael Chen',
      age: 45,
      gender: 'Male',
      initials: 'MC',
      diagnosis: 'Lumbar Disc Herniation (L4-L5)',
      joint: 'Spine',
      phase: 'Phase 2: Core Stabilization',
      exercisesCount: 4,
      adherence: 58.0,
      lastPain: 7,
      lastActive: '3 days ago',
      status: 'Attention Needed',
    },
    {
      id: 'pt_407',
      name: 'Robert Wilson',
      age: 52,
      gender: 'Male',
      initials: 'RW',
      diagnosis: 'Total Knee Arthroplasty',
      joint: 'Knee',
      phase: 'Phase 3: Functional Loading',
      exercisesCount: 3,
      adherence: 82.0,
      lastPain: 4,
      lastActive: 'Yesterday',
      status: 'Active',
    },
    {
      id: 'pt_408',
      name: 'Emily Davis',
      age: 31,
      gender: 'Female',
      initials: 'ED',
      diagnosis: 'Subacromial Impingement',
      joint: 'Shoulder',
      phase: 'Phase 2: Scapular Strengthening',
      exercisesCount: 3,
      adherence: 76.5,
      lastPain: 6,
      lastActive: 'Yesterday',
      status: 'Attention Needed',
    },
  ];

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJoint = jointFilter === 'All' || p.joint === jointFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesJoint && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Patient Caseload Directory</h1>
          <p className="page-subtitle">
            Manage assigned rehabilitation patients, review adherence curves, and update clinical protocols.
          </p>
        </div>
        <div>
          <span className="badge badge-primary">{filteredPatients.length} Patients Active</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="filter-card">
        <div className="filter-bar-grid">
          <div className="filter-item search-item">
            <label htmlFor="patient-search">Search Directory</label>
            <input
              id="patient-search"
              type="text"
              className="form-input"
              placeholder="Search by patient name, diagnosis, or MRN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-item">
            <label htmlFor="joint-select">Target Joint</label>
            <select
              id="joint-select"
              className="form-input"
              value={jointFilter}
              onChange={(e) => setJointFilter(e.target.value)}
            >
              <option value="All">All Joints</option>
              <option value="Knee">Knee</option>
              <option value="Shoulder">Shoulder</option>
              <option value="Spine">Spine</option>
            </select>
          </div>
          <div className="filter-item">
            <label htmlFor="status-select">Clinical Status</label>
            <select
              id="status-select"
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Attention Needed">Attention Needed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patient Cards Grid */}
      <div className="patient-cards-grid">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="patient-card-item">
            <div className="patient-card-top">
              <div className="patient-card-avatar">{patient.initials}</div>
              <div className="patient-card-heading">
                <div className="patient-name-line">
                  <Link to={`/therapist/patients/${patient.id}`} className="patient-name-link">
                    {patient.name}
                  </Link>
                  <span
                    className={`badge ${
                      patient.status === 'Attention Needed' ? 'badge-danger' : 'badge-success'
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <p className="patient-card-sub">{patient.age} yrs • {patient.gender}</p>
              </div>
            </div>

            <div className="patient-card-body">
              <div className="patient-detail-line">
                <span className="detail-label">Diagnosis:</span>
                <span className="detail-value">{patient.diagnosis}</span>
              </div>
              <div className="patient-detail-line">
                <span className="detail-label">Joint / Phase:</span>
                <span className="detail-value">{patient.joint} &bull; {patient.phase}</span>
              </div>
              <div className="patient-detail-line">
                <span className="detail-label">Last Active:</span>
                <span className="detail-value">{patient.lastActive}</span>
              </div>

              <div className="adherence-section">
                <div className="adherence-header">
                  <span className="detail-label">Adherence Rate</span>
                  <span className={`font-semibold ${patient.adherence >= 80 ? 'text-success' : 'text-danger'}`}>
                    {patient.adherence}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${
                      patient.adherence >= 80 ? 'progress-fill-success' : 'progress-fill-danger'
                    }`}
                    style={{ width: `${patient.adherence}%` }}
                  />
                </div>
              </div>

              <div className="patient-detail-line" style={{ marginTop: '0.5rem' }}>
                <span className="detail-label">Latest Pain Score:</span>
                <span
                  className={`badge ${
                    patient.lastPain > 5 ? 'badge-danger' : patient.lastPain > 3 ? 'badge-warning' : 'badge-neutral'
                  }`}
                >
                  {patient.lastPain} / 10
                </span>
              </div>
            </div>

            <div className="patient-card-footer">
              <Link to={`/therapist/patients/${patient.id}`} className="btn btn-primary btn-sm btn-block">
                View Profile & Progress &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
