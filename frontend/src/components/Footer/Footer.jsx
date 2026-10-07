import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#881337] via-[#dc2626] to-[#991b1b] text-white pt-14 pb-10 px-6 sm:px-10 overflow-hidden shadow-2xl">
      {/* Curving Wave Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-900 via-rose-500 to-red-900 opacity-60" />

      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-red-500/40">
        
        {/* Left: Brand */}
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

        {/* Center: Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-rose-100">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/find-donor" className="hover:text-white transition">Find Donor</Link>
          <Link to="/request-blood" className="hover:text-white transition">Request Blood</Link>
          <Link to="/donate" className="hover:text-white transition">Donate</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/about" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-3 text-lg">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
          >
            <FaFacebookF className="text-sm" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
          >
            <FaInstagram className="text-sm" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter / X"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
          >
            <FaTwitter className="text-sm" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white hover:text-red-600 transition"
          >
            <FaYoutube className="text-sm" />
          </a>
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
