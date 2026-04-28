import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

const config = {
  success: {
    icon: <CheckCircle size={16} />,
    cls: 'border-l-teal-500 text-teal-700',
    bg: 'bg-teal-50',
    iconCls: 'text-teal-600',
  },
  error: {
    icon: <AlertCircle size={16} />,
    cls: 'border-l-red-500 text-red-700',
    bg: 'bg-red-50',
    iconCls: 'text-red-600',
  },
  info: {
    icon: <Info size={16} />,
    cls: 'border-l-blue-500 text-blue-700',
    bg: 'bg-blue-50',
    iconCls: 'text-blue-600',
  },
};

export default function NotificationToast() {
  const { toasts, dismissToast } = useNotifications();

  // Only show non-call toasts here — calls are handled by IncomingCallCard
  const visible = toasts.filter((t) => t.type !== 'call');
  if (!visible.length) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2 w-72">
      {visible.map((n) => {
        const c = config[n.type] || config.info;
        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-lg ${c.cls}`}
          >
            <div className={`mt-0.5 shrink-0 ${c.iconCls}`}>{c.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{n.title}</p>
              {n.message && (
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{n.message}</p>
              )}
            </div>
            <button
              className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
              onClick={() => dismissToast(n.id)}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
