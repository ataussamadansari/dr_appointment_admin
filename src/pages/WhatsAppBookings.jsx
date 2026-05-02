import { ExternalLink, MessageCircle, RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getWhatsappBookings } from '../api/whatsappBookingApi';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatDate } from '../utils/formatDate';

const tomorrowIST = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(date);
};

const paymentStatuses = ['pending', 'paid', 'failed', 'expired'];
const bookingStatuses = ['ASK_NAME', 'ASK_AGE', 'ASK_CITY', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'];

const statusLabel = (value) => String(value || '').replaceAll('_', ' ').toLowerCase();

function PaymentBadge({ status }) {
  const classes = {
    paid: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-red-100 text-red-700',
    expired: 'bg-slate-100 text-slate-700'
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status] || classes.pending}`}>
      {statusLabel(status)}
    </span>
  );
}

export default function WhatsAppBookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(tomorrowIST());
  const [paymentStatus, setPaymentStatus] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (date) params.date = date;
      if (paymentStatus) params.paymentStatus = paymentStatus;
      if (bookingStatus) params.bookingStatus = bookingStatus;
      setRows(await getWhatsappBookings(params));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const displayRows = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      row.patientName?.toLowerCase().includes(q) ||
      row.phone?.includes(q) ||
      row.city?.toLowerCase().includes(q) ||
      String(row.tokenNumber || '').includes(q)
    );
  }, [rows, search]);

  return (
    <section className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">WhatsApp Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">Offline appointment flow through Interakt and Cashfree links</p>
        </div>
        <button className="btn-secondary flex items-center gap-2" onClick={load}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Appointment date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Payment status</label>
          <select className="input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            <option value="">All payments</option>
            {paymentStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Booking status</label>
          <select className="input" value={bookingStatus} onChange={(e) => setBookingStatus(e.target.value)}>
            <option value="">All bookings</option>
            {bookingStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full" onClick={load}>Apply filters</button>
        </div>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9 pr-9"
          placeholder="Search by patient, phone, city, token..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setSearch('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{displayRows.length}</span> WhatsApp booking{displayRows.length !== 1 ? 's' : ''}
      </p>

      <DataTable
        rows={displayRows}
        empty="No WhatsApp bookings found."
        columns={[
          { key: 'date', label: 'Date', render: (r) => r.appointmentDate ? formatDate(r.appointmentDate) : '-' },
          {
            key: 'token',
            label: 'Token',
            render: (r) => r.tokenNumber ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
                {r.tokenNumber}
              </div>
            ) : '-'
          },
          {
            key: 'patient',
            label: 'Patient',
            render: (r) => (
              <div>
                <p className="font-medium text-slate-900">{r.patientName || '-'}</p>
                <p className="text-xs text-slate-400">{r.phone}</p>
              </div>
            )
          },
          { key: 'age', label: 'Age', render: (r) => r.age || '-' },
          { key: 'city', label: 'City', render: (r) => r.city || '-' },
          { key: 'payment', label: 'Payment', render: (r) => <PaymentBadge status={r.paymentStatus} /> },
          { key: 'booking', label: 'Booking', render: (r) => <StatusBadge status={r.step} /> },
          {
            key: 'link',
            label: 'Cashfree Link',
            render: (r) => r.cashfreeLinkUrl ? (
              <a className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800" href={r.cashfreeLinkUrl} target="_blank" rel="noreferrer">
                Open <ExternalLink size={12} />
              </a>
            ) : '-'
          },
          {
            key: 'appointment',
            label: 'Appointment Created',
            render: (r) => r.appointmentId ? (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <MessageCircle size={13} /> Yes
              </span>
            ) : 'No'
          },
          { key: 'createdAt', label: 'Created At', render: (r) => formatDate(r.createdAt) },
        ]}
      />
    </section>
  );
}
