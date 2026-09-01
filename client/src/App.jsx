import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import TherapistLayout from './layouts/TherapistLayout';

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
import TherapistExercises from './pages/therapist/TherapistExercises';
import TherapistSessions from './pages/therapist/TherapistSessions';

// Styles
import './App.css';

function App() {
  return (
    <Routes>
      {/* Root redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Patient Portal Routes */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="exercises" element={<PatientExercises />} />
        <Route path="progress" element={<PatientProgress />} />
      </Route>

      {/* Therapist Portal Routes */}
      <Route path="/therapist" element={<TherapistLayout />}>
        <Route index element={<Navigate to="/therapist/dashboard" replace />} />
        <Route path="dashboard" element={<TherapistDashboard />} />
        <Route path="patients" element={<TherapistPatients />} />
        <Route path="exercises" element={<TherapistExercises />} />
        <Route path="sessions" element={<TherapistSessions />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
