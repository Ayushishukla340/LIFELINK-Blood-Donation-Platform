import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ChatModal from "../components/ChatModal/ChatModal";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [activeChatRequestId, setActiveChatRequestId] = useState(null);

  // ===============================
  // FETCH MY BLOOD REQUESTS
  // ===============================

  const fetchMyRequests = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(
        "/api/my-blood-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(response.data.requests);
    } catch (error) {
      console.log("❌ My Requests Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch your blood requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [navigate]);

  // ===============================
  // CANCEL BLOOD REQUEST
  // ===============================

  const handleCancelRequest = async (requestId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading(requestId);
    setMessage("");

    try {
      const response = await api.put(
        `/api/blood-requests/${requestId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      // Update status immediately
      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Cancelled",
              }
            : request
        )
      );
    } catch (error) {
      console.log("❌ Cancel Request Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to cancel blood request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ===============================
  // CONFIRM BLOOD RECEIVED (FULFILL)
  // ===============================

  const handleConfirmReceived = async (requestId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setActionLoading(requestId);
    setMessage("");

    try {
      const response = await api.put(
        `/api/blood-requests/${requestId}/fulfill`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Blood donation confirmed and marked as fulfilled! Thank you."
      );

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Fulfilled",
              }
            : request
        )
      );
    } catch (error) {
      console.log("❌ Confirm Received Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to confirm blood receipt"
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
      return "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 dark:border dark:border-green-800/40";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/40";
    }

    if (status === "Fulfilled") {
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 dark:border dark:border-blue-800/40";
    }

    if (status === "Cancelled") {
      return "bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-400 dark:border dark:border-slate-700";
    }

    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400 dark:border dark:border-yellow-800/40";
  };

  // ===============================
  // URGENCY STYLE
  // ===============================

  const getUrgencyStyle = (urgency) => {
    if (urgency === "Emergency") {
      return "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/40";
    }

    if (urgency === "Urgent") {
      return "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 dark:border dark:border-orange-800/40";
    }

    return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 dark:border dark:border-blue-800/40";
  };

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 transition-colors duration-200 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-500">
            My Blood Requests
          </h1>

          <p className="text-gray-600 dark:text-slate-400 mt-2">
            Track the blood requests you have submitted.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800 p-4 rounded-xl text-center mb-6">
            {message}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center border border-red-50 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-gray-600 dark:text-slate-400">
              Loading your blood requests...
            </p>
          </div>
        )}

        {/* NO REQUESTS */}

        {!loading && requests.length === 0 && !message && (
          <div className="bg-white rounded-2xl shadow p-10 text-center border border-red-50 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-5xl mb-4">🩸</div>

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">
              No Blood Requests
            </h2>

            <p className="text-gray-600 dark:text-slate-400 mt-2">
              You have not submitted any blood request yet.
            </p>
          </div>
        )}

        {/* REQUEST CARDS */}

        {!loading && requests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-md p-6 border border-red-50 dark:border-slate-800 dark:bg-slate-900"
              >

                {/* HEADER */}

                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                      {request.bloodGroup} Blood Required
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {request.isEmergencySOS && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
                      <span>🚨</span>
                      <span>Emergency SOS Broadcast (City-Wide)</span>
                    </span>
                  )}

                  {request.isFreePrivilege && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                      <span>🛡️</span>
                      <span>Gold Lifesaver: 100% Free Blood • Zero Charges</span>
                    </span>
                  )}
                </div>

                {/* DETAILS */}

                <div className="space-y-3 text-gray-700 dark:text-slate-300">

                  <p>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      👤 Donor:
                    </span>{" "}
                    {request.donorName || (request.isEmergencySOS ? "Awaiting City Donor Acceptance..." : "Assigned Donor")}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      🏥 Hospital:
                    </span>{" "}
                    {request.hospitalName}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      📍 City:
                    </span>{" "}
                    {request.city}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      📞 Contact:
                    </span>{" "}
                    {request.contactNumber}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      🚨 Urgency:
                    </span>{" "}
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getUrgencyStyle(
                        request.urgency
                      )}`}
                    >
                      {request.urgency}
                    </span>
                  </p>

                </div>

                {/* CANCEL BUTTON */}

                {request.status === "Pending" && (
                  <button
                    onClick={() =>
                      handleCancelRequest(request._id)
                    }
                    disabled={actionLoading === request._id}
                    className="w-full mt-6 bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-900 transition dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {actionLoading === request._id
                      ? "Cancelling..."
                      : request.isEmergencySOS
                      ? "Cancel Emergency SOS Broadcast"
                      : "Cancel Request"}
                  </button>
                )}

                {/* ACCEPTED */}

                {request.status === "Accepted" && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                      <span>✅</span>
                      <span>Donor has accepted your blood request!</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Donor <span className="font-bold text-slate-800 dark:text-slate-100">{request.donorName || "Assigned Donor"}</span> is coordinating with <span className="font-semibold text-slate-800 dark:text-slate-100">{request.hospitalName}</span>. Use the chat below to coordinate ward room, timing, and formalities!
                    </p>

                    {/* 🛡️ 4-DIGIT HOSPITAL VERIFICATION OTP */}
                    {request.verificationOtp && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border-2 border-dashed border-amber-400 dark:border-amber-600/70 text-center">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                          🛡️ Hospital Donation Verification OTP
                        </span>
                        <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-amber-900 dark:text-amber-100 my-1 select-all">
                          {request.verificationOtp}
                        </div>
                        <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 font-medium">
                          Provide this 4-digit OTP to the donor at the hospital after donation. They will enter it into their portal to verify the donation and receive their certificate.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        onClick={() => setActiveChatRequestId(request._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>💬</span>
                        <span>Chat with Donor</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* REJECTED */}

                {request.status === "Rejected" && (
                  <div className="mt-6 bg-red-50 text-red-700 p-3 rounded-xl text-center font-semibold dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-800/40">
                    ❌ Donor rejected your blood request.
                  </div>
                )}

                {/* CANCELLED */}

                {request.status === "Cancelled" && (
                  <div className="mt-6 bg-gray-100 text-gray-700 p-3 rounded-xl text-center font-semibold dark:bg-slate-800 dark:text-slate-400">
                    Request cancelled successfully.
                  </div>
                )}

                {/* FULFILLED */}

                {request.status === "Fulfilled" && (
                  <div className="mt-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2.5">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
                      <span>🎉</span>
                      <span>Blood request has been fulfilled!</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Thank you for using LifeLink. You can still view your past coordination chat with the donor.
                    </p>
                    <button
                      onClick={() => setActiveChatRequestId(request._id)}
                      className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>💬</span>
                      <span>View Coordination Chat</span>
                    </button>
                  </div>
                )}

              </div>
            ))}

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

export default MyRequests;