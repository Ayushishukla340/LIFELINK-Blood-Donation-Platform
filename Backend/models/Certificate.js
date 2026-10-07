const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    donorName: {
      type: String,
      required: true,
      trim: true,
    },

    donorEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    patientName: {
      type: String,
      default: "Patient in Need",
    },

    hospitalName: {
      type: String,
      default: "General Hospital",
    },

    city: {
      type: String,
      default: "India",
    },

    pointsEarned: {
      type: Number,
      default: 20,
    },

    donationNumber: {
      type: Number,
      default: 1,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Certificate", certificateSchema);
