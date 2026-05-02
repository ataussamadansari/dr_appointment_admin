import { ChevronLeft, ChevronRight, LayoutList, RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../api/appointmentApi';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { APPOINTMENT_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

// ── Date helpers (IST) ────────────────────────────────────────────────────────
const TZ = 'Asia/Kolkata';
const fmtIST = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

const nowIST = () => new Date(new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()));
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const mondayOf = (d) => { const r = new Date(d); r.setDate(r.getDate() - ((r.getDay() + 6) % 7)); return r; };

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['M','T','W','T','F','S','S'];

// ── Week Calendar Component ───────────────────────────────────────────────────
function WeekCalendar({ selectedDate, onSelect, datesWithData, weekOffset, onWeekChange }) {
  const today = nowIST();
  const monday = addDays(mondayOf(today), weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const isSame = (a, b) => fmtIST(a) === fmtIST(b);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-800">
          {MONTHS[monday.getMonth()]} {monday.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            onClick={() => onWeekChange(weekOffset - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="rounded-lg px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 transition"
            onClick={() => { onWeekChange(0); onSelect(fmtIST(today)); }}
          >
            Today
          </button>
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            onClick={() => onWeekChange(weekOffset + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-slate-400 pb-1">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-3">
        {days.map((day) => {
          const key = fmtIST(day);
          const isSelected = key === selectedDate;
          const isToday = isSame(day, today);
          const hasDot = datesWithData.has(key);

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-sm'
                  : isToday
                  ? 'bg-teal-50 text-teal-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : ''}`}>
                {day.getDate()}
              </span>
              {/* Dot indicator */}
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full transition ${
                hasDot
                  ? isSelected ? 'bg-white/70' : 'bg-teal-500'
                  : 'bg-transparent'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Appointments Page ────────────────────────────────────────────────────
export default function Appointments() {
  const today = fmtIST(nowIST());

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'

  // Calendar mode state
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);

  // List mode state
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);

  const dateFromRef = useRef(today);
  const dateToRef   = useRef(today);
  const statusRef   = useRef('');

  // All unique dates that have appointments (for dot indicators)
  const datesWithData = new Set(
    rows.map((r) => fmtIST(new Date(r.appointmentDate)))
  );

  const load = async (from, to, st) => {
    const f = from !== undefined ? from : dateFromRef.current;
    const t = to   !== undefined ? to   : dateToRef.current;
    const s = st   !== undefined ? st   : statusRef.current;
    setLoading(true);
    try {
      const params = {};
      if (s) params.status   = s;
      if (f) params.dateFrom = f;
      if (t) params.dateTo   = t;
      const data = await getAppointments(params);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  // Calendar mode: load whole week so dots show correctly
  const loadWeek = (offset = weekOffset) => {
    const monday = addDays(mondayOf(nowIST()), offset * 7);
    const sunday = addDays(monday, 6);
    const f = fmtIST(monday);
    const t = fmtIST(sunday);
    dateFromRef.current = f;
    dateToRef.current   = t;
    load(f, t, statusRef.current);
  };

  useEffect(() => {
    if (viewMode === 'calendar') loadWeek();
    else load();
  }, [viewMode]);

  const handleWeekChange = (offset) => {
    setWeekOffset(offset);
    loadWeek(offset);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // If selected date is outside current week range, shift week
    const monday = addDays(mondayOf(nowIST()), weekOffset * 7);
    const sunday = addDays(monday, 6);
    const d = new Date(date);
    if (d < monday || d > sunday) {
      const newOffset = Math.round((mondayOf(d) - mondayOf(nowIST())) / (7 * 86400000));
      setWeekOffset(newOffset);
      loadWeek(newOffset);
    }
  };

  const applyStatus = (s) => {
    setStatus(s);
    statusRef.current = s;
    if (viewMode === 'calendar') loadWeek();
    else load(dateFromRef.current, dateToRef.current, s);
  };

  const handleDateFromChange = (val) => { setDateFrom(val); dateFromRef.current = val; };
  const handleDateToChange   = (val) => { setDateTo(val);   dateToRef.current   = val; };

  // Filter rows for calendar view (selected date only) or list view (all loaded)
  const displayRows = (() => {
    let r = rows;
    if (viewMode === 'calendar') {
      r = r.filter((a) => fmtIST(new Date(a.appointmentDate)) === selectedDate);
    }
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((a) =>
        a.patientSnapshot?.name?.toLowerCase().includes(q) ||
        a.patientSnapshot?.mobile?.includes(q) ||
        String(a.tokenNumber).includes(q)
      );
    }
    return r;
  })();

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Appointments</h2>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              <ChevronLeft size={13} />
              <ChevronRight size={13} />
              Calendar
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('list')}
            >
              <LayoutList size={13} />
              List
            </button>
          </div>
          <button
            className="btn-secondary flex items-center gap-2"
            onClick={() => viewMode === 'calendar' ? loadWeek() : load()}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Calendar view ── */}
      {viewMode === 'calendar' && (
        <WeekCalendar
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          datesWithData={datesWithData}
          weekOffset={weekOffset}
          onWeekChange={handleWeekChange}
        />
      )}

      {/* ── List view filters ── */}
      {viewMode === 'list' && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
            <input type="date" className="input w-40 text-sm" value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
            <input type="date" className="input w-40 text-sm" value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)} />
          </div>
          <button className="btn-primary py-2.5 text-sm"
            onClick={() => load(dateFromRef.current, dateToRef.current, statusRef.current)}>
            Apply
          </button>
        </div>
      )}

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
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <select className="input sm:max-w-44" value={status} onChange={(e) => applyStatus(e.target.value)}>
          <option value="">All statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* ── Result count ── */}
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{displayRows.length}</span> appointment{displayRows.length !== 1 ? 's' : ''}
        {viewMode === 'calendar' && (
          <span> · <span className="text-teal-600 font-medium">{selectedDate}</span></span>
        )}
        {status && <span> · <span className="capitalize">{status.replace('_', ' ')}</span></span>}
        {search && <span> · matching "<span className="font-medium">{search}</span>"</span>}
      </p>

      {/* ── Table ── */}
      <DataTable
        rows={displayRows}
        empty={viewMode === 'calendar' ? `No appointments on ${selectedDate}` : 'No appointments found.'}
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
          { key: 'source', label: 'Source', render: (r) => r.source === 'whatsapp' ? 'WhatsApp' : 'App' },
          { key: 'fee', label: 'Fee', render: (r) => `₹${r.feeAmount}` },
          {
            key: 'actions',
            label: '',
            render: (r) => (
              <Link
                className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                to={`/admin/appointments/${r._id}`}
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
