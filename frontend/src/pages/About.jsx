import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaTint,
  FaHeart,
  FaSearch,
  FaHandsHelping,
  FaBell,
  FaArrowRight,
} from "react-icons/fa";

const features = [
  {
    number: "01",
    title: "Find Suitable Donors",
    description:
      "Search registered donors by blood group and city to find relevant matches.",
    icon: <FaSearch className="text-red-600 dark:text-red-400" />,
  },
  {
    number: "02",
    title: "Send Blood Requests",
    description:
      "Patients can submit requests and follow their status through the platform.",
    icon: <FaTint className="text-red-600 dark:text-red-400" />,
  },
  {
    number: "03",
    title: "Support Donors",
    description:
      "Donors can manage their availability and respond to incoming requests.",
    icon: <FaHandsHelping className="text-red-600 dark:text-red-400" />,
  },
  {
    number: "04",
    title: "Track Updates",
    description:
      "Notifications help users stay informed about request activity.",
    icon: <FaBell className="text-red-600 dark:text-red-400" />,
  },
];

export default function About() {
  return (
    <main className="overflow-hidden bg-gradient-to-b from-[#fff6f6] via-[#ffeded]/50 to-[#fff5f5] text-slate-800 transition-colors duration-200 dark:from-[#0f0406] dark:via-[#19060b] dark:to-[#0d0205] dark:text-slate-100">
      
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24">
        {/* Soft Ambient Glow */}
        <div className="absolute -left-28 -top-10 h-96 w-96 rounded-full bg-red-400/15 blur-3xl pointer-events-none dark:bg-red-600/10" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl pointer-events-none dark:bg-rose-900/15" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-200/90 bg-rose-50/90 px-4 py-1.5 text-xs font-bold text-red-600 shadow-sm dark:border-red-900/60 dark:bg-red-950/70 dark:text-red-300">
              <span className="text-sm">❤️</span> About LifeLink
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white md:text-6xl">
              Connecting people.
              <span className="block text-red-600 dark:text-red-500">
                Supporting lives.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
              LifeLink is a blood donation platform designed to make donor
              discovery and blood request management more organized,
              accessible and convenient.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/find-donor"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-500/35"
              >
                Find a Donor &nbsp; →
              </Link>

              <Link
                to="/request-blood"
                className="inline-flex items-center gap-2 rounded-full border-2 border-red-600 bg-white/90 px-6 py-3.5 text-sm font-bold text-red-600 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-50 dark:bg-slate-900/80 dark:text-red-400 dark:hover:bg-slate-800"
              >
                Request Blood
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-red-500/20 blur-3xl dark:bg-red-900/30" />

            <div className="relative rounded-3xl border-2 border-rose-200/80 bg-white/95 p-8 shadow-2xl shadow-red-500/10 md:p-10 dark:border-red-950/70 dark:bg-slate-900/95">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-5xl shadow-inner dark:bg-red-950/60">
                🩸
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                Our purpose
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-black leading-snug text-slate-900 dark:text-white">
                Make finding a suitable donor simpler.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                Bring donor information, blood requests and request updates
                together in one platform.
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-rose-100 pt-6 dark:border-slate-800">
                <span className="text-2xl text-red-500">❤️</span>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Built around connection, care and accessibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm">
            Our mission
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            Making donor discovery more organized
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-8 text-slate-600 dark:text-slate-300">
            Finding a suitable donor can take time. LifeLink brings searchable
            donor details and digital request management into a single
            experience, helping patients and donors coordinate more easily.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl mb-16">
        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/70 p-8 sm:p-12 shadow-sm backdrop-blur-sm dark:border-red-950/70 dark:bg-slate-900/60">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm">
              What you can do
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
              One platform, connected journeys
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-400">
              Explore the main features available in the LifeLink application.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-rose-200/80 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl hover:shadow-red-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-red-600/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl transition group-hover:scale-110">{feature.icon}</span>
                  <span className="text-xs font-black text-red-500 dark:text-red-400">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400 sm:text-sm">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
              A simple journey from search to update
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              The platform connects the user interface with backend APIs and
              a database to manage account information, donor searches and
              blood requests.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["1", "Explore", "Search donors using available filters by blood group and city."],
              ["2", "Connect", "Submit a request to a suitable donor securely."],
              ["3", "Stay updated", "Check real-time notifications and request status."],
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="flex gap-4 rounded-2xl border border-rose-200/80 bg-white/95 p-5 shadow-sm transition hover:border-red-300 dark:border-slate-800 dark:bg-slate-900/90"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 font-bold text-white shadow-sm shadow-red-500/25">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-xs sm:text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT DETAILS SECTION (RED BLOOD THEMED) ================= */}
      <section className="mx-4 sm:mx-6 lg:mx-auto lg:max-w-7xl mb-16">
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50/90 via-red-50/50 to-rose-100/70 p-8 shadow-xl shadow-red-500/5 sm:p-12 md:p-14 dark:border-red-950/70 dark:from-[#150508] dark:via-[#1e070c] dark:to-[#120306]">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none dark:bg-red-600/10" />
          <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl pointer-events-none dark:bg-rose-600/10" />

          {/* Section Header with Red Underline */}
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200/90 bg-white/80 px-4 py-1 text-xs font-bold text-red-600 shadow-sm backdrop-blur-sm dark:border-red-900/60 dark:bg-red-950/70 dark:text-red-300">
              <span className="text-sm">☎️</span> 24×7 SUPPORT & ASSISTANCE
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Contact
            </h2>

            {/* Red Underline Bar */}
            <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-red-600 dark:bg-red-500" />

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Need immediate blood donation assistance or have questions about LifeLink? Reach out to our helpdesk team.
            </p>
          </div>

          {/* 3 Contact Cards Grid */}
          <div className="relative z-10 mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* 1. 24x7 Helpdesk */}
            <div className="group rounded-2xl border border-rose-200/80 bg-white/95 p-7 shadow-md shadow-red-500/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-red-600/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100/80 text-2xl text-red-600 transition-transform duration-300 group-hover:scale-110 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    24x7 Helpdesk:
                  </h3>
                  <a
                    href="tel:+917859939940"
                    className="mt-1 block text-base font-black text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    +91-7859939940
                  </a>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400 border-t border-rose-100 pt-3 dark:border-slate-800">
                Round-the-clock emergency support for patients and donor coordination.
              </p>
            </div>

            {/* 2. Email */}
            <div className="group rounded-2xl border border-rose-200/80 bg-white/95 p-7 shadow-md shadow-red-500/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-red-600/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100/80 text-2xl text-red-600 transition-transform duration-300 group-hover:scale-110 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                  <FaEnvelope />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Email:
                  </h3>
                  <div className="mt-1 space-y-0.5">
                    <a
                      href="mailto:ehospital@gov.in"
                      className="block truncate text-xs sm:text-sm font-bold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      ehospital@gov.in
                    </a>
                    <a
                      href="mailto:helpdesk-ors@gov.in"
                      className="block truncate text-xs sm:text-sm font-bold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      helpdesk-ors@gov.in
                    </a>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400 border-t border-rose-100 pt-3 dark:border-slate-800">
                Official support, platform queries, and feedback assistance.
              </p>
            </div>

            {/* 3. Call */}
            <div className="group rounded-2xl border border-rose-200/80 bg-white/95 p-7 shadow-md shadow-red-500/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-red-600/60 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100/80 text-2xl text-red-600 transition-transform duration-300 group-hover:scale-110 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Call:
                  </h3>
                  <a
                    href="tel:+917859939940"
                    className="mt-1 block text-base font-black text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    +91-7859939940
                  </a>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400 border-t border-rose-100 pt-3 dark:border-slate-800">
                Direct helpline for quick donor communication and hospital coordination.
              </p>
            </div>

          </div>

          {/* Quick Emergency Assistance Banner */}
          <div className="relative z-10 mt-8 rounded-2xl border border-red-200 bg-red-600 p-4 text-center text-white shadow-md sm:flex sm:items-center sm:justify-between sm:px-8 sm:text-left dark:border-red-800 dark:bg-red-700">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <span className="text-2xl animate-pulse">🚨</span>
              <p className="text-xs sm:text-sm font-bold">
                Urgent Blood Requirement? Connect with our emergency helpline right away.
              </p>
            </div>
            <a
              href="tel:+917859939940"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-black text-red-700 shadow-sm transition hover:bg-rose-50 sm:mt-0"
            >
              <FaPhoneAlt className="text-xs" /> Call +91-7859939940
            </a>
          </div>
        </div>
      </section>

      {/* ================= CLOSING CTA ================= */}
      <section className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-7 py-12 text-center text-white md:px-16 md:py-16 shadow-2xl shadow-red-600/20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100 sm:text-sm">
            Be part of the connection
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl text-white">
            Every connection starts with a step.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-7 text-rose-100">
            Explore registered donors or use the blood request feature to get
            started with LifeLink.
          </p>
          <Link
            to="/find-donor"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-red-600 transition hover:bg-rose-50 shadow-lg"
          >
            Explore Donors &nbsp; →
          </Link>
        </div>
      </section>
    </main>
  );
}