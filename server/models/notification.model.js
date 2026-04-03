import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["outbid", "won", "auction_ending", "payment_due", "system_alert"],
      required: true,
    },
    // Pattern: Flexible JSON Schema attribute for polymorphic data
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index to quickly fetch unread notifications for a specific user
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
