import { Bell, LogOut, Phone, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const { notifications, callingAppointments, dismissNotification, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const unread = notifications.length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left — calling badge */}
        <div className="flex items-center gap-3">
          {callingAppointments.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {callingAppointments.length} active call{callingAppointments.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Admin info */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">{admin?.name || 'Doctor'}</p>
              <p className="text-xs text-slate-400">{admin?.email}</p>
            </div>
          </div>

          {/* Bell */}
          <div className="relative" ref={bellRef}>
            <button
              className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setOpen((o) => !o)}
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button className="text-xs text-slate-400 hover:text-slate-600" onClick={clearAll}>
                        Clear all
                      </button>
                    )}
                    <button className="rounded-lg p-1 hover:bg-slate-100" onClick={() => setOpen(false)}>
                      <X size={14} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm text-slate-400">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50">
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          n.type === 'call' ? 'bg-emerald-100' : n.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <Phone size={13} className={n.type === 'call' ? 'text-emerald-600' : 'text-blue-600'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{n.title}</p>
                          {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                          {n.appointmentId && (
                            <button
                              className="mt-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                              onClick={() => {
                                navigate(`/appointments/${n.appointmentId}/video`);
                                setOpen(false);
                                dismissNotification(n.id);
                              }}
                            >
                              Start call →
                            </button>
                          )}
                        </div>
                        <button
                          className="shrink-0 rounded p-0.5 text-slate-300 hover:text-slate-500"
                          onClick={() => dismissNotification(n.id)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            onClick={logout}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
