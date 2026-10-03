import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Find Suitable Donors",
    description:
      "Search registered donors by blood group and city to find relevant matches.",
    icon: "🔎",
  },
  {
    number: "02",
    title: "Send Blood Requests",
    description:
      "Patients can submit requests and follow their status through the platform.",
    icon: "🩸",
  },
  {
    number: "03",
    title: "Support Donors",
    description:
      "Donors can manage their availability and respond to incoming requests.",
    icon: "🤝",
  },
  {
    number: "04",
    title: "Track Updates",
    description:
      "Notifications help users stay informed about request activity.",
    icon: "🔔",
  },
];

export default function About() {
  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-red-100">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
          <div>
            <span className="inline-flex rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600">
              ❤️ About LifeLink
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Connecting people.
              <span className="block text-red-600">
                Supporting lives.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              LifeLink is a blood donation platform designed to make donor
              discovery and blood request management more organized,
              accessible and convenient.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/find-donor"
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
              >
                Find a Donor →
              </Link>

              <Link
                to="/request-blood"
                className="rounded-xl border border-red-200 bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                Request Blood
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-red-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white/90 p-8 shadow-2xl shadow-red-100 md:p-10">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-5xl">
                🩸
              </div>

              <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-red-600">
                Our purpose
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-snug">
                Make finding a suitable donor simpler.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Bring donor information, blood requests and request updates
                together in one platform.
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                <span className="text-2xl">❤️</span>
                <p className="text-sm font-medium text-slate-600">
                  Built around connection, care and accessibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-bold uppercase tracking-[0.2em] text-red-600">
            Our mission
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Making donor discovery more organized
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Finding a suitable donor can take time. LifeLink brings searchable
            donor details and digital request management into a single
            experience, helping patients and donors coordinate more easily.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="font-bold uppercase tracking-[0.2em] text-red-600">
              What you can do
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              One platform, connected journeys
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Explore the main features available in the LifeLink application.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-100/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{feature.icon}</span>
                  <span className="text-sm font-bold text-red-300">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-red-600">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
              A simple journey from search to update
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              The platform connects the user interface with backend APIs and
              a database to manage account information, donor searches and
              blood requests.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["1", "Explore", "Search donors using available filters."],
              ["2", "Connect", "Submit a request to a suitable donor."],
              ["3", "Stay updated", "Check notifications and request status."],
            ].map(([step, title, description]) => (
              <div
                key={step}
                className="flex gap-4 rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 font-bold text-white">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 to-rose-600 px-7 py-12 text-center text-white md:px-16 md:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-100">
            Be part of the connection
          </p>
          <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Every connection starts with a step.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-red-50">
            Explore registered donors or use the blood request feature to get
            started with LifeLink.
          </p>
          <Link
            to="/find-donor"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-red-700 transition hover:bg-red-50"
          >
            Explore Donors →
          </Link>
        </div>
      </section>
    </main>
  );
}