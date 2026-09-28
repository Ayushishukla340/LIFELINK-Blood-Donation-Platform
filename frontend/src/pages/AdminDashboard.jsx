import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalPatients: 0,
    totalRequests: 0,
    pendingRequests: 0,
    fulfilledRequests: 0,
    cancelledRequests: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [usersResponse, requestsResponse] =
          await Promise.all([
            api.get("/api/users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            api.get("/api/blood-requests"),
          ]);

        const usersData = usersResponse.data.users || [];
        const requests =
          requestsResponse.data.requests || [];

        setUsers(usersData);

        setStats({
          totalUsers: usersData.length,

          totalDonors: usersData.filter(
            (user) => user.role === "Blood Donor"
          ).length,

          totalPatients: usersData.filter(
            (user) => user.role === "Patient"
          ).length,

          totalRequests: requests.length,

          pendingRequests: requests.filter(
            (request) => request.status === "Pending"
          ).length,

          fulfilledRequests: requests.filter(
            (request) => request.status === "Fulfilled"
          ).length,

          cancelledRequests: requests.filter(
            (request) => request.status === "Cancelled"
          ).length,
        });

        // Latest 5 requests
        setRecentRequests(requests.slice(0, 5));
      } catch (error) {
        console.log("❌ Admin Dashboard Error:", error);

        setMessage(
          error.response?.data?.message ||
            "Unable to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Fulfilled") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const getUrgencyStyle = (urgency) => {
    if (urgency === "Emergency") {
      return "bg-red-100 text-red-700";
    }

    if (urgency === "Urgent") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const getRoleStyle = (role) => {
    if (role === "Admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "Blood Donor") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const getAvailabilityStyle = (availability) => {
    if (availability === "Available") {
      return "bg-green-100 text-green-700";
    }

    if (availability === "Temporarily Unavailable") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-200 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-red-600">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Monitor LifeLink users and blood requests.
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {message && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 font-semibold">
            {message}
          </div>
        )}

        {/* USER STATISTICS */}
        <h2 className="text-2xl font-bold mb-5">
          User Statistics
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Total Users
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Blood Donors
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.totalDonors}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Patients
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.totalPatients}
            </p>
          </div>

        </div>

        {/* BLOOD REQUEST STATISTICS */}
        <h2 className="text-2xl font-bold mb-5">
          Blood Request Statistics
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Total Requests
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.totalRequests}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Pending
            </p>

            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {stats.pendingRequests}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Fulfilled
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.fulfilledRequests}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">
              Cancelled
            </p>

            <p className="text-4xl font-bold text-gray-600 mt-2">
              {stats.cancelledRequests}
            </p>
          </div>

        </div>

        {/* RECENT BLOOD REQUESTS */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold">
            Recent Blood Requests
          </h2>

          <p className="text-gray-500 mt-1">
            Latest blood requests submitted on LifeLink.
          </p>
        </div>

        {recentRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center mb-12">
            <p className="text-gray-500">
              No blood requests available.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold">
                      Patient
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Blood Group
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Hospital
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      City
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Urgency
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {request.patientName}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                          {request.bloodGroup}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {request.hospitalName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {request.city}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyStyle(
                            request.urgency
                          )}`}
                        >
                          {request.urgency}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        )}

        {/* USER MANAGEMENT */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold">
            User Management
          </h2>

          <p className="text-gray-500 mt-1">
            View registered LifeLink users and their details.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-500">
              No registered users found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Blood Group
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      City
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 font-semibold">
                      Availability
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">
                        {user.fullName}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                          {user.bloodGroup}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.city}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getAvailabilityStyle(
                            user.availability
                          )}`}
                        >
                          {user.availability || "Available"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;