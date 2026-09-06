import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import TherapistLayout from './layouts/TherapistLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientExercises from './pages/patient/PatientExercises';
import PatientProgress from './pages/patient/PatientProgress';

// Therapist Pages
import TherapistDashboard from './pages/therapist/TherapistDashboard';
import TherapistPatients from './pages/therapist/TherapistPatients';
import TherapistPatientDetails from './pages/therapist/TherapistPatientDetails';
import TherapistExercises from './pages/therapist/TherapistExercises';
import TherapistExerciseDetails from './pages/therapist/TherapistExerciseDetails';
import TherapistAssignExercise from './pages/therapist/TherapistAssignExercise';
import TherapistPatientProgress from './pages/therapist/TherapistPatientProgress';
import TherapistNotes from './pages/therapist/TherapistNotes';
import TherapistSessions from './pages/therapist/TherapistSessions';

// Styles
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      {/* ================= PATIENT ================= */}
      <Route element={<ProtectedRoute allowedRole="PATIENT" />}>
        <Route path="/patient" element={<PatientLayout />}>
          <Route
            index
            element={<Navigate to="/patient/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<PatientDashboard />}
          />

          <Route
            path="exercises"
            element={<PatientExercises />}
          />

          <Route
            path="progress"
            element={<PatientProgress />}
          />
        </Route>
      </Route>

      {/* ================= THERAPIST ================= */}
      <Route element={<ProtectedRoute allowedRole="THERAPIST" />}>
        <Route path="/therapist" element={<TherapistLayout />}>

          <Route
            index
            element={<Navigate to="/therapist/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<TherapistDashboard />}
          />

          <Route
            path="patients"
            element={<TherapistPatients />}
          />

          <Route
            path="patients/:patientId"
            element={<TherapistPatientDetails />}
          />

          <Route
            path="patients/:patientId/assign"
            element={<TherapistAssignExercise />}
          />

          <Route
            path="patients/:patientId/progress"
            element={<TherapistPatientProgress />}
          />

          <Route
            path="patients/:patientId/notes"
            element={<TherapistNotes />}
          />

          <Route
            path="exercises"
            element={<TherapistExercises />}
          />

          <Route
            path="exercises/:exerciseId"
            element={<TherapistExerciseDetails />}
          />

          <Route
            path="sessions"
            element={<TherapistSessions />}
          />

        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;