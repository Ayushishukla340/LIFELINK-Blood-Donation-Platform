import { useState } from "react";
import { Link } from "react-router-dom";
import { FaTint } from "react-icons/fa";
import api from "../services/api";
import { CITIES } from "../data/cities";
import registerLeftImg from "../assets/register-left.png";
import registerRightImg from "../assets/register-right.png";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    role: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const city = formData.city.trim();
    const password = formData.password;

    // Full name validation
    if (!/^[A-Za-z ]{2,50}$/.test(fullName)) {
      setMessage("Please enter a valid full name.");
      setMessageType("error");
      return;
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit Indian phone number.");
      setMessageType("error");
      return;
    }

    // City validation
    if (!/^[A-Za-z ]{2,50}$/.test(city)) {
      setMessage("Please enter a valid city name.");
      setMessageType("error");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    // Required dropdown validation
    if (!formData.bloodGroup) {
      setMessage("Please select a blood group.");
      setMessageType("error");
      return;
    }

    if (!formData.role) {
      setMessage("Please select a role.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/register", {
        fullName,
        email,
        phone,
        bloodGroup: formData.bloodGroup,
        city,
        role: formData.role,
        password,
      });

      setMessage(response.data.message);
      setMessageType("success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        bloodGroup: "",
        city: "",
        role: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-[#fff6f6] via-[#ffeded]/60 to-[#fff0f2] py-12 px-4 transition-colors duration-200 dark:from-[#0d0305] dark:via-[#19060b] dark:to-[#0f0205] flex items-center justify-center">
      
      {/* Background Soft Red Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-red-400/15 blur-3xl dark:bg-red-600/10" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-900/15" />

      {/* Main Layout Container: Left Illustration + Center Card + Right Illustration */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center lg:justify-between gap-6 pb-12">
        
        {/* Left Illustration (Hands holding Blood Bag) */}
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
              Create Account
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Join LifeLink and help save lives.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Blood Group */}
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
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Row 3: City & Role */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Register As
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Blood Donor">Blood Donor</option>
                  <option value="Patient">Patient / Requester</option>
                </select>
              </div>
            </div>

            {/* Row 4: Password (Full Width) */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password (minimum 8 characters)"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 text-sm sm:text-base shadow-lg shadow-red-500/25 transition duration-200 flex items-center justify-center gap-2 disabled:bg-slate-400"
              >
                {loading ? "Creating Account..." : "Register →"}
              </button>
            </div>

            {/* Feedback Message */}
            {message && (
              <p
                className={`text-center text-xs sm:text-sm font-bold p-3 rounded-xl transition ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          {/* Footer link to Login */}
          <p className="mt-5 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-black text-red-600 hover:underline dark:text-red-400"
            >
              Login
            </Link>
          </p>

        </div>

        {/* Right Illustration (Donor in Clinic Bed) */}
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

export default Register;