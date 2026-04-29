import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const nav = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#appointment', label: 'Appointment' },
  { href: '#contact', label: 'Contact' },
];

const socials = [
  { href: 'https://www.linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://www.facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com', icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 px-4 py-12 dark:border-slate-700/80 dark:bg-slate-950/90 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-base font-bold text-white dark:bg-teal-400 dark:text-slate-950">SK</div>
            <div>
              <p className="text-base font-semibold text-slate-950 dark:text-white">Dr. S. K. Poddar</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Consultant Neurologist · Varanasi</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="inline-flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </div>
            <div className="inline-flex items-center gap-2">
              <Mail size={16} /> contact@doctorpodar.com
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="flex flex-wrap items-center gap-3">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-700/80 dark:text-slate-400">
        © 2026 Dr. S. K. Poddar. All rights reserved.
      </div>
    </footer>
  );
}
