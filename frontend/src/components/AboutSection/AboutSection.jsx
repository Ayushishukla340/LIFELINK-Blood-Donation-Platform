import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex rounded-full border border-red-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-red-600">
          About LifeLink
        </span>
        <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
          Connecting Donors, Saving Lives
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
          LifeLink is a modern blood donation platform that connects donors with
          patients quickly, securely, and efficiently. Our mission is to save lives
          by making donations simple and accessible.
        </p>
      </div>

      {/* Contact Cards in About Component */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 dark:bg-red-950/60">
            <FaMapMarkerAlt />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">24x7 Helpdesk</h3>
          <p className="mt-1 font-bold text-red-600">+91-7859939940</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 dark:bg-red-950/60">
            <FaEnvelope />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">Email</h3>
          <p className="mt-1 text-sm font-bold text-red-600 truncate">ehospital@gov.in</p>
          <p className="text-xs text-slate-500 truncate">helpdesk-ors@gov.in</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 dark:bg-red-950/60">
            <FaPhoneAlt />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">Call</h3>
          <p className="mt-1 font-bold text-red-600">+91-7859939940</p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;