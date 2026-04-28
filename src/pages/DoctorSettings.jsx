import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../api/settingApi';
import Loader from '../components/Loader.jsx';

export default function DoctorSettings() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getSettings().then(setForm); }, []);
  if (!form) return <Loader />;

  const set = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (e) => {
    e.preventDefault();
    const result = await updateSettings({
      consultationFee: Number(form.consultationFee),
      maxSeatsPerDay: Number(form.maxSeatsPerDay),
      isAvailable: Boolean(form.isAvailable)
    });
    setForm(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Doctor settings</h2>
      <form onSubmit={submit} className="mt-6 grid max-w-lg gap-4 rounded-lg border border-slate-200 bg-white p-5">
        <label className="text-sm font-medium">
          Consultation fee (₹)
          <input
            className="input mt-1"
            type="number"
            min="1"
            value={form.consultationFee}
            onChange={(e) => set('consultationFee', e.target.value)}
          />
        </label>

        <label className="text-sm font-medium">
          Max tokens per day
          <input
            className="input mt-1"
            type="number"
            min="1"
            max="100"
            value={form.maxSeatsPerDay}
            onChange={(e) => set('maxSeatsPerDay', e.target.value)}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Patients will get token numbers 1 to {form.maxSeatsPerDay}
          </span>
        </label>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={form.isAvailable}
            onChange={(e) => set('isAvailable', e.target.checked)}
          />
          Accepting appointments for next day
        </label>

        <button className="btn-primary flex items-center gap-2" type="submit">
          <Save size={16} />
          {saved ? 'Saved!' : 'Save settings'}
        </button>
      </form>
    </section>
  );
}
