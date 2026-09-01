import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ title = 'VELTRIX', portalName = '', links = [] }) {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-name">{title}</span>
          {portalName && <span className="portal-badge">{portalName}</span>}
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
        <Link to="/login" className="btn btn-outline">
          Switch Role / Exit
        </Link>
      </div>
    </header>
  );
}
