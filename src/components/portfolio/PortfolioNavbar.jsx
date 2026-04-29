import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { href: '#about', label: 'About' },
  { href: '#specialities', label: 'Specialities' },
  { href: '#services', label: 'Services' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#appointment', label: 'Appointment' },
  { href: '#contact', label: 'Contact' },
];

export default function PortfolioNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-sm shadow-slate-200/20 dark:border-slate-700/70 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-base font-bold text-white shadow-lg shadow-slate-900/10 dark:bg-teal-400 dark:text-slate-950">
            SK
          </span>
          <div className="hidden sm:block">
            <p>Dr. S. K. Poddar</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Consultant Neurologist</p>
          </div>
        </a>

        <div className="hidden items-center gap-4 lg:flex">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setOpen((open) => !open)}
            aria-label="Open mobile menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="space-y-2 border-t border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/95">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#appointment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-teal-400 dark:text-slate-950"
            onClick={() => setOpen(false)}
          >
            Book Appointment <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
