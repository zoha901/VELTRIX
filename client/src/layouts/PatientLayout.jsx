import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ROUTES } from '../utils/constants';

export default function PatientLayout() {
  const patientNavLinks = [
    { to: ROUTES.PATIENT.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.PATIENT.EXERCISES, label: 'My Exercises' },
    { to: ROUTES.PATIENT.PROGRESS, label: 'My Progress' },
  ];

  return (
    <div className="layout-wrapper patient-theme">
      <Navbar
        title="VELTRIX"
        portalName="Patient Portal"
        links={patientNavLinks}
      />
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>VELTRIX &bull; Vitality + Elevation + Tracking + IX &bull; Patient Interface</p>
      </footer>
    </div>
  );
}
