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
import PatientExerciseDetails from './pages/patient/PatientExerciseDetails';
import PatientGuidedExercise from './pages/patient/PatientGuidedExercise';
import PatientSessionSummary from './pages/patient/PatientSessionSummary';
import PatientProgress from './pages/patient/PatientProgress';

// Therapist Pages
import TherapistDashboard from './pages/therapist/TherapistDashboard';
import TherapistPatients from './pages/therapist/TherapistPatients';
import TherapistPatientDetails from './pages/therapist/TherapistPatientDetails';
import TherapistExercises from './pages/therapist/TherapistExercises';
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
      <Route
        element={<ProtectedRoute requiredRole="PATIENT" />}
      >
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
            path="exercises/:exerciseId"
            element={<PatientExerciseDetails />}
          />

          <Route
            path="exercises/:exerciseId/guided"
            element={<PatientGuidedExercise />}
          />

          <Route
            path="exercises/:exerciseId/summary"
            element={<PatientSessionSummary />}
          />

          <Route
            path="progress"
            element={<PatientProgress />}
          />
        </Route>
      </Route>

      {/* Therapist Portal */}
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
          path="exercises"
          element={<TherapistExercises />}
        />

        <Route
          path="sessions"
          element={<TherapistSessions />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;