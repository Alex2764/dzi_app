import { GraduationCap, Home } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Начало', icon: Home, end: true },
];

export default function NavBar() {
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
      </div>
    </header>
  );
}
