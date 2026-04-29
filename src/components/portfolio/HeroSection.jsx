import { ArrowRight, HeartPulse, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
  { value: '20+', label: 'Years of experience' },
  { value: '4.8K+', label: 'Patients treated' },
  { value: '3', label: 'Hospital affiliations' },
];

export default function HeroSection() {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative overflow-hidden px-4 pt-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 ring-1 ring-teal-100 dark:bg-teal-500/10 dark:text-teal-200 dark:ring-teal-500/20">
              <ShieldCheck size={18} /> Trusted neurology care in Varanasi
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Expert Neurology Care with 20+ Years of Compassionate Treatment
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                Dr. S. K. Poddar provides premium neurological care for stroke, epilepsy and neuromuscular disorders from the Neurology Centre, Gurudham Colony.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#appointment"
                className="btn-primary inline-flex items-center gap-2"
              >
                Book Appointment <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Contact Clinic
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900/80">
                  <p className="text-3xl font-semibold text-slate-950 dark:text-white">{metric.value}</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-sky-50 p-6 shadow-2xl shadow-slate-200/40 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-slate-950/50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_38%)]" />
            <div className="relative grid gap-4 sm:grid-cols-[0.95fr_0.9fr]">
              <div className="space-y-4 rounded-[1.75rem] bg-white/90 p-5 shadow-lg shadow-slate-200/40 dark:bg-slate-950/95 dark:shadow-slate-950/20">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200">
                    <HeartPulse size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Clinic Location</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gurudham Colony, Varanasi</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-200 dark:bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80"
                    alt="Consulting neurologist"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="grid gap-4 rounded-[1.75rem] bg-slate-950/95 p-5 text-slate-100 shadow-lg shadow-slate-950/40 dark:bg-slate-900/95">
                <div className="rounded-[1.5rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-teal-300">Visiting consultant</p>
                  <p className="mt-3 text-lg font-semibold">Galaxy Hospital & Varanasi Hospital</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Specialities</p>
                  <p className="mt-3 text-lg font-semibold">Stroke care, epilepsy management & neuromuscular disorders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
