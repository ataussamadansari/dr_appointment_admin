import { CheckCircle, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createSymptom, deleteSymptom, listSymptoms, updateSymptom } from '../api/symptomApi';
import Loader from '../components/Loader.jsx';

const blank = { name: '', description: '', sortOrder: 0, isActive: true };

export default function SymptomsMaster() {
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = () => listSymptoms().then(setRows);
  useEffect(() => { load(); }, []);

  if (!rows) return <Loader />;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setForm(blank);
    setEditing(null);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: Boolean(form.isActive)
      };
      editing ? await updateSymptom(editing, payload) : await createSymptom(payload);
      reset();
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save symptom');
    } finally {
      setSaving(false);
    }
  };

  const edit = (row) => {
    setEditing(row._id);
    setForm({
      name: row.name || '',
      description: row.description || '',
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive !== false
    });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    await deleteSymptom(row._id);
    await load();
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="page-title">Symptoms Master</h2>
        <p className="mt-1 text-sm text-slate-500">Active symptoms are shown to patients in the mobile app.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr_120px_auto]">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Symptom name</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Headache" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Description</label>
            <input className="input" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Optional note" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Sort order</label>
            <input className="input" type="number" min="0" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
          </div>
          <label className="flex items-end gap-2 pb-3 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
            Active
          </label>
        </div>

        {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn-primary" disabled={saving}>
            {saved ? <><CheckCircle size={16} /> Saved</> : editing ? <><Save size={16} /> Update symptom</> : <><Plus size={16} /> Add symptom</>}
          </button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={reset}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id}>
                <td className="px-4 py-3 font-semibold text-slate-800">{row.name}</td>
                <td className="px-4 py-3 text-slate-500">{row.description || '-'}</td>
                <td className="px-4 py-3 text-slate-500">{row.sortOrder || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={() => edit(row)}>
                      <Pencil size={15} />
                    </button>
                    <button type="button" className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => remove(row)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan="5">No symptoms added yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
