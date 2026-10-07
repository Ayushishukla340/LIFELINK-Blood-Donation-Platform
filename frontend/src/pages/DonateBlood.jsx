import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTint, FaMapMarkerAlt, FaCalendarAlt, FaPhoneAlt, FaUser, FaEnvelope } from "react-icons/fa";
import { CITIES } from "../data/cities";
import registerLeftImg from "../assets/register-left.png";
import registerRightImg from "../assets/register-right.png";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function DonateBlood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    lastDonationDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToRegister = (e) => {
    e.preventDefault();
    // Redirect to register with state if needed, or straight to register
    navigate("/register");
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-[#fff6f6] via-[#ffeded]/60 to-[#fff0f2] py-12 px-4 transition-colors duration-200 dark:from-[#0d0305] dark:via-[#19060b] dark:to-[#0f0205] flex items-center justify-center">
      
      {/* Background Soft Red Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-red-400/15 blur-3xl dark:bg-red-600/10" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-900/15" />

      {/* Main Layout Container: Left Illustration + Center Card + Right Illustration */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center lg:justify-between gap-6 pb-12">
        
        {/* Left Illustration */}
        <div className="hidden lg:flex shrink-0 w-[280px] xl:w-[330px] justify-center select-none pointer-events-none">
          <img
            src={registerLeftImg}
            alt="Be a Hero Donate Blood"
            className="w-full h-auto object-contain max-h-[500px] drop-shadow-md"
          />
        </div>

        {/* Center Card */}
        <div className="w-full max-w-xl rounded-3xl border border-rose-200/90 bg-white/95 p-7 sm:p-9 shadow-2xl shadow-red-900/10 backdrop-blur-md dark:border-red-950/80 dark:bg-slate-900/95">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 shadow-inner dark:bg-red-950/60 dark:text-red-400">
              <FaTint />
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-red-600 dark:text-red-500">
              Donate Blood
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Become a verified donor and help save precious lives.
            </p>
          </div>

          {/* Already registered notice */}
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-3 text-center dark:border-red-900/60 dark:bg-red-950/30">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300">
              Already a donor?{" "}
              <Link to="/login" className="font-bold underline hover:text-red-800 dark:hover:text-red-200">
                Sign in to your account
              </Link>
            </p>
          </div>

          <form onSubmit={handleProceedToRegister} className="space-y-4">
            
            {/* Row 1: Full Name & Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone & Blood Group */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone"
                  maxLength="10"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        🩸 {bg}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-red-600 dark:text-red-400">
                    <FaTint className="text-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: City & Last Donation Date */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  City / Location
                </label>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                    required
                  >
                    <option value="">Select City</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        📍 {c}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <FaMapMarkerAlt className="text-xs text-red-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Last Donation Date (Optional)
                </label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Link
                to="/register"
                className="block text-center w-full rounded-2xl bg-red-600 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-red-600/30 transition-all duration-200 hover:bg-red-700 active:scale-98"
              >
                Register as Blood Donor
              </Link>
            </div>

            {/* Medical Info Footnote */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-800/60">
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                ❤️ <strong>Medical Safety Rule:</strong> Whole blood donors must maintain a minimum <strong>90-day (3-month)</strong> recovery gap between consecutive donations to replenish ferritin and hemoglobin.
              </p>
            </div>
          </form>

        </div>

        {/* Right Illustration */}
        <div className="hidden lg:flex shrink-0 w-[280px] xl:w-[330px] justify-center select-none pointer-events-none">
          <img
            src={registerRightImg}
            alt="Small Actions Big Impact"
            className="w-full h-auto object-contain max-h-[500px] drop-shadow-md"
          />
        </div>

      </div>

      {/* Layered Fluid Crimson Bottom Waves */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 50 C 320 120 420 10 720 60 C 1020 110 1200 20 1440 40 L 1440 120 L 0 120 Z"
            fill="#b91c1c"
            opacity="0.8"
          />
          <path
            d="M 0 70 C 260 20 540 110 820 50 C 1100 0 1300 80 1440 60 L 1440 120 L 0 120 Z"
            fill="#dc2626"
          />
        </svg>
      </div>

    </div>
  );
}

export default DonateBlood;