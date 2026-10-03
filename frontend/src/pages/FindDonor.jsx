import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function FindDonor() {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDonor, setSelectedDonor] = useState(null);

  const [requestData, setRequestData] = useState({
    hospitalName: "",
    contactNumber: "",
    patientCity: "",
    urgency: "",
  });

  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ===============================
  // SEARCH DONORS
  // ===============================

  const handleSearch = async () => {
    setLoading(true);
    setMessage("");
    setDonors([]);

    try {
      const response = await api.get("/api/donors", {
        params: {
          bloodGroup,
          city,
        },
      });

      if (response.data.donors.length === 0) {
        setMessage("No donors found for your search.");
      } else {
        setDonors(response.data.donors);
      }
    } catch (error) {
      console.log("❌ Donor Search Error:", error);

      setMessage(
        error.response?.data?.message || "Unable to find donors"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // OPEN REQUEST FORM
  // ===============================

  const handleBloodRequest = (donor) => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      alert("Please login as a patient to send a blood request.");
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "Patient") {
      alert("Only patients can send blood requests.");
      return;
    }

    setSelectedDonor(donor);
    setMessage("");
  };

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleRequestChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // SEND REQUEST
  // ===============================

  const submitBloodRequest = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setRequestLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/api/blood-requests",
        {
          donorId: selectedDonor._id,

          bloodGroup: selectedDonor.bloodGroup,

          hospitalName: requestData.hospitalName,

          contactNumber: requestData.contactNumber,

          city: requestData.patientCity,

          urgency: requestData.urgency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setSelectedDonor(null);

      setRequestData({
        hospitalName: "",
        contactNumber: "",
        patientCity: "",
        urgency: "",
      });
    } catch (error) {
      console.log("❌ Blood Request Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to send blood request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* ===============================
            PAGE HEADER
        =============================== */}

        <h1 className="text-4xl font-bold text-red-600 text-center mb-3">
          Find Blood Donor
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Find available blood donors based on blood group and location.
        </p>

        {/* ===============================
            SEARCH BOX
        =============================== */}

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">

          <div className="grid md:grid-cols-3 gap-5">

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">
                Select Blood Group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter City"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading ? "Finding Matches..." : "Find Best Donors"}
            </button>

          </div>
        </div>

        {/* ===============================
            MESSAGE
        =============================== */}

        {message && (
          <div className="bg-blue-100 text-blue-700 p-4 rounded-lg text-center font-semibold mb-6">
            {message}
          </div>
        )}

        {/* ===============================
            MATCH RESULT HEADER
        =============================== */}

        {donors.length > 0 && (
          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Recommended Donors
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Donors are arranged according to matching factors.
              </p>
            </div>

            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold">
              {donors.length} Donor{donors.length > 1 ? "s" : ""} Found
            </div>

          </div>
        )}

        {/* ===============================
            DONOR CARDS
        =============================== */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {donors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >

              {/* ===============================
                  MATCH SCORE
              =============================== */}

              <div className="bg-red-50 px-5 py-4 flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Smart Match
                  </p>

                  <p className="text-2xl font-bold text-red-600">
                    {donor.matchScore ?? 0}%
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    ● Available
                  </span>
                </div>

              </div>

              <div className="p-6">

                {/* DONOR NAME */}

                <h2 className="text-xl font-bold text-gray-800">
                  {donor.fullName}
                </h2>

                {/* BLOOD GROUP */}

                <p className="mt-4 text-gray-700">
                  Blood Group:{" "}
                  <span className="text-red-600 font-bold text-lg">
                    {donor.bloodGroup}
                  </span>
                </p>

                {/* LOCATION */}

                <p className="mt-2 text-gray-700">
                  📍 Location:{" "}
                  <span className="font-semibold">
                    {donor.city}
                  </span>
                </p>

                {/* DONATION STATS */}

                <div className="grid grid-cols-2 gap-3 mt-4">

                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">
                      Donations
                    </p>

                    <p className="font-bold text-gray-800">
                      {donor.totalDonations ?? 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">
                      Points
                    </p>

                    <p className="font-bold text-gray-800">
                      {donor.points ?? 0}
                    </p>
                  </div>

                </div>

                {/* MATCH REASONS */}

                {donor.matchReasons &&
                  donor.matchReasons.length > 0 && (
                    <div className="mt-5">

                      <p className="text-sm font-bold text-gray-700 mb-2">
                        Why this donor matches:
                      </p>

                      <div className="space-y-1">

                        {donor.matchReasons.map(
                          (reason, index) => (
                            <p
                              key={index}
                              className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg"
                            >
                              ✓ {reason}
                            </p>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* REQUEST BUTTON */}

                <button
                  onClick={() => handleBloodRequest(donor)}
                  className="mt-5 w-full bg-red-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Send Blood Request
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* ===============================
            REQUEST FORM MODAL
        =============================== */}

        {selectedDonor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">

              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Send Blood Request
              </h2>

              <p className="text-gray-600 mb-4">
                Requesting blood from{" "}
                <span className="font-bold">
                  {selectedDonor.fullName}
                </span>
              </p>

              {/* MATCH INFORMATION */}

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">

                <div className="flex justify-between items-center">

                  <div>
                    <p className="text-xs text-gray-500">
                      Smart Match Score
                    </p>

                    <p className="text-xl font-bold text-red-600">
                      {selectedDonor.matchScore ?? 0}%
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Blood Group
                    </p>

                    <p className="font-bold text-red-600">
                      {selectedDonor.bloodGroup}
                    </p>
                  </div>

                </div>

              </div>

              <form
                onSubmit={submitBloodRequest}
                className="space-y-4"
              >

                {/* BLOOD GROUP */}

                <div>
                  <label className="block font-semibold mb-1">
                    Blood Group
                  </label>

                  <input
                    type="text"
                    value={selectedDonor.bloodGroup}
                    disabled
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100"
                  />
                </div>

                {/* HOSPITAL */}

                <div>
                  <label className="block font-semibold mb-1">
                    Hospital Name
                  </label>

                  <input
                    type="text"
                    name="hospitalName"
                    value={requestData.hospitalName}
                    onChange={handleRequestChange}
                    placeholder="Enter hospital name"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>

                {/* CONTACT */}

                <div>
                  <label className="block font-semibold mb-1">
                    Contact Number
                  </label>

                  <input
                    type="tel"
                    name="contactNumber"
                    value={requestData.contactNumber}
                    onChange={handleRequestChange}
                    placeholder="Enter contact number"
                    maxLength="10"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="block font-semibold mb-1">
                    City / Location
                  </label>

                  <input
                    type="text"
                    name="patientCity"
                    value={requestData.patientCity}
                    onChange={handleRequestChange}
                    placeholder="Enter your city"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>

                {/* URGENCY */}

                <div>
                  <label className="block font-semibold mb-1">
                    Urgency Level
                  </label>

                  <select
                    name="urgency"
                    value={requestData.urgency}
                    onChange={handleRequestChange}
                    className="w-full border border-gray-300 p-3 rounded-lg"
                    required
                  >
                    <option value="">
                      Select Urgency
                    </option>

                    <option value="Normal">
                      Normal
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>

                    <option value="Emergency">
                      Emergency
                    </option>
                  </select>
                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 pt-3">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDonor(null);

                      setRequestData({
                        hospitalName: "",
                        contactNumber: "",
                        patientCity: "",
                        urgency: "",
                      });
                    }}
                    className="w-1/2 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="w-1/2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {requestLoading
                      ? "Sending..."
                      : "Send Request"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default FindDonor;