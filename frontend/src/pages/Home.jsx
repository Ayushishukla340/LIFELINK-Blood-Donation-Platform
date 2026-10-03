
import { Link } from "react-router-dom";

const steps = [
  { icon: "♟", title: "1. Register", text: "Create your donor account in just a few minutes." },
  { icon: "⌕", title: "2. Find Donor", text: "Search blood donors by blood group and city." },
  { icon: "🩸", title: "3. Donate Blood", text: "Connect with people who need blood donations." },
  { icon: "♥", title: "4. Save Lives", text: "Your contribution can make a meaningful difference." },
];

const facts = [
  { icon: "🩸", title: "Blood Donation", text: "Donations help patients who need blood." },
  { icon: "♥", title: "Every Donation", text: "Can make a meaningful difference." },
  { icon: "🧬", title: "Blood Groups", text: "A, B, AB and O blood groups." },
  { icon: "✚", title: "Emergency Needs", text: "Finding a compatible donor matters." },
];

const features = [
  { icon: "♧", title: "Donor Information", text: "Explore donor profiles and available information." },
  { icon: "●", title: "Nearby Search", text: "Search donors using city and blood group." },
  { icon: "◷", title: "Request Updates", text: "View notifications about blood requests." },
  { icon: "♡", title: "Save Lives", text: "Help connect patients with potential donors." },
];

function BloodDropIllustration() {
  return (
    <div className="relative mx-auto flex h-[330px] w-full max-w-[480px] items-center justify-center sm:h-[400px]">
      <div className="absolute h-[290px] w-[290px] rounded-full bg-rose-100 sm:h-[350px] sm:w-[350px]" />
      <div className="absolute h-[245px] w-[245px] rounded-full border-[18px] border-white/70 sm:h-[300px] sm:w-[300px]" />

      <svg
        viewBox="0 0 220 260"
        className="relative z-10 h-64 w-56 drop-shadow-2xl sm:h-80 sm:w-72"
        role="img"
        aria-label="Red blood drop symbol"
      >
        <defs>
          <linearGradient id="bloodGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b75" />
            <stop offset="45%" stopColor="#ed102b" />
            <stop offset="100%" stopColor="#a90018" />
          </linearGradient>
        </defs>
        <path
          d="M110 12 C91 54 39 109 39 157 C39 203 70 237 110 237 C150 237 181 203 181 157 C181 109 129 54 110 12 Z"
          fill="url(#bloodGradient)"
          stroke="#fff"
          strokeWidth="3"
        />
        <path
          d="M80 74 C61 111 57 139 65 160"
          fill="none"
          stroke="#fff"
          strokeWidth="8"
          strokeLinecap="round"
          opacity=".55"
        />
        <circle cx="110" cy="155" r="39" fill="#ffffff" fillOpacity=".13" stroke="#fff" strokeWidth="2" />
        <path
          d="M72 157 H91 L101 141 L113 173 L126 149 L136 157 H149"
          fill="none"
          stroke="#fff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M110 128 C99 114 82 128 91 141 L110 159 L129 141 C138 128 121 114 110 128 Z" fill="#fff" />
      </svg>

      <div className="absolute left-1 top-10 z-20 rounded-2xl bg-white px-4 py-3 shadow-lg sm:left-0">
        <span className="text-xl text-red-600">♥</span>
        <p className="mt-1 text-xs font-bold">Give Hope</p>
      </div>
      <div className="absolute bottom-8 right-0 z-20 rounded-2xl bg-white px-4 py-3 shadow-lg">
        <span className="text-xl">🤝</span>
        <p className="mt-1 text-xs font-bold">Make an Impact</p>
      </div>
      <span className="absolute right-1 top-12 rotate-6 text-center text-lg font-bold leading-6 text-red-600 sm:right-0">
        Small Act
        <br />
        Big Impact
      </span>
      <span className="absolute bottom-8 left-10 text-3xl text-red-400">♡</span>
    </div>
  );
}

function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-white via-rose-50 to-red-50">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 py-10 sm:px-10 md:grid-cols-2 md:py-12">
          <div>
            <span className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-red-600 sm:text-sm">
              ♥ &nbsp; Save Lives Through Blood Donation
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Donate Blood,
              <span className="mt-1 block text-red-600">Save Every Life</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              LifeLink connects blood donors with patients who need blood.
              Search by blood group and city, send requests, and become part
              of a community that cares.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/find-donor"
                className="rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                Find a Donor &nbsp; →
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-red-300 bg-white px-6 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-rose-50"
              >
                ♟ &nbsp; Become a Donor
              </Link>
            </div>
          </div>
          <BloodDropIllustration />
        </div>
      </section>

      {/* Highlight cards */}
      <section className="mx-auto max-w-7xl px-6 py-2 sm:px-10">
        <div className="grid gap-3 rounded-2xl bg-rose-50 p-4 sm:grid-cols-3 sm:p-5">
          {[
            ["♟", "Find Donors", "Search by blood group and city"],
            ["♥", "Blood Requests", "Connect through donation requests"],
            ["♧", "Request Updates", "Keep track of request status"],
          ].map(([icon, title, text]) => (
            <div key={title} className="flex items-center gap-4 border-rose-200 px-3 py-3 sm:border-r sm:last:border-r-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-red-600 shadow-sm">
                {icon}
              </div>
              <div>
                <h2 className="font-bold text-red-600">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600 sm:text-sm">Simple Process</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">How LifeLink Works</h2>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          Register, search for donors, and manage blood donation requests.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/60 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-3xl text-red-600">
                {step.icon}
              </div>
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood donation facts */}
      <section className="mx-4 rounded-3xl bg-gradient-to-r from-rose-50 to-red-50 px-6 py-8 sm:mx-6 sm:px-8 lg:mx-auto lg:max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[1.15fr_2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600 sm:text-sm">Learn & Donate</p>
            <h2 className="mt-2 text-3xl font-extrabold">Blood Donation Facts</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Blood donation supports patients during treatment, surgery,
              and medical emergencies. Blood group compatibility is important
              when matching a donor with a patient.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.title} className="rounded-xl bg-white/70 p-4 text-center">
                <div className="text-3xl text-red-600">{fact.icon}</div>
                <h3 className="mt-3 text-sm font-bold text-red-600">{fact.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 sm:text-sm">Why Choose Us</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Why Choose LifeLink?</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            LifeLink brings donor search, blood requests, and notifications
            together in one accessible platform.
          </p>
          <Link to="/about" className="mt-5 inline-flex font-semibold text-red-600 hover:text-red-700">
            Learn About Us &nbsp; →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-2xl text-red-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact strip: no invented statistics */}
      <section className="mx-4 mb-4 rounded-2xl bg-rose-50 px-6 py-6 sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 sm:w-1/3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-3xl">🩸</div>
            <div>
              <h2 className="text-xl font-extrabold">Our Impact</h2>
              <p className="mt-1 text-sm text-slate-600">Every connection matters.</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ["Find", "Potential Donors"],
              ["Send", "Blood Requests"],
              ["Track", "Request Updates"],
            ].map(([title, label]) => (
              <div key={label} className="border-l border-rose-200 px-4">
                <p className="text-lg font-extrabold text-red-600">{title}</p>
                <p className="mt-1 text-xs text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 mb-3 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-rose-200 sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 px-7 py-9 sm:flex-row sm:items-center sm:px-12">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Be a Hero. Donate Blood.</h2>
            <p className="mt-2 text-sm text-rose-50">Together, we can build a more caring community.</p>
          </div>
          <Link to="/find-donor" className="rounded-full bg-white px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-rose-50">
            Find a Donor &nbsp; →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
