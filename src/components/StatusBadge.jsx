const config = {
  payment_pending: { cls: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500',   label: 'Payment Pending' },
  confirmed:       { cls: 'bg-blue-100 text-blue-800',     dot: 'bg-blue-500',    label: 'Confirmed' },
  waiting:         { cls: 'bg-cyan-100 text-cyan-800',     dot: 'bg-cyan-500',    label: 'Waiting' },
  calling:         { cls: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', label: 'Calling' },
  completed:       { cls: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400',   label: 'Completed' },
  cancelled:       { cls: 'bg-red-100 text-red-700',       dot: 'bg-red-500',     label: 'Cancelled' },
  missed:          { cls: 'bg-zinc-100 text-zinc-600',     dot: 'bg-zinc-400',    label: 'Missed' },
  ASK_NAME:        { cls: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400',   label: 'Ask Name' },
  ASK_AGE:         { cls: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400',   label: 'Ask Age' },
  ASK_CITY:        { cls: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400',   label: 'Ask City' },
  PAYMENT_PENDING: { cls: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500',   label: 'Payment Pending' },
  CONFIRMED:       { cls: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500', label: 'Confirmed' },
  CANCELLED:       { cls: 'bg-red-100 text-red-700',       dot: 'bg-red-500',     label: 'Cancelled' },
  EXPIRED:         { cls: 'bg-zinc-100 text-zinc-600',     dot: 'bg-zinc-400',    label: 'Expired' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || { cls: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
