const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    senderRole: {
      type: String,
      required: true,
      enum: ["Blood Donor", "Patient", "Admin"],
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiverName: {
      type: String,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ requestId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
