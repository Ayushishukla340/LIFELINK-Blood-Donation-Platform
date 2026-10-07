const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    donorName: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      required: true,
      enum: ["Normal", "Urgent", "Emergency"],
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Fulfilled",
        "Cancelled",
      ],
      default: "Pending",
    },

    isEmergencySOS: {
      type: Boolean,
      default: false,
    },

    verificationOtp: {
      type: String,
      default: null,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },

    otpVerifiedAt: {
      type: Date,
      default: null,
    },

    isFreePrivilege: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", requestSchema);