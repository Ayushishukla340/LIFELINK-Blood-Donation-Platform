const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const BloodRequest = require("./models/Request");
const Notification = require("./models/Notification");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

require("dotenv").config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("Welcome to LifeLink Backend 🚀");
});

// ===============================
// TEST API
// ===============================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "LifeLink API is working successfully!",
  });
});

// ===============================
// REGISTER USER
// ===============================

app.post("/api/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodGroup,
      city,
      role,
      password,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !bloodGroup ||
      !city ||
      !role ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Block public Admin registration
    if (role === "Admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed",
      });
    }

    // Normalize email and phone
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check whether phone number already exists
    const existingPhone = await User.findOne({
      phone: normalizedPhone,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Create new user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      bloodGroup,
      city: city.trim(),
      role,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Registration Error:", error);

    // Handle duplicate-key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ===============================
// LOGIN USER
// ===============================

app.post("/api/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    console.log("🔐 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("✅ User found:", user.email);
    console.log("👤 User role:", user.role);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    console.log("🔑 Password match:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("✅ Login successful for:", user.email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("❌ Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ===============================
// FIND BLOOD DONORS
// SMART MATCHING
// ===============================

app.get("/api/donors", async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    const filter = {
      role: "Blood Donor",
      availability: "Available",
    };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (city) {
      filter.city = {
        $regex: city.trim(),
        $options: "i",
      };
    }

    const donors = await User.find(filter).select(
      "fullName bloodGroup city phone availability totalDonations points lastDonationDate"
    );

    // ===============================
    // SMART MATCHING SCORE
    // ===============================

    const searchCity = city?.trim().toLowerCase();

    const matchedDonors = donors.map((donor) => {
      let matchScore = 0;
      const matchReasons = [];

      if (!bloodGroup || donor.bloodGroup === bloodGroup) {
        matchScore += 50;
        matchReasons.push("Blood group matched");
      }

      if (
        searchCity &&
        donor.city?.trim().toLowerCase() === searchCity
      ) {
        matchScore += 40;
        matchReasons.push("Same city");
      } else if (searchCity) {
        matchScore += 20;
        matchReasons.push("Nearby/related city match");
      }

      if (donor.availability === "Available") {
        matchScore += 10;
        matchReasons.push("Currently available");
      }

      return {
        _id: donor._id,
        fullName: donor.fullName,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        phone: donor.phone,
        availability: donor.availability,
        totalDonations: donor.totalDonations || 0,
        points: donor.points || 0,
        lastDonationDate: donor.lastDonationDate || null,
        matchScore,
        matchReasons,
      };
    });

    matchedDonors.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      return (b.points || 0) - (a.points || 0);
    });

    res.json({
      success: true,
      donors: matchedDonors,
    });
  } catch (error) {
    console.log("❌ Find Donor Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch donors",
    });
  }
});

// ===============================
// CREATE BLOOD REQUEST
// PATIENT ONLY
// ===============================

app.post(
  "/api/blood-requests",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        donorId,
        bloodGroup,
        hospitalName,
        contactNumber,
        city,
        urgency,
      } = req.body;

      if (
        !donorId ||
        !bloodGroup ||
        !hospitalName ||
        !contactNumber ||
        !city ||
        !urgency
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all fields",
        });
      }

      // Validate donor ID
      if (!mongoose.isValidObjectId(donorId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid donor ID",
        });
      }

      const patient = await User.findById(req.user.id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient account not found",
        });
      }

      if (patient.role !== "Patient") {
        return res.status(403).json({
          success: false,
          message: "Only patients can send blood requests",
        });
      }

      const donor = await User.findById(donorId);

      if (!donor) {
        return res.status(404).json({
          success: false,
          message: "Donor not found",
        });
      }

      if (donor.role !== "Blood Donor") {
        return res.status(400).json({
          success: false,
          message: "Selected user is not a blood donor",
        });
      }

      if (donor.availability !== "Available") {
        return res.status(400).json({
          success: false,
          message: "Selected donor is currently unavailable",
        });
      }

      if (donor.bloodGroup !== bloodGroup) {
        return res.status(400).json({
          success: false,
          message: "Donor blood group does not match",
        });
      }
      // Prevent duplicate pending requests
      const existingRequest = await BloodRequest.findOne({
  patientId: patient._id,
  donorId: donor._id,
  status: "Pending",
});

console.log("🔍 Duplicate Check:", {
  patientId: patient._id.toString(),
  donorId: donor._id.toString(),
  existingRequest: existingRequest ? existingRequest._id.toString() : null,
});

if (existingRequest) {
  return res.status(409).json({
    success: false,
    message: "You already have a pending request with this donor.",
  });
}

      const bloodRequest = await BloodRequest.create({
        patientId: patient._id,
        patientName: patient.fullName,
        donorId: donor._id,
        donorName: donor.fullName,
        bloodGroup,
        hospitalName,
        contactNumber,
        city,
        urgency,
      });

      await Notification.create({
        userId: donor._id,
        type: "Blood Request",
        title: "New Blood Request",
        message: `${patient.fullName} has sent you a ${urgency.toLowerCase()} blood request for ${bloodGroup}.`,
        relatedRequestId: bloodRequest._id,
      });

      res.status(201).json({
        success: true,
        message: `Blood request sent to ${donor.fullName}`,
        request: bloodRequest,
      });
    } catch (error) {
      console.log("❌ Blood Request Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to send blood request",
      });
    }
  }
);

// ===============================
// GET ALL BLOOD REQUESTS
// ADMIN ONLY
// ===============================

app.get(
  "/api/blood-requests",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const requests = await BloodRequest.find().sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        requests,
      });
    } catch (error) {
      console.log("❌ Fetch Blood Requests Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to fetch blood requests",
      });
    }
  }
);

// ===============================
// GET MY BLOOD REQUESTS
// PATIENT ONLY
// ===============================

app.get(
  "/api/my-blood-requests",
  authMiddleware,
  async (req, res) => {
    try {
      const patient = await User.findById(req.user.id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient account not found",
        });
      }

      if (patient.role !== "Patient") {
        return res.status(403).json({
          success: false,
          message: "Only patients can view their blood requests",
        });
      }

      const requests = await BloodRequest.find({
        patientId: patient._id,
      }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        requests,
      });
    } catch (error) {
      console.log("❌ My Blood Requests Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to fetch your blood requests",
      });
    }
  }
);

// ===============================
// CANCEL BLOOD REQUEST
// PATIENT ONLY
// ===============================

app.put(
  "/api/blood-requests/:id/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const patient = await User.findById(req.user.id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient account not found",
        });
      }

      if (patient.role !== "Patient") {
        return res.status(403).json({
          success: false,
          message: "Only patients can cancel blood requests",
        });
      }

      const bloodRequest = await BloodRequest.findById(
        req.params.id
      );

      if (!bloodRequest) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      if (
        !bloodRequest.patientId ||
        bloodRequest.patientId.toString() !==
          patient._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this request",
        });
      }

      if (bloodRequest.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message:
            "Only pending blood requests can be cancelled",
        });
      }

      bloodRequest.status = "Cancelled";

      await bloodRequest.save();

      if (bloodRequest.donorId) {
        await Notification.create({
          userId: bloodRequest.donorId,
          type: "Request Cancelled",
          title: "Blood Request Cancelled",
          message: `${bloodRequest.patientName} cancelled the blood request.`,
          relatedRequestId: bloodRequest._id,
        });
      }

      res.json({
        success: true,
        message: "Blood request cancelled successfully",
        request: bloodRequest,
      });
    } catch (error) {
      console.log("❌ Cancel Request Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to cancel blood request",
      });
    }
  }
);

// ===============================
// GET DONOR BLOOD REQUESTS
// DONOR ONLY
// ===============================

app.get(
  "/api/donor-requests",
  authMiddleware,
  async (req, res) => {
    try {
      const donor = await User.findById(req.user.id);

      if (!donor) {
        return res.status(404).json({
          success: false,
          message: "Donor account not found",
        });
      }

      if (donor.role !== "Blood Donor") {
        return res.status(403).json({
          success: false,
          message: "Only blood donors can view received requests",
        });
      }

      const requests = await BloodRequest.find({
        donorId: donor._id,
      }).sort({
        createdAt: -1,
      });

      res.json({
        success: true,
        requests,
      });
    } catch (error) {
      console.log("❌ Donor Requests Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to fetch donor requests",
      });
    }
  }
);

// ===============================
// DONOR ACCEPT / REJECT REQUEST
// DONOR ONLY
// ===============================

app.put(
  "/api/blood-requests/:id/decision",
  authMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const { decision } = req.body;

      if (!["Accepted", "Rejected"].includes(decision)) {
        return res.status(400).json({
          success: false,
          message: "Invalid decision",
        });
      }

      const donor = await User.findById(req.user.id);

      if (!donor) {
        return res.status(404).json({
          success: false,
          message: "Donor account not found",
        });
      }

      if (donor.role !== "Blood Donor") {
        return res.status(403).json({
          success: false,
          message:
            "Only blood donors can make this decision",
        });
      }

      const bloodRequest = await BloodRequest.findById(
        req.params.id
      );

      if (!bloodRequest) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      if (
        !bloodRequest.donorId ||
        bloodRequest.donorId.toString() !==
          donor._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to decide this request",
        });
      }

      if (bloodRequest.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message:
            "This request has already been processed",
        });
      }

      bloodRequest.status = decision;

      await bloodRequest.save();

      if (bloodRequest.patientId) {
        await Notification.create({
          userId: bloodRequest.patientId,
          type:
            decision === "Accepted"
              ? "Request Accepted"
              : "Request Rejected",
          title:
            decision === "Accepted"
              ? "Blood Request Accepted"
              : "Blood Request Rejected",
          message:
            decision === "Accepted"
              ? `${donor.fullName} accepted your blood request.`
              : `${donor.fullName} rejected your blood request.`,
          relatedRequestId: bloodRequest._id,
        });
      }

      res.json({
        success: true,
        message: `Blood request ${decision.toLowerCase()} successfully`,
        request: bloodRequest,
      });
    } catch (error) {
      console.log("❌ Donor Decision Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to process blood request",
      });
    }
  }
);

// ===============================
// UPDATE BLOOD REQUEST STATUS
// ADMIN ONLY
// ===============================

app.put(
  "/api/blood-requests/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Accepted",
        "Rejected",
        "Fulfilled",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const request = await BloodRequest.findById(
        req.params.id
      );

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }
      const wasAlreadyFulfilled =
        request.status === "Fulfilled";

        const allowedTransitions = {
  Pending: ["Accepted", "Rejected", "Cancelled","Fulfilled"],
  Accepted: ["Fulfilled", "Cancelled"],
  Rejected: [],
  Fulfilled: [],
  Cancelled: [],
};

if (
  status !== request.status &&
  !allowedTransitions[request.status]?.includes(status)
) {
  return res.status(400).json({
    success: false,
    message: `Cannot change status from ${request.status} to ${status}`,
  });
}

      // Prevent changing a fulfilled request to another status
      if (
        wasAlreadyFulfilled &&
        status !== "Fulfilled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A fulfilled request cannot be changed to another status.",
        });
      }
       console.log("ADMIN STATUS DEBUG:", {
       currentStatus: request.status,
       requestedStatus: status,
       allowed: allowedTransitions[request.status],
       });

      request.status = status;

      await request.save();

      if (
        status === "Fulfilled" &&
        !wasAlreadyFulfilled &&
        request.donorId
      ) {
        const donor = await User.findById(
          request.donorId
        );

        if (donor && donor.role === "Blood Donor") {
          donor.totalDonations =
            (donor.totalDonations || 0) + 1;

          donor.lastDonationDate = new Date();

          await donor.save();
        }
      }


      if (request.patientId) {
        let notificationType = "General";
        let title = "Blood Request Updated";
        let message = `Your blood request status is now ${status}.`;

        if (status === "Fulfilled") {
          notificationType = "Request Fulfilled";
          title = "Blood Request Fulfilled";
          message =
            "Your blood request has been fulfilled successfully.";
        } else if (status === "Cancelled") {
          notificationType = "Request Cancelled";
          title = "Blood Request Cancelled";
          message =
            "Your blood request has been cancelled.";
        }

        await Notification.create({
          userId: request.patientId,
          type: notificationType,
          title,
          message,
          relatedRequestId: request._id,
        });
      }

      res.json({
        success: true,
        message:
          "Blood request status updated successfully",
        request,
      });
    } catch (error) {
      console.log("❌ Update Status Error:", error);

      res.status(500).json({
        success: false,
        message:
          "Unable to update blood request status",
      });
    }
  }
);

// ===============================
// UPDATE DONOR AVAILABILITY
// ===============================

app.put(
  "/api/profile/availability",
  authMiddleware,
  async (req, res) => {
    try {
      const { availability } = req.body;

      const allowedAvailability = [
        "Available",
        "Temporarily Unavailable",
        "Not Available",
      ];

      if (!allowedAvailability.includes(availability)) {
        return res.status(400).json({
          success: false,
          message: "Invalid availability status",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { availability },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Availability updated successfully",
        user,
      });
    } catch (error) {
      console.log("❌ Availability Update Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to update availability",
      });
    }
  }
);

// ===============================
// GET ALL USERS
// ADMIN ONLY
// ===============================

app.get(
  "/api/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        users,
      });
    } catch (error) {
      console.log("❌ Fetch Users Error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to fetch users",
      });
    }
  }
);

// ===============================
// UPDATE USER PROFILE
// PROTECTED
// ===============================

app.put(
  "/api/profile",
  authMiddleware,
  async (req, res) => {
    try {
      console.log(
        "📝 Profile Update Request:",
        req.body
      );

      const {
        fullName,
        phone,
        bloodGroup,
        city,
      } = req.body;

      if (
        !fullName ||
        !phone ||
        !bloodGroup ||
        !city
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all profile fields",
        });
      }

      const allowedBloodGroups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "O+",
        "O-",
        "AB+",
        "AB-",
      ];

      if (!allowedBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood group",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          bloodGroup,
          city: city.trim(),
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.log(
        "❌ Update Profile Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Unable to update profile",
      });
    }
  }
);

// ===============================
// PROTECTED PROFILE API
// ===============================

app.get(
  "/api/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.id
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile fetched successfully",
        user,
      });
    } catch (error) {
      console.log("❌ Profile Error:", error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// ===============================
// NOTIFICATION APIs
// ===============================

// GET USER NOTIFICATIONS

app.get(
  "/api/notifications",
  authMiddleware,
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          userId: req.user.id,
        }).sort({
          createdAt: -1,
        });

      const unreadCount =
        notifications.filter(
          (notification) =>
            !notification.isRead
        ).length;

      res.json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (error) {
      console.log(
        "❌ Fetch Notifications Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to fetch notifications",
      });
    }
  }
);

// MARK ONE NOTIFICATION AS READ

app.put(
  "/api/notifications/:id/read",
  authMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user.id,
          },
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.json({
        success: true,
        message:
          "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.log(
        "❌ Mark Notification Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update notification",
      });
    }
  }
);

// MARK ALL NOTIFICATIONS AS READ

app.put(
  "/api/notifications/read-all",
  authMiddleware,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          userId: req.user.id,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      res.json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.log(
        "❌ Read All Notifications Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to update notifications",
      });
    }
  }
);

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "✅ MongoDB Connected Successfully"
    );
  })
  .catch((error) => {
    console.log(
      "❌ MongoDB Connection Error"
    );
    console.log(error.message);
  });

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running on Port ${PORT}`
  );
});