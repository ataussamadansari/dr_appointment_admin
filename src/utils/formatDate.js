const TZ = 'Asia/Kolkata';

// Format appointment date as readable IST date — no time shown
// e.g. "29 Apr 2026"
export const formatDate = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

// Format with time too (for call logs, recordings etc.)
// e.g. "29 Apr 2026, 10:30 AM"
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};
