// import { useCallback, useEffect, useState } from "react";
// import api from "../services/api";

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [recentRequests, setRecentRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");

//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalDonors: 0,
//     totalPatients: 0,
//     totalRequests: 0,
//     pendingRequests: 0,
//     fulfilledRequests: 0,
//     cancelledRequests: 0,
//   });

//   const fetchAdminData = useCallback(async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setMessage("Please log in again to access the Admin Dashboard.");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const [usersResponse, requestsResponse] = await Promise.all([
//         api.get("/api/users", config),
//         api.get("/api/blood-requests", config),
//       ]);

//       const usersData = Array.isArray(usersResponse.data.users)
//         ? usersResponse.data.users
//         : [];

//       const requestsData = Array.isArray(requestsResponse.data.requests)
//         ? requestsResponse.data.requests
//         : [];

//       setUsers(usersData);
//       setRecentRequests(requestsData.slice(0, 5));

//       setStats({
//         totalUsers: usersData.length,

//         totalDonors: usersData.filter(
//           (user) => user.role === "Blood Donor"
//         ).length,

//         totalPatients: usersData.filter(
//           (user) => user.role === "Patient"
//         ).length,

//         totalRequests: requestsData.length,

//         pendingRequests: requestsData.filter(
//           (request) => request.status === "Pending"
//         ).length,

//         fulfilledRequests: requestsData.filter(
//           (request) => request.status === "Fulfilled"
//         ).length,

//         cancelledRequests: requestsData.filter(
//           (request) => request.status === "Cancelled"
//         ).length,
//       });
//     } catch (error) {
//       console.error("Admin Dashboard Error:", error);

//       setMessage(
//         error.response?.data?.message ||
//           "Unable to load dashboard. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAdminData();
//   }, [fetchAdminData]);

//   const getRoleStyle = (role) => {
//     if (role === "Admin") {
//       return "bg-purple-100 text-purple-700";
//     }

//     if (role === "Blood Donor") {
//       return "bg-red-100 text-red-700";
//     }

//     return "bg-blue-100 text-blue-700";
//   };

//   const getAvailabilityStyle = (availability) => {
//     if (availability === "Available") {
//       return "bg-green-100 text-green-700";
//     }

//     if (availability === "Temporarily Unavailable") {
//       return "bg-yellow-100 text-yellow-700";
//     }

//     return "bg-gray-100 text-gray-700";
//   };

//   const getStatusStyle = (status) => {
//     const styles = {
//       Pending: "bg-yellow-100 text-yellow-700",
//       Accepted: "bg-blue-100 text-blue-700",
//       Rejected: "bg-red-100 text-red-700",
//       Fulfilled: "bg-green-100 text-green-700",
//       Cancelled: "bg-gray-200 text-gray-700",
//     };

//     return styles[status] || "bg-gray-100 text-gray-700";
//   };

//   const formatDate = (date) => {
//     if (!date) return "—";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) return "—";

//     return parsedDate.toLocaleDateString("en-IN");
//   };

//   const statCards = [
//     { label: "Total Users", value: stats.totalUsers },
//     { label: "Blood Donors", value: stats.totalDonors },
//     { label: "Patients", value: stats.totalPatients },
//     { label: "Total Requests", value: stats.totalRequests },
//     { label: "Pending", value: stats.pendingRequests },
//     { label: "Fulfilled", value: stats.fulfilledRequests },
//     { label: "Cancelled", value: stats.cancelledRequests },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <p className="text-gray-600 font-semibold">
//           Loading Admin Dashboard...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
//               LifeLink Administration
//             </p>

//             <h1 className="mt-2 text-3xl font-bold text-gray-900">
//               Admin Dashboard
//             </h1>

//             <p className="mt-2 text-gray-500">
//               Monitor registered users and blood request activity.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={fetchAdminData}
//             className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
//           >
//             Refresh Dashboard
//           </button>
//         </header>

//         {/* Message */}
//         {message && (
//           <div
//             role="alert"
//             className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
//           >
//             {message}
//           </div>
//         )}

//         {/* Platform Overview */}
//         <section className="mb-10">
//           <h2 className="mb-5 text-xl font-bold text-gray-900">
//             Platform Overview
//           </h2>

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {statCards.map((card) => (
//               <div
//                 key={card.label}
//                 className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
//               >
//                 <p className="text-sm text-gray-500">{card.label}</p>

//                 <p className="mt-3 text-3xl font-bold text-gray-900">
//                   {card.value}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Recent Blood Requests */}
//         <section className="mb-10">
//           <div className="mb-5">
//             <h2 className="text-xl font-bold text-gray-900">
//               Recent Blood Requests
//             </h2>

//             <p className="mt-1 text-gray-500">
//               Latest blood request activity.
//             </p>
//           </div>

//           <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr>
//                     <th className="px-5 py-4 text-left">Patient</th>
//                     <th className="px-5 py-4 text-left">Blood Group</th>
//                     <th className="px-5 py-4 text-left">City</th>
//                     <th className="px-5 py-4 text-left">Units</th>
//                     <th className="px-5 py-4 text-left">Status</th>
//                     <th className="px-5 py-4 text-left">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {recentRequests.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-5 py-8 text-center text-gray-500"
//                       >
//                         No blood requests found.
//                       </td>
//                     </tr>
//                   ) : (
//                     recentRequests.map((request, index) => (
//                       <tr
//                         key={request._id || index}
//                         className="border-t border-gray-100 hover:bg-gray-50"
//                       >
//                         <td className="px-5 py-4 font-medium text-gray-900">
//                           {request.patientName || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           {request.bloodGroup || "—"}
//                         </td>

//                         <td className="px-5 py-4 text-gray-600">
//                           {request.city || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           {request.units ?? "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
//                               request.status
//                             )}`}
//                           >
//                             {request.status || "Unknown"}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4 text-gray-600">
//                           {formatDate(request.createdAt || request.date)}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </section>

//         {/* User Management */}
//         <section>
//           <div className="mb-5">
//             <h2 className="text-xl font-bold text-gray-900">
//               User Management
//             </h2>

//             <p className="mt-1 text-gray-500">
//               Registered accounts, roles, contact details, donor availability
//               and donation totals.
//             </p>
//           </div>

//           <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr>
//                     <th className="px-5 py-4 text-left">Name</th>
//                     <th className="px-5 py-4 text-left">Email</th>
//                     <th className="px-5 py-4 text-left">Phone</th>
//                     <th className="px-5 py-4 text-left">Blood Group</th>
//                     <th className="px-5 py-4 text-left">City</th>
//                     <th className="px-5 py-4 text-left">Role</th>
//                     <th className="px-5 py-4 text-left">Availability</th>
//                     <th className="px-5 py-4 text-left">Total Donations</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {users.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={8}
//                         className="px-5 py-8 text-center text-gray-500"
//                       >
//                         No registered users found.
//                       </td>
//                     </tr>
//                   ) : (
//                     users.map((user, index) => (
//                       <tr
//                         key={user._id || index}
//                         className="border-t border-gray-100 hover:bg-gray-50"
//                       >
//                         <td className="px-5 py-4 font-medium text-gray-900">
//                           {user.fullName || "—"}
//                         </td>

//                         <td className="px-5 py-4 text-gray-600">
//                           {user.email || "—"}
//                         </td>

//                         <td className="px-5 py-4 text-gray-600">
//                           {user.phone || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           {user.bloodGroup || "—"}
//                         </td>

//                         <td className="px-5 py-4 text-gray-600">
//                           {user.city || "—"}
//                         </td>

//                         <td className="px-5 py-4">
//                           <span
//                             className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
//                               user.role
//                             )}`}
//                           >
//                             {user.role || "Unknown"}
//                           </span>
//                         </td>

//                         <td className="px-5 py-4">
//                           {user.role === "Blood Donor" ? (
//                             <span
//                               className={`rounded-full px-3 py-1 text-xs font-semibold ${getAvailabilityStyle(
//                                 user.availability
//                               )}`}
//                             >
//                               {user.availability || "Available"}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">
//                               Not applicable
//                             </span>
//                           )}
//                         </td>

//                         <td className="px-5 py-4 font-semibold text-gray-700">
//                           {user.role === "Blood Donor"
//                             ? (user.totalDonations ?? 0)
//                             : "—"}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-sm text-gray-500">
//               Showing {users.length} registered account(s).
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// export default AdminDashboard;




import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalPatients: 0,
    totalRequests: 0,
    pendingRequests: 0,
    fulfilledRequests: 0,
    cancelledRequests: 0,
  });

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please log in again to access the Admin Dashboard.");
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
      setRecentRequests(requestsData.slice(0, 5));

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
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const updateRequestStatus = async (request) => {
    const requestId = request._id;
    const status = selectedStatuses[requestId];

    if (!requestId || !status || status === request.status) {
      setMessage("Please select a different status first.");
      return;
    }

    if (request.status === "Fulfilled") {
      setMessage("A fulfilled request cannot be changed to another status.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in again.");
      return;
    }

    setUpdatingId(requestId);
    setMessage("");

    try {
      await api.put(
        `/api/blood-requests/${requestId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Request status updated successfully.");
      await fetchAdminData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update request status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const getRoleStyle = (role) => {
    if (role === "Admin") return "bg-purple-100 text-purple-700";
    if (role === "Blood Donor") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const getAvailabilityStyle = (availability) => {
    if (availability === "Available") return "bg-green-100 text-green-700";
    if (availability === "Temporarily Unavailable")
      return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700",
      Accepted: "bg-blue-100 text-blue-700",
      Rejected: "bg-red-100 text-red-700",
      Fulfilled: "bg-green-100 text-green-700",
      Cancelled: "bg-gray-200 text-gray-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";
    return parsedDate.toLocaleDateString("en-IN");
  };

  const statCards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Blood Donors", value: stats.totalDonors },
    { label: "Patients", value: stats.totalPatients },
    { label: "Total Requests", value: stats.totalRequests },
    { label: "Pending", value: stats.pendingRequests },
    { label: "Fulfilled", value: stats.fulfilledRequests },
    { label: "Cancelled", value: stats.cancelledRequests },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-semibold text-gray-600">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              LifeLink Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-500">
              Monitor registered users and blood request activity.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            Refresh Dashboard
          </button>
        </header>

        {message && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {message}
          </div>
        )}

        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Blood Requests
            </h2>
            <p className="mt-1 text-gray-500">
              Update the status of recent blood requests.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-5 py-4 text-left">Patient</th>
                    <th className="px-5 py-4 text-left">Blood Group</th>
                    <th className="px-5 py-4 text-left">City</th>
                    <th className="px-5 py-4 text-left">Units</th>
                    <th className="px-5 py-4 text-left">Status</th>
                    <th className="px-5 py-4 text-left">Date</th>
                    <th className="px-5 py-4 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                        No blood requests found.
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((request, index) => (
                      <tr
                        key={request._id || index}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {request.patientName || "—"}
                        </td>
                        <td className="px-5 py-4">{request.bloodGroup || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">
                          {request.city || "—"}
                        </td>
                        <td className="px-5 py-4">{request.units ?? "—"}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {formatDate(request.createdAt || request.date)}
                        </td>
                        <td className="px-5 py-4">
                          {request.status === "Fulfilled" ? (
                            <span className="text-xs font-medium text-green-700">
                              Completed
                            </span>
                          ) : (
                            <div className="flex min-w-48 flex-col gap-2">
                              <select
                                aria-label={`Status for ${request.patientName || "request"}`}
                                value={
                                  selectedStatuses[request._id] ||
                                  request.status ||
                                  "Pending"
                                }
                                onChange={(event) =>
                                  setSelectedStatuses((previous) => ({
                                    ...previous,
                                    [request._id]: event.target.value,
                                  }))
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2"
                              >
                                {["Pending", "Accepted", "Rejected", "Fulfilled", "Cancelled"].map(
                                  (status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  )
                                )}
                              </select>
                              <button
                                type="button"
                                disabled={
                                  updatingId === request._id ||
                                  !selectedStatuses[request._id] ||
                                  selectedStatuses[request._id] === request.status
                                }
                                onClick={() => updateRequestStatus(request)}
                                className="rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                              >
                                {updatingId === request._id ? "Updating..." : "Update Status"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-sm text-gray-500">
              Showing {recentRequests.length} of {stats.totalRequests} request(s).
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="mt-1 text-gray-500">
              Registered accounts, roles, contact details, donor availability
              and donation totals.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-5 py-4 text-left">Name</th>
                    <th className="px-5 py-4 text-left">Email</th>
                    <th className="px-5 py-4 text-left">Phone</th>
                    <th className="px-5 py-4 text-left">Blood Group</th>
                    <th className="px-5 py-4 text-left">City</th>
                    <th className="px-5 py-4 text-left">Role</th>
                    <th className="px-5 py-4 text-left">Availability</th>
                    <th className="px-5 py-4 text-left">Total Donations</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <tr
                        key={user._id || index}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {user.fullName || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-600">{user.email || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">{user.phone || "—"}</td>
                        <td className="px-5 py-4">{user.bloodGroup || "—"}</td>
                        <td className="px-5 py-4 text-gray-600">{user.city || "—"}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleStyle(
                              user.role
                            )}`}
                          >
                            {user.role || "Unknown"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {user.role === "Blood Donor" ? (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getAvailabilityStyle(
                                user.availability
                              )}`}
                            >
                              {user.availability || "Available"}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not applicable</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-700">
                          {user.role === "Blood Donor"
                            ? user.totalDonations ?? 0
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-sm text-gray-500">
              Showing {users.length} registered account(s).
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
