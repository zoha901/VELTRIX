import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ title = 'VELTRIX', portalName = '', links = [] }) {
  const { logout } = useAuth();

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-name">{title}</span>
          {portalName && (
            <span className="portal-badge">{portalName}</span>
          )}
        </Link>
      </div>

      <nav className="navbar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}