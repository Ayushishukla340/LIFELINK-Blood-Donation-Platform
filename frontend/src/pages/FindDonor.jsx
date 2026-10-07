import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTint, FaSearch, FaMapMarkerAlt, FaHeartbeat, FaCheckCircle, FaTimes } from "react-icons/fa";
import api from "../services/api";
import { CITIES } from "../data/cities";
import { calculateDonationEligibility } from "../utils/eligibility";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function FindDonor() {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDonor, setSelectedDonor] = useState(null);

  const [requestData, setRequestData] = useState({
    hospitalName: "",
    contactNumber: "",
    patientCity: "",
    urgency: "",
  });

  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // SEARCH DONORS
  // Only called when user clicks Find Donors button
  // ===============================
  const handleSearch = async () => {
    setLoading(true);
    setMessage("");
    setDonors([]);

    try {
      const response = await api.get("/api/donors", {
        params: {
          bloodGroup,
          city,
        },
      });

      if (!response.data.donors || response.data.donors.length === 0) {
        setMessage("No donors found for your search.");
      } else {
        setDonors(response.data.donors);
      }
    } catch (error) {
      console.log("❌ Donor Search Error:", error);
      setMessage(
        error.response?.data?.message || "Unable to find donors"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // OPEN REQUEST FORM
  // ===============================
  const handleBloodRequest = (donor) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      alert("Please login to send a blood request.");
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    // Check if donor is trying to request themselves
    const currentUserId = user._id || user.id;
    const targetDonorId = donor._id || donor.id;
    if (currentUserId && targetDonorId && currentUserId.toString() === targetDonorId.toString()) {
      alert("You cannot send a blood request to yourself.");
      return;
    }

    setSelectedDonor(donor);
    setMessage("");
  };

  // ===============================
  // FORM CHANGE
  // ===============================
  const handleRequestChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // SEND REQUEST
  // ===============================
  const submitBloodRequest = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setRequestLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/api/blood-requests",
        {
          donorId: selectedDonor._id,
          bloodGroup: selectedDonor.bloodGroup,
          hospitalName: requestData.hospitalName,
          contactNumber: requestData.contactNumber,
          city: requestData.patientCity,
          urgency: requestData.urgency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message || "Blood request sent successfully! ✅");
      setSelectedDonor(null);
      setRequestData({
        hospitalName: "",
        contactNumber: "",
        patientCity: "",
        urgency: "",
      });
    } catch (error) {
      console.log("❌ Blood Request Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message || "Unable to send blood request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-[#fff6f6] via-[#ffeded]/60 to-[#fff0f2] py-12 px-4 transition-colors duration-200 dark:from-[#0d0305] dark:via-[#19060b] dark:to-[#0f0205]">
      
      {/* Background Soft Red Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-red-400/15 blur-3xl dark:bg-red-600/10" />
      <div className="pointer-events-none absolute -right-20 top-80 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-900/15" />

      <div className="relative z-10 max-w-6xl mx-auto pb-16">

        {/* ===============================
            PAGE HEADER
        =============================== */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
            </span>
            Verified Life Savers
          </div>

          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-red-600 dark:text-red-500">
            Find Blood Donors
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select blood group and city to find compatible, verified blood donors instantly.
          </p>
        </div>

        {/* ===============================
            SEARCH BOX
        =============================== */}
        <div className="rounded-3xl border border-rose-200/90 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-red-900/10 backdrop-blur-md mb-8 dark:border-red-950/80 dark:bg-slate-900/95">
          <div className="grid md:grid-cols-3 gap-4">

            {/* Blood Group Dropdown */}
            <div className="relative">
              <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                Blood Group
              </label>
              <div className="relative">
                <select
                  aria-label="Select Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3.5 pr-10 text-sm font-medium text-slate-800 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="">Select Blood Group (All)</option>
                  <option value="A+">A+ (A Positive)</option>
                  <option value="A-">A- (A Negative)</option>
                  <option value="B+">B+ (B Positive)</option>
                  <option value="B-">B- (B Negative)</option>
                  <option value="O+">O+ (O Positive)</option>
                  <option value="O-">O- (O Negative)</option>
                  <option value="AB+">AB+ (AB Positive)</option>
                  <option value="AB-">AB- (AB Negative)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-red-600 dark:text-red-400">
                  <FaTint className="text-xs" />
                </div>
              </div>
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                City / Location
              </label>
              <div className="relative">
                <select
                  aria-label="Select City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3.5 pr-10 text-sm font-medium text-slate-800 transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="">Select City (All Cities)</option>
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

            {/* Find Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full rounded-xl bg-red-600 p-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 active:scale-98 disabled:bg-slate-400 dark:disabled:bg-slate-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Finding Matches...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>🔍 Find Best Donors</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* ===============================
            STATUS / ERROR MESSAGE
        =============================== */}
        {message && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-center text-sm font-semibold text-red-700 shadow-sm mb-6 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {message}
          </div>
        )}

        {/* ===============================
            MATCH RESULT HEADER (Only when donors exist)
        =============================== */}
        {donors.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FaHeartbeat className="text-red-600 dark:text-red-400" />
                Recommended Donors
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Donors are arranged according to matching factors.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-1.5 text-xs font-black text-red-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
              <span>●</span>
              {donors.length} Donor{donors.length === 1 ? "" : "s"} Found
            </div>
          </div>
        )}

        {/* ===============================
            DONOR CARDS GRID (Only when donors exist)
        =============================== */}
        {donors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => {
              const donorElig =
                donor.eligibility ||
                calculateDonationEligibility(donor.lastDonationDate);
              const isCooldown = Boolean(donorElig?.cooldownActive);

              return (
                <div
                  key={donor._id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-rose-200/80 bg-white/95 p-6 shadow-lg shadow-red-900/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/95 dark:hover:border-red-900/70"
                >
                  <div>
                    {/* Top Header Pill: Match & Availability */}
                    <div className="flex items-center justify-between pb-4 border-b border-rose-100/80 dark:border-slate-800">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                        <span>⚡</span>
                        <span>Smart Match: {donor.matchScore ?? 0}%</span>
                      </div>

                      {isCooldown ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Cooldown ({donorElig.daysRemaining}d left)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Available
                        </span>
                      )}
                    </div>

                    {/* Donor Profile Body */}
                    <div className="mt-5 flex items-start gap-4">
                      {/* Blood Group Badge */}
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30">
                        <FaTint className="text-xs opacity-80" />
                        <span className="text-lg font-black tracking-tighter leading-none mt-0.5">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      {/* Name & City */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate">
                          {donor.fullName}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <FaMapMarkerAlt className="text-red-500" />
                          <span>{donor.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Donation Stats Pills */}
                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                        <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          Donations
                        </span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                          {donor.totalDonations ?? 0}
                        </span>
                      </div>

                      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-2.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
                        <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          Hero Points
                        </span>
                        <span className="text-sm font-black text-red-600 dark:text-red-400">
                          {donor.points ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {donor.matchReasons && donor.matchReasons.length > 0 && (
                      <div className="mt-4 space-y-1">
                        {donor.matchReasons.map((reason, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400"
                          >
                            <FaCheckCircle className="text-[10px] shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-5 pt-4 border-t border-rose-100/80 dark:border-slate-800">
                    {isCooldown ? (
                      <button
                        disabled
                        className="w-full rounded-2xl bg-amber-50 dark:bg-amber-950/40 py-3 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 cursor-not-allowed flex items-center justify-center gap-2"
                        title={`Donor in 90-day medical cooldown. Eligible on ${donorElig.formattedNextDate}`}
                      >
                        <span>🔒</span>
                        <span>In Recovery ({donorElig.daysRemaining}d left)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBloodRequest(donor)}
                        className="w-full rounded-2xl bg-red-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-600/25 transition-all duration-200 hover:bg-red-700 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FaTint />
                        <span>Send Blood Request</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===============================
            REQUEST FORM MODAL
        =============================== */}
        {selectedDonor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-3xl border border-rose-200/90 bg-white/98 p-7 sm:p-9 shadow-2xl backdrop-blur-md dark:border-red-950/80 dark:bg-slate-900/98 max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedDonor(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-slate-500 hover:bg-rose-100 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              >
                <FaTimes />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl text-red-600 shadow-inner dark:bg-red-950/60 dark:text-red-400">
                  <FaTint />
                </div>
                <h2 className="mt-3 text-2xl font-black text-red-600 dark:text-red-500">
                  Send Blood Request
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Requesting blood from <span className="font-bold text-slate-800 dark:text-white">{selectedDonor.fullName}</span> ({selectedDonor.bloodGroup})
                </p>
              </div>

              {/* Match Snapshot */}
              <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3.5 mb-5 flex items-center justify-between dark:border-red-950/60 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-semibold">Location</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">📍 {selectedDonor.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400 block font-semibold">Blood Group</span>
                  <span className="font-black text-red-600 dark:text-red-400 text-sm">{selectedDonor.bloodGroup}</span>
                </div>
              </div>

              <form onSubmit={submitBloodRequest} className="space-y-4">
                
                {/* Hospital Name */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={requestData.hospitalName}
                    onChange={handleRequestChange}
                    placeholder="e.g. Apollo Hospital, City Clinic"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                    Patient Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={requestData.contactNumber}
                    onChange={handleRequestChange}
                    placeholder="Enter 10-digit emergency contact"
                    maxLength="10"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition"
                    required
                  />
                </div>

                {/* Patient City */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                    Hospital City
                  </label>
                  <div className="relative">
                    <select
                      name="patientCity"
                      value={requestData.patientCity}
                      onChange={handleRequestChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                      required
                    >
                      <option value="">Select Hospital City</option>
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

                {/* Urgency */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                    Urgency Level
                  </label>
                  <select
                    name="urgency"
                    value={requestData.urgency}
                    onChange={handleRequestChange}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition cursor-pointer"
                    required
                  >
                    <option value="">Select Urgency</option>
                    <option value="Normal">🟢 Normal (Within 24 hours)</option>
                    <option value="Urgent">🟡 Urgent (Within 6-12 hours)</option>
                    <option value="Emergency">🔴 Critical Emergency (Immediate)</option>
                  </select>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDonor(null);
                      setRequestData({
                        hospitalName: "",
                        contactNumber: "",
                        patientCity: "",
                        urgency: "",
                      });
                    }}
                    className="w-1/2 rounded-2xl border border-slate-200 py-3 text-xs sm:text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-1/2 rounded-2xl bg-red-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 disabled:bg-slate-400 active:scale-98"
                  >
                    {requestLoading ? "Sending..." : "Submit Request"}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

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

export default FindDonor;