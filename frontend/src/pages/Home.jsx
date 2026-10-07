import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTint,
  FaSearch,
  FaBell,
  FaHeart,
  FaPlus,
  FaClipboardList,
  FaCalendarAlt,
  FaPlay,
  FaHospital,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";

import heroDonorImg from "../assets/hero-donor.jpg";
import bloodDropHandsImg from "../assets/blood-donation-hero.png";

// ================= BLOOD AVAILABILITY DATA =================
const bloodStockData = {
  Lucknow: [
    { type: "A+", status: "Available", color: "emerald" },
    { type: "A-", status: "Limited", color: "amber" },
    { type: "B+", status: "Available", color: "emerald" },
    { type: "B-", status: "Low", color: "red" },
    { type: "O+", status: "Available", color: "emerald" },
    { type: "O-", status: "Critical", color: "red" },
    { type: "AB+", status: "Limited", color: "amber" },
    { type: "AB-", status: "Available", color: "emerald" },
  ],
  Kanpur: [
    { type: "A+", status: "Available", color: "emerald" },
    { type: "A-", status: "Low", color: "red" },
    { type: "B+", status: "Limited", color: "amber" },
    { type: "B-", status: "Available", color: "emerald" },
    { type: "O+", status: "Limited", color: "amber" },
    { type: "O-", status: "Critical", color: "red" },
    { type: "AB+", status: "Available", color: "emerald" },
    { type: "AB-", status: "Low", color: "red" },
  ],
  Varanasi: [
    { type: "A+", status: "Limited", color: "amber" },
    { type: "A-", status: "Available", color: "emerald" },
    { type: "B+", status: "Available", color: "emerald" },
    { type: "B-", status: "Limited", color: "amber" },
    { type: "O+", status: "Available", color: "emerald" },
    { type: "O-", status: "Low", color: "red" },
    { type: "AB+", status: "Critical", color: "red" },
    { type: "AB-", status: "Available", color: "emerald" },
  ],
  Delhi: [
    { type: "A+", status: "Available", color: "emerald" },
    { type: "A-", status: "Available", color: "emerald" },
    { type: "B+", status: "Available", color: "emerald" },
    { type: "B-", status: "Limited", color: "amber" },
    { type: "O+", status: "Available", color: "emerald" },
    { type: "O-", status: "Limited", color: "amber" },
    { type: "AB+", status: "Available", color: "emerald" },
    { type: "AB-", status: "Available", color: "emerald" },
  ],
};

// ================= RECENT REQUESTS DATA =================
const recentRequests = [
  {
    group: "A+",
    location: "Lucknow",
    units: 2,
    urgency: "Emergency",
    status: "Finding Donors",
    statusBg: "from-amber-400 to-yellow-500 text-slate-950",
  },
  {
    group: "O-",
    location: "Kanpur",
    units: 1,
    urgency: "Normal",
    status: "In Progress",
    statusBg: "from-blue-500 to-indigo-600 text-white",
  },
  {
    group: "B+",
    location: "Varanasi",
    units: 3,
    urgency: "Normal",
    status: "Accepted",
    statusBg: "from-emerald-500 to-teal-600 text-white",
  },
  {
    group: "AB+",
    location: "Patna",
    units: 1,
    urgency: "Emergency",
    status: "Donor Responded",
    statusBg: "from-purple-500 to-pink-600 text-white",
  },
];

function Home() {
  const [selectedCity, setSelectedCity] = useState("Lucknow");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const currentStocks = bloodStockData[selectedCity] || bloodStockData["Lucknow"];

  return (
    <main className="overflow-hidden bg-[#fff8f8] text-slate-800 transition-colors duration-200 dark:bg-[#0c0406] dark:text-slate-100">
      
      {/* ================= HERO SECTION (CINEMATIC DONOR BACKGROUND) ================= */}
      <section className="relative min-h-[580px] lg:min-h-[640px] w-full overflow-hidden flex items-center">
        {/* Background Donor Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroDonorImg}
            alt="Person donating blood in medical clinic"
            className="h-full w-full object-cover object-center scale-105 filter brightness-95"
          />
          {/* Deep Crimson Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2b0407] via-[#48080f]/95 via-45% to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#200305] via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-28 w-full">
          <div className="max-w-2xl">
            {/* Top Micro-Tag */}
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-rose-300 drop-shadow-sm">
              Real People. Real Impact.
            </p>

            {/* Headline */}
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-white drop-shadow-md">
              Donate Blood
              <br />
              Be the Reason
              <br />
              <span className="text-[#f43f5e] drop-shadow-sm">Someone Lives.</span>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-rose-100/90 sm:text-base sm:leading-7 drop-shadow-sm">
              LifeLink connects donors with patients in need.
              Search, request, and donate blood — because every drop counts.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/find-donor"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-950/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700"
              >
                Find a Donor &nbsp; →
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-black/40 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 hover:border-white/70"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-red-600">
                  <FaPlay className="ml-0.5" />
                </span>
                Watch Video
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4 FEATURE HIGHLIGHTS STRIP ================= */}
      <section className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 -mt-8 sm:-mt-12">
        <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-5 sm:p-7 shadow-xl shadow-red-900/10 backdrop-blur-md dark:border-red-950/80 dark:bg-slate-900/95">
          <div className="grid grid-cols-1 divide-y divide-rose-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x dark:divide-slate-800">
            
            {/* Highlight 1 */}
            <div className="flex items-center gap-4 py-3 sm:py-2 lg:px-4 lg:first:pl-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xl text-red-600 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                <FaTint />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Blood Requests
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Get help when you need it
                </p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="flex items-center gap-4 py-3 sm:py-2 lg:px-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xl text-red-600 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                <FaSearch />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Find Donors
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Search by group & city
                </p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="flex items-center gap-4 py-3 sm:py-2 lg:px-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xl text-red-600 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                <FaBell />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Emergency
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Priority support for critical cases
                </p>
              </div>
            </div>

            {/* Highlight 4 */}
            <div className="flex items-center gap-4 py-3 sm:py-2 lg:px-4 lg:last:pr-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xl text-red-600 shadow-sm dark:bg-red-950/60 dark:text-red-400">
                <FaHeart />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Save Lives
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Be the reason for hope
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SPLIT SECTION 1: EMERGENCY REQUEST & QUICK ACTIONS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          
          {/* LEFT: Emergency Blood Request Card */}
          <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-6 sm:p-8 shadow-sm dark:border-red-950/80 dark:bg-slate-900/95 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-rose-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                    <FaBell />
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Emergency Blood Request
                  </h2>
                </div>

                <Link
                  to="/blood-requests"
                  className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  View All &nbsp; →
                </Link>
              </div>

              {/* Inner Urgent Blood Box */}
              <div className="relative mt-6 overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/60 p-6 shadow-sm dark:border-red-950 dark:from-red-950/40 dark:via-slate-900 dark:to-red-950/20">
                
                {/* Urgent Tag */}
                <span className="inline-block rounded-full bg-red-600 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                  Urgent
                </span>

                {/* Blood Group and Units Needed */}
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-black tracking-tight text-red-600 dark:text-red-500 sm:text-5xl">
                    O+
                  </span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    2 Units Needed
                  </span>
                </div>

                {/* Hospital Details */}
                <div className="mt-4 flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 text-base dark:bg-red-950/60 dark:text-red-400">
                    <FaHospital />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      City Hospital, Lucknow
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Posted 1 hr ago
                    </p>
                  </div>
                </div>

                {/* Decorative Heart Thread Doodle & Action Button */}
                <div className="mt-6 flex items-center justify-between pt-2">
                  <div className="text-rose-400 dark:text-rose-600 text-2xl">
                    <svg viewBox="0 0 100 30" className="w-20 h-6 stroke-current fill-none stroke-2">
                      <path d="M 5 20 Q 25 30 40 15 C 45 5 60 5 65 15 Q 75 30 95 10" strokeLinecap="round" />
                    </svg>
                  </div>

                  <Link
                    to="/find-donor"
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-500/25 transition hover:bg-red-700"
                  >
                    Find Donors &nbsp; →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Quick Actions Card */}
          <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-6 sm:p-8 shadow-sm dark:border-red-950/80 dark:bg-slate-900/95 flex flex-col justify-between">
            <div>
              {/* Header with Heart Doodle */}
              <div className="flex items-center justify-between pb-5 border-b border-rose-100 dark:border-slate-800">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Quick Actions
                </h2>
                <span className="text-red-500 text-xl">❤️</span>
              </div>

              {/* 4 Action Pill Buttons */}
              <div className="mt-6 space-y-3.5">
                
                {/* Action 1: Create Blood Request */}
                <Link
                  to="/request-blood"
                  className="flex items-center gap-4 rounded-2xl border border-rose-200/80 bg-white p-3.5 shadow-sm transition hover:bg-rose-50/80 hover:border-red-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-red-600 text-lg font-bold dark:bg-red-950/60 dark:text-red-400">
                    <FaPlus />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Create Blood Request
                  </span>
                </Link>

                {/* Action 2: Find a Donor */}
                <Link
                  to="/find-donor"
                  className="flex items-center gap-4 rounded-2xl border border-rose-200/80 bg-white p-3.5 shadow-sm transition hover:bg-rose-50/80 hover:border-red-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-red-600 text-sm font-bold dark:bg-red-950/60 dark:text-red-400">
                    <FaSearch />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Find a Donor
                  </span>
                </Link>

                {/* Action 3: View My Requests */}
                <Link
                  to="/my-requests"
                  className="flex items-center gap-4 rounded-2xl border border-rose-200/80 bg-white p-3.5 shadow-sm transition hover:bg-rose-50/80 hover:border-red-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-red-600 text-sm font-bold dark:bg-red-950/60 dark:text-red-400">
                    <FaClipboardList />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    View My Requests
                  </span>
                </Link>

                {/* Action 4: Update Availability */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-4 rounded-2xl border border-rose-200/80 bg-white p-3.5 shadow-sm transition hover:bg-rose-50/80 hover:border-red-300 dark:border-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-red-600 text-sm font-bold dark:bg-red-950/60 dark:text-red-400">
                    <FaCalendarAlt />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Update Availability
                  </span>
                </Link>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SPLIT SECTION 2: BLOOD AVAILABILITY & RED PROMO CARD ================= */}
      <section className="mx-auto max-w-7xl px-6 py-6 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] items-stretch">
          
          {/* LEFT: Blood Availability Grid */}
          <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-6 sm:p-8 shadow-sm dark:border-red-950/80 dark:bg-slate-900/95 flex flex-col justify-between">
            <div>
              {/* Header & Location Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-rose-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl dark:bg-red-950/60 dark:text-red-400">
                    <FaTint />
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Blood Availability
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Check blood stock in your area
                    </p>
                  </div>
                </div>

                {/* City Selector Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/70 px-4 py-1.5 text-xs font-bold text-red-600 transition hover:bg-rose-100 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400"
                  >
                    <FaMapMarkerAlt /> {selectedCity} <FaChevronDown className="text-[10px]" />
                  </button>

                  {/* Dropdown Menu */}
                  {showCityDropdown && (
                    <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-rose-200 bg-white p-1.5 shadow-xl z-30 dark:border-slate-800 dark:bg-slate-900">
                      {["Lucknow", "Kanpur", "Varanasi", "Delhi"].map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city);
                            setShowCityDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            selectedCity === city
                              ? "bg-red-600 text-white"
                              : "text-slate-700 hover:bg-rose-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 8 Blood Group Cards (2 rows of 4) */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {currentStocks.map((item) => (
                  <div
                    key={item.type}
                    className="group rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-center transition hover:border-red-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 flex flex-col items-center justify-center"
                  >
                    {/* Blood drop and type */}
                    <div className="flex items-center justify-center gap-1.5">
                      <FaTint className="text-red-600 dark:text-red-400 text-lg transition group-hover:scale-110" />
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {item.type}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.color === "emerald"
                            ? "bg-emerald-500"
                            : item.color === "amber"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                      />
                      <span
                        className={
                          item.color === "emerald"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : item.color === "amber"
                            ? "text-amber-700 dark:text-amber-400"
                            : "text-red-700 dark:text-red-400"
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Red Promo Card "Your Blood Can Save Lives" */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#e11d48] via-[#dc2626] to-[#881337] p-7 text-center text-white shadow-2xl shadow-red-900/30 flex flex-col items-center justify-between">
            
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            {/* Central Hands & Blood Drop Illustration */}
            <div className="relative mx-auto mt-2 w-48 sm:w-56 overflow-hidden rounded-2xl drop-shadow-xl transition hover:scale-105 duration-300">
              <img
                src={bloodDropHandsImg}
                alt="Your Blood Can Save Lives"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Promo Text */}
            <div className="mt-4">
              <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Your Blood
                <br />
                Can Save Lives
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-rose-100">
                Be a donor. Be a hero.
              </p>
            </div>

            {/* Donate Now Button */}
            <Link
              to="/donate"
              className="mt-6 w-full max-w-xs rounded-full bg-red-950/80 hover:bg-black/80 border border-white/20 py-3 text-sm font-bold text-white shadow-lg transition duration-200 inline-flex items-center justify-center gap-2"
            >
              Donate Now &nbsp; →
            </Link>
          </div>

        </div>
      </section>

      {/* ================= SECTION 5: RECENT BLOOD REQUESTS TABLE ================= */}
      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#4c0519] p-6 sm:p-8 text-white shadow-2xl shadow-red-950/50">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-red-800/80">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-950/80 border border-red-500/30 text-white text-xl">
                <FaTint />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Recent Blood Requests
              </h2>
            </div>

            <Link
              to="/blood-requests"
              className="text-xs sm:text-sm font-bold text-rose-200 hover:text-white transition"
            >
              View All &nbsp; →
            </Link>
          </div>

          {/* Table Container */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-red-800/60 text-xs font-extrabold uppercase tracking-wider text-rose-200/80">
                  <th className="py-4 pr-4">Blood Group</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Units</th>
                  <th className="py-4 px-4">Urgency</th>
                  <th className="py-4 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-800/50">
                {recentRequests.map((req, idx) => (
                  <tr key={idx} className="transition hover:bg-white/5">
                    {/* Blood Group */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5 font-black text-base text-white">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-950/80 border border-red-400/40 text-red-400 text-xs">
                          <FaTint />
                        </span>
                        {req.group}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 font-semibold text-rose-100">
                      {req.location}
                    </td>

                    {/* Units */}
                    <td className="py-4 px-4 font-bold text-white">
                      {req.units}
                    </td>

                    {/* Urgency */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          req.urgency === "Emergency"
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-emerald-700/80 text-white"
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 pl-4 text-right">
                      <span
                        className={`inline-block rounded-full bg-gradient-to-r ${req.statusBg} px-4 py-1.5 text-xs font-black shadow-md`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ================= SECTION 6: BECAUSE EVERY DROP MATTERS STRIP ================= */}
      <section className="mx-auto max-w-7xl px-6 py-6 sm:px-10 mb-8">
        <div className="rounded-3xl border border-rose-200/90 bg-rose-100/60 p-6 sm:p-7 backdrop-blur-sm dark:border-red-950/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          
          {/* Left Icon and Title */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white text-2xl shadow-md">
              <FaHeart />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Because Every Drop Matters
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Join LifeLink and be a part of a community that saves lives.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <Link
            to="/register"
            className="rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-black px-8 py-3.5 shadow-lg shadow-red-500/25 transition duration-200 shrink-0 inline-flex items-center gap-2"
          >
            Register Now &nbsp; →
          </Link>
        </div>
      </section>

      {/* ================= OPTIONAL VIDEO PREVIEW MODAL ================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-red-500/30 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <span className="text-red-500">▶</span> Why Blood Donation Matters
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="rounded-full bg-slate-800 h-8 w-8 flex items-center justify-center text-sm font-bold text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 aspect-video rounded-2xl bg-black flex flex-col items-center justify-center text-center p-6 border border-slate-800">
              <span className="text-5xl text-red-600 mb-3 animate-pulse">🩸</span>
              <p className="text-base font-bold text-white">
                "One donation can save up to 3 lives."
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-md">
                Every 2 seconds, someone in India needs blood. Join LifeLink today to become an active lifesaver in your city.
              </p>
              <Link
                to="/register"
                onClick={() => setIsVideoModalOpen(false)}
                className="mt-6 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
              >
                Register as Donor Now
              </Link>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default Home;