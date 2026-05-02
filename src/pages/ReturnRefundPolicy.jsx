const LAST_UPDATED = 'April 29, 2026';

const sections = [
  {
    title: '1. Policy Overview',
    points: [
      'This Return and Refund Policy applies to appointment and consultation payments made through this website.',
      'As medical consultation is a service and not a physical product, return of services is not applicable.',
    ],
  },
  {
    title: '2. Cancellation by Patient',
    points: [
      'If you cancel before the scheduled consultation time, refund eligibility will be reviewed based on timing and service status.',
      'No-show cases or cancellations after consultation start may not be eligible for refund.',
    ],
  },
  {
    title: '3. Cancellation by Doctor/Clinic',
    points: [
      'If an appointment is cancelled from our side and an alternate slot is not accepted, you will be eligible for a full refund.',
    ],
  },
  {
    title: '4. Duplicate or Failed Transactions',
    points: [
      'If money is debited but appointment confirmation is not received, please contact us with transaction details.',
      'Verified duplicate or failed transactions are eligible for full refund.',
    ],
  },
  {
    title: '5. Refund Processing Timeline',
    points: [
      'Approved refunds are initiated through Razorpay to the original payment method.',
      'Banks and payment providers usually take 5 to 10 business days to reflect the refund after initiation.',
    ],
  },
  {
    title: '6. Non-Refundable Situations',
    points: [
      'Completed consultations are generally non-refundable.',
      'Incorrect details provided during booking that result in service delay or failure may be non-refundable.',
      'Missed appointments without prior notice may be non-refundable.',
    ],
  },
  {
    title: '7. How to Request a Refund',
    points: [
      'Email us at contact@doctorpodar.com with your name, appointment date, and payment transaction ID.',
      'You may also call +91 98765 43210 for support on refund requests.',
      'Requests are reviewed and responded to within a reasonable time based on case details.',
    ],
  },
  {
    title: '8. Razorpay Reference',
    points: [
      'Payment handling is managed via Razorpay.',
      'For payment gateway practices, refer to Razorpay policies at https://razorpay.com/privacy/.',
    ],
  },
];

export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/25 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Return and Refund Policy</h1>
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
