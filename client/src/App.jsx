import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import TherapistLayout from './layouts/TherapistLayout';

// Authentication
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientExercises from './pages/patient/PatientExercises';
import PatientProgress from './pages/patient/PatientProgress';

// Therapist Pages
import TherapistDashboard from './pages/therapist/TherapistDashboard';
import TherapistPatients from './pages/therapist/TherapistPatients';
import TherapistPatientDetails from './pages/therapist/TherapistPatientDetails';
import TherapistAssignExercise from './pages/therapist/TherapistAssignExercise';
import TherapistPatientProgress from './pages/therapist/TherapistPatientProgress';
import TherapistNotes from './pages/therapist/TherapistNotes';
import TherapistExercises from './pages/therapist/TherapistExercises';
import TherapistExerciseDetails from './pages/therapist/TherapistExerciseDetails';
import TherapistSessions from './pages/therapist/TherapistSessions';

// Styles
import './App.css';

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Patient Portal */}
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

      {/* Therapist Portal */}
      <Route
        element={<ProtectedRoute requiredRole="THERAPIST" />}
      >
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
            path="assign"
            element={<TherapistAssignExercise />}
          />

          <Route
            path="sessions"
            element={<TherapistSessions />}
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;