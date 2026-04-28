import { CalendarDays, LayoutDashboard, Settings, Video, X } from 'lucide-react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/settings',     label: 'Settings',     icon: Settings },
  { to: '/recordings',   label: 'Recordings',   icon: Video },
];

const Brand = () => (
  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600">
      <span className="text-sm font-bold text-white">M</span>
    </div>
    <div>
      <p className="text-sm font-bold text-slate-900">MediConsult</p>
      <p className="text-xs text-slate-400">Admin Panel</p>
    </div>
  </div>
);

const NavLinks = ({ onNavigate }) => (
  <nav className="flex-1 space-y-1 px-3 py-4">
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === '/'}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            isActive
              ? 'bg-teal-50 text-teal-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`
        }
      >
        <Icon size={17} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default function Sidebar({ mobileOpen, onClose }) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Brand />
        <NavLinks />
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">© 2025 MediConsult</p>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">MediConsult</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <NavLinks onNavigate={onClose} />

        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-400">© 2025 MediConsult</p>
        </div>
      </aside>
    </>
  );
}
