import { Activity, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const specialities = [
  {
    title: 'Stroke Care',
    description: 'Rapid diagnosis, rehabilitation planning and preventive care for stroke survivors.',
    icon: Activity,
  },
  {
    title: 'Epilepsy Management',
    description: 'Individualised treatment plans to minimise seizures and improve quality of life.',
    icon: Zap,
  },
  {
    title: 'Neuromuscular Disorders',
    description: 'Expert care for muscle weakness, neuropathy, and chronic neuromuscular symptoms.',
    icon: Brain,
  },
];

export default function SpecialtiesSection() {
  return (
    <motion.section
      id="specialities"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Specialities</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Focused neurological care with measurable results</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Dr. Poddar combines clinical expertise and compassionate support to deliver advanced neurology treatment and follow-up care.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {specialities.map((item) => (
            <div key={item.title} className="group rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-teal-200/30 dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-950/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-200">
                <item.icon size={24} />
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
