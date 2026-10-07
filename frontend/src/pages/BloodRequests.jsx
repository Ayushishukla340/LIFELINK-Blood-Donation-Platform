import { useEffect, useState } from "react";
import api from "../services/api";

function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

      setUpdatingId(id);
      setMessage("");

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
      setMessage(response.data.message || `Request status updated to ${status}.`);

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

      // Clear pending selection state for this request
      setSelectedStatuses((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error("Status Update Error:", error);
      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          "Unable to update blood request status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "Rejected":
        return "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60";
      case "Fulfilled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "Cancelled":
        return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700";
      case "Pending":
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter =
      statusFilter === "All" || req.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      req.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.bloodGroup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <p className="text-lg font-semibold animate-pulse">
          Loading blood requests...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-extrabold text-red-600 dark:text-red-500 mb-2">
            Blood Requests
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            View and manage real-time patient blood requests across hospitals and cities.
          </p>
        </div>

        {message && (
          <div
            className={`text-center font-semibold mb-6 px-4 py-3 rounded-xl border max-w-xl mx-auto ${
              isError
                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
            }`}
          >
            {message}
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["All", "Pending", "Accepted", "Rejected", "Fulfilled", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === tab
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by patient, city, hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {!isError && filteredRequests.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-10 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No blood requests found matching your filter.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => {
            const currentSelected =
              selectedStatuses[request._id] ?? request.status;
            const hasChanged = currentSelected !== request.status;
            const isUpdating = updatingId === request._id;

            return (
              <div
                key={request._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:shadow-slate-950/50 p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {request.patientName}
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        📍 {request.city || "Unknown City"}
                      </span>
                    </div>

                    <span className="bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                      {request.bloodGroup}
                    </span>
                  </div>

                  {request.isFreePrivilege && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm">
                        <span>🛡️</span>
                        <span>100% Free Blood Privilege (Zero Charges)</span>
                      </span>
                    </div>
                  )}

                  <div className="space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                    <p>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Hospital:
                      </span>{" "}
                      {request.hospitalName}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Contact:
                      </span>{" "}
                      <span className="font-mono text-xs">
                        {request.contactNumber}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Urgency:
                      </span>{" "}
                      <span
                        className={`font-bold ${
                          request.urgency === "Emergency"
                            ? "text-red-600 dark:text-red-400"
                            : request.urgency === "Urgent"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {request.urgency}
                      </span>
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Status:
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeStyle(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ADMIN STATUS CONTROLLER (Full authority: change to any status anytime) */}
                {loggedInUser?.role === "Admin" && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Admin Status Control
                      </span>
                      {hasChanged && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                          Ready to update
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        aria-label={`Select status for ${request.patientName}`}
                        value={currentSelected}
                        onChange={(e) =>
                          setSelectedStatuses((previous) => ({
                            ...previous,
                            [request._id]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer transition"
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Accepted">🟢 Accepted</option>
                        <option value="Rejected">🔴 Rejected</option>
                        <option value="Fulfilled">🔵 Fulfilled</option>
                        <option value="Cancelled">⚪ Cancelled</option>
                      </select>

                      <button
                        onClick={() =>
                          handleStatusChange(request._id, currentSelected)
                        }
                        disabled={isUpdating || !hasChanged}
                        className={`px-3.5 py-2 text-xs rounded-xl font-bold transition shadow-sm flex items-center justify-center min-w-20 ${
                          hasChanged
                            ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer ring-2 ring-red-400/50"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {isUpdating ? "Saving..." : "Update"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BloodRequests;