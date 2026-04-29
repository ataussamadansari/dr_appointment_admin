import { CalendarDays, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppointmentSection() {
  const whatsappNumber = '918299632202';
  const whatsappMessage = `Hello Dr. Poddar, I would like to book a neurology appointment.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.section
      id="appointment"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-slate-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Appointment</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Schedule a consultation with Dr. Poddar</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Tap the button and start a WhatsApp chat to book your neurology appointment instantly.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="flex items-center gap-3 text-teal-700 dark:text-teal-300">
                <Phone size={20} />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Phone</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">+91 82996 32202</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-950">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <CalendarDays size={20} />
                <div>
                  <p className="text-sm font-semibold">Clinic Hours</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mon - Sat, 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/20">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Quick booking</p>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">Book directly over WhatsApp</h3>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Start a chat with Dr. Poddar’s clinic to request your preferred appointment date and treatment details instantly.
            </p>
            <button
              type="button"
              onClick={openWhatsApp}
              className="btn-primary w-full"
            >
              Open WhatsApp
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You will be redirected to WhatsApp with a message ready to send.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
