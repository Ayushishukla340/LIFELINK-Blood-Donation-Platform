import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // No token = user is not logged in
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.log("❌ Profile Error:", error);

        // Invalid/expired token
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setMessage(
          error.response?.data?.message || "Unable to load profile"
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvailabilityChange = async (e) => {
    const newAvailability = e.target.value;

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/api/profile/availability",
        {
          availability: newAvailability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.log("❌ Availability Update Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update availability"
      );
      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formattedLastDonationDate = user.lastDonationDate
    ? new Date(user.lastDonationDate).toLocaleDateString("en-IN")
    : "No donation recorded yet";

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        
        {/* HEADER */}
        <h1 className="text-4xl font-bold text-red-600 mb-2">
          Welcome to LifeLink ❤️
        </h1>

        <p className="text-gray-600 mb-8">
          Your personal dashboard
        </p>

        {/* PROFILE DETAILS */}
        <div className="space-y-4">

          <div className="border-b pb-3">
            <p className="text-gray-500">Full Name</p>
            <p className="text-lg font-semibold">
              {user.fullName}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500">Email</p>
            <p className="text-lg font-semibold">
              {user.email}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500">Phone</p>
            <p className="text-lg font-semibold">
              {user.phone}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500">Blood Group</p>
            <p className="text-lg font-semibold text-red-600">
              {user.bloodGroup}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500">City</p>
            <p className="text-lg font-semibold">
              {user.city}
            </p>
          </div>

          <div className="border-b pb-3">
            <p className="text-gray-500">Role</p>
            <p className="text-lg font-semibold text-red-600">
              {user.role}
            </p>
          </div>

          {/* DONATION STATS */}
          {user.role === "Blood Donor" && (
            <>
              <div className="border-b pb-3">
                <p className="text-gray-500">
                  Total Donations
                </p>

                <p className="text-2xl font-bold text-red-600">
                  {user.totalDonations || 0}
                </p>
              </div>

              <div className="border-b pb-3">
                <p className="text-gray-500">
                  Last Donation Date
                </p>

                <p className="text-lg font-semibold">
                  {formattedLastDonationDate}
                </p>
              </div>
            </>
          )}

          {/* AVAILABILITY */}
          {user.role === "Blood Donor" && (
            <div className="pt-2">
              <label
                htmlFor="availability"
                className="block text-gray-500 mb-2"
              >
                Donation Availability
              </label>

              <select
                id="availability"
                value={user.availability || "Available"}
                onChange={handleAvailabilityChange}
                disabled={updating}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              >
                <option value="Available">
                  Available
                </option>

                <option value="Temporarily Unavailable">
                  Temporarily Unavailable
                </option>

                <option value="Not Available">
                  Not Available
                </option>
              </select>

              {updating && (
                <p className="text-gray-500 text-sm mt-2">
                  Updating availability...
                </p>
              )}
            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <div
              className={`p-3 rounded-lg text-center font-semibold ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;