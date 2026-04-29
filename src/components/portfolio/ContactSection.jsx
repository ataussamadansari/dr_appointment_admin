import { MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="px-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">Contact</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Visit the Neurology Centre</h2>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
            Clinic location and direct contact details are provided below for easy booking and directions.
          </p>

          <div className="space-y-4 rounded-[1.75rem] bg-slate-50 p-6 dark:bg-slate-900/80">
            <div className="flex items-start gap-4">
              <span className="mt-1 rounded-3xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-200">
                <MapPin size={20} />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Address</p>
                <a
                  href="https://maps.app.goo.gl/zb7u1sfRsnyFhDTw5"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-sm text-teal-600 underline decoration-teal-300 hover:text-teal-700 dark:text-teal-300"
                >
                  Neurology Centre, Gurudham Colony, Varanasi, India
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1 rounded-3xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-200">
                <Phone size={20} />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Phone</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-1 rounded-3xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-500/10 dark:text-teal-200">
                <Mail size={20} />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">contact@doctorpodar.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-200/30 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/20">
          <iframe
            title="Neurology Centre location"
            className="h-full min-h-[420px] w-full border-0"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5627.046057362972!2d82.9958392!3d25.2933942!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e31f732ffb8cb%3A0x17baab3bf482a203!2sDr%20S%20K%20Poddar%20Neurology%20Center!5e1!3m2!1sen!2sin!4v1777448356649!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </motion.section>
  );
}
