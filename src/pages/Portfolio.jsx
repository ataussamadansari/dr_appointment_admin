import PortfolioNavbar from '../components/portfolio/PortfolioNavbar.jsx';
import HeroSection from '../components/portfolio/HeroSection.jsx';
import SpecialtiesSection from '../components/portfolio/SpecialtiesSection.jsx';
import ServicesSection from '../components/portfolio/ServicesSection.jsx';
import TimelineSection from '../components/portfolio/TimelineSection.jsx';
import TestimonialsSection from '../components/portfolio/TestimonialsSection.jsx';
import AppointmentSection from '../components/portfolio/AppointmentSection.jsx';
import ContactSection from '../components/portfolio/ContactSection.jsx';
import Footer from '../components/portfolio/Footer.jsx';

function AboutSection() {
  return (
    <section id="about" className="px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-slate-950/20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600 dark:text-teal-300">About Dr. Poddar</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">A trusted neurologist with a calm, confident approach</h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Dr. S. K. Poddar is an experienced Consultant Neurologist at the Neurology Centre, Gurudham Colony, with more than two decades of experience supporting patients through stroke, epilepsy and neuromuscular disorders. His practice blends clinical precision with personalised care at Galaxy Hospital and Varanasi Hospital.
            </p>
          </div>
          <div className="grid gap-4 rounded-[1.75rem] bg-slate-50 p-8 shadow-sm dark:bg-slate-900/80">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700/80 dark:bg-slate-950/95">
              <p className="text-sm text-slate-500 dark:text-slate-400">Experience</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">20+ years</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700/80 dark:bg-slate-950/95">
              <p className="text-sm text-slate-500 dark:text-slate-400">Hospital affiliations</p>
              <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                <li>Neurology Centre, Gurudham Colony</li>
                <li>Galaxy Hospital</li>
                <li>Varanasi Hospital</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <PortfolioNavbar />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-teal-200/40 to-transparent dark:from-teal-500/20" />
        <HeroSection />
        <AboutSection />
        <SpecialtiesSection />
        <ServicesSection />
        <TimelineSection />
        <TestimonialsSection />
        <AppointmentSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
