const LAST_UPDATED = 'April 29, 2026';

const sections = [
  {
    title: '1. Information We Collect',
    points: [
      'Name, phone number, email address, and any details you provide while booking an appointment.',
      'Basic device and usage information such as browser type, IP address, and pages visited.',
      'Transaction-related information required to confirm successful payment.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    points: [
      'To schedule and manage appointments.',
      'To provide medical consultation-related communication and support.',
      'To process and confirm payments made through Razorpay.',
      'To improve website performance, security, and user experience.',
    ],
  },
  {
    title: '3. Razorpay Payments',
    points: [
      'We use Razorpay as our third-party payment gateway for secure online payments.',
      'When you make a payment, your payment details are processed directly by Razorpay on their secure infrastructure.',
      'We do not store your full card number, CVV, or netbanking credentials on this website.',
      'Payment processing is subject to Razorpay terms and privacy practices available at https://razorpay.com/privacy/.',
    ],
  },
  {
    title: '4. Information Sharing',
    points: [
      'We do not sell your personal information.',
      'We may share limited information with trusted service providers only when necessary to operate this website and services.',
      'We may disclose information if required by law, regulation, or legal process.',
    ],
  },
  {
    title: '5. Data Security',
    points: [
      'We use reasonable administrative and technical safeguards to protect your information.',
      'No online system can be guaranteed as 100% secure, but we continuously monitor and improve our controls.',
    ],
  },
  {
    title: '6. Data Retention',
    points: [
      'We retain personal information only as long as needed for service delivery, recordkeeping, legal, and compliance purposes.',
    ],
  },
  {
    title: '7. Your Rights',
    points: [
      'You may request access, correction, or deletion of your personal data, subject to applicable law.',
      'You may contact us to withdraw consent where processing is based on consent.',
    ],
  },
  {
    title: '8. Contact Us',
    points: [
      'For privacy-related questions, contact: contact@doctorpodar.com',
      'Phone: +91 98765 43210',
      'Address: Neurology Centre, Gurudham Colony, Varanasi, India',
    ],
  },
  {
    title: '9. Policy Updates',
    points: [
      'We may update this Privacy Policy from time to time.',
      'Any changes will be posted on this page with an updated date.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/25 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Last updated: {LAST_UPDATED}</p>

        <p className="mt-8 text-base leading-8 text-slate-700 dark:text-slate-300">
          This Privacy Policy explains how Dr. S. K. Poddar collects, uses, and protects personal information when you use this website and related services, including online payments via Razorpay.
        </p>

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
