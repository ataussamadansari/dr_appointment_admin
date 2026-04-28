import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchRecordingUrl } from '../api/agoraApi';
import { getRecordings } from '../api/appointmentApi';
import DataTable from '../components/DataTable.jsx';
import { formatDate } from '../utils/formatDate';

export default function Recordings() {
  const [rows, setRows] = useState([]);
  const [fetching, setFetching] = useState({});

  const load = () => getRecordings().then(setRows);
  useEffect(() => { load(); }, []);

  const handleFetchUrl = async (appointmentId, rowIndex) => {
    setFetching((f) => ({ ...f, [rowIndex]: true }));
    try {
      const result = await fetchRecordingUrl(appointmentId);
      if (result.recordingUrl) {
        setRows((prev) =>
          prev.map((r, i) => (i === rowIndex ? { ...r, recordingUrl: result.recordingUrl } : r))
        );
      } else {
        alert(result.message || 'Recording still uploading. Try again in 1-2 minutes.');
      }
    } catch {
      alert('Failed to fetch recording URL.');
    } finally {
      setFetching((f) => ({ ...f, [rowIndex]: false }));
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title">Recordings</h2>
        <button className="btn-secondary flex items-center gap-2" onClick={load}>
          <RefreshCw size={14} /> <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <DataTable
        rows={rows}
        empty="No recordings found."
        columns={[
          {
            key: 'patient',
            label: 'Patient',
            render: (r) => r.appointment?.patient?.mobile || '—',
          },
          { key: 'channelName', label: 'Channel' },
          { key: 'status', label: 'Status' },
          {
            key: 'startedAt',
            label: 'Started',
            render: (r) => formatDate(r.startedAt),
          },
          {
            key: 'recordingUrl',
            label: 'Recording',
            render: (r, i) => {
              if (r.recordingUrl) {
                return (
                  <a
                    href={r.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 underline text-xs"
                  >
                    View
                  </a>
                );
              }
              const appointmentId = r.appointment?._id || r.appointment;
              if (!appointmentId) return <span className="text-slate-400 text-xs">—</span>;
              return (
                <button
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 disabled:opacity-50"
                  disabled={fetching[i]}
                  onClick={() => handleFetchUrl(appointmentId, i)}
                >
                  <RefreshCw size={12} className={fetching[i] ? 'animate-spin' : ''} />
                  {fetching[i] ? 'Checking...' : 'Fetch URL'}
                </button>
              );
            },
          },
        ]}
      />
    </section>
  );
}
