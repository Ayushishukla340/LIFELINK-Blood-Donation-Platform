import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function RequestBlood() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    hospitalName: "",
    contactNumber: "",
    city: "",
    urgency: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first to submit a blood request.");
      setMessageType("error");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/api/blood-requests",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setMessageType("success");

      setFormData({
        bloodGroup: "",
        hospitalName: "",
        contactNumber: "",
        city: "",
        urgency: "",
      });
    } catch (error) {
      console.log("❌ Blood Request Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setMessage("Your session has expired. Please login again.");
        setMessageType("error");

        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to submit blood request"
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold text-red-600 text-center mb-3">
          Request Blood
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Need blood urgently? Submit your request and connect with donors.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Blood Group */}
          <div>
            <label className="block mb-2 font-semibold">
              Blood Group Required
            </label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
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

          {/* Hospital */}
          <div>
            <label className="block mb-2 font-semibold">
              Hospital Name
            </label>

            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              placeholder="Enter hospital name"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-2 font-semibold">
              Contact Number
            </label>

            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              maxLength="10"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block mb-2 font-semibold">
              City / Location
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block mb-2 font-semibold">
              Urgency Level
            </label>

            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
              required
            >
              <option value="">Select Urgency</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Submitting..."
              : "Submit Blood Request"}
          </button>

          {/* Message */}
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

        </form>
      </div>
    </div>
  );
}

export default RequestBlood;