import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { ROUTES } from '../../utils/constants';

const AVAILABLE_EXERCISES = [
  {
    id: 'ex-101',
    name: 'Seated Knee Extension with Quad Hold',
    category: 'Lower Body',
    targetJoint: 'Knee',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
    defaultFrequency: '2x daily',
    targetAngle: '0° - 90°',
  },
  {
    id: 'ex-102',
    name: 'Shoulder Pendulum & Active-Assisted Circumduction',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldSeconds: 0,
    defaultFrequency: '2x daily',
    targetAngle: '0° - 45°',
  },
  {
    id: 'ex-103',
    name: 'Assisted Shoulder External Rotation with Towel',
    category: 'Upper Body',
    targetJoint: 'Shoulder',
    defaultSets: 3,
    defaultReps: 10,
    defaultHoldSeconds: 5,
    defaultFrequency: '1x daily',
    targetAngle: '0° - 30°',
  },
  {
    id: 'ex-104',
    name: 'Prone Pelvic Tilt & Lumbar Spine Stabilization',
    category: 'Spine / Core',
    targetJoint: 'Spine',
    defaultSets: 3,
    defaultReps: 12,
    defaultHoldSeconds: 8,
    defaultFrequency: '1x daily',
    targetAngle: 'Neutral',
  },
  {
    id: 'ex-105',
    name: 'Ankle Dorsiflexion with Resistance Band',
    category: 'Lower Body',
    targetJoint: 'Ankle',
    defaultSets: 3,
    defaultReps: 15,
    defaultHoldSeconds: 3,
    defaultFrequency: '2x daily',
    targetAngle: '0° - 20°',
  },
];

const PATIENTS = [
  { id: 'pt-101', name: 'John Doe (Post-Op Rotator Cuff Repair - Shoulder)' },
  { id: 'pt-102', name: 'Sarah Smith (ACL Reconstruction Rehab - Knee)' },
  { id: 'pt-103', name: 'Michael Chen (Lumbar Spine Disc Herniation - Spine)' },
  { id: 'pt-104', name: 'Emma Watson (Lateral Ankle Sprain - Ankle)' },
];

export default function TherapistAssignExercise() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [selectedPatientId, setSelectedPatientId] = useState(patientId || 'pt-101');
  const [selectedExerciseId, setSelectedExerciseId] = useState('ex-101');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [holdDuration, setHoldDuration] = useState(5);
  const [frequency, setFrequency] = useState('2x daily');
  const [targetRom, setTargetRom] = useState('0° - 90°');
  const [restSeconds, setRestSeconds] = useState(30);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [therapistNotes, setTherapistNotes] = useState(
    'Keep back straight. Ensure smooth controlled movement with no sudden jerking.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentExercise =
    AVAILABLE_EXERCISES.find((ex) => ex.id === selectedExerciseId) || AVAILABLE_EXERCISES[0];
  const currentPatient = PATIENTS.find((p) => p.id === selectedPatientId) || PATIENTS[0];

  const handleExerciseChange = (e) => {
    const exId = e.target.value;
    setSelectedExerciseId(exId);
    const chosen = AVAILABLE_EXERCISES.find((ex) => ex.id === exId);
    if (chosen) {
      setSets(chosen.defaultSets);
      setReps(chosen.defaultReps);
      setHoldDuration(chosen.defaultHoldSeconds);
      setFrequency(chosen.defaultFrequency);
      setTargetRom(chosen.targetAngle);
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      navigate(`/therapist/patients/${selectedPatientId}/progress`);
    }, 1200);
  };

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link to={ROUTES.THERAPIST.PATIENTS} className="breadcrumb-link">
          &larr; Patients Directory
        </Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Prescribe & Assign Exercise</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">Exercise Prescription Engine</h1>
        <p className="page-subtitle">
          Configure clinical exercise dosage, range of motion targets, and custom rehabilitation instructions.
        </p>
      </div>

      {isSubmitted && (
        <div className="alert-banner alert-success">
          ✅ <strong>Prescription Assigned!</strong> Exercise regimen configured for {currentPatient.name}. Redirecting to Patient Progress...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="prescription-layout-grid">
          {/* Main Parameters Configuration Form */}
          <div className="prescription-form-column">
            {/* Step 1: Patient Selection */}
            <Card title="1. Select Patient Context" subtitle="Target recipient for this rehabilitation protocol">
              <div className="form-group">
                <label className="form-label">Assigned Patient:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="form-select"
                >
                  {PATIENTS.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Step 2: Exercise Selection */}
            <Card title="2. Choose Rehabilitation Exercise" subtitle="Select from VELTRIX Clinical Catalog">
              <div className="form-group">
                <label className="form-label">Exercise Title:</label>
                <select
                  value={selectedExerciseId}
                  onChange={handleExerciseChange}
                  className="form-select"
                >
                  {AVAILABLE_EXERCISES.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.targetJoint} &bull; {ex.category})
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Step 3: Prescription Parameters */}
            <Card title="3. Configure Clinical Dosage Parameters" subtitle="Specify sets, repetitions, hold duration, and schedule">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Target Sets:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reps per Set:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hold Duration (Seconds):</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={holdDuration}
                    onChange={(e) => setHoldDuration(Number(e.target.value))}
                    className="form-input"
                  />
                  <span className="field-hint">Use 0 for continuous fluid repetitions</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Frequency:</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="form-select"
                  >
                    <option value="1x daily">1x daily</option>
                    <option value="2x daily">2x daily (Morning & Evening)</option>
                    <option value="3x daily">3x daily</option>
                    <option value="Every other day">Every other day</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Range of Motion (ROM):</label>
                  <input
                    type="text"
                    value={targetRom}
                    onChange={(e) => setTargetRom(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 0° - 90°"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rest Between Sets (Seconds):</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Schedule Days Picker */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Scheduled Days of Week:</label>
                <div className="day-pills-row">
                  {daysList.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`day-pill ${isSelected ? 'day-pill-active' : ''}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Therapist Guidance Cues */}
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Therapist Clinical Instructions & Form Cues:</label>
                <textarea
                  rows="3"
                  value={therapistNotes}
                  onChange={(e) => setTherapistNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter specific verbal cues, posture cautions, or pain limits..."
                ></textarea>
              </div>
            </Card>
          </div>

          {/* Live Prescription Preview Sidebar */}
          <div className="prescription-preview-column">
            <Card title="Prescription Summary Preview" subtitle="Live clinical dosage verification">
              <div className="preview-summary-box">
                <div className="preview-item">
                  <span className="preview-label">Patient:</span>
                  <span className="preview-value font-bold">{currentPatient.name.split('(')[0]}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Exercise:</span>
                  <span className="preview-value font-bold text-primary">{currentExercise.name}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Target Dosage:</span>
                  <span className="preview-value font-medium">{sets} Sets × {reps} Reps ({holdDuration}s hold)</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Daily Frequency:</span>
                  <span className="preview-value">{frequency}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Target Angle:</span>
                  <span className="preview-value">{targetRom}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Active Days:</span>
                  <span className="preview-value">{selectedDays.join(', ')}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Estimated Routine Duration:</span>
                  <span className="preview-value">~{Math.round((sets * reps * (holdDuration + 3) + (sets - 1) * restSeconds) / 60)} minutes / session</span>
                </div>
              </div>

              <div className="preview-cues-box">
                <span className="preview-label">Clinical Form Cues:</span>
                <p className="preview-cues-text">"{therapistNotes}"</p>
              </div>

              <div className="prescription-actions">
                <button type="submit" className="btn btn-primary btn-block">
                  Prescribe & Assign Exercise &rarr;
                </button>
                <Link
                  to={ROUTES.THERAPIST.PATIENTS}
                  className="btn btn-outline btn-block"
                >
                  Cancel
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
