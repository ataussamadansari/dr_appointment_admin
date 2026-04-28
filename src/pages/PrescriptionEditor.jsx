import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPrescription } from '../api/prescriptionApi';

export default function PrescriptionEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const submit = async (e) => {
    e.preventDefault();
    await createPrescription({
      appointmentId: id,
      ...form,
      testsSuggested: form.testsSuggested.split(',').map((x) => x.trim()).filter(Boolean)
    });
    navigate(`/appointments/${id}`);
  };
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">Prescription editor</h2>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <textarea className="input min-h-24" placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
        <div className="space-y-3">
          {form.medicines.map((medicine, idx) => (
            <div key={idx} className="grid gap-2 rounded-md border border-slate-100 p-3 md:grid-cols-5">
              {['name', 'dosage', 'duration', 'instructions'].map((key) => <input key={key} className="input" placeholder={key} value={medicine[key]} onChange={(e) => updateMedicine(idx, key, e.target.value)} />)}
              <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, medicines: form.medicines.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', duration: '', instructions: '' }] })}><Plus size={16} /> Add medicine</button>
        </div>
        <textarea className="input min-h-20" placeholder="Instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        <input className="input" placeholder="Tests suggested, comma separated" value={form.testsSuggested} onChange={(e) => setForm({ ...form, testsSuggested: e.target.value })} />
        <input className="input" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
        <button className="btn-primary"><Save size={16} /> Generate PDF</button>
      </form>
    </section>
  );
}
