import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

export function TopBar() {
  const { theme, toggle } = useTheme();

  return (
    <header className="top-bar">
      <NavLink to="/dashboard" className="top-bar__brand">
        Im Not Lazy
      </NavLink>
      <div className="top-bar__actions">
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
}

export function NavBar() {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/check-in', label: 'Check-in' },
    { to: '/wizard', label: 'Setup' },
    { to: '/learn', label: 'Learn' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="nav-bar" aria-label="Main navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `nav-bar__link ${isActive ? 'nav-bar__link--active' : ''}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell({ children, narrow }) {
  return (
    <div className="app-shell">
      <TopBar />
      <main className={`app-shell__main ${narrow ? 'app-shell__main--narrow' : ''}`}>
        {children}
      </main>
      <NavBar />
    </div>
  );
}
