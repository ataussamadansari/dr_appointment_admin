import { useEffect, useRef, useState } from 'react';
import { getMedicineSuggestions } from '../api/prescriptionApi';

/**
 * Medicine name input with autocomplete from past prescriptions.
 * When a suggestion is selected, it auto-fills dosage/duration/instructions too.
 *
 * Props:
 *   value        – current name value
 *   onChange     – (field, value) => void  — called for name changes
 *   onFill       – (medicine) => void      — called when suggestion selected (fills all fields)
 *   placeholder  – input placeholder
 *   className    – extra classes for the input
 */
export default function MedicineAutocomplete({ value, onChange, onFill, placeholder = 'Medicine name', className = '' }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!value || value.length < 1) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getMedicineSuggestions(value);
        setSuggestions(data || []);
        setOpen((data || []).length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (med) => {
    onFill(med);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        className={`input text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => onChange('name', e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />

      {/* Loading indicator */}
      {loading && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        </span>
      )}

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full z-50 mt-1 w-full min-w-[220px] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          {suggestions.map((med) => (
            <li key={med.name}>
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left hover:bg-teal-50 transition"
                onMouseDown={(e) => { e.preventDefault(); select(med); }}
              >
                <p className="text-sm font-semibold text-slate-800">{med.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {[med.dosage, med.duration, med.instructions].filter(Boolean).join(' · ') || 'No details'}
                  {med.count > 1 && <span className="ml-1.5 text-teal-500">×{med.count}</span>}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
