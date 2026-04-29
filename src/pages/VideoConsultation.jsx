import AgoraRTC from 'agora-rtc-sdk-ng';
import { ArrowLeft, Mic, MicOff, PhoneOff, Plus, Save, Trash2, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { endCall, getAdminToken, startCall } from '../api/agoraApi';
import { getAppointment } from '../api/appointmentApi';
import { createPrescription } from '../api/prescriptionApi';
import MedicineAutocomplete from '../components/MedicineAutocomplete.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

// ── Inline prescription panel (used during call) ──────────────────────────────
function PrescriptionPanel({ appointmentId, onSaved }) {
  const { addNotification } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    instructions: '',
    testsSuggested: '',
    followUpDate: ''
  });

  const updateMedicine = (idx, key, value) => {
    const medicines = [...form.medicines];
    medicines[idx] = { ...medicines[idx], [key]: value };
    setForm({ ...form, medicines });
  };

  const addMedicine = () =>
    setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', duration: '', instructions: '' }] });

  const removeMedicine = (idx) =>
    setForm({ ...form, medicines: form.medicines.filter((_, i) => i !== idx) });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPrescription({
        appointmentId,
        ...form,
        testsSuggested: form.testsSuggested.split(',').map((x) => x.trim()).filter(Boolean)
      });
      addNotification({ type: 'success', title: 'Prescription saved', message: 'PDF generated successfully' });
      onSaved?.();
    } catch (err) {
      addNotification({ type: 'error', title: 'Save failed', message: err?.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 h-full">

      <textarea
        className="input min-h-[72px] text-sm resize-none"
        placeholder="Diagnosis *"
        required
        value={form.diagnosis}
        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
      />

      <div className="space-y-2">
        <p className="text-xs text-slate-400 font-medium">Medicines</p>
        {form.medicines.map((med, idx) => (
          <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-2 space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <MedicineAutocomplete
                value={med.name}
                placeholder="Name *"
                className="py-1.5 text-xs"
                onChange={(field, val) => updateMedicine(idx, field, val)}
                onFill={(suggestion) => {
                  const medicines = [...form.medicines];
                  medicines[idx] = {
                    name: suggestion.name,
                    dosage: suggestion.dosage || medicines[idx].dosage,
                    duration: suggestion.duration || medicines[idx].duration,
                    instructions: suggestion.instructions || medicines[idx].instructions,
                  };
                  setForm({ ...form, medicines });
                }}
              />
              <input className="input text-xs py-1.5" placeholder="Dosage" value={med.dosage}
                onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} />
              <input className="input text-xs py-1.5" placeholder="Duration" value={med.duration}
                onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} />
              <input className="input text-xs py-1.5" placeholder="Instructions" value={med.instructions}
                onChange={(e) => updateMedicine(idx, 'instructions', e.target.value)} />
            </div>
            {form.medicines.length > 1 && (
              <button type="button" className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                onClick={() => removeMedicine(idx)}>
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn-secondary text-xs py-1.5 w-full" onClick={addMedicine}>
          <Plus size={13} /> Add medicine
        </button>
      </div>

      <textarea
        className="input text-sm resize-none min-h-[60px]"
        placeholder="Instructions for patient"
        value={form.instructions}
        onChange={(e) => setForm({ ...form, instructions: e.target.value })}
      />

      <input
        className="input text-sm"
        placeholder="Tests suggested (comma separated)"
        value={form.testsSuggested}
        onChange={(e) => setForm({ ...form, testsSuggested: e.target.value })}
      />

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Follow-up date</label>
        <input
          className="input text-sm"
          type="date"
          value={form.followUpDate}
          onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
        />
      </div>

      <button className="btn-primary mt-auto" disabled={saving}>
        <Save size={14} />
        {saving ? 'Saving...' : 'Save & Generate PDF'}
      </button>
    </form>
  );
}

// ── Main VideoConsultation page ───────────────────────────────────────────────
export default function VideoConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const clientRef = useRef(null);
  const tracksRef = useRef([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [permState, setPermState] = useState(null);
  const [duration, setDuration] = useState(0);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState(null); // track DB status
  const durationRef = useRef(null);

  useEffect(() => {
    checkPermissions();
    // Fetch appointment status to know if call is already active
    getAppointment(id).then((appt) => setAppointmentStatus(appt.status)).catch(() => {});
    return () => {
      tracksRef.current.forEach((t) => { try { t.stop(); t.close(); } catch (_) {} });
      if (clientRef.current) clientRef.current.leave().catch(() => {});
      clearInterval(durationRef.current);
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const [cam, mic] = await Promise.all([
        navigator.permissions.query({ name: 'camera' }),
        navigator.permissions.query({ name: 'microphone' }),
      ]);
      setPermState(cam.state === 'granted' && mic.state === 'granted' ? 'granted'
        : cam.state === 'denied' || mic.state === 'denied' ? 'denied' : 'prompt');
    } catch {
      setPermState('prompt');
    }
  };

  const requestPermissions = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setPermState('granted');
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermState('denied');
        setError('Camera/microphone access denied. Allow in browser settings and reload.');
      } else {
        setError(`Permission error: ${err.message}`);
      }
    }
  };

  const start = async () => {
    setLoading(true);
    setError('');
    setStatus('Starting call...');
    try {
      // If call already active in DB → rejoin (get token only, don't start again)
      // If not active → start fresh (creates call log, sends FCM to patient)
      let rtc;
      const isAlreadyCalling = appointmentStatus === 'calling';
      if (isAlreadyCalling) {
        setStatus('Rejoining call...');
        rtc = await getAdminToken(id); // just get token, no new call log
      } else {
        const data = await startCall(id);
        rtc = data.rtc;
        setAppointmentStatus('calling');
      }

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers((prev) => [...prev.filter((u) => u.uid !== user.uid), user]);
          setTimeout(() => user.videoTrack?.play(`remote-video-${user.uid}`, { fit: 'contain' }), 150);
        }
        if (mediaType === 'audio') user.audioTrack?.play();
      });
      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
      // When patient leaves the channel → auto end call from doctor side too
      client.on('user-left', async (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        if (user.uid === 2) {
          addNotification({ type: 'info', title: 'Patient left', message: 'Patient disconnected — ending call' });
          await endCallCleanup();
        }
      });

      setStatus('Joining channel...');
      await client.join(rtc.appId, rtc.channelName, rtc.token, rtc.uid);

      setStatus('Starting camera & microphone...');
      const tracks = [];
      try { tracks.push(await AgoraRTC.createMicrophoneAudioTrack()); } catch (e) { console.warn('Mic unavailable:', e.message); }
      try {
        const vt = await AgoraRTC.createCameraVideoTrack();
        tracks.push(vt);
        vt.play('local-video');
      } catch (e) { console.warn('Camera unavailable:', e.message); }

      tracksRef.current = tracks;
      if (tracks.length) await client.publish(tracks);

      setActive(true);
      setPermState('granted');
      setStatus('');
      addNotification({
        type: 'success',
        title: isAlreadyCalling ? 'Rejoined call' : 'Call started',
        message: isAlreadyCalling ? 'Reconnected to active call' : 'Patient has been notified',
      });
      durationRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('DEVICE_NOT_FOUND') || msg.includes('NotFoundError')) {
        setError('No camera/microphone found.');
      } else if (msg.includes('NotAllowedError')) {
        setPermState('denied');
        setError('Camera/microphone permission denied.');
      } else {
        setError(err?.response?.data?.message || msg || 'Failed to start call.');
      }
      setStatus('');
      tracksRef.current.forEach((t) => { try { t.stop(); t.close(); } catch (_) {} });
      tracksRef.current = [];
      if (clientRef.current) { try { await clientRef.current.leave(); } catch (_) {} clientRef.current = null; }
    } finally {
      setLoading(false);
    }
  };

  // Shared cleanup — called by both manual end and auto-end when patient leaves
  const endCallCleanup = async () => {
    tracksRef.current.forEach((t) => { try { t.stop(); t.close(); } catch (_) {} });
    tracksRef.current = [];
    if (clientRef.current) { try { await clientRef.current.leave(); } catch (_) {} clientRef.current = null; }
    try { await endCall(id); } catch (_) {}
    clearInterval(durationRef.current);
    setActive(false);
    setRemoteUsers([]);
    setDuration(0);
  };

  const end = async () => {
    setLoading(true);
    setError('');
    try {
      await endCallCleanup();
      addNotification({ type: 'success', title: 'Call ended', message: 'Recording stop requested' });
      navigate(`/admin/appointments/${id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to end call.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = async () => {
    const t = tracksRef.current.find((t) => t.trackMediaType === 'audio');
    if (!t) return;
    await t.setEnabled(muted);
    setMuted((m) => !m);
  };

  const toggleCamera = async () => {
    const t = tracksRef.current.find((t) => t.trackMediaType === 'video');
    if (!t) return;
    await t.setEnabled(cameraOff);
    setCameraOff((c) => !c);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="page-title">Video consultation</h2>
            {active && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live · {fmt(duration)}
              </p>
            )}
            {status && <p className="mt-0.5 text-sm text-slate-500">{status}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          {!active ? (
            <button className="btn-primary" disabled={loading} onClick={start}>
              <Video size={16} />
              {loading
                ? (appointmentStatus === 'calling' ? 'Rejoining...' : 'Starting...')
                : (appointmentStatus === 'calling' ? 'Rejoin call' : 'Start call')
              }
            </button>
          ) : (
            <>
              <button
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${muted ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={toggleMute}
              >
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
                {muted ? 'Unmute' : 'Mute'}
              </button>
              <button
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${cameraOff ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                onClick={toggleCamera}
              >
                {cameraOff ? <VideoOff size={16} /> : <Video size={16} />}
                {cameraOff ? 'Cam on' : 'Cam off'}
              </button>
              <button
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
                onClick={end}
              >
                <PhoneOff size={16} />
                {loading ? 'Ending...' : 'End call'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Permission banner */}
      {permState !== 'granted' && !active && (
        <div className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
          permState === 'denied' ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          <span>
            {permState === 'denied'
              ? '⛔ Camera/microphone blocked. Allow in browser settings → reload.'
              : '🎥 Camera and microphone access needed.'}
          </span>
          {permState !== 'denied' && (
            <button
              className="ml-4 shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              onClick={requestPermissions}
            >
              Allow access
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main layout: videos (top/left) + prescription (bottom/right) */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">

        {/* ── Video area — sticky on xl+ ── */}
        <div className="w-full xl:flex-1 xl:min-w-0 xl:sticky xl:top-4">

          {/* Patient video — LARGE (primary) with doctor PiP inside */}
          {/* padding-top 56.25% = 16:9 ratio — keeps container height fixed */}
          <div className="relative w-full rounded-2xl bg-slate-900 overflow-hidden" style={{ paddingTop: '56.25%' }}>

            {/* Patient (remote) — full area */}
            {remoteUsers.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Video size={48} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{active ? 'Waiting for patient...' : 'Start call to see patient'}</p>
                </div>
              </div>
            ) : (
              remoteUsers.map((user) => (
                <div key={user.uid} id={`remote-video-${user.uid}`} className="absolute inset-0" />
              ))
            )}

            {/* Patient label */}
            <span className="absolute bottom-3 left-3 z-10 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              Patient
            </span>

            {/* Doctor (local) — PiP top-right, WhatsApp style */}
            <div
              className="absolute top-3 right-3 z-20 overflow-hidden rounded-xl shadow-lg border-2 border-white/20 bg-slate-800"
              style={{ width: '22%', aspectRatio: '3/4' }}
            >
              <div id="local-video" className="absolute inset-0" />
              {(!active || cameraOff) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  {cameraOff
                    ? <VideoOff size={20} className="text-slate-500" />
                    : <Video size={20} className="opacity-20 text-slate-500" />
                  }
                </div>
              )}
              <span className="absolute bottom-1.5 left-1.5 z-10 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                You (Doctor)
              </span>
            </div>
          </div>
        </div>

        {/* ── Prescription panel — full width on mobile, fixed sidebar on xl ── */}
        <div
          className="w-full rounded-2xl border border-slate-200 bg-white flex flex-col xl:w-80 xl:shrink-0"
          style={{ maxHeight: '80vh', minHeight: '400px' }}
        >
          {/* Panel header */}
          <div className="px-4 pt-4 pb-2 border-b border-slate-100 shrink-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prescription</p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            {prescriptionSaved ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
                <div className="rounded-full bg-emerald-100 p-4">
                  <Save size={24} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-800">Prescription saved!</p>
                <p className="text-sm text-slate-500">PDF has been generated.</p>
                <button
                  className="btn-secondary text-sm mt-2"
                  onClick={() => setPrescriptionSaved(false)}
                >
                  Edit prescription
                </button>
              </div>
            ) : (
              <PrescriptionPanel
                appointmentId={id}
                onSaved={() => setPrescriptionSaved(true)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
