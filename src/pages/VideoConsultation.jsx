import AgoraRTC from 'agora-rtc-sdk-ng';
import { ArrowLeft, Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { endCall, startCall } from '../api/agoraApi';
import { useNotifications } from '../context/NotificationContext.jsx';

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
  const durationRef = useRef(null);

  useEffect(() => {
    checkPermissions();
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
      const data = await startCall(id);
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers((prev) => [...prev.filter((u) => u.uid !== user.uid), user]);
          setTimeout(() => user.videoTrack?.play(`remote-video-${user.uid}`), 150);
        }
        if (mediaType === 'audio') user.audioTrack?.play();
      });
      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });
      client.on('user-left', (user) => setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid)));

      setStatus('Joining channel...');
      await client.join(data.rtc.appId, data.rtc.channelName, data.rtc.token, data.rtc.uid);

      setStatus('Starting camera & microphone...');
      const tracks = [];
      try {
        tracks.push(await AgoraRTC.createMicrophoneAudioTrack());
      } catch (e) { console.warn('Mic unavailable:', e.message); }
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
      addNotification({ type: 'success', title: 'Call started', message: 'Patient has been notified' });

      // Duration timer
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

  const end = async () => {
    setLoading(true);
    setError('');
    try {
      tracksRef.current.forEach((t) => { try { t.stop(); t.close(); } catch (_) {} });
      tracksRef.current = [];
      if (clientRef.current) { await clientRef.current.leave(); clientRef.current = null; }
      await endCall(id);
      clearInterval(durationRef.current);
      setActive(false);
      setRemoteUsers([]);
      setDuration(0);
      addNotification({ type: 'success', title: 'Call ended', message: 'Recording stop requested' });
      navigate(`/appointments/${id}`);
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
              {loading ? 'Starting...' : 'Start call'}
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

      {/* Video grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Local */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
          <div id="local-video" className="h-full w-full" />
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Video size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">Camera preview</p>
              </div>
            </div>
          )}
          {active && cameraOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <VideoOff size={40} className="text-slate-600" />
            </div>
          )}
          <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            You (Doctor)
          </span>
        </div>

        {/* Remote */}
        {remoteUsers.length === 0 ? (
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-800">
            <div className="text-center text-slate-400">
              <Video size={40} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">{active ? 'Waiting for patient...' : 'Start call to see patient'}</p>
            </div>
          </div>
        ) : (
          remoteUsers.map((user) => (
            <div key={user.uid} className="relative aspect-video overflow-hidden rounded-2xl bg-slate-800">
              <div id={`remote-video-${user.uid}`} className="h-full w-full" />
              <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                Patient
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
