import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ChatModal from "../components/ChatModal/ChatModal";

function DonorRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);
  const [otpModalRequest, setOtpModalRequest] = useState(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // ===============================
  // FETCH DONOR REQUESTS
  // ===============================

  const fetchDonorRequests = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "Blood Donor") {
        navigate("/dashboard");
        return;
      }

      const response = await api.get("/api/donor-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data.requests);
    } catch (error) {
      console.log("❌ Donor Requests Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch blood requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorRequests();
  }, [navigate]);

  // ===============================
  // ACCEPT / REJECT REQUEST
  // ===============================

  const handleDecision = async (requestId, decision) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading(requestId);
    setMessage("");

    try {
      const response = await api.put(
        `/api/blood-requests/${requestId}/decision`,
        {
          decision,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      // Re-fetch donor requests to get fresh state (including verificationOtp)
      await fetchDonorRequests();
    } catch (error) {
      console.log("❌ Decision Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to process blood request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // COMPLETE DONATION (VERIFY VIA 4-DIGIT OTP)
  // ===============================

  const handleVerifyOtpAndComplete = async (e) => {
    e.preventDefault();
    if (!otpModalRequest) return;

    if (!otpInput || otpInput.trim().length !== 4) {
      setOtpError("Please enter the 4-digit OTP provided by the patient");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading(otpModalRequest._id);
    setOtpError("");

    try {
      const response = await api.put(
        `/api/blood-requests/${otpModalRequest._id}/fulfill`,
        {
          otp: otpInput.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Blood donation verified & completed! +20 points credited and certificate generated 🎉"
      );

      // Update status immediately on screen
      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === otpModalRequest._id
            ? {
                ...request,
                status: "Fulfilled",
              }
            : request
        )
      );

      setOtpModalRequest(null);
      setOtpInput("");

      // Trigger user profile reload event
      window.dispatchEvent(new Event("lifelink-auth-changed"));
    } catch (error) {
      console.log("❌ Complete Donation Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setOtpError(
        error.response?.data?.message ||
          "Invalid OTP. Please check with the patient and try again."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // STATUS STYLE
  // ===============================

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/60";
    }

    if (status === "Fulfilled") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
    }

    if (status === "Cancelled") {
      return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
  };

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-500">
            Blood Requests
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mt-2">
            View blood requests received from patients.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-center mb-6 shadow-sm">
            {message}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 animate-pulse">
              Loading blood requests...
            </p>
          </div>
        )}

        {/* NO REQUESTS */}

        {!loading && requests.length === 0 && !message && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">🩸</div>

            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              No Blood Requests
            </h2>

            <p className="text-slate-600 dark:text-slate-400 mt-2">
              You have not received any blood request yet.
            </p>
          </div>
        )}

        {/* REQUEST CARDS */}

        {!loading && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-950/50 p-6 transition-all"
              >

                {/* SOS BADGE */}
                {request.isEmergencySOS && (
                  <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md shadow-red-600/20">
                    <div className="flex items-center gap-2">
                      <span className="text-base animate-bounce">🚨</span>
                      <span className="text-xs font-black uppercase tracking-wider">
                        City-Wide Emergency SOS Alert
                      </span>
                    </div>
                    <p className="text-[11px] text-red-100 mt-1 leading-snug">
                      {request.status === "Pending"
                        ? "Broadcast to all compatible city donors. First donor to click Accept gets assigned!"
                        : "You accepted this Emergency SOS request. Coordinated patient is awaiting your blood donation."}
                    </p>
                  </div>
                )}

                {/* CARD HEADER */}

                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {request.bloodGroup} Blood Required
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>

                {/* REQUEST DETAILS */}

                <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm">

                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      👤 Patient:
                    </span>{" "}
                    {request.patientName}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      🏥 Hospital:
                    </span>{" "}
                    {request.hospitalName}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      📍 City:
                    </span>{" "}
                    {request.city}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      📞 Contact:
                    </span>{" "}
                    {request.contactNumber}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      🚨 Urgency:
                    </span>{" "}
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {request.urgency}
                    </span>
                  </p>

                </div>

                {/* ACTION BUTTONS */}

                {request.status === "Pending" && (
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">

                    <button
                      onClick={() =>
                        handleDecision(
                          request._id,
                          "Accepted"
                        )
                      }
                      disabled={actionLoading === request._id}
                      className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      {actionLoading === request._id
                        ? "Processing..."
                        : request.isEmergencySOS
                        ? "Accept SOS 🚨"
                        : "Accept"}
                    </button>

                    <button
                      onClick={() =>
                        handleDecision(
                          request._id,
                          "Rejected"
                        )
                      }
                      disabled={actionLoading === request._id}
                      className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      {actionLoading === request._id
                        ? "Processing..."
                        : request.isEmergencySOS
                        ? "Dismiss"
                        : "Reject"}
                    </button>

                  </div>
                )}

                {/* PROCESSED MESSAGE */}

                {request.status === "Accepted" && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                      <span>✅</span>
                      <span>Request Accepted! Have you coordinated with {request.patientName}?</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Use the direct chat below to coordinate arrival time, hospital room, and blood bank formalities. Once donation is done at the hospital, collect the 4-digit verification OTP from the patient to claim your points & certificate!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={() => setActiveChatRequestId(request._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>💬</span>
                        <span>Chat with Patient</span>
                      </button>

                      <button
                        onClick={() => {
                          setOtpModalRequest(request);
                          setOtpInput("");
                          setOtpError("");
                        }}
                        disabled={actionLoading === request._id}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>🛡️</span>
                        <span>Verify OTP (+20 Pts)</span>
                      </button>
                    </div>
                  </div>
                )}

                {request.status === "Fulfilled" && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/60 space-y-3">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
                      <span>🎉</span>
                      <span>Donation Fulfilled! +20 Points & Certificate Issued</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Thank you for saving a life! Your official certificate has been generated and added to your collection.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={() => setActiveChatRequestId(request._id)}
                        className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>💬</span>
                        <span>View Chat</span>
                      </button>

                      <button
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>📜</span>
                        <span>View Certificate →</span>
                      </button>
                    </div>
                  </div>
                )}

                {request.status === "Rejected" && (
                  <div className="mt-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 p-3 rounded-xl text-center font-semibold text-sm">
                    ❌ You rejected this blood request.
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* 🛡️ HOSPITAL 4-DIGIT OTP VERIFICATION MODAL */}
        {otpModalRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  🛡️
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                  Hospital Donation Verification
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ask patient <span className="font-bold text-slate-700 dark:text-slate-200">{otpModalRequest.patientName}</span> for the 4-digit OTP shown on their screen.
                </p>
              </div>

              <form onSubmit={handleVerifyOtpAndComplete} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 text-center uppercase tracking-wider">
                    Enter 4-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength="4"
                    autoFocus
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, ""));
                      setOtpError("");
                    }}
                    placeholder="••••"
                    className="w-full text-center text-3xl font-black tracking-[1em] font-mono py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition placeholder-slate-400"
                    required
                  />
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs text-center font-bold">
                    {otpError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpModalRequest(null);
                      setOtpInput("");
                      setOtpError("");
                    }}
                    className="w-1/3 py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={actionLoading === otpModalRequest._id || otpInput.length !== 4}
                    className="w-2/3 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {actionLoading === otpModalRequest._id ? "Verifying..." : "Verify & Complete (+20 Pts) ✓"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* DIRECT IN-APP CHAT MODAL */}
        {activeChatRequestId && (
          <ChatModal
            requestId={activeChatRequestId}
            onClose={() => setActiveChatRequestId(null)}
          />
        )}

      </div>
    </div>
  );
}

export default DonorRequests;