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
const Certificate = require("./models/Certificate");
const Message = require("./models/Message");

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
// 90-DAY DONATION COOLDOWN HELPER
// ===============================

const COOLDOWN_DAYS = 90;

function calculateDonationEligibility(lastDonationDate) {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      cooldownActive: false,
      daysRemaining: 0,
      daysPassed: null,
      totalCooldownDays: COOLDOWN_DAYS,
      nextEligibleDate: null,
      progressPercent: 100,
      statusMessage: "Ready to Donate! Medically eligible.",
    };
  }

  const donationDate = new Date(lastDonationDate);
  if (isNaN(donationDate.getTime())) {
    return {
      isEligible: true,
      cooldownActive: false,
      daysRemaining: 0,
      daysPassed: null,
      totalCooldownDays: COOLDOWN_DAYS,
      nextEligibleDate: null,
      progressPercent: 100,
      statusMessage: "Ready to Donate! Medically eligible.",
    };
  }

  const now = new Date();
  const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const nextEligibleTime = donationDate.getTime() + cooldownMs;
  const diffMs = nextEligibleTime - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  const daysPassed = Math.max(
    0,
    Math.floor((now.getTime() - donationDate.getTime()) / (24 * 60 * 60 * 1000))
  );

  const cooldownActive = daysRemaining > 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((daysPassed / COOLDOWN_DAYS) * 100))
  );

  return {
    isEligible: !cooldownActive,
    cooldownActive,
    daysRemaining,
    daysPassed,
    totalCooldownDays: COOLDOWN_DAYS,
    nextEligibleDate: new Date(nextEligibleTime),
    progressPercent,
    statusMessage: cooldownActive
      ? `You can donate again in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`
      : "Ready to Donate! Medically eligible.",
  };
}

// ===============================
// FIND BLOOD DONORS
// SMART MATCHING
// ===============================

app.get("/api/donors", async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    const filter = {
      role: "Blood Donor",
      $or: [
        { availability: "Available" },
        { availability: { $exists: false } },
        { availability: null },
      ],
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
    // SMART MATCHING SCORE & ELIGIBILITY
    // ===============================

    const searchCity = city?.trim().toLowerCase();

    const matchedDonors = donors.map((donor) => {
      let matchScore = 0;
      const matchReasons = [];

      const eligibility = calculateDonationEligibility(donor.lastDonationDate);
      let effectiveAvailability = donor.availability || "Available";

      if (eligibility.cooldownActive) {
        effectiveAvailability = "Temporarily Unavailable";
      }

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

      if (effectiveAvailability === "Available") {
        matchScore += 10;
        matchReasons.push("Currently available");
      } else if (eligibility.cooldownActive) {
        matchReasons.push(`Cooldown Active (${eligibility.daysRemaining}d left)`);
      }

      return {
        _id: donor._id,
        fullName: donor.fullName,
        bloodGroup: donor.bloodGroup,
        city: donor.city,
        phone: donor.phone,
        availability: effectiveAvailability,
        totalDonations: donor.totalDonations || 0,
        points: donor.points || 0,
        lastDonationDate: donor.lastDonationDate || null,
        eligibility,
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

// Compatible donor groups for a given recipient blood group
const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

// Compatible recipients that a given donor blood group can donate to
const COMPATIBLE_RECIPIENTS_FOR_DONOR = {
  "O-": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "A+": ["A+", "AB+"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB+", "AB-"],
  "AB+": ["AB+"],
};

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
        isEmergencySOS,
      } = req.body;

      if (
        !bloodGroup ||
        !hospitalName ||
        !contactNumber ||
        !city ||
        (!urgency && !isEmergencySOS)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields",
        });
      }

      const requester = await User.findById(req.user.id);

      if (!requester) {
        return res.status(404).json({
          success: false,
          message: "User account not found",
        });
      }

      const isFreePrivilege =
        (requester.points || 0) >= 100 ||
        (requester.totalDonations || 0) >= 5;

      const ninetyDaysAgo = new Date(
        Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000
      );
      const cooldownFilter = {
        $or: [
          { lastDonationDate: null },
          { lastDonationDate: { $exists: false } },
          { lastDonationDate: { $lte: ninetyDaysAgo } },
        ],
      };

      // 🚨 EMERGENCY SOS BROADCAST (CITY-WIDE ALERT)
      if (isEmergencySOS) {
        // Prevent spamming multiple pending SOS requests
        const existingSOS = await BloodRequest.findOne({
          patientId: requester._id,
          isEmergencySOS: true,
          status: "Pending",
        });

        if (existingSOS) {
          return res.status(409).json({
            success: false,
            message:
              "You already have an active Emergency SOS broadcast pending. Please wait for donors or cancel it before sending a new one.",
          });
        }

        const bloodRequest = await BloodRequest.create({
          patientId: requester._id,
          patientName: requester.fullName,
          donorId: null,
          donorName: "Open SOS Broadcast",
          bloodGroup,
          hospitalName,
          contactNumber,
          city,
          urgency: "Emergency",
          isEmergencySOS: true,
          isFreePrivilege,
        });

        // Find all active compatible donors in that city
        const compatibleDonorGroups =
          COMPATIBLE_DONORS_FOR_RECIPIENT[bloodGroup] || [bloodGroup];

        const matchingDonors = await User.find({
          role: "Blood Donor",
          bloodGroup: { $in: compatibleDonorGroups },
          availability: "Available",
          _id: { $ne: req.user.id },
          city: { $regex: new RegExp(`^${city.trim()}$`, "i") },
          ...cooldownFilter,
        });

        if (matchingDonors.length > 0) {
          const notifications = matchingDonors.map((d) => ({
            userId: d._id,
            type: "Blood Request",
            title: "🚨 EMERGENCY SOS BROADCAST",
            message: `CRITICAL ALERT in ${city}: ${requester.fullName} urgently needs ${bloodGroup} blood at ${hospitalName}! First donor to accept will be dispatched.`,
            relatedRequestId: bloodRequest._id,
          }));
          await Notification.insertMany(notifications);
        }

        return res.status(201).json({
          success: true,
          message: `🚨 Emergency SOS broadcasted to ${matchingDonors.length} compatible donors in ${city}!`,
          request: bloodRequest,
          alertedCount: matchingDonors.length,
        });
      }

      // STANDARD REQUEST FLOW
      let donor = null;

      if (donorId) {
        // Validate donor ID
        if (!mongoose.isValidObjectId(donorId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid donor ID",
          });
        }

        if (donorId.toString() === req.user.id.toString()) {
          return res.status(400).json({
            success: false,
            message: "You cannot send a blood request to yourself.",
          });
        }

        donor = await User.findById(donorId);

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

        // Check 90-day medical recovery cooldown
        const donorEligibility = calculateDonationEligibility(
          donor.lastDonationDate
        );
        if (donorEligibility.cooldownActive) {
          return res.status(400).json({
            success: false,
            message: `Selected donor is currently under a 90-day medical recovery cooldown (${donorEligibility.daysRemaining} days remaining). Please choose an eligible donor.`,
            eligibility: donorEligibility,
          });
        }

        if (donor.bloodGroup !== bloodGroup) {
          return res.status(400).json({
            success: false,
            message: "Donor blood group does not match",
          });
        }
      } else {
        // Auto-match best available donor matching blood group and city (excluding cooldown)
        donor = await User.findOne({
          role: "Blood Donor",
          bloodGroup,
          availability: "Available",
          _id: { $ne: req.user.id },
          city: { $regex: new RegExp(`^${city}$`, "i") },
          ...cooldownFilter,
        });

        if (!donor) {
          // Fallback to any available donor matching blood group (excluding cooldown)
          donor = await User.findOne({
            role: "Blood Donor",
            bloodGroup,
            availability: "Available",
            _id: { $ne: req.user.id },
            ...cooldownFilter,
          });
        }

        if (!donor) {
          return res.status(404).json({
            success: false,
            message: `Currently no active donors are available for blood group ${bloodGroup}. You can also browse donors directly in Find Donor or use Emergency SOS Broadcast.`,
          });
        }
      }

      // Prevent duplicate pending requests
      const existingRequest = await BloodRequest.findOne({
        patientId: requester._id,
        donorId: donor._id,
        status: "Pending",
      });

      console.log("🔍 Duplicate Check:", {
        patientId: requester._id.toString(),
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
        patientId: requester._id,
        patientName: requester.fullName,
        donorId: donor._id,
        donorName: donor.fullName,
        bloodGroup,
        hospitalName,
        contactNumber,
        city,
        urgency: urgency || "Normal",
        isEmergencySOS: false,
        isFreePrivilege,
      });

      await Notification.create({
        userId: donor._id,
        type: "Blood Request",
        title: isFreePrivilege
          ? "🌟 Free Blood Privilege Request"
          : "New Blood Request",
        message: `${requester.fullName} ${
          isFreePrivilege ? "(Gold Lifesaver Member)" : ""
        } has sent you a ${(urgency || "Normal").toLowerCase()} blood request for ${bloodGroup}.`,
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
// ===============================
// GET MY BLOOD REQUESTS
// ANY AUTHENTICATED USER
// ===============================

app.get(
  "/api/my-blood-requests",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User account not found",
        });
      }

      const requests = await BloodRequest.find({
        patientId: user._id,
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
// CREATOR ONLY
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

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User account not found",
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
          user._id.toString()
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

      const canDonateToGroups =
        COMPATIBLE_RECIPIENTS_FOR_DONOR[donor.bloodGroup] || [donor.bloodGroup];

      const requests = await BloodRequest.find({
        $or: [
          { donorId: donor._id },
          {
            isEmergencySOS: true,
            status: "Pending",
            bloodGroup: { $in: canDonateToGroups },
            city: { $regex: new RegExp(`^${donor.city}$`, "i") },
          },
        ],
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

      const isPendingSOS =
        bloodRequest.isEmergencySOS &&
        bloodRequest.status === "Pending" &&
        (!bloodRequest.donorId || bloodRequest.donorName === "Open SOS Broadcast");

      if (!isPendingSOS) {
        if (
          !bloodRequest.donorId ||
          bloodRequest.donorId.toString() !==
            donor._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You are not authorized to decide this request, or it was already accepted by another donor.",
          });
        }
      }

      if (bloodRequest.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message:
            "This request has already been processed or fulfilled.",
        });
      }

      // If donor rejects an SOS broadcast, simply dismiss for this donor
      if (isPendingSOS && decision === "Rejected") {
        return res.json({
          success: true,
          message: "Emergency SOS broadcast dismissed.",
        });
      }

      // Generate random 4-digit verification OTP when request is accepted
      let verificationOtp = bloodRequest.verificationOtp;
      if (decision === "Accepted") {
        verificationOtp = Math.floor(1000 + Math.random() * 9000).toString();
        bloodRequest.verificationOtp = verificationOtp;
      }

      // If it was an open SOS broadcast, assign it to this first-responder donor
      if (isPendingSOS && decision === "Accepted") {
        bloodRequest.donorId = donor._id;
        bloodRequest.donorName = donor.fullName;
      }

      bloodRequest.status = decision;

      await bloodRequest.save();

      if (bloodRequest.patientId) {
        const isSOS = bloodRequest.isEmergencySOS;
        await Notification.create({
          userId: bloodRequest.patientId,
          type:
            decision === "Accepted"
              ? "Request Accepted"
              : "Request Rejected",
          title:
            decision === "Accepted"
              ? (isSOS ? "🚨 Emergency SOS Accepted!" : "Blood Request Accepted")
              : "Blood Request Rejected",
          message:
            decision === "Accepted"
              ? `${donor.fullName} accepted your blood request! Your hospital verification OTP is [${verificationOtp}]. Provide this OTP to the donor after donation.`
              : `${donor.fullName} rejected your blood request.`,
          relatedRequestId: bloodRequest._id,
        });
      }

      res.json({
        success: true,
        message: isPendingSOS
          ? `Emergency SOS accepted! You are now assigned to patient ${bloodRequest.patientName}.`
          : `Blood request ${decision.toLowerCase()} successfully`,
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
// HELPER: FULFILL BLOOD REQUEST (AWARD +20 POINTS & ISSUE CERTIFICATE)
// ===============================
async function processFulfillBloodRequest(bloodRequest) {
  if (bloodRequest.status === "Fulfilled") {
    return { success: false, message: "Request already fulfilled" };
  }

  bloodRequest.status = "Fulfilled";
  await bloodRequest.save();

  let cert = null;
  if (bloodRequest.donorId) {
    const donor = await User.findById(bloodRequest.donorId);

    if (donor && donor.role === "Blood Donor") {
      donor.totalDonations = (donor.totalDonations || 0) + 1;
      donor.points = (donor.points || 0) + 20;
      donor.lastDonationDate = new Date();
      donor.availability = "Temporarily Unavailable"; // Auto-lock to 90-day recovery cooldown
      await donor.save();

      // Generate Certificate if not already present
      const existingCert = await Certificate.findOne({
        requestId: bloodRequest._id,
      });

      if (!existingCert) {
        const randomCode = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
        const certId = `LL-CERT-${new Date().getFullYear()}-${randomCode}`;

        cert = await Certificate.create({
          certificateId: certId,
          donorId: donor._id,
          donorName: donor.fullName,
          donorEmail: donor.email,
          bloodGroup: donor.bloodGroup || bloodRequest.bloodGroup,
          requestId: bloodRequest._id,
          patientName: bloodRequest.patientName,
          hospitalName: bloodRequest.hospitalName,
          city: bloodRequest.city,
          pointsEarned: 20,
          donationNumber: donor.totalDonations,
          issueDate: new Date(),
        });

        await Notification.create({
          userId: donor._id,
          type: "General",
          title: "🎉 Donation Certificate Issued!",
          message: `Congratulations ${donor.fullName}! You have earned +20 points and Certificate (${certId}). Your 90-day medical recovery cooldown has started to ensure your health & safety.`,
          relatedRequestId: bloodRequest._id,
        });
      } else {
        cert = existingCert;
      }
    }
  }

  if (bloodRequest.patientId) {
    await Notification.create({
      userId: bloodRequest.patientId,
      type: "Request Fulfilled",
      title: "Blood Request Fulfilled 🎉",
      message: `Your blood request for ${bloodRequest.bloodGroup} at ${bloodRequest.hospitalName} has been fulfilled. Thank you for using LifeLink!`,
      relatedRequestId: bloodRequest._id,
    });
  }

  return { success: true, bloodRequest, cert };
}

// ===============================
// COMPLETE / FULFILL BLOOD REQUEST (DONOR / PATIENT / ADMIN)
// ===============================
app.put(
  "/api/blood-requests/:id/fulfill",
  authMiddleware,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const bloodRequest = await BloodRequest.findById(req.params.id);

      if (!bloodRequest) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      const isDonor =
        bloodRequest.donorId &&
        bloodRequest.donorId.toString() === req.user.id.toString();
      const isPatient =
        bloodRequest.patientId &&
        bloodRequest.patientId.toString() === req.user.id.toString();
      const isAdmin = req.user.role === "Admin";

      if (!isDonor && !isPatient && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to complete this request",
        });
      }

      if (bloodRequest.status === "Fulfilled") {
        return res.status(400).json({
          success: false,
          message: "This blood request is already marked as fulfilled",
        });
      }

      if (bloodRequest.status !== "Accepted" && !isAdmin) {
        return res.status(400).json({
          success: false,
          message: "Blood request must be in 'Accepted' state before completing donation",
        });
      }

      // 🛡️ 4-Digit OTP Verification for hospital donation
      const { otp } = req.body;
      if (!isAdmin && bloodRequest.verificationOtp) {
        if (!otp || otp.toString().trim() !== bloodRequest.verificationOtp.toString().trim()) {
          return res.status(400).json({
            success: false,
            message: "Invalid 4-digit OTP. Please ask the patient for the correct verification OTP displayed on their screen.",
          });
        }
        bloodRequest.isOtpVerified = true;
        bloodRequest.otpVerifiedAt = new Date();
      }

      const result = await processFulfillBloodRequest(bloodRequest);

      res.json({
        success: true,
        message:
          "Blood donation verified & marked as completed! 20 points credited and certificate generated 🎉",
        request: bloodRequest,
        certificate: result?.cert,
      });
    } catch (error) {
      console.log("❌ Fulfill Blood Request Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to complete blood request",
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

      const previousStatus = request.status;
      const wasAlreadyFulfilled = previousStatus === "Fulfilled";

      if (status === "Fulfilled" && !wasAlreadyFulfilled) {
        await processFulfillBloodRequest(request);
      } else {
        request.status = status;
        await request.save();
      }

      // If status was previously Fulfilled and is now changed to something else, decrement donor count, deduct points, and remove certificate
      if (
        wasAlreadyFulfilled &&
        status !== "Fulfilled" &&
        request.donorId
      ) {
        const donor = await User.findById(request.donorId);

        if (donor && donor.role === "Blood Donor") {
          donor.totalDonations = Math.max(0, (donor.totalDonations || 1) - 1);
          donor.points = Math.max(0, (donor.points || 20) - 20);
          await donor.save();

          await Certificate.findOneAndDelete({
            requestId: request._id,
          });
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

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check 90-day medical cooldown rule for blood donors
      if (user.role === "Blood Donor" && availability === "Available") {
        const eligibility = calculateDonationEligibility(user.lastDonationDate);
        if (eligibility.cooldownActive) {
          const nextDateStr = new Date(
            eligibility.nextEligibleDate
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return res.status(400).json({
            success: false,
            message: `Medical Cooldown Active: You cannot set availability to 'Available' until 90 days have elapsed since your last blood donation. You can donate again in ${eligibility.daysRemaining} days (on ${nextDateStr}).`,
            eligibility,
          });
        }
      }

      user.availability = availability;
      await user.save();

      const userObj = user.toObject();
      delete userObj.password;

      res.json({
        success: true,
        message: "Availability updated successfully",
        user: userObj,
        eligibility: calculateDonationEligibility(user.lastDonationDate),
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
        lastDonationDate,
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

      const updateData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        bloodGroup,
        city: city.trim(),
      };

      if (lastDonationDate !== undefined) {
        updateData.lastDonationDate = lastDonationDate
          ? new Date(lastDonationDate)
          : null;

        // Auto-lock availability if donor enters a donation date within 90 days
        if (updateData.lastDonationDate) {
          const elig = calculateDonationEligibility(updateData.lastDonationDate);
          if (elig.cooldownActive) {
            updateData.availability = "Temporarily Unavailable";
          }
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
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

      const eligibility = calculateDonationEligibility(user.lastDonationDate);

      res.json({
        success: true,
        message: "Profile updated successfully",
        user,
        eligibility,
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

      let eligibility = null;
      if (user.role === "Blood Donor") {
        eligibility = calculateDonationEligibility(user.lastDonationDate);

        // Auto-lock availability if cooldown is active and currently Available
        if (eligibility.cooldownActive && user.availability === "Available") {
          user.availability = "Temporarily Unavailable";
          await user.save();
        }
      }

      res.json({
        success: true,
        message: "Profile fetched successfully",
        user,
        eligibility,
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
// GET DONOR ELIGIBILITY STATUS
// ===============================
app.get(
  "/api/donor/eligibility",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const eligibility = calculateDonationEligibility(user.lastDonationDate);

      res.json({
        success: true,
        eligibility,
      });
    } catch (error) {
      console.log("❌ Eligibility Calculation Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to calculate donation eligibility",
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
// CERTIFICATES & REWARDS SYSTEM
// ===============================

// GET MY CERTIFICATES & PRIVILEGE STATS
app.get(
  "/api/certificates/my-certificates",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let certificates = await Certificate.find({ donorId: user._id }).sort({
        createdAt: -1,
      });

      // Auto-sync certificates for existing fulfilled blood requests if any
      if (certificates.length === 0 && user.role === "Blood Donor") {
        const fulfilledRequests = await BloodRequest.find({
          donorId: user._id,
          status: "Fulfilled",
        }).sort({ createdAt: 1 });

        if (fulfilledRequests.length > 0) {
          for (let i = 0; i < fulfilledRequests.length; i++) {
            const reqItem = fulfilledRequests[i];
            const randomCode = Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase();
            const certId = `LL-CERT-${new Date(
              reqItem.createdAt || Date.now()
            ).getFullYear()}-${randomCode}`;

            await Certificate.create({
              certificateId: certId,
              donorId: user._id,
              donorName: user.fullName,
              donorEmail: user.email,
              bloodGroup: user.bloodGroup || reqItem.bloodGroup,
              requestId: reqItem._id,
              patientName: reqItem.patientName,
              hospitalName: reqItem.hospitalName,
              city: reqItem.city,
              pointsEarned: 20,
              donationNumber: i + 1,
              issueDate: reqItem.updatedAt || reqItem.createdAt || new Date(),
            });
          }

          if (!user.points || user.points < fulfilledRequests.length * 20) {
            user.points = fulfilledRequests.length * 20;
            user.totalDonations = Math.max(
              user.totalDonations || 0,
              fulfilledRequests.length
            );
            await user.save();
          }

          certificates = await Certificate.find({ donorId: user._id }).sort({
            createdAt: -1,
          });
        }
      }

      const totalCertificates = certificates.length;
      const totalPoints = user.points || totalCertificates * 20 || 0;
      const totalDonations = Math.max(
        user.totalDonations || 0,
        totalCertificates
      );
      const isPrivilegeUnlocked =
        totalCertificates >= 5 || totalPoints >= 100 || totalDonations >= 5;

      res.json({
        success: true,
        certificates,
        stats: {
          totalCertificates,
          totalPoints,
          totalDonations,
          isPrivilegeUnlocked,
          remainingForPrivilege: Math.max(0, 5 - totalDonations),
          pointsRemainingForPrivilege: Math.max(0, 100 - totalPoints),
          tier: isPrivilegeUnlocked
            ? "LifeLink Gold Lifesaver"
            : "Active Donor",
        },
      });
    } catch (error) {
      console.log("❌ Fetch Certificates Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch certificates",
      });
    }
  }
);

// GET SINGLE CERTIFICATE BY ID
app.get("/api/certificates/:id", async (req, res) => {
  try {
    let cert;
    if (mongoose.isValidObjectId(req.params.id)) {
      cert = await Certificate.findById(req.params.id);
    }
    if (!cert) {
      cert = await Certificate.findOne({ certificateId: req.params.id });
    }
    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }
    res.json({
      success: true,
      certificate: cert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load certificate",
    });
  }
});

// GET USER PRIVILEGE STATUS
app.get(
  "/api/user/privilege-status",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const certCount = await Certificate.countDocuments({ donorId: user._id });
      const totalDonations = Math.max(user.totalDonations || 0, certCount);
      const points = Math.max(user.points || 0, totalDonations * 20);
      const isPrivilegeUnlocked =
        certCount >= 5 || totalDonations >= 5 || points >= 100;

      res.json({
        success: true,
        privilege: {
          isPrivilegeUnlocked,
          totalDonations,
          points,
          certificatesCount: certCount,
          tier: isPrivilegeUnlocked
            ? "LifeLink Gold Lifesaver"
            : "Active Lifesaver",
          benefit: isPrivilegeUnlocked
            ? "100% Free Blood • Zero Processing & Screening Charges"
            : `${Math.max(
                0,
                5 - totalDonations
              )} more donation(s) to unlock 100% Free Blood Privilege`,
          progressPercent: Math.min(100, Math.round((points / 100) * 100)),
        },
      });
    } catch (error) {
      console.log("❌ Privilege Status Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch privilege status",
      });
    }
  }
);

// ===============================
// IN-APP DIRECT CHAT (DONOR ↔ PATIENT)
// Accessible when blood request is 'Accepted' or 'Fulfilled'
// ===============================

// GET CHAT MESSAGES FOR A BLOOD REQUEST
app.get(
  "/api/chat/:requestId/messages",
  authMiddleware,
  async (req, res) => {
    try {
      const { requestId } = req.params;

      if (!mongoose.isValidObjectId(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const bloodRequest = await BloodRequest.findById(requestId)
        .populate("patientId", "fullName phone email role")
        .populate("donorId", "fullName phone email role");

      if (!bloodRequest) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      const userId = req.user.id.toString();
      const patientId =
        bloodRequest.patientId?._id?.toString() ||
        bloodRequest.patientId?.toString();
      const donorId =
        bloodRequest.donorId?._id?.toString() ||
        bloodRequest.donorId?.toString();
      const isAdmin = req.user.role === "Admin";

      // Verify user is authorized
      if (userId !== patientId && userId !== donorId && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view this chat conversation",
        });
      }

      // Check request status - chat is available when Accepted or Fulfilled
      if (
        bloodRequest.status !== "Accepted" &&
        bloodRequest.status !== "Fulfilled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Direct chat is only active for Accepted or Fulfilled blood requests.",
          status: bloodRequest.status,
        });
      }

      // Fetch messages
      const messages = await Message.find({ requestId }).sort({
        createdAt: 1,
      });

      // Mark incoming messages as read
      await Message.updateMany(
        { requestId, receiverId: req.user.id, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );

      // Determine who the other participant is
      const isDonor = userId === donorId;
      const otherParticipant = isDonor
        ? {
            id: patientId,
            name:
              bloodRequest.patientName ||
              bloodRequest.patientId?.fullName ||
              "Patient",
            role: "Patient",
            phone:
              bloodRequest.contactNumber ||
              bloodRequest.patientId?.phone ||
              "",
          }
        : {
            id: donorId,
            name:
              bloodRequest.donorName ||
              bloodRequest.donorId?.fullName ||
              "Donor",
            role: "Blood Donor",
            phone: bloodRequest.donorId?.phone || "",
          };

      res.json({
        success: true,
        request: {
          _id: bloodRequest._id,
          status: bloodRequest.status,
          bloodGroup: bloodRequest.bloodGroup,
          hospitalName: bloodRequest.hospitalName,
          city: bloodRequest.city,
          urgency: bloodRequest.urgency,
          patientName: bloodRequest.patientName,
          donorName: bloodRequest.donorName,
        },
        otherParticipant,
        currentUser: {
          id: req.user.id,
          name: req.user.fullName,
          role: isDonor ? "Blood Donor" : "Patient",
        },
        messages,
      });
    } catch (error) {
      console.log("❌ Fetch Chat Messages Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to load chat messages",
      });
    }
  }
);

// SEND MESSAGE IN CHAT
app.post(
  "/api/chat/:requestId/messages",
  authMiddleware,
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: "Message text cannot be empty",
        });
      }

      if (!mongoose.isValidObjectId(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood request ID",
        });
      }

      const bloodRequest = await BloodRequest.findById(requestId);

      if (!bloodRequest) {
        return res.status(404).json({
          success: false,
          message: "Blood request not found",
        });
      }

      const userId = req.user.id.toString();
      const patientId = bloodRequest.patientId?.toString();
      const donorId = bloodRequest.donorId?.toString();

      if (userId !== patientId && userId !== donorId) {
        return res.status(403).json({
          success: false,
          message: "You are not a participant in this blood request",
        });
      }

      if (
        bloodRequest.status !== "Accepted" &&
        bloodRequest.status !== "Fulfilled"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Direct chat is only available once the blood request is Accepted",
        });
      }

      const isDonor = userId === donorId;
      const receiverId = isDonor ? patientId : donorId;
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(receiverId);

      const newMessage = await Message.create({
        requestId: bloodRequest._id,
        senderId: sender._id,
        senderName: sender.fullName,
        senderRole: sender.role,
        receiverId: receiver ? receiver._id : receiverId,
        receiverName: receiver
          ? receiver.fullName
          : isDonor
          ? bloodRequest.patientName
          : bloodRequest.donorName,
        text: text.trim(),
      });

      // Send in-app notification to receiver
      if (receiverId) {
        const previewText =
          text.trim().length > 60
            ? `${text.trim().substring(0, 60)}...`
            : text.trim();

        await Notification.create({
          userId: receiverId,
          type: "General",
          title: `💬 New Message from ${sender.fullName}`,
          message: `${sender.fullName}: "${previewText}" (Re: Blood request at ${bloodRequest.hospitalName})`,
          relatedRequestId: bloodRequest._id,
        });
      }

      res.status(201).json({
        success: true,
        message: newMessage,
      });
    } catch (error) {
      console.log("❌ Send Message Error:", error);
      res.status(500).json({
        success: false,
        message: "Unable to send message",
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