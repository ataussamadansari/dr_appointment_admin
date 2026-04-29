import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
  {
    quote: 'Dr. Poddar guided me through my stroke recovery with patience and expertise. Every visit felt reassuring.',
    name: 'Pooja Verma',
    role: 'Stroke survivor',
  },
  {
    quote: 'My epilepsy treatment plan was clear and effective. The follow-up care has been incredibly supportive.',
    name: 'Ravi Tiwari',
    role: 'Epilepsy patient',
  },
  {
    quote: 'The team was professional, and the diagnosis was precise. Highly recommended for neuromuscular issues.',
    name: 'Anita Singh',
    role: 'Care partner',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  const next = () => setActive((current) => (current + 1) % testimonials.length);
  const prev = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);

  return (
    <motion.section
      id="testimonials"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Testimonials</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Patients trust Dr. Poddar for compassionate, expert care</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Real patient stories that reflect confidence in treatment, communication and follow-up at every stage.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-950/20"
          >
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={18} className="text-amber-400" />
              ))}
            </div>
            <p className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">“{testimonials[active].quote}”</p>
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600 dark:border-slate-700/80 dark:text-slate-300">
              <p className="font-semibold text-slate-950 dark:text-white">{testimonials[active].name}</p>
              <p>{testimonials[active].role}</p>
            </div>
          </motion.div>

          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-slate-600 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/75 dark:text-slate-300">
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm dark:bg-slate-950/90">
              <p className="font-semibold text-slate-950 dark:text-white">Find calm and confidence</p>
              <p className="mt-2 text-sm leading-6">Personalized neurology care that helps each patient feel heard and supported.</p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-300 bg-white text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-300 bg-white text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
