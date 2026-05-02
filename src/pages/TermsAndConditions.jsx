const LAST_UPDATED = 'April 29, 2026';

const sections = [
  {
    title: '1. Acceptance of Terms',
    points: [
      'By accessing this website and booking consultation services, you agree to these Terms and Conditions.',
      'If you do not agree, please do not use this website or proceed with bookings.',
    ],
  },
  {
    title: '2. Medical Service Scope',
    points: [
      'Online consultations are provided for guidance and follow-up as applicable.',
      'Emergency conditions should be handled by immediately contacting local emergency services or visiting the nearest hospital.',
      'The doctor reserves the right to decline or reschedule appointments when clinically necessary.',
    ],
  },
  {
    title: '3. Appointments and User Responsibility',
    points: [
      'You must provide accurate personal and medical details while booking.',
      'You are responsible for joining consultations on time using the shared appointment details.',
      'Misuse, abusive behavior, or fraudulent bookings may lead to cancellation of services.',
    ],
  },
  {
    title: '4. Pricing and Payments',
    points: [
      'Consultation fees are displayed at the time of booking and are subject to change without prior notice.',
      'All online payments are processed securely through Razorpay.',
      'By paying online, you agree to Razorpay terms and policies in addition to these Terms and Conditions.',
    ],
  },
  {
    title: '5. Cancellations and Refunds',
    points: [
      'Refund eligibility and timelines are governed by our Return and Refund Policy.',
      'Approved refunds are processed back to the original payment method via Razorpay.',
    ],
  },
  {
    title: '6. Intellectual Property',
    points: [
      'All website content including text, branding, and design is owned or licensed by the practice.',
      'No content may be copied, reproduced, or distributed without prior written permission.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    points: [
      'This website and services are provided on a best-effort basis.',
      'We are not liable for interruptions caused by internet issues, third-party platform downtime, or factors outside reasonable control.',
    ],
  },
  {
    title: '8. Privacy',
    points: [
      'Collection and use of personal data are governed by our Privacy Policy.',
    ],
  },
  {
    title: '9. Contact Information',
    points: [
      'For questions regarding these terms, contact: contact@doctorpodar.com',
      'Phone: +91 98765 43210',
      'Address: Neurology Centre, Gurudham Colony, Varanasi, India',
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/25 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Terms and Conditions</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Last updated: {LAST_UPDATED}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-slate-700 dark:text-slate-300">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <a href="/" className="font-medium text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
