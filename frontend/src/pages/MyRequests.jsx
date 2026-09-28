import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

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
  // STATUS STYLE
  // ===============================

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Fulfilled") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // ===============================
  // URGENCY STYLE
  // ===============================

  const getUrgencyStyle = (urgency) => {
    if (urgency === "Emergency") {
      return "bg-red-100 text-red-700";
    }

    if (urgency === "Urgent") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600">
            My Blood Requests
          </h1>

          <p className="text-gray-600 mt-2">
            Track the blood requests you have submitted.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center mb-6">
            {message}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-600">
              Loading your blood requests...
            </p>
          </div>
        )}

        {/* NO REQUESTS */}

        {!loading && requests.length === 0 && !message && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <div className="text-5xl mb-4">🩸</div>

            <h2 className="text-2xl font-semibold text-gray-800">
              No Blood Requests
            </h2>

            <p className="text-gray-600 mt-2">
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
                className="bg-white rounded-2xl shadow-md p-6"
              >

                {/* HEADER */}

                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {request.bloodGroup} Blood Required
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="space-y-3 text-gray-700">

                  <p>
                    <span className="font-semibold">
                      👤 Donor:
                    </span>{" "}
                    {request.donorName || "Assigned Donor"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      🏥 Hospital:
                    </span>{" "}
                    {request.hospitalName}
                  </p>

                  <p>
                    <span className="font-semibold">
                      📍 City:
                    </span>{" "}
                    {request.city}
                  </p>

                  <p>
                    <span className="font-semibold">
                      📞 Contact:
                    </span>{" "}
                    {request.contactNumber}
                  </p>

                  <p>
                    <span className="font-semibold">
                      🚨 Urgency:
                    </span>{" "}
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-semibold ${getUrgencyStyle(
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
                    className="w-full mt-6 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === request._id
                      ? "Cancelling..."
                      : "Cancel Request"}
                  </button>
                )}

                {/* ACCEPTED */}

                {request.status === "Accepted" && (
                  <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-lg text-center font-semibold">
                    ✅ Donor has accepted your blood request.
                  </div>
                )}

                {/* REJECTED */}

                {request.status === "Rejected" && (
                  <div className="mt-6 bg-red-50 text-red-700 p-3 rounded-lg text-center font-semibold">
                    ❌ Donor rejected your blood request.
                  </div>
                )}

                {/* CANCELLED */}

                {request.status === "Cancelled" && (
                  <div className="mt-6 bg-gray-100 text-gray-700 p-3 rounded-lg text-center font-semibold">
                    Request cancelled successfully.
                  </div>
                )}

                {/* FULFILLED */}

                {request.status === "Fulfilled" && (
                  <div className="mt-6 bg-blue-50 text-blue-700 p-3 rounded-lg text-center font-semibold">
                    🩸 Blood request has been fulfilled.
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyRequests;