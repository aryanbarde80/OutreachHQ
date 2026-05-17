import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { to: '/', label: 'Overview' },
  { to: '/leads', label: 'Leads' },
  { to: '/accounts', label: 'SMTP Accounts' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/logs', label: 'Send Logs' },
  { to: '/resumes', label: 'Resumes' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand">OutreachHQ</div>
          <p className="brand-subtitle">Cold outreach operations, queue safety, and visibility from one console.</p>
        </div>
        <nav className="nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

