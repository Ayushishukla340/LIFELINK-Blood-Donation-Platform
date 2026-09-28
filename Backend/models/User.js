const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["Blood Donor", "Patient", "Admin"],
    },

    // Donor availability
    availability: {
      type: String,
      enum: ["Available", "Temporarily Unavailable", "Not Available"],
      default: "Available",
    },

    // Last time the donor donated blood
    lastDonationDate: {
      type: Date,
      default: null,
    },

    // Total number of successful donations
    totalDonations: {
      type: Number,
      default: 0,
    },

    // LifeLink reward points
    points: {
      type: Number,
      default: 0,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving user
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);