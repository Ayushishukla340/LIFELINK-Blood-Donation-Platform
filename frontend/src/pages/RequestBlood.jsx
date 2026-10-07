import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTint } from "react-icons/fa";
import api from "../services/api";
import { CITIES } from "../data/cities";
import registerLeftImg from "../assets/register-left.png";
import registerRightImg from "../assets/register-right.png";

function RequestBlood() {
  const navigate = useNavigate();

  const [isEmergencySOS, setIsEmergencySOS] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    hospitalName: "",
    contactNumber: "",
    city: "",
    urgency: "Normal",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const isPrivileged =
    (currentUser?.points || 0) >= 100 ||
    (currentUser?.totalDonations || 0) >= 5;

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

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first to submit a blood request.");
      setMessageType("error");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        urgency: isEmergencySOS ? "Emergency" : formData.urgency || "Normal",
        isEmergencySOS,
      };

      const response = await api.post(
        "/api/blood-requests",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");

      setFormData({
        bloodGroup: "",
        hospitalName: "",
        contactNumber: "",
        city: "",
        urgency: "Normal",
      });
      setIsEmergencySOS(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage("Your session has expired. Please login again.");
        setMessageType("error");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to submit blood request"
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
        
        {/* Left Illustration */}
        <div className="hidden lg:flex shrink-0 w-[280px] xl:w-[330px] justify-center select-none pointer-events-none">
          <img
            src={registerLeftImg}
            alt="Be a Hero Donate Blood"
            className="w-full h-auto object-contain max-h-[500px] drop-shadow-md"
          />
        </div>

        {/* Center Request Blood Card */}
        <div className="w-full max-w-xl rounded-3xl border border-rose-200/90 bg-white/95 p-7 sm:p-9 shadow-2xl shadow-red-900/10 backdrop-blur-md dark:border-red-950/80 dark:bg-slate-900/95">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 shadow-inner dark:bg-red-950/60 dark:text-red-400">
              <FaTint />
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-red-600 dark:text-red-500">
              Request Blood
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Need blood urgently? Submit your request and connect with verified donors.
            </p>
          </div>

          {/* EMERGENCY SOS BROADCAST BANNER / SWITCH */}
          <div
            onClick={() => {
              setIsEmergencySOS(!isEmergencySOS);
              if (!isEmergencySOS) {
                setFormData((prev) => ({ ...prev, urgency: "Emergency" }));
              }
            }}
            className={`mb-5 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
              isEmergencySOS
                ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-red-500 shadow-xl shadow-red-600/30 ring-2 ring-red-400 scale-[1.01]"
                : "bg-red-50/70 hover:bg-red-100/70 dark:bg-red-950/30 dark:hover:bg-red-950/50 border-red-200/80 dark:border-red-900/50 text-slate-800 dark:text-slate-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl animate-bounce">🚨</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black uppercase tracking-wider ${
                        isEmergencySOS ? "text-white" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      Emergency SOS Broadcast
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        isEmergencySOS
                          ? "bg-white text-red-600"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      City-Wide
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 leading-snug ${
                      isEmergencySOS ? "text-red-100" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {isEmergencySOS
                      ? "⚡ ACTIVE: Alerts ALL matching donors in the selected city simultaneously! First donor to accept claims request."
                      : "Critical patient emergency? Click to notify all city donors at once instead of waiting for 1 donor."}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="shrink-0">
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    isEmergencySOS ? "bg-white" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`bg-red-600 w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                      isEmergencySOS ? "translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gold Lifesaver Privilege Banner */}
          {isPrivileged && (
            <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3 shadow-sm">
              <span className="text-2xl">🛡️</span>
              <div>
                <span className="font-black text-sm block text-amber-800 dark:text-amber-300">
                  Gold Lifesaver Privilege Active!
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  As an honored 5+ donation hero, this blood request is 100% free with zero screening and testing charges.
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Blood Group Required */}
            <div>
              <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                Blood Group Required
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

            {/* Hospital Name & Contact Number */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 transition"
                  required
                />
              </div>
            </div>

            {/* City & Urgency */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  City / Location
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
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  value={isEmergencySOS ? "Emergency" : formData.urgency}
                  disabled={isEmergencySOS}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer disabled:bg-red-50 disabled:text-red-700 disabled:font-bold dark:disabled:bg-red-950/40 dark:disabled:text-red-300"
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency (Critical)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full font-bold py-3.5 text-sm sm:text-base shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEmergencySOS
                    ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white shadow-red-600/35 ring-2 ring-red-400 animate-pulse"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/25"
                }`}
              >
                {loading
                  ? "Broadcasting..."
                  : isEmergencySOS
                  ? "🚨 Broadcast Emergency SOS to City →"
                  : "Submit Blood Request →"}
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

export default RequestBlood;