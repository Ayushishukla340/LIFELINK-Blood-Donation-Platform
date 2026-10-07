import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaHeadset,
} from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#881337] via-[#dc2626] to-[#991b1b] text-white pt-12 pb-8 px-6 sm:px-10 overflow-hidden shadow-2xl">
      {/* Curving Wave Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-900 via-rose-500 to-red-900 opacity-60" />

      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-red-500/40">
        
        {/* Left: Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl text-red-600 shadow-md transition group-hover:scale-105">
              🩸
            </div>
            <div>
              <span className="block text-2xl font-black tracking-tight text-white">
                LifeLink
              </span>
              <span className="block text-xs font-semibold tracking-wide text-rose-200">
                Donate Blood, Save Lives
              </span>
            </div>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-rose-100/80">
            Dedicated blood donation network connecting patients with voluntary donors across the nation.
          </p>
        </div>

        {/* Center: Contact Us Details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <FaHeadset className="text-rose-200 text-base" />
            <span className="text-sm font-bold uppercase tracking-wider text-rose-200">
              Contact Us
            </span>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 text-sm">
            {/* Contact Number */}
            <a
              href="tel:+917859939940"
              className="group flex items-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 transition backdrop-blur-sm"
              title="Call Helpline"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white group-hover:scale-110 transition">
                <FaPhoneAlt className="text-xs" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-medium text-rose-200 uppercase tracking-wider leading-none">
                  Helpline / Contact Number
                </span>
                <span className="font-bold text-white tracking-wide text-sm">
                  +91-7859939940
                </span>
              </div>
            </a>

            {/* Instagram Page */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 transition backdrop-blur-sm"
              title="Visit Instagram Page"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white group-hover:scale-110 transition">
                <FaInstagram className="text-sm" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-medium text-rose-200 uppercase tracking-wider leading-none">
                  Instagram Page
                </span>
                <span className="font-bold text-white tracking-wide text-sm">
                  @lifelink.blood
                </span>
              </div>
            </a>

            {/* Email Support */}
            <a
              href="mailto:support@lifelink.org"
              className="group flex items-center gap-2.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 transition backdrop-blur-sm"
              title="Email Support"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white group-hover:scale-110 transition">
                <FaEnvelope className="text-xs" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-medium text-rose-200 uppercase tracking-wider leading-none">
                  Email Support
                </span>
                <span className="font-bold text-white tracking-wide text-sm">
                  support@lifelink.org
                </span>
              </div>
            </a>
          </div>

          <Link
            to="/about"
            className="mt-3 text-xs font-semibold text-rose-200 hover:text-white underline underline-offset-4 transition"
          >
            View More Details →
          </Link>
        </div>

        {/* Right: Social & Community */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <span className="text-sm font-bold uppercase tracking-wider text-rose-200 mb-3">
            Social Media
          </span>

          <div className="flex items-center gap-3 text-lg">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Page"
              title="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:scale-110 text-white shadow-lg transition"
            >
              <FaInstagram className="text-base" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              title="Twitter"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              title="YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
            >
              <FaYoutube className="text-sm" />
            </a>
          </div>

          <div className="mt-4 rounded-xl bg-white/10 border border-white/15 px-3 py-1.5 text-center md:text-right">
            <span className="text-[11px] font-semibold text-rose-100 flex items-center gap-1.5 justify-center md:justify-end">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Emergency Blood Helpline
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Bar with ECG Wave Accent & Theme Toggle */}
      <div className="mx-auto max-w-7xl pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-rose-200 gap-4">
        <p>© {new Date().getFullYear()} LifeLink. All rights reserved.</p>

        {/* ECG Pulse Graphic & Theme */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 120 24" className="w-24 h-6 stroke-rose-300 fill-none stroke-2">
              <path
                d="M 0 12 H 30 L 38 4 L 46 20 L 54 8 L 60 14 L 66 12 H 120"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-rose-100">Every Drop Saves Life</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
