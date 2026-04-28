import { ChevronLeft, ChevronRight, LayoutList, RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { fetchRecordingUrl } from '../api/agoraApi';
import { getRecordings } from '../api/appointmentApi';
import DataTable from '../components/DataTable.jsx';
import { formatDateTime } from '../utils/formatDate';

// ── Date helpers (IST) ────────────────────────────────────────────────────────
const TZ = 'Asia/Kolkata';
const fmtIST = (d) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const nowIST  = () => new Date(new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()));
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const mondayOf = (d) => { const r = new Date(d); r.setDate(r.getDate() - ((r.getDay() + 6) % 7)); return r; };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['M','T','W','T','F','S','S'];

// ── Week Calendar (reused from Appointments) ──────────────────────────────────
function WeekCalendar({ selectedDate, onSelect, datesWithData, weekOffset, onWeekChange }) {
  const today = nowIST();
  const monday = addDays(mondayOf(today), weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const isSame = (a, b) => fmtIST(a) === fmtIST(b);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-bold text-slate-800">
          {MONTHS[monday.getMonth()]} {monday.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
            onClick={() => onWeekChange(weekOffset - 1)}>
            <ChevronLeft size={16} />
          </button>
          <button className="rounded-lg px-2.5 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 transition"
            onClick={() => { onWeekChange(0); onSelect(fmtIST(today)); }}>
            Today
          </button>
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
            onClick={() => onWeekChange(weekOffset + 1)}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 px-2 pt-2">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-slate-400 pb-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 px-2 pb-3">
        {days.map((day) => {
          const key = fmtIST(day);
          const isSelected = key === selectedDate;
          const isToday = isSame(day, today);
          const hasDot = datesWithData.has(key);
          return (
            <button key={key} onClick={() => onSelect(key)}
              className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
                isSelected ? 'bg-teal-600 text-white shadow-sm'
                : isToday  ? 'bg-teal-50 text-teal-700'
                : 'hover:bg-slate-50 text-slate-700'
              }`}>
              <span className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : ''}`}>
                {day.getDate()}
              </span>
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full transition ${
                hasDot ? isSelected ? 'bg-white/70' : 'bg-teal-500' : 'bg-transparent'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Recordings Page ──────────────────────────────────────────────────────
export default function Recordings() {
  const today = fmtIST(nowIST());

  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState({});
  const [search, setSearch]     = useState('');
  const [viewMode, setViewMode] = useState('calendar');

  // Calendar mode
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset]     = useState(0);

  // List mode
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo]     = useState(today);
  const dateFromRef = useRef(today);
  const dateToRef   = useRef(today);

  // Dates that have recordings (for dot indicators)
  const datesWithData = new Set(
    rows
      .filter((r) => r.startedAt)
      .map((r) => fmtIST(new Date(r.startedAt)))
  );

  const load = async (from, to) => {
    const f = from !== undefined ? from : dateFromRef.current;
    const t = to   !== undefined ? to   : dateToRef.current;
    setLoading(true);
    try {
      const params = {};
      if (f) params.dateFrom = f;
      if (t) params.dateTo   = t;
      const data = await getRecordings(params);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  const loadWeek = (offset = weekOffset) => {
    const monday = addDays(mondayOf(nowIST()), offset * 7);
    const sunday = addDays(monday, 6);
    const f = fmtIST(monday);
    const t = fmtIST(sunday);
    dateFromRef.current = f;
    dateToRef.current   = t;
    load(f, t);
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
    const monday = addDays(mondayOf(nowIST()), weekOffset * 7);
    const sunday = addDays(monday, 6);
    const d = new Date(date);
    if (d < monday || d > sunday) {
      const newOffset = Math.round((mondayOf(d) - mondayOf(nowIST())) / (7 * 86400000));
      setWeekOffset(newOffset);
      loadWeek(newOffset);
    }
  };

  const handleFetchUrl = async (appointmentId, rowId) => {
    setFetching((f) => ({ ...f, [rowId]: true }));
    try {
      const result = await fetchRecordingUrl(appointmentId);
      if (result.recordingUrl) {
        setRows((prev) =>
          prev.map((r) => (r._id === rowId ? { ...r, recordingUrl: result.recordingUrl } : r))
        );
      } else {
        alert(result.message || 'Recording still uploading. Try again in 1-2 minutes.');
      }
    } catch {
      alert('Failed to fetch recording URL.');
    } finally {
      setFetching((f) => ({ ...f, [rowId]: false }));
    }
  };

  // Filter rows
  const displayRows = (() => {
    let r = rows;
    if (viewMode === 'calendar') {
      r = r.filter((row) => row.startedAt && fmtIST(new Date(row.startedAt)) === selectedDate);
    }
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((row) => {
        const p    = row.appointment?.patient;
        const snap = row.appointment?.patientSnapshot;
        const name   = snap?.name   || p?.name   || '';
        const mobile = snap?.mobile || p?.mobile || '';
        return (
          name.toLowerCase().includes(q) ||
          mobile.includes(q) ||
          row.channelName?.toLowerCase().includes(q)
        );
      });
    }
    return r;
  })();

  return (
    <section className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Recordings</h2>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              <ChevronLeft size={13} /><ChevronRight size={13} /> Calendar
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => setViewMode('list')}
            >
              <LayoutList size={13} /> List
            </button>
          </div>
          <button className="btn-secondary flex items-center gap-2"
            onClick={() => viewMode === 'calendar' ? loadWeek() : load()}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      {viewMode === 'calendar' && (
        <WeekCalendar
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          datesWithData={datesWithData}
          weekOffset={weekOffset}
          onWeekChange={handleWeekChange}
        />
      )}

      {/* List date range */}
      {viewMode === 'list' && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
            <input type="date" className="input w-40 text-sm" value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); dateFromRef.current = e.target.value; }} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
            <input type="date" className="input w-40 text-sm" value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); dateToRef.current = e.target.value; }} />
          </div>
          <button className="btn-primary py-2.5 text-sm"
            onClick={() => load(dateFromRef.current, dateToRef.current)}>
            Apply
          </button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9 pr-9"
          placeholder="Search by patient name, mobile, channel..."
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

      {/* Count */}
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{displayRows.length}</span> recording{displayRows.length !== 1 ? 's' : ''}
        {viewMode === 'calendar' && (
          <span> · <span className="text-teal-600 font-medium">{selectedDate}</span></span>
        )}
        {search && <span> · matching "<span className="font-medium">{search}</span>"</span>}
      </p>

      <DataTable
        rows={displayRows}
        empty={viewMode === 'calendar' ? `No recordings on ${selectedDate}` : 'No recordings found.'}
        columns={[
          {
            key: 'patient',
            label: 'Patient',
            render: (r) => {
              const p = r.appointment?.patient;
              const snap = r.appointment?.patientSnapshot;
              // patientSnapshot has name from booking form — use as primary source
              const name   = snap?.name   || p?.name   || '—';
              const mobile = snap?.mobile || p?.mobile || '—';
              return (
                <div>
                  <p className="font-medium text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{mobile}</p>
                </div>
              );
            },
          },
          { key: 'channelName', label: 'Channel',
            render: (r) => (
              <span className="text-xs text-slate-500 font-mono truncate max-w-[160px] block">
                {r.channelName}
              </span>
            )
          },
          { key: 'status', label: 'Status',
            render: (r) => (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                r.status === 'ended' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {r.status}
              </span>
            )
          },
          {
            key: 'startedAt',
            label: 'Started',
            render: (r) => formatDateTime(r.startedAt),
          },
          {
            key: 'recordingUrl',
            label: 'Recording',
            render: (r) => {
              if (r.recordingUrl) {
                return (
                  <a href={r.recordingUrl} target="_blank" rel="noreferrer"
                    className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100">
                    ▶ View
                  </a>
                );
              }
              const appointmentId = r.appointment?._id || r.appointment;
              if (!appointmentId) return <span className="text-slate-400 text-xs">—</span>;
              return (
                <button
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  disabled={fetching[r._id]}
                  onClick={() => handleFetchUrl(appointmentId, r._id)}
                >
                  <RefreshCw size={11} className={fetching[r._id] ? 'animate-spin' : ''} />
                  {fetching[r._id] ? 'Checking...' : 'Fetch URL'}
                </button>
              );
            },
          },
        ]}
      />
    </section>
  );
}
