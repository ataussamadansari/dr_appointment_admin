import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPrescription } from '../api/prescriptionApi';
import MedicineAutocomplete from '../components/MedicineAutocomplete.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function PrescriptionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    instructions: '',
    testsSuggested: '',
    followUpDate: '',
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
        appointmentId: id,
        ...form,
        testsSuggested: form.testsSuggested.split(',').map((x) => x.trim()).filter(Boolean),
      });
      addNotification({ type: 'success', title: 'Prescription saved', message: 'PDF generated successfully' });
      navigate(`/appointments/${id}`);
    } catch (err) {
      addNotification({ type: 'error', title: 'Save failed', message: err?.response?.data?.message || err.message || 'Failed to save prescription' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <button
          className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <h2 className="page-title">Prescription editor</h2>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Diagnosis */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Diagnosis *</label>
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="Enter diagnosis..."
            required
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          />
        </div>

        {/* Medicines */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Medicines</label>
          <div className="space-y-3">
            {form.medicines.map((med, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                {/* 2-col on mobile, 4-col on md */}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <MedicineAutocomplete
                    value={med.name}
                    placeholder="Medicine name *"
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
                  {[
                    { key: 'dosage', placeholder: 'Dosage (e.g. 500mg)' },
                    { key: 'duration', placeholder: 'Duration (e.g. 5 days)' },
                    { key: 'instructions', placeholder: 'Instructions' },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      className="input text-sm"
                      placeholder={placeholder}
                      value={med[key]}
                      onChange={(e) => updateMedicine(idx, key, e.target.value)}
                    />
                  ))}
                </div>
                {form.medicines.length > 1 && (
                  <button
                    type="button"
                    className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    onClick={() => removeMedicine(idx)}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary mt-3 text-sm" onClick={addMedicine}>
            <Plus size={15} /> Add medicine
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Instructions for patient</label>
          <textarea
            className="input min-h-[72px] resize-none"
            placeholder="General instructions..."
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
        </div>

        {/* Tests + Follow-up — side by side on sm+ */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tests suggested</label>
            <input
              className="input"
              placeholder="CBC, LFT, ... (comma separated)"
              value={form.testsSuggested}
              onChange={(e) => setForm({ ...form, testsSuggested: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Follow-up date</label>
            <input
              className="input"
              type="date"
              value={form.followUpDate}
              onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
            />
          </div>
        </div>

        <button className="btn-primary w-full sm:w-auto" disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Generate PDF'}
        </button>
      </form>
    </section>
  );
}
