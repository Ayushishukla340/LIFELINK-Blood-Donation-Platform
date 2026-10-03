import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    bloodGroup: "",
    city: "",
  });

  // ===============================
  // FETCH PROFILE
  // ===============================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

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

        const profileUser = response.data.user;

        setUser(profileUser);

        setProfileForm({
          fullName: profileUser.fullName || "",
          phone: profileUser.phone || "",
          bloodGroup: profileUser.bloodGroup || "",
          city: profileUser.city || "",
        });
      } catch (error) {
        console.log("❌ Profile Error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", { replace: true });
          return;
        }

        setMessage(
          error.response?.data?.message ||
            "Unable to load profile"
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===============================
  // PROFILE FORM CHANGE
  // ===============================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // OPEN EDIT PROFILE
  // ===============================

  const handleEditProfile = () => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      bloodGroup: user.bloodGroup || "",
      city: user.city || "",
    });

    setMessage("");
    setEditingProfile(true);
  };

  // ===============================
  // CANCEL EDIT PROFILE
  // ===============================

  const handleCancelEdit = () => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      bloodGroup: user.bloodGroup || "",
      city: user.city || "",
    });

    setMessage("");
    setEditingProfile(false);
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (
      !profileForm.fullName.trim() ||
      !profileForm.phone.trim() ||
      !profileForm.bloodGroup ||
      !profileForm.city.trim()
    ) {
      setMessage("Please fill all profile fields");
      setMessageType("error");
      return;
    }

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/api/profile",
        {
          fullName: profileForm.fullName.trim(),
          phone: profileForm.phone.trim(),
          bloodGroup: profileForm.bloodGroup,
          city: profileForm.city.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);

      setProfileForm({
        fullName: response.data.user.fullName || "",
        phone: response.data.user.phone || "",
        bloodGroup: response.data.user.bloodGroup || "",
        city: response.data.user.city || "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setEditingProfile(false);
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.log("❌ Profile Update Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile"
      );
      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  // ===============================
  // UPDATE AVAILABILITY
  // ===============================

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

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
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

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-lg font-semibold text-gray-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formattedLastDonationDate = user.lastDonationDate
    ? new Date(user.lastDonationDate).toLocaleDateString("en-IN")
    : "No donation recorded yet";

  const availabilityColor =
    user.availability === "Available"
      ? "bg-green-100 text-green-700"
      : user.availability === "Temporarily Unavailable"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">

        {/* ===============================
            HEADER
        =============================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">
                LifeLink Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
                Welcome, {user.fullName} ❤️
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your profile and track your LifeLink activity.
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-bold ${availabilityColor}`}
            >
              {user.role === "Blood Donor"
                ? `● ${user.availability || "Available"}`
                : "● Active Account"}
            </div>

          </div>
        </div>

        {/* ===============================
            DONOR STATS
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {/* TOTAL DONATIONS */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">

              <p className="text-gray-500 text-sm font-semibold">
                Total Donations
              </p>

              <p className="text-4xl font-bold text-red-600 mt-2">
                {user.totalDonations || 0}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Successful donations
              </p>

            </div>

            {/* POINTS */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500">

              <p className="text-gray-500 text-sm font-semibold">
                LifeLink Points
              </p>

              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {user.points || 0}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Contribution points
              </p>

            </div>

            {/* BLOOD GROUP */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500">

              <p className="text-gray-500 text-sm font-semibold">
                Blood Group
              </p>

              <p className="text-4xl font-bold text-red-600 mt-2">
                {user.bloodGroup}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Registered blood group
              </p>

            </div>

          </div>
        )}

        {/* ===============================
            PROFILE + ACTIVITY
        =============================== */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ===============================
              PROFILE INFORMATION
          =============================== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Profile Information
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Your registered LifeLink account details
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold">
                  {user.role}
                </div>

                {!editingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Edit Profile
                  </button>
                )}

              </div>

            </div>

            {/* ===============================
                EDIT PROFILE FORM
            =============================== */}

            {editingProfile ? (

              <form onSubmit={handleProfileSubmit}>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* FULL NAME */}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
                    />
                  </div>

                  {/* EMAIL - NOT EDITABLE */}

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Email
                    </label>

                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 p-3 rounded-lg cursor-not-allowed"
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Email cannot be changed here.
                    </p>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
                    />
                  </div>

                  {/* BLOOD GROUP */}

                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Blood Group
                    </label>

                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={profileForm.bloodGroup}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* CITY */}

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
                    />
                  </div>

                  {/* ROLE - NOT EDITABLE */}

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Account Role
                    </label>

                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 p-3 rounded-lg cursor-not-allowed"
                    />

                    <p className="text-xs text-gray-400 mt-1">
                      Account role cannot be changed.
                    </p>
                  </div>

                </div>

                {/* FORM BUTTONS */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:bg-red-300"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              /* ===============================
                 PROFILE DISPLAY
              =============================== */

              <div className="grid md:grid-cols-2 gap-5">

                {/* FULL NAME */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {user.fullName}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold text-gray-800 mt-1 break-all">
                    {user.email}
                  </p>
                </div>

                {/* PHONE */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {user.phone}
                  </p>
                </div>

                {/* BLOOD GROUP */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Blood Group
                  </p>

                  <p className="font-bold text-red-600 text-lg mt-1">
                    {user.bloodGroup}
                  </p>
                </div>

                {/* CITY */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    City
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {user.city}
                  </p>
                </div>

                {/* ROLE */}

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Account Role
                  </p>

                  <p className="font-semibold text-red-600 mt-1">
                    {user.role}
                  </p>
                </div>

              </div>

            )}

          </div>

          {/* ===============================
              ACTIVITY CARD
          =============================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-gray-800">
              Activity
            </h2>

            <p className="text-gray-500 text-sm mt-1 mb-6">
              Recent account information
            </p>

            {user.role === "Blood Donor" ? (
              <>

                <div className="border-b pb-5 mb-5">

                  <p className="text-sm text-gray-500">
                    Last Donation
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {formattedLastDonationDate}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Current Availability
                  </p>

                  <p
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${availabilityColor}`}
                  >
                    {user.availability || "Available"}
                  </p>

                </div>

              </>
            ) : (
              <div>

                <p className="text-sm text-gray-500">
                  Account Status
                </p>

                <p className="text-green-600 font-semibold mt-1">
                  Active
                </p>

                <p className="text-gray-500 text-sm mt-5">
                  You can use LifeLink to find donors and manage your blood requests.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ===============================
            DONOR AVAILABILITY
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Donation Availability
                </h2>

                <p className="text-gray-500 mt-2">
                  Update your current availability so patients can find you through the donor search.
                </p>

              </div>

              <div>

                <label
                  htmlFor="availability"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Current Availability
                </label>

                <select
                  id="availability"
                  value={user.availability || "Available"}
                  onChange={handleAvailabilityChange}
                  disabled={updating}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
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

            </div>

          </div>
        )}

        {/* ===============================
            MESSAGE
        =============================== */}

        {message && (
          <div
            className={`mt-8 p-4 rounded-xl text-center font-semibold ${
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
  );
}

export default Dashboard;