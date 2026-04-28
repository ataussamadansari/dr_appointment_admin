import { CalendarCheck, CalendarClock, IndianRupee, RefreshCw, TrendingUp, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboardApi';
import { getAppointments } from '../api/appointmentApi';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { formatDate } from '../utils/formatDate';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { callingAppointments } = useNotifications();

  const load = async () => {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        getDashboard(),
        getAppointments({ limit: 5 }),
      ]);
      setStats(s);
      setRecent(r.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading && !stats) return <Loader />;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Overview of your consultation practice</p>
        </div>
        <button className="btn-secondary flex items-center gap-2" onClick={load}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Active calls banner */}
      {callingAppointments.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {callingAppointments.length} active call{callingAppointments.length > 1 ? 's' : ''} in progress
              </p>
              <p className="text-xs text-emerald-600">
                {callingAppointments.map((a) => a.patientSnapshot?.name).join(', ')}
              </p>
            </div>
          </div>
          <Link
            to={`/appointments/${callingAppointments[0]._id}/video`}
            className="btn-primary py-2 text-xs"
          >
            <Video size={14} /> Join call
          </Link>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Today's appointments" value={stats.todayAppointments} icon={CalendarCheck} color="teal" />
          <StatCard label="Tomorrow's appointments" value={stats.tomorrowAppointments} icon={CalendarClock} color="blue" />
          <StatCard label="Completed" value={stats.completedAppointments} icon={TrendingUp} color="violet" />
          <StatCard label="Total revenue" value={`₹${(stats.revenue || 0).toLocaleString('en-IN')}`} icon={IndianRupee} color="amber" />
        </div>
      )}

      {/* Recent appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Recent appointments</h3>
          <Link to="/appointments" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No appointments yet</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map((a) => (
              <div key={a._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-700">
                    T{a.tokenNumber}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.patientSnapshot?.name}</p>
                    <p className="text-xs text-slate-400">{a.patientSnapshot?.mobile} · {formatDate(a.appointmentDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  <Link to={`/appointments/${a._id}`} className="text-xs font-semibold text-teal-600 hover:text-teal-700">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
