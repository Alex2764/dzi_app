import { GraduationCap, Home, LineChart, LogIn, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const links = [
  { to: '/', label: 'Начало', icon: Home, end: true },
  { to: '/diagnostics', label: 'Диагностика', icon: LineChart, end: false },
];

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <NavLink to="/" className="site-nav-brand" end>
          <GraduationCap size={20} strokeWidth={2} />
          ДЗИ по ИТ
        </NavLink>

        <nav className="site-nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`}
            >
              <link.icon size={16} strokeWidth={2} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <button type="button" className="site-nav-signout" title="Изход" onClick={() => signOut()}>
            <LogOut size={18} strokeWidth={2} />
          </button>
        ) : (
          <NavLink to="/login" className="site-nav-link" title="Вход">
            <LogIn size={16} strokeWidth={2} />
            Вход
          </NavLink>
        )}
      </div>
    </header>
  );
}
