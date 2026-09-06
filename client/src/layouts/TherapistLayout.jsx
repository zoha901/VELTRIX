import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ROUTES } from '../utils/constants';

export default function TherapistLayout() {
  const therapistNavLinks = [
    { to: ROUTES.THERAPIST.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.THERAPIST.PATIENTS, label: 'Patients' },
    { to: ROUTES.THERAPIST.EXERCISES, label: 'Exercise Library' },
    { to: ROUTES.THERAPIST.ASSIGN, label: 'Prescribe Plan' },
    { to: ROUTES.THERAPIST.SESSIONS, label: 'Clinical Sessions' },
  ];

  return (
    <div className="layout-wrapper therapist-theme">
      <Navbar
        title="VELTRIX"
        portalName="Therapist Portal"
        links={therapistNavLinks}
      />
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>VELTRIX &bull; Vitality + Elevation + Tracking + IX &bull; Clinical Therapist Portal</p>
      </footer>
    </div>
  );
}
