import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTint } from "react-icons/fa";
import api from "../services/api";
import registerLeftImg from "../assets/register-left.png";
import registerRightImg from "../assets/register-right.png";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/login", formData);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("lifelink-auth-changed"));
      setMessage("Login successful! ✅");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password");
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
        
        {/* Left Illustration */}
        <div className="hidden lg:flex shrink-0 w-[280px] xl:w-[330px] justify-center select-none pointer-events-none">
          <img
            src={registerLeftImg}
            alt="Be a Hero Donate Blood"
            className="w-full h-auto object-contain max-h-[500px] drop-shadow-md"
          />
        </div>

        {/* Center Login Card */}
        <div className="w-full max-w-md rounded-3xl border border-rose-200/90 bg-white/95 p-8 sm:p-10 shadow-2xl shadow-red-900/10 backdrop-blur-md dark:border-red-950/80 dark:bg-slate-900/95">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 shadow-inner dark:bg-red-950/60 dark:text-red-400">
              <FaTint />
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-red-600 dark:text-red-500">
              Welcome Back
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Login to continue with LifeLink.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                {loading ? "Logging in..." : "Login →"}
              </button>
            </div>

            {/* Error/Success Message */}
            {message && (
              <p
                className={`text-center text-xs sm:text-sm font-bold p-3 rounded-xl transition ${
                  message.includes("successful")
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          {/* Footer link to Register */}
          <p className="mt-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-black text-red-600 hover:underline dark:text-red-400"
            >
              Register
            </Link>
          </p>

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

export default Login;