import { ClipboardList, HeartPulse, Stethoscope, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  {
    title: 'Consultation',
    description: 'In-depth neurological evaluation with personalised care recommendations.',
    icon: Stethoscope,
  },
  {
    title: 'Diagnosis',
    description: 'Accurate assessment using clinical expertise and advanced diagnostic guidance.',
    icon: ClipboardList,
  },
  {
    title: 'Treatment Plans',
    description: 'Tailored therapy strategies for complex neurological conditions and recovery.',
    icon: HeartPulse,
  },
  {
    title: 'Follow-up Care',
    description: 'Ongoing support to track progress and adapt treatment over time.',
    icon: Repeat,
  },
];

export default function ServicesSection() {
  return (
    <motion.section
      id="services"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Services</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Comprehensive neurology services designed for recovery</h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Every patient receives expert guidance from diagnosis through follow-up care, with a clear emphasis on confidence and comfort.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">Trusted by:</p>
            <ul className="mt-4 space-y-3">
              <li>Neurology Centre</li>
              <li>Galaxy Hospital</li>
              <li>Varanasi Hospital</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {services.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/30 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-teal-200/20 dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-950/20">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-200">
                <item.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
