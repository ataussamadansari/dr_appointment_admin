import { ArrowLeft, CalendarClock, FilePenLine, MessageCircle, PhoneCall, RefreshCw, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAppointment, updateAppointmentStatus } from '../api/appointmentApi';
import { fetchRecordingUrl } from '../api/agoraApi';
import { sendPrescriptionWhatsapp } from '../api/prescriptionApi';
import Loader from '../components/Loader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { APPOINTMENT_STATUSES } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/formatDate';

// Check if appointment date is today (IST)
const isAppointmentToday = (dateStr) => {
  if (!dateStr) return false;
  const apptDate = new Date(dateStr);
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const apptIST = new Date(apptDate.getTime() + istOffset);
  const nowIST  = new Date(now.getTime() + istOffset);
  return (
    apptIST.getUTCFullYear() === nowIST.getUTCFullYear() &&
    apptIST.getUTCMonth()    === nowIST.getUTCMonth() &&
    apptIST.getUTCDate()     === nowIST.getUTCDate()
  );
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [appointment, setAppointment] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [recordingMsg, setRecordingMsg] = useState('');

  const load = () => getAppointment(id).then(setAppointment);
  useEffect(() => { load(); }, [id]);

  if (!appointment) return <Loader />;

  const changeStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      await updateAppointmentStatus(id, newStatus);
      await load();
      addNotification({ type: 'success', title: 'Status updated', message: `Appointment marked as ${newStatus}` });
    } catch (err) {
      addNotification({ type: 'error', title: 'Update failed', message: err?.response?.data?.message || err.message });
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchRecording = async () => {
    setRecordingLoading(true);
    setRecordingMsg('');
    try {
      const result = await fetchRecordingUrl(id);
      if (result.recordingUrl) {
        await load(); // refresh to show new URL
        setRecordingMsg('');
      } else {
        setRecordingMsg(result.message || 'Still uploading. Try again in 1-2 minutes.');
      }
    } catch (err) {
      setRecordingMsg(err?.response?.data?.message || 'Failed to fetch recording.');
    } finally {
      setRecordingLoading(false);
    }
  };

  const sendPdf = async () => {    setWhatsappLoading(true);
    try {
      await sendPrescriptionWhatsapp(appointment.prescription._id);
      await load();
      addNotification({ type: 'success', title: 'WhatsApp sent', message: 'Prescription sent to patient' });
    } catch (err) {
      addNotification({ type: 'error', title: 'WhatsApp failed', message: err?.response?.data?.message || err.message });
    } finally {
      setWhatsappLoading(false);
    }
  };

  const isCalling = appointment.status === 'calling';
  const isToday = isAppointmentToday(appointment.appointmentDate);
  const isFuture = !isToday && new Date(appointment.appointmentDate) > new Date();

  return (
    <section className="space-y-5 sm:space-y-6">
      {/* Back + header */}
      <div>
        <button
          className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="page-title truncate">{appointment.patientSnapshot.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {appointment.patientSnapshot.mobile} · {formatDate(appointment.appointmentDate)} · Token {appointment.tokenNumber}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge status={appointment.status} />
            <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" onClick={load}>
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Future appointment banner */}
      {isFuture && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5 sm:py-4">
          <CalendarClock size={18} className="shrink-0 text-amber-600" />
          <p className="text-sm font-medium text-amber-800">
            This appointment is scheduled for a future date. Actions (video call, status change) will be available on the day of the appointment.
          </p>
        </div>
      )}

      {/* Active call banner */}
      {isCalling && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm font-semibold text-emerald-800">Call is active</p>
          </div>
          <Link to={`/admin/appointments/${id}/video`} className="btn-primary py-2 text-xs shrink-0">
            <Video size={14} /> Rejoin call
          </Link>
        </div>
      )}

      {/* Main grid — stacks on mobile, 3-col on lg */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Patient info */}
        <div className="card space-y-4 lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Patient information</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-2">
            {[
              ['Age', appointment.patientSnapshot.age],
              ['Gender', appointment.patientSnapshot.gender],
              ['City', appointment.patientSnapshot.city],
              ['Patient type', appointment.patientType],
              ['Last prescription', appointment.lastPrescriptionDate ? formatDate(appointment.lastPrescriptionDate) : null],
              ['Fee', `₹${appointment.feeAmount}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
                <dt className="text-xs text-slate-400 mb-0.5">{label}</dt>
                <dd className="font-medium text-slate-900 truncate">{value || '—'}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
            <dt className="text-xs text-slate-400 mb-1">Complaint</dt>
            <dd className="text-sm text-slate-700 leading-relaxed">{appointment.symptoms}</dd>
          </div>
          {appointment.prescriptionPhotoUrl && (
            <a className="btn-secondary w-fit" href={appointment.prescriptionPhotoUrl} target="_blank" rel="noreferrer">
              View previous prescription photo
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-slate-900">Actions</h3>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Update status</label>
            <select
              className="input"
              value={appointment.status}
              disabled={statusLoading || isFuture}
              onChange={(e) => changeStatus(e.target.value)}
            >
              {APPOINTMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
            {isFuture && (
              <p className="mt-1 text-xs text-amber-600">Only cancellation allowed before appointment day</p>
            )}
          </div>

          {isFuture ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400 cursor-not-allowed">
              <Video size={16} />
              Start video call (available on appointment day)
            </div>
          ) : (
            <Link className="btn-primary w-full" to={`/admin/appointments/${id}/video`}>
              <Video size={16} />
              {isCalling ? 'Rejoin call' : 'Start video call'}
            </Link>
          )}

          {isFuture ? (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400 cursor-not-allowed">
              <FilePenLine size={16} />
              Write prescription (available on appointment day)
            </div>
          ) : (
            <Link className="btn-secondary w-full" to={`/admin/appointments/${id}/prescription`}>
              <FilePenLine size={16} />
              {appointment.prescription ? 'Edit prescription' : 'Write prescription'}
            </Link>
          )}

          {appointment.prescription?.pdfUrl && (
            <a className="btn-secondary w-full" href={appointment.prescription.pdfUrl} target="_blank" rel="noreferrer">
              <PhoneCall size={16} /> View PDF
            </a>
          )}

          {appointment.prescription?._id && (
            <button className="btn-secondary w-full" disabled={whatsappLoading} onClick={sendPdf}>
              <MessageCircle size={16} />
              {whatsappLoading ? 'Sending...' : 'Send WhatsApp'}
            </button>
          )}
        </div>
      </div>

      {/* Recording */}
      {appointment.callLog && (
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-3">Call recording</h3>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  appointment.callLog.status === 'ended' ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'
                }`} />
                <p className="text-sm text-slate-600">
                  Status: <span className="font-medium capitalize">{appointment.callLog.status}</span>
                </p>
              </div>
              {appointment.callLog.startedAt && (
                <p className="text-xs text-slate-400 mt-1">
                  Started: {formatDateTime(appointment.callLog.startedAt)}
                </p>
              )}
              {recordingMsg && (
                <p className="mt-1.5 text-xs text-amber-600">{recordingMsg}</p>
              )}
            </div>

            {appointment.callLog.recordingUrl ? (
              <a
                href={appointment.callLog.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary py-2 text-xs"
              >
                ▶ View recording
              </a>
            ) : appointment.callLog.status === 'ended' ? (
              <div className="flex flex-col items-end gap-1.5">
                <button
                  className="btn-secondary py-2 text-xs flex items-center gap-1.5"
                  disabled={recordingLoading}
                  onClick={fetchRecording}
                >
                  <RefreshCw size={12} className={recordingLoading ? 'animate-spin' : ''} />
                  {recordingLoading ? 'Checking...' : 'Fetch recording URL'}
                </button>
                <p className="text-xs text-slate-400">
                  S3 upload takes 1–3 min after call ends
                </p>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Recording in progress...</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
