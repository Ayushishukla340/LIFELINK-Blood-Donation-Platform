import { useEffect, useState } from "react";
import api from "../services/api";

function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/api/blood-requests");

      setRequests(response.data.requests);
    } catch (error) {
      console.log("❌ Blood Requests Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch blood requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/api/blood-requests/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: response.data.request.status,
              }
            : request
        )
      );
    } catch (error) {
      console.log("❌ Status Update Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update blood request status"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading blood requests...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold text-red-600 text-center mb-3">
          Blood Requests
        </h1>

        <p className="text-center text-gray-600 mb-10">
          View and manage blood requests.
        </p>

        {message && (
          <p className="text-center text-green-600 font-semibold mb-6">
            {message}
          </p>
        )}

        {requests.length === 0 && !message && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-600">
              No blood requests available.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              {/* Header */}
              <div className="flex justify-between items-start mb-4">

                <h2 className="text-xl font-bold">
                  {request.patientName}
                </h2>

                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                  {request.bloodGroup}
                </span>

              </div>

              {/* Details */}
              <div className="space-y-2 text-gray-600">

                <p>
                  <span className="font-semibold text-gray-800">
                    Hospital:
                  </span>{" "}
                  {request.hospitalName}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    City:
                  </span>{" "}
                  {request.city}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Contact:
                  </span>{" "}
                  {request.contactNumber}
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Urgency:
                  </span>{" "}
                  <span className="text-red-600 font-semibold">
                    {request.urgency}
                  </span>
                </p>

                <p>
                  <span className="font-semibold text-gray-800">
                    Status:
                  </span>{" "}
                  <span className="font-semibold">
                    {request.status}
                  </span>
                </p>

              </div>

              {/* Admin Controls */}
              {loggedInUser?.role === "Admin" && (
                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() =>
                      handleStatusChange(
                        request._id,
                        "Fulfilled"
                      )
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Fulfilled
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(
                        request._id,
                        "Cancelled"
                      )
                    }
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default BloodRequests;