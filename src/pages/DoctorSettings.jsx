import { CheckCircle, RefreshCw, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDoctorProfile, getNextDaySlots, getSettings, updateDoctorProfile, updateSettings } from '../api/settingApi';
import Loader from '../components/Loader.jsx';

const QUICK_TOKENS = [10, 15, 20, 25, 30, 40, 50];

export default function DoctorSettings() {
  const [tab, setTab]                   = useState('practice');
  const [form, setForm]                 = useState(null);
  const [slots, setSlots]               = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [saved, setSaved]               = useState(false);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');
  const [profile, setProfile]           = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved]   = useState(false);

  const loadSlots = async () => {
    setSlotsLoading(true);
    try { setSlots(await getNextDaySlots()); } catch (_) { setSlots(null); }
    finally { setSlotsLoading(false); }
  };

  useEffect(() => {
    getSettings().then(setForm);
    loadSlots();
    getDoctorProfile().then(setProfile).catch(() => {});
  }, []);

  if (!form) return <Loader />;

  const set      = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setTokens = (n) => set('maxSeatsPerDay', n);
  const setP     = (key, value) => setProfile((p) => ({ ...p, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const result = await updateSettings({
        consultationFee: Number(form.consultationFee),
        maxSeatsPerDay:  Number(form.maxSeatsPerDay),
        isAvailable:     Boolean(form.isAvailable),
      });
      setForm(result);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      loadSlots();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const result = await updateDoctorProfile(profile);
      setProfile(result);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (_) {}
    finally { setProfileSaving(false); }
  };

  const maxTokens  = Number(form.maxSeatsPerDay) || 0;
  const bookedSet  = new Set((slots?.tokens || []).filter((t) => t.booked).map((t) => t.tokenNumber));
  const bookedCount = bookedSet.size;
  const previewDate = slots?.date || '—';

  return (
    <section className="space-y-5">
      <h2 className="page-title">Settings</h2>

      {/* Tab switcher */}
      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden w-fit">
        <button type="button"
          className={`px-4 py-2.5 text-sm font-semibold transition ${tab === 'practice' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setTab('practice')}>
          Practice settings
        </button>
        <button type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition ${tab === 'profile' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          onClick={() => setTab('profile')}>
          <User size={14} /> Doctor profile
        </button>
      </div>

      {/* ── Doctor Profile Tab ── */}
      {tab === 'profile' && profile && (
        <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'name',           label: 'Full name',      placeholder: 'S. K. Poddar' },
              { key: 'title',          label: 'Title',          placeholder: 'Dr.' },
              { key: 'specialization', label: 'Specialization', placeholder: 'Consultant Neurologist' },
              { key: 'experience',     label: 'Experience',     placeholder: '20+ years' },
              { key: 'clinicName',     label: 'Clinic name',    placeholder: 'Neurology Centre' },
              { key: 'clinicAddress',  label: 'Clinic address', placeholder: 'Gurudham Colony, Varanasi' },
              { key: 'phone',          label: 'Phone',          placeholder: '+91 ...' },
              { key: 'email',          label: 'Email',          placeholder: 'doctor@example.com' },
              { key: 'photo',          label: 'Photo URL',      placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
                <input className="input text-sm" placeholder={placeholder}
                  value={profile[key] || ''}
                  onChange={(e) => setP(key, e.target.value)} />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">About / General info</label>
            <textarea className="input min-h-[100px] resize-none text-sm"
              placeholder="About the doctor..."
              value={profile.about || ''}
              onChange={(e) => setP('about', e.target.value)} />
          </div>

          {[
            { key: 'specialties',       label: 'Specialties (comma separated)',        placeholder: 'Stroke, Epilepsy, Neuromuscular Disorders' },
            { key: 'visitingHospitals', label: 'Visiting hospitals (comma separated)', placeholder: 'Galaxy Hospital, Varanasi Hospital' },
            { key: 'memberships',       label: 'Memberships & Certifications (comma)', placeholder: 'IMA, NAN' },
            { key: 'achievements',      label: 'Achievements (comma separated)',       placeholder: 'Award 1, Award 2' },
            { key: 'languages',         label: 'Languages (comma separated)',          placeholder: 'Hindi, English' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
              <input className="input text-sm" placeholder={placeholder}
                value={Array.isArray(profile[key]) ? profile[key].join(', ') : (profile[key] || '')}
                onChange={(e) => setP(key, e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} />
            </div>
          ))}

          <button className="btn-primary w-full sm:w-auto" disabled={profileSaving}>
            {profileSaved
              ? <><CheckCircle size={16} /> Saved!</>
              : <><Save size={16} /> {profileSaving ? 'Saving...' : 'Save profile'}</>}
          </button>
        </form>
      )}

      {/* ── Practice Settings Tab ── */}
      {tab === 'practice' && (
        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2 lg:items-start">

          {/* Left: form fields */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">

            {/* Availability toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">Accepting appointments</p>
                <p className="text-xs text-slate-400 mt-0.5">Toggle to open/close bookings for next day</p>
              </div>
              <button type="button" onClick={() => set('isAvailable', !form.isAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${form.isAvailable ? 'bg-teal-600' : 'bg-slate-300'}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${form.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Consultation fee */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Consultation fee (₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <input className="input pl-8" type="number" min="1" required
                  value={form.consultationFee}
                  onChange={(e) => set('consultationFee', e.target.value)} />
              </div>
            </div>

            {/* Max tokens */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Max tokens per day</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {QUICK_TOKENS.map((n) => (
                  <button key={n} type="button" onClick={() => setTokens(n)}
                    className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold transition ${maxTokens === n ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    {n}
                  </button>
                ))}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Custom:</span>
                  <input
                    className="w-20 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-center font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    type="number" min="1" max="200"
                    value={!QUICK_TOKENS.includes(maxTokens) ? maxTokens : ''}
                    placeholder="—"
                    onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v > 0) setTokens(v); }} />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Patients will receive token numbers <span className="font-semibold text-slate-600">1 – {maxTokens}</span>
              </p>
            </div>

            {error && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">{error}</p>}

            <button className="btn-primary w-full sm:w-auto" type="submit" disabled={saving}>
              {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save settings'}</>}
            </button>
          </div>

          {/* Right: token preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-slate-800">
                Token preview <span className="ml-2 text-xs font-normal text-slate-400">{previewDate}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${form.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {form.isAvailable ? 'Open' : 'Closed'}
                </span>
                <button type="button" onClick={loadSlots}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" title="Refresh slots">
                  <RefreshCw size={13} className={slotsLoading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-teal-100 border border-teal-200" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-red-100 border border-red-200" /> Booked</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-slate-100 border border-slate-200" /> Closed</span>
            </div>

            {maxTokens === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Set max tokens to see preview</p>
            ) : (
              <>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(maxTokens, 10)}, minmax(0, 1fr))` }}>
                  {Array.from({ length: Math.min(maxTokens, 50) }, (_, i) => i + 1).map((n) => {
                    const isBooked = bookedSet.has(n);
                    const isClosed = !form.isAvailable;
                    let cls = 'bg-teal-50 text-teal-700 border border-teal-100';
                    if (isBooked)      cls = 'bg-red-100 text-red-600 border border-red-200 line-through opacity-70';
                    else if (isClosed) cls = 'bg-slate-100 text-slate-400 border border-slate-200';
                    return (
                      <div key={n}
                        title={isBooked ? `Token ${n} — Booked` : isClosed ? `Token ${n} — Closed` : `Token ${n} — Available`}
                        className={`flex items-center justify-center rounded-lg text-xs font-bold py-1.5 ${cls}`}>
                        {n}
                      </div>
                    );
                  })}
                </div>

                {maxTokens > 50 && (
                  <p className="mt-3 text-center text-xs text-slate-400">+ {maxTokens - 50} more tokens (showing first 50)</p>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Total tokens</span>
                    <span className="font-bold text-slate-900">{maxTokens}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm">
                    <span className="text-red-600 font-medium">Booked</span>
                    <span className="font-bold text-red-700">{bookedCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 text-sm">
                    <span className="text-teal-700 font-medium">Remaining</span>
                    <span className="font-bold text-teal-800">{Math.max(maxTokens - bookedCount, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Fee per token</span>
                    <span className="font-bold text-slate-900">₹{form.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <span className="text-slate-500">Max daily revenue</span>
                    <span className="font-bold text-slate-900">₹{(maxTokens * Number(form.consultationFee)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
