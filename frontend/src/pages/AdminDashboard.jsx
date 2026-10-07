import { useCallback, useEffect, useState } from "react";
import { FaTint, FaChartLine, FaHeartbeat } from "react-icons/fa";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // Active view tab for user directories: "all" | "donors" | "patients"
  const [activeUserTab, setActiveUserTab] = useState("all");

  // Search filters for donor & patient tables
  const [donorSearch, setDonorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalPatients: 0,
    totalRequests: 0,
    pendingRequests: 0,
    fulfilledRequests: 0,
    cancelledRequests: 0,
    rejectedRequests: 0,
  });

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please log in again to access the Admin Dashboard.");
        setMessageType("error");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [usersResponse, requestsResponse] = await Promise.all([
        api.get("/api/users", config),
        api.get("/api/blood-requests", config),
      ]);

      const usersData = Array.isArray(usersResponse.data.users)
        ? usersResponse.data.users
        : [];

      const requestsData = Array.isArray(requestsResponse.data.requests)
        ? requestsResponse.data.requests
        : [];

      setUsers(usersData);
      setRequests(requestsData);

      setStats({
        totalUsers: usersData.length,
        totalDonors: usersData.filter(
          (user) => user.role === "Blood Donor"
        ).length,
        totalPatients: usersData.filter(
          (user) => user.role === "Patient"
        ).length,
        totalRequests: requestsData.length,
        pendingRequests: requestsData.filter(
          (request) => request.status === "Pending"
        ).length,
        fulfilledRequests: requestsData.filter(
          (request) => request.status === "Fulfilled"
        ).length,
        cancelledRequests: requestsData.filter(
          (request) => request.status === "Cancelled"
        ).length,
        rejectedRequests: requestsData.filter(
          (request) => request.status === "Rejected"
        ).length,
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Admin can change ANY request's status to ANY valid status
  const updateRequestStatus = async (request) => {
    const requestId = request._id;
    const newStatus = selectedStatuses[requestId];

    if (!requestId || !newStatus || newStatus === request.status) {
      setMessage("Please select a different status from the dropdown first.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in again.");
      setMessageType("error");
      return;
    }

    setUpdatingId(requestId);
    setMessage("");

    try {
      const response = await api.put(
        `/api/blood-requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        response.data?.message ||
          `Request status successfully updated to "${newStatus}".`
      );
      setMessageType("success");

      // Clear selected dropdown state for this request
      setSelectedStatuses((previous) => {
        const next = { ...previous };
        delete next[requestId];
        return next;
      });

      // Refresh admin data to update counters and table immediately
      await fetchAdminData();
    } catch (error) {
      console.error("Status update error:", error);
      setMessage(
        error.response?.data?.message ||
          "Unable to update request status. Please try again."
      );
      setMessageType("error");
    } finally {
      setUpdatingId("");
    }
  };

  const getRoleStyle = (role) => {
    if (role === "Admin")
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800";
    if (role === "Blood Donor")
      return "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/60";
    return "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
  };

  const getAvailabilityStyle = (availability) => {
    if (availability === "Available")
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
    if (availability === "Temporarily Unavailable")
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      Accepted:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      Rejected:
        "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900/60",
      Fulfilled:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      Cancelled:
        "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700",
    };

    return (
      styles[status] ||
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";
    return parsedDate.toLocaleDateString("en-IN");
  };

  // Filtered Donors & Patients lists
  const allDonors = users.filter((u) => u.role === "Blood Donor");
  const allPatients = users.filter((u) => u.role === "Patient");

  const filteredDonors = allDonors.filter((donor) => {
    const query = donorSearch.toLowerCase();
    return (
      (donor.fullName || "").toLowerCase().includes(query) ||
      (donor.city || "").toLowerCase().includes(query) ||
      (donor.bloodGroup || "").toLowerCase().includes(query) ||
      (donor.phone || "").toLowerCase().includes(query)
    );
  });

  const filteredPatients = allPatients.filter((patient) => {
    const query = patientSearch.toLowerCase();
    return (
      (patient.fullName || "").toLowerCase().includes(query) ||
      (patient.city || "").toLowerCase().includes(query) ||
      (patient.bloodGroup || "").toLowerCase().includes(query) ||
      (patient.phone || "").toLowerCase().includes(query)
    );
  });

  // Calculate requests made by a specific patient
  const getPatientRequestCount = (patient) => {
    return requests.filter(
      (r) =>
        r.patientId === patient._id ||
        (r.patientName &&
          r.patientName.toLowerCase() ===
            (patient.fullName || "").toLowerCase())
    ).length;
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "text-slate-900 dark:text-slate-100" },
    { label: "Blood Donors", value: stats.totalDonors, icon: "🩸", color: "text-red-600 dark:text-red-500" },
    { label: "Patients", value: stats.totalPatients, icon: "🏥", color: "text-blue-600 dark:text-blue-400" },
    { label: "Total Requests", value: stats.totalRequests, icon: "📋", color: "text-slate-900 dark:text-slate-100" },
    { label: "Pending Requests", value: stats.pendingRequests, icon: "⏳", color: "text-amber-600 dark:text-amber-400" },
    { label: "Fulfilled Requests", value: stats.fulfilledRequests, icon: "✅", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Cancelled Requests", value: stats.cancelledRequests, icon: "🚫", color: "text-slate-600 dark:text-slate-400" },
    { label: "Rejected Requests", value: stats.rejectedRequests, icon: "❌", color: "text-red-600 dark:text-red-400" },
  ];

  // ===============================
  // REAL-TIME ANALYTICS CALCULATIONS
  // ===============================
  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // 1. Blood Group Demand (Requests) vs Supply (Registered Donors)
  const bloodGroupStats = BLOOD_GROUPS.map((bg) => {
    const demandCount = requests.filter((r) => r.bloodGroup === bg).length;
    const donorSupplyCount = users.filter(
      (u) => u.role === "Blood Donor" && u.bloodGroup === bg
    ).length;
    return {
      bloodGroup: bg,
      demand: demandCount,
      supply: donorSupplyCount,
    };
  });

  const maxDemand = Math.max(...bloodGroupStats.map((b) => b.demand), 1);
  const maxSupply = Math.max(...bloodGroupStats.map((b) => b.supply), 1);
  const maxScale = Math.max(maxDemand, maxSupply, 1);

  // Highest demand blood group
  const topDemandGroup =
    [...bloodGroupStats].sort((a, b) => b.demand - a.demand)[0] || {
      bloodGroup: "O+",
      demand: 0,
    };

  // 2. Monthly Trend Calculation (Previous 6 Calendar Months)
  const getMonthlyTrend = () => {
    const list = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = d.toLocaleString("en-US", { month: "short" });
      const mIdx = d.getMonth();
      const yr = d.getFullYear();

      const matchedRequests = requests.filter((r) => {
        const itemDate = new Date(r.createdAt || r.date);
        return (
          !isNaN(itemDate.getTime()) &&
          itemDate.getMonth() === mIdx &&
          itemDate.getFullYear() === yr
        );
      });

      const total = matchedRequests.length;
      const fulfilled = matchedRequests.filter(
        (r) => r.status === "Fulfilled"
      ).length;

      list.push({
        label: mLabel,
        total,
        fulfilled,
      });
    }
    return list;
  };

  const monthlyData = getMonthlyTrend();
  const maxMonthlyVal = Math.max(
    ...monthlyData.map((m) => Math.max(m.total, m.fulfilled)),
    4
  );

  // 3. Urgency Counts & Breakdown
  const urgencyCounts = {
    Emergency: requests.filter((r) => r.urgency === "Emergency").length,
    Urgent: requests.filter((r) => r.urgency === "Urgent").length,
    Normal: requests.filter((r) => r.urgency === "Normal" || !r.urgency).length,
  };
  const totalUrgencyCount = Math.max(
    urgencyCounts.Emergency + urgencyCounts.Urgent + urgencyCounts.Normal,
    1
  );

  // 4. Overall Fulfillment Success Rate
  const fulfillmentRate =
    stats.totalRequests > 0
      ? Math.round((stats.fulfilledRequests / stats.totalRequests) * 100)
      : 0;

  // 5. SVG Area Curve Generator for Monthly Trend
  const svgWidth = 520;
  const svgHeight = 160;
  const padX = 35;
  const padY = 25;
  const usableWidth = svgWidth - padX * 2;
  const usableHeight = svgHeight - padY * 2;

  const points = monthlyData.map((item, idx) => {
    const x = padX + (idx / (monthlyData.length - 1)) * usableWidth;
    const y = svgHeight - padY - (item.total / maxMonthlyVal) * usableHeight;
    return {
      x,
      y,
      label: item.label,
      total: item.total,
      fulfilled: item.fulfilled,
    };
  });

  // Build smooth bezier path
  const svgPath = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cX1 = prev.x + (pt.x - prev.x) / 2;
    const cY1 = prev.y;
    const cX2 = prev.x + (pt.x - prev.x) / 2;
    const cY2 = pt.y;
    return `${acc} C ${cX1} ${cY1}, ${cX2} ${cY2}, ${pt.x} ${pt.y}`;
  }, "");

  const svgAreaPath = `${svgPath} L ${
    points[points.length - 1].x
  } ${svgHeight - padY} L ${points[0].x} ${svgHeight - padY} Z`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ================= HEADER ================= */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              🛡️ LifeLink Master Administration
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Admin Control Center
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
              Live monitoring, request status overrides, and segmented donor & patient directories.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 px-5 py-3 font-semibold text-white shadow-lg shadow-red-600/30 dark:shadow-red-950/60 transition cursor-pointer"
          >
            🔄 Refresh Data
          </button>
        </header>

        {/* ================= ALERTS / MESSAGES ================= */}
        {message && (
          <div
            role="alert"
            className={`rounded-xl border p-4 text-sm font-semibold flex items-center justify-between shadow-sm transition ${
              messageType === "success"
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                : messageType === "error"
                ? "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300"
                : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300"
            }`}
          >
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="text-xs underline hover:opacity-75 cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================= PLATFORM METRICS ================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              📊 Platform Overview & Metrics
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Live synced with database
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-red-300 dark:hover:border-red-900/60 transition"
              >
                <div className="flex items-center justify-between text-2xl">
                  <span>{card.icon}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Live
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className={`mt-1 text-2xl sm:text-3xl font-extrabold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= VISUAL ANALYTICS & CHARTS ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                🔴 Live Intelligence Engine
              </span>
              <h2 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FaChartLine className="text-red-600 dark:text-red-500" />
                Platform Analytics & Demand Trends
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Real-time blood group demand vs donor supply, monthly fulfillment trends, and urgency distribution.
              </p>
            </div>

            {/* Quick Insights Highlights */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-rose-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 shadow-sm">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Success Rate</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {fulfillmentRate}% Fulfilled
                </span>
              </div>
              <div className="rounded-2xl border border-rose-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 shadow-sm">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Peak Demand</span>
                <span className="text-lg font-black text-red-600 dark:text-red-400">
                  🩸 {topDemandGroup.bloodGroup} ({topDemandGroup.demand} reqs)
                </span>
              </div>
            </div>
          </div>

          {/* Charts Dual Grid */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* CHART 1: BLOOD GROUP DEMAND VS SUPPLY (DUAL BARS) */}
            <div className="rounded-3xl border border-rose-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-7 shadow-xl shadow-red-900/5 backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-slate-800 mb-5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FaTint className="text-red-600" />
                    Blood Group Demand vs Donor Supply
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Compare incoming patient requests against verified donor availability.
                  </p>
                </div>
                {/* Legend */}
                <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span>
                    Demand
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                    Supply
                  </span>
                </div>
              </div>

              {/* Blood Groups Bar List */}
              <div className="space-y-3.5">
                {bloodGroupStats.map((item) => {
                  const demandWidth = Math.max(
                    (item.demand / maxScale) * 100,
                    item.demand > 0 ? 8 : 2
                  );
                  const supplyWidth = Math.max(
                    (item.supply / maxScale) * 100,
                    item.supply > 0 ? 8 : 2
                  );
                  const isHighDemand = item.demand > item.supply;

                  return (
                    <div key={item.bloodGroup} className="group">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-black">
                          <span className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 text-xs">
                            {item.bloodGroup}
                          </span>
                          {isHighDemand && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                              ⚠️ Shortage Alert
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-red-600 dark:text-red-400">
                            {item.demand} Req
                          </span>
                          <span>|</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {item.supply} Donors
                          </span>
                        </div>
                      </div>

                      {/* Dual Progress Bars */}
                      <div className="space-y-1">
                        {/* Demand Bar */}
                        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${demandWidth}%` }}
                            title={`Demand: ${item.demand} requests`}
                          />
                        </div>
                        {/* Supply Bar */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${supplyWidth}%` }}
                            title={`Supply: ${item.supply} donors`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Note */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Higher donor bar = Healthy reserve</span>
                <span>🔴 Red = Demand • 🟢 Green = Registered Donors</span>
              </div>
            </div>

            {/* CHART 2: MONTHLY TREND (CURVE & PERFORMANCE BARS) */}
            <div className="rounded-3xl border border-rose-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-7 shadow-xl shadow-red-900/5 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-slate-800 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FaChartLine className="text-rose-600" />
                      Monthly Request & Fulfillment Trend
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      6-Month trajectory of blood requests submitted vs fulfilled.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span>
                      Requests
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                      Fulfilled
                    </span>
                  </div>
                </div>

                {/* SVG Area Line Chart */}
                <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-rose-50/50 to-transparent dark:from-red-950/20 dark:to-transparent p-2 border border-rose-100/60 dark:border-slate-800">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-36 sm:h-40 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="crimsonAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line
                      x1={padX}
                      y1={padY}
                      x2={svgWidth - padX}
                      y2={padY}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={padX}
                      y1={svgHeight / 2}
                      x2={svgWidth - padX}
                      y2={svgHeight / 2}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={padX}
                      y1={svgHeight - padY}
                      x2={svgWidth - padX}
                      y2={svgHeight - padY}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800"
                    />

                    {/* Area under curve */}
                    <path d={svgAreaPath} fill="url(#crimsonAreaGrad)" />

                    {/* Smooth curve line */}
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Values */}
                    {points.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          className="fill-white dark:fill-slate-900 stroke-red-600"
                          strokeWidth="3"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          className="text-[11px] font-black fill-slate-700 dark:fill-slate-200"
                        >
                          {pt.total}
                        </text>
                        <text
                          x={pt.x}
                          y={svgHeight - 6}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-slate-400 dark:fill-slate-500 uppercase"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Monthly Performance Columns */}
                <div className="mt-4 grid grid-cols-6 gap-2 text-center">
                  {monthlyData.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-800/40 p-2"
                    >
                      <span className="block text-[10px] font-bold uppercase text-slate-400">
                        {m.label}
                      </span>
                      <span className="block text-sm font-black text-red-600 dark:text-red-400 mt-0.5">
                        {m.total}
                      </span>
                      <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ {m.fulfilled}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency Distribution Bar inside right card */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Urgency Level Split:</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {urgencyCounts.Emergency} Critical • {urgencyCounts.Urgent} Urgent • {urgencyCounts.Normal} Normal
                  </span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{
                      width: `${(urgencyCounts.Emergency / totalUrgencyCount) * 100}%`,
                    }}
                    className="bg-red-600 transition-all duration-500"
                    title={`Emergency: ${urgencyCounts.Emergency}`}
                  />
                  <div
                    style={{
                      width: `${(urgencyCounts.Urgent / totalUrgencyCount) * 100}%`,
                    }}
                    className="bg-amber-500 transition-all duration-500"
                    title={`Urgent: ${urgencyCounts.Urgent}`}
                  />
                  <div
                    style={{
                      width: `${(urgencyCounts.Normal / totalUrgencyCount) * 100}%`,
                    }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`Normal: ${urgencyCounts.Normal}`}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= RECENT BLOOD REQUESTS (ADMIN STATUS OVERRIDE) ================= */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                🩸 Blood Requests Management
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Admin can update any request status anytime (even if Fulfilled or Rejected).
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 w-fit">
              {requests.length} Total Requests
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 text-left font-semibold">Patient</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Blood Group</th>
                    <th className="px-5 py-3.5 text-left font-semibold">City</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Hospital</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Current Status</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                    <th className="px-5 py-3.5 text-left font-semibold min-w-56">Admin Status Override</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                        No blood requests found in the system.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request, index) => {
                      const currentSelectedStatus =
                        selectedStatuses[request._id] || request.status || "Pending";
                      const isStatusChanged = currentSelectedStatus !== request.status;

                      return (
                        <tr
                          key={request._id || index}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">
                            {request.patientName || "—"}
                          </td>
                          <td className="px-5 py-4 font-bold text-red-600 dark:text-red-400">
                            <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60">
                              {request.bloodGroup || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                            📍 {request.city || "—"}
                          </td>
                          <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                            {request.hospitalName || "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                                request.status
                              )}`}
                            >
                              {request.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">
                            {formatDate(request.createdAt || request.date)}
                          </td>
                          <td className="px-5 py-4">
                            {/* Status Override Controls - Active for ALL statuses */}
                            <div className="flex items-center gap-2">
                              <select
                                aria-label={`Update status for ${request.patientName || "request"}`}
                                value={currentSelectedStatus}
                                onChange={(event) =>
                                  setSelectedStatuses((previous) => ({
                                    ...previous,
                                    [request._id]: event.target.value,
                                  }))
                                }
                                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                              >
                                {["Pending", "Accepted", "Rejected", "Fulfilled", "Cancelled"].map(
                                  (statusOption) => (
                                    <option key={statusOption} value={statusOption}>
                                      {statusOption}
                                    </option>
                                  )
                                )}
                              </select>

                              <button
                                type="button"
                                disabled={
                                  updatingId === request._id || !isStatusChanged
                                }
                                onClick={() => updateRequestStatus(request)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer ${
                                  isStatusChanged
                                    ? "bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/30"
                                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                                }`}
                              >
                                {updatingId === request._id
                                  ? "Saving..."
                                  : isStatusChanged
                                  ? "Update"
                                  : "Saved"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-3 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>Showing all {requests.length} blood requests.</span>
              <span className="text-slate-400">Status can be modified at any point by admin</span>
            </div>
          </div>
        </section>

        {/* ================= USER DIRECTORIES WITH SEPARATED DONOR & PATIENT SIDES ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                👥 User Directories
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Distinct segregated views for Blood Donors and Patients for effortless analysis.
              </p>
            </div>

            {/* Interactive View Filter Tabs */}
            <div className="flex rounded-xl bg-slate-200/80 dark:bg-slate-800/80 p-1.5 gap-1 self-start sm:self-auto border border-slate-300/40 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveUserTab("all")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  activeUserTab === "all"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Users ({users.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveUserTab("donors")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeUserTab === "donors"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                🩸 Blood Donors ({allDonors.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveUserTab("patients")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeUserTab === "patients"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                🏥 Patients ({allPatients.length})
              </button>
            </div>
          </div>

          {/* ================= DONOR SIDE LIST ================= */}
          {(activeUserTab === "all" || activeUserTab === "donors") && (
            <div className="rounded-2xl border border-red-100 dark:border-red-950/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {/* Donor Section Header */}
              <div className="p-5 border-b border-red-50 dark:border-slate-800 bg-gradient-to-r from-red-50/70 via-white to-white dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-xl text-red-600 dark:text-red-400 font-bold shadow-sm">
                    🩸
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Blood Donors Directory
                      </h3>
                      <span className="rounded-full bg-red-600 text-white text-xs font-extrabold px-2.5 py-0.5">
                        {allDonors.length} Donors
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verified donors with contact details, availability status and total lifetime donations.
                    </p>
                  </div>
                </div>

                {/* Donor Search Filter */}
                <div className="w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search donors by name, city, group..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Donor Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">Donor Name</th>
                      <th className="px-5 py-3 text-left font-semibold">Blood Group</th>
                      <th className="px-5 py-3 text-left font-semibold">City</th>
                      <th className="px-5 py-3 text-left font-semibold">Phone Number</th>
                      <th className="px-5 py-3 text-left font-semibold">Email</th>
                      <th className="px-5 py-3 text-left font-semibold">Availability</th>
                      <th className="px-5 py-3 text-left font-semibold">Donations</th>
                      <th className="px-5 py-3 text-left font-semibold">Registered</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDonors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                          {donorSearch ? "No donors matched your search." : "No blood donors registered yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredDonors.map((donor, index) => (
                        <tr
                          key={donor._id || index}
                          className="hover:bg-red-50/40 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                            {donor.fullName || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 px-2.5 py-0.5 rounded-lg text-xs">
                              {donor.bloodGroup || "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                            📍 {donor.city || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
                            📞 {donor.phone || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                            {donor.email || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getAvailabilityStyle(
                                donor.availability
                              )}`}
                            >
                              {donor.availability || "Available"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs">
                              🏆 {donor.totalDonations ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                            {formatDate(donor.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                Displaying {filteredDonors.length} of {allDonors.length} registered blood donor(s).
              </div>
            </div>
          )}

          {/* ================= PATIENT SIDE LIST ================= */}
          {(activeUserTab === "all" || activeUserTab === "patients") && (
            <div className="rounded-2xl border border-blue-100 dark:border-blue-950/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {/* Patient Section Header */}
              <div className="p-5 border-b border-blue-50 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-xl text-blue-600 dark:text-blue-400 font-bold shadow-sm">
                    🏥
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Patients Directory
                      </h3>
                      <span className="rounded-full bg-blue-600 text-white text-xs font-extrabold px-2.5 py-0.5">
                        {allPatients.length} Patients
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Registered patient seekers with contact information, cities and blood request activity.
                    </p>
                  </div>
                </div>

                {/* Patient Search Filter */}
                <div className="w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search patients by name, city, group..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Patient Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">Patient Name</th>
                      <th className="px-5 py-3 text-left font-semibold">Blood Group</th>
                      <th className="px-5 py-3 text-left font-semibold">City</th>
                      <th className="px-5 py-3 text-left font-semibold">Phone Number</th>
                      <th className="px-5 py-3 text-left font-semibold">Email</th>
                      <th className="px-5 py-3 text-left font-semibold">Blood Requests Created</th>
                      <th className="px-5 py-3 text-left font-semibold">Registered</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                          {patientSearch ? "No patients matched your search." : "No patients registered yet."}
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient, index) => {
                        const requestCount = getPatientRequestCount(patient);
                        return (
                          <tr
                            key={patient._id || index}
                            className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition"
                          >
                            <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                              {patient.fullName || "—"}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 px-2.5 py-0.5 rounded-lg text-xs">
                                {patient.bloodGroup || "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                              📍 {patient.city || "—"}
                            </td>
                            <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
                              📞 {patient.phone || "—"}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                              {patient.email || "—"}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 px-2.5 py-1 rounded-lg text-xs">
                                📋 {requestCount} Request{requestCount !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                              {formatDate(patient.createdAt)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 text-xs text-slate-500 dark:text-slate-400">
                Displaying {filteredPatients.length} of {allPatients.length} registered patient(s).
              </div>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;
