import { RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../api/appointmentApi';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { APPOINTMENT_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

export default function Appointments() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAppointments(status ? { status } : {});
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.patientSnapshot?.name?.toLowerCase().includes(q) ||
      r.patientSnapshot?.mobile?.includes(q) ||
      String(r.tokenNumber).includes(q)
    );
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Appointments</h2>
        <button className="btn-secondary flex items-center gap-2" onClick={load}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, mobile, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input max-w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      <DataTable
        rows={filtered}
        empty="No appointments found."
        columns={[
          {
            key: 'token',
            label: 'Token',
            render: (r) => (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
                {r.tokenNumber}
              </div>
            ),
          },
          { key: 'patient', label: 'Patient', render: (r) => (
            <div>
              <p className="font-medium text-slate-900">{r.patientSnapshot?.name}</p>
              <p className="text-xs text-slate-400">{r.patientSnapshot?.mobile}</p>
            </div>
          )},
          { key: 'date', label: 'Date', render: (r) => (
            <span className="text-slate-600">{formatDate(r.appointmentDate)}</span>
          )},
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'fee', label: 'Fee', render: (r) => `₹${r.feeAmount}` },
          { key: 'actions', label: '', render: (r) => (
            <Link
              className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
              to={`/appointments/${r._id}`}
            >
              Open
            </Link>
          )},
        ]}
      />
    </section>
  );
}
