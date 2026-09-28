const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const BloodRequest = require("./models/Request");

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

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      fullName,
      email: email.trim().toLowerCase(),
      phone,
      bloodGroup,
      city,
      role,
      password,
    });

    res.status(201).json({
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
    console.log("❌ Registration Error:", error);

    res.status(500).json({
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
        $regex: city,
        $options: "i",
      };
    }

    const donors = await User.find(filter).select(
      "fullName bloodGroup city phone availability"
    );

    res.json({
      success: true,
      donors,
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
// ===============================

app.get("/api/blood-requests", async (req, res) => {
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
});

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

      // Find the request first
      const request = await BloodRequest.findById(req.params.id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      // Prevent donation count from increasing
      // if an already fulfilled request is updated again
      const wasAlreadyFulfilled =
        request.status === "Fulfilled";

      // Update request status
      request.status = status;
      await request.save();

      // If request is fulfilled for the first time,
      // update donor donation statistics
      if (
        status === "Fulfilled" &&
        !wasAlreadyFulfilled &&
        request.donorId
      ) {
        const donor = await User.findById(request.donorId);

        if (donor && donor.role === "Blood Donor") {
          donor.totalDonations =
            (donor.totalDonations || 0) + 1;

          donor.lastDonationDate = new Date();

          await donor.save();
        }
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
// PROTECTED PROFILE API
// ===============================

app.get(
  "/api/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select(
        "-password"
      );

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
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB Connection Error");
    console.log(error.message);
  });

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});