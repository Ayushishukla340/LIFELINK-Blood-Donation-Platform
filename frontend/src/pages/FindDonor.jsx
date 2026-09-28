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
        error.response?.data?.message ||
          "Unable to find donors"
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
      <div className="max-w-5xl mx-auto px-6">

        {/* ===============================
            PAGE HEADER
        =============================== */}

        <h1 className="text-4xl font-bold text-red-600 text-center mb-3">
          Find Blood Donor
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Search available donors near your location.
        </p>

        {/* ===============================
            SEARCH BOX
        =============================== */}

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">

          <div className="grid md:grid-cols-3 gap-5">

            <select
              value={bloodGroup}
              onChange={(e) =>
                setBloodGroup(e.target.value)
              }
              className="border border-gray-300 p-3 rounded-lg"
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
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="Enter City"
              className="border border-gray-300 p-3 rounded-lg"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading
                ? "Searching..."
                : "Search Donor"}
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
            DONOR CARDS
        =============================== */}

        <div className="grid md:grid-cols-3 gap-6">

          {donors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >

              <h2 className="text-xl font-bold">
                {donor.fullName}
              </h2>

              <p className="mt-3">
                Blood Group:{" "}
                <span className="text-red-600 font-bold">
                  {donor.bloodGroup}
                </span>
              </p>

              <p>
                Location: {donor.city}
              </p>

              <p className="mt-2 text-green-600 font-semibold">
                ● Available
              </p>

              <button
                onClick={() =>
                  handleBloodRequest(donor)
                }
                className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Send Blood Request
              </button>

            </div>
          ))}

        </div>

        {/* ===============================
            REQUEST FORM
        =============================== */}

        {selectedDonor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Send Blood Request
              </h2>

              <p className="text-gray-600 mb-6">
                Requesting blood from{" "}
                <span className="font-bold">
                  {selectedDonor.fullName}
                </span>
              </p>

              <form
                onSubmit={submitBloodRequest}
                className="space-y-4"
              >

                {/* Blood Group */}

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

                {/* Hospital */}

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

                {/* Contact */}

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

                {/* City */}

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

                {/* Urgency */}

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

                {/* Buttons */}

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