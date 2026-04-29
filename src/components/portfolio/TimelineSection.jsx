import { CalendarDays, Award, Briefcase, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const timeline = [
  { year: '2004', title: 'Started neurology practice', description: 'Opened Neurology Centre at Gurudham Colony with a focus on stroke and epilepsy care.', icon: Briefcase },
  { year: '2010', title: 'Hospital affiliation', description: 'Joined Galaxy Hospital as a visiting neurologist for advanced patient care.', icon: HeartPulse },
  { year: '2016', title: 'Expanded stroke program', description: 'Launched structured stroke rehabilitation and follow-up care for local patients.', icon: CalendarDays },
  { year: '2022', title: 'Recognised expert', description: 'Trusted consultant at Varanasi Hospital for complex neuromuscular and epilepsy cases.', icon: Award },
];

export default function TimelineSection() {
  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Experience</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">A career shaped by meaningful neurology milestones</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            The timeline highlights Dr. Poddar’s journey from founding the local neurology centre to serving as a leading consultant across Varanasi hospitals.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {timeline.map((item, index) => (
            <div key={item.year} className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-950/20">
              <div className="absolute -left-6 top-6 flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-600 text-white shadow-xl">
                <item.icon size={20} />
              </div>
              <div className="ml-10 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.year}</p>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
