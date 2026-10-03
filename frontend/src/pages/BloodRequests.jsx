import { useEffect, useState } from "react";
import api from "../services/api";

function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setLoggedInUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to read stored user:", error);
    }
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsError(true);
        setMessage("Please login again. Login token not found.");
        return;
      }

      const response = await api.get("/api/blood-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Blood Requests Error:", error);
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to fetch blood requests."
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

      if (!token) {
        setIsError(true);
        setMessage("Please login again. Login token not found.");
        return;
      }

      const response = await api.put(
        `/api/blood-requests/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsError(false);
      setMessage(response.data.message || "Request status updated.");

      setRequests((previousRequests) =>
        previousRequests.map((request) =>
          request._id === id
            ? {
                ...request,
                status: response.data.request?.status || status,
              }
            : request
        )
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to update blood request status."
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
          <p
            className={`text-center font-semibold mb-6 ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {!isError && requests.length === 0 && (
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
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  {request.patientName}
                </h2>

                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                  {request.bloodGroup}
                </span>
              </div>

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

              {loggedInUser?.role === "Admin" && (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      handleStatusChange(request._id, "Fulfilled")
                    }
                    disabled={request.status === "Fulfilled"}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Fulfilled
                  </button>

                  <button
                    onClick={() =>
                      handleStatusChange(request._id, "Cancelled")
                    }
                    disabled={
                      request.status === "Cancelled" ||
                      request.status === "Fulfilled"
                    }
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50"
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