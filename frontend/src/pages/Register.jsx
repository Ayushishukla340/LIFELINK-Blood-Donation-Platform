import { useState } from "react";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    role: "",
    password: "",
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

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const city = formData.city.trim();
    const password = formData.password;

    // Full name validation
    if (!/^[A-Za-z ]{2,50}$/.test(fullName)) {
      setMessage("Please enter a valid full name.");
      setMessageType("error");
      return;
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit Indian phone number.");
      setMessageType("error");
      return;
    }

    // City validation
    if (!/^[A-Za-z ]{2,50}$/.test(city)) {
      setMessage("Please enter a valid city name.");
      setMessageType("error");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      setMessageType("error");
      return;
    }

    // Required dropdown validation
    if (!formData.bloodGroup) {
      setMessage("Please select your blood group.");
      setMessageType("error");
      return;
    }

    if (!formData.role) {
      setMessage("Please select your role.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/register", {
        fullName,
        email,
        phone,
        bloodGroup: formData.bloodGroup,
        city,
        role: formData.role,
        password,
      });

      setMessage(response.data.message);
      setMessageType("success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        bloodGroup: "",
        city: "",
        role: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
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
          Create Account
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Join LifeLink and help save lives.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-2 font-semibold">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 font-semibold">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Blood Group */}
          <div>
            <label className="block mb-2 font-semibold">
              Blood Group
            </label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
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

          {/* City */}
          <div>
            <label className="block mb-2 font-semibold">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-2 font-semibold">
              Register As
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
            >
              <option value="">Select Role</option>
              <option value="Blood Donor">Blood Donor</option>
              <option value="Patient">Patient</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password (minimum 8 characters)"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Create Account"}
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

export default Register;