import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DonorRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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

      // Update status immediately on screen
      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: decision,
              }
            : request
        )
      );
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
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-600">
            Blood Requests
          </h1>

          <p className="text-gray-600 mt-2">
            View blood requests received from patients.
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
              Loading blood requests...
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
                className="bg-white rounded-2xl shadow-md p-6"
              >

                {/* CARD HEADER */}

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

                {/* REQUEST DETAILS */}

                <div className="space-y-3 text-gray-700">

                  <p>
                    <span className="font-semibold">
                      👤 Patient:
                    </span>{" "}
                    {request.patientName}
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
                    {request.urgency}
                  </p>

                </div>

                {/* ACTION BUTTONS */}

                {request.status === "Pending" && (
                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        handleDecision(
                          request._id,
                          "Accepted"
                        )
                      }
                      disabled={actionLoading === request._id}
                      className="w-1/2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === request._id
                        ? "Processing..."
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
                      className="w-1/2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === request._id
                        ? "Processing..."
                        : "Reject"}
                    </button>

                  </div>
                )}

                {/* PROCESSED MESSAGE */}

                {request.status === "Accepted" && (
                  <div className="mt-6 bg-green-50 text-green-700 p-3 rounded-lg text-center font-semibold">
                    ✅ You accepted this blood request.
                  </div>
                )}

                {request.status === "Rejected" && (
                  <div className="mt-6 bg-red-50 text-red-700 p-3 rounded-lg text-center font-semibold">
                    ❌ You rejected this blood request.
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

export default DonorRequests;