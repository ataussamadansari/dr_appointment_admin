import { RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../api/appointmentApi';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { APPOINTMENT_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

const TZ = 'Asia/Kolkata';

// Format Date → 'YYYY-MM-DD' in IST
const fmtIST = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

// Helpers
const startOfWeek = (d) => { const r = new Date(d); r.setDate(r.getDate() - ((r.getDay() + 6) % 7)); return r; };
const endOfWeek   = (d) => { const r = startOfWeek(d); r.setDate(r.getDate() + 6); return r; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const startOfYear  = (d) => new Date(d.getFullYear(), 0, 1);
const endOfYear    = (d) => new Date(d.getFullYear(), 11, 31);
const addDays      = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const addMonths    = (d, n) => { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; };
const addYears     = (d, n) => { const r = new Date(d); r.setFullYear(r.getFullYear() + n); return r; };

const nowIST = () => {
  // Current date in IST as a plain Date (midnight UTC offset)
  const s = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  return new Date(s);
};

// Quick date range presets
const PRESETS = [
  { label: 'Today',       key: 'today',       from: () => fmtIST(nowIST()),                          to: () => fmtIST(nowIST()) },
  { label: 'Yesterday',   key: 'yesterday',   from: () => fmtIST(addDays(nowIST(), -1)),              to: () => fmtIST(addDays(nowIST(), -1)) },
  { label: 'Tomorrow',    key: 'tomorrow',    from: () => fmtIST(addDays(nowIST(), 1)),               to: () => fmtIST(addDays(nowIST(), 1)) },
  { label: 'This week',   key: 'this_week',   from: () => fmtIST(startOfWeek(nowIST())),              to: () => fmtIST(endOfWeek(nowIST())) },
  { label: 'Last week',   key: 'last_week',   from: () => fmtIST(startOfWeek(addDays(nowIST(), -7))), to: () => fmtIST(endOfWeek(addDays(nowIST(), -7))) },
  { label: 'This month',  key: 'this_month',  from: () => fmtIST(startOfMonth(nowIST())),             to: () => fmtIST(endOfMonth(nowIST())) },
  { label: 'Last month',  key: 'last_month',  from: () => fmtIST(startOfMonth(addMonths(nowIST(), -1))), to: () => fmtIST(endOfMonth(addMonths(nowIST(), -1))) },
  { label: 'This year',   key: 'this_year',   from: () => fmtIST(startOfYear(nowIST())),              to: () => fmtIST(endOfYear(nowIST())) },
  { label: 'Last year',   key: 'last_year',   from: () => fmtIST(startOfYear(addYears(nowIST(), -1))), to: () => fmtIST(endOfYear(addYears(nowIST(), -1))) },
  { label: 'All time',    key: 'all',         from: () => '',                                         to: () => '' },
];

export default function Appointments() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState('today');
  const [dateFrom, setDateFrom] = useState(fmtIST(nowIST()));
  const [dateTo, setDateTo] = useState(fmtIST(nowIST()));

  // Refs to always have latest values in callbacks (avoids stale closure)
  const dateFromRef = useRef(fmtIST(nowIST()));
  const dateToRef   = useRef(fmtIST(nowIST()));
  const statusRef   = useRef('');

  const load = async (from, to, st) => {
    // Fall back to refs so Refresh always uses current filter
    const f  = from !== undefined ? from : dateFromRef.current;
    const t  = to   !== undefined ? to   : dateToRef.current;
    const s  = st   !== undefined ? st   : statusRef.current;

    setLoading(true);
    try {
      const params = {};
      if (s) params.status   = s;
      if (f) params.dateFrom = f;
      if (t) params.dateTo   = t;
      console.log('[Appointments] loading with params:', params);
      const data = await getAppointments(params);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const applyPreset = (preset) => {
    const from = preset.from();
    const to   = preset.to();
    setActivePreset(preset.key);
    setDateFrom(from);
    setDateTo(to);
    dateFromRef.current = from;
    dateToRef.current   = to;
    load(from, to, statusRef.current);
  };

  const applyCustomRange = () => {
    setActivePreset('custom');
    load(dateFromRef.current, dateToRef.current, statusRef.current);
  };

  const applyStatus = (s) => {
    setStatus(s);
    statusRef.current = s;
    load(dateFromRef.current, dateToRef.current, s);
  };

  const handleDateFromChange = (val) => {
    setDateFrom(val);
    dateFromRef.current = val;
    setActivePreset('custom');
  };

  const handleDateToChange = (val) => {
    setDateTo(val);
    dateToRef.current = val;
    setActivePreset('custom');
  };

  const clearSearch = () => setSearch('');

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.patientSnapshot?.name?.toLowerCase().includes(q) ||
      r.patientSnapshot?.mobile?.includes(q) ||
      String(r.tokenNumber).includes(q)
    );
  });

  // Label for current range
  const rangeLabel = (() => {
    const p = PRESETS.find((p) => p.key === activePreset);
    if (p && activePreset !== 'custom') return p.label;
    if (dateFrom && dateTo) return `${dateFrom} → ${dateTo}`;
    if (dateFrom) return `From ${dateFrom}`;
    if (dateTo)   return `Until ${dateTo}`;
    return 'All time';
  })();

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Appointments</h2>
        <button className="btn-secondary flex items-center gap-2" onClick={() => load()}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── Date preset chips ── */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activePreset === p.key
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Custom date range ── */}
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
          <input
            type="date"
            className="input w-40 text-sm"
            value={dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
          <input
            type="date"
            className="input w-40 text-sm"
            value={dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
          />
        </div>
        <button
          className="btn-primary py-2.5 text-sm"
          onClick={applyCustomRange}
        >
          Apply
        </button>
      </div>

      {/* ── Search + Status ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9 pr-9"
            placeholder="Search by name, mobile, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={clearSearch}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          className="input sm:max-w-44"
          value={status}
          onChange={(e) => applyStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* ── Result count ── */}
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{filtered.length}</span> appointment{filtered.length !== 1 ? 's' : ''}
        {' · '}
        <span className="text-teal-600 font-medium">{rangeLabel}</span>
        {status && <span> · <span className="capitalize">{status.replace('_', ' ')}</span></span>}
        {search && <span> · matching "<span className="font-medium">{search}</span>"</span>}
      </p>

      <DataTable
        rows={filtered}
        empty="No appointments found for this period."
        columns={[
          {
            key: 'token',
            label: '#',
            render: (r) => (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
                {r.tokenNumber}
              </div>
            ),
          },
          {
            key: 'patient',
            label: 'Patient',
            render: (r) => (
              <div>
                <p className="font-medium text-slate-900">{r.patientSnapshot?.name}</p>
                <p className="text-xs text-slate-400">{r.patientSnapshot?.mobile}</p>
              </div>
            ),
          },
          {
            key: 'date',
            label: 'Date',
            render: (r) => <span className="text-slate-600">{formatDate(r.appointmentDate)}</span>,
          },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'fee', label: 'Fee', render: (r) => `₹${r.feeAmount}` },
          {
            key: 'actions',
            label: '',
            render: (r) => (
              <Link
                className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                to={`/appointments/${r._id}`}
              >
                Open
              </Link>
            ),
          },
        ]}
      />
    </section>
  );
}
