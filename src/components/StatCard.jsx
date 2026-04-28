export default function StatCard({ label, value, icon: Icon, color = 'teal', trend }) {
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   icon: 'bg-teal-100' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', icon: 'bg-violet-100' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'bg-amber-100' },
  };
  const c = colors[color] || colors.teal;

  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value ?? '—'}</p>
        {trend && <p className="mt-1 text-xs text-slate-400">{trend}</p>}
      </div>
      {Icon && (
        <div className={`rounded-xl p-2.5 ${c.icon}`}>
          <Icon size={20} className={c.text} />
        </div>
      )}
    </div>
  );
}
