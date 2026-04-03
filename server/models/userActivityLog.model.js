import mongoose from "mongoose";

const userActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["login", "logout", "signup", "bid", "create_auction", "view_auction", "update_profile"],
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Compound index to quickly pull history for auditing
userActivityLogSchema.index({ userId: 1, createdAt: -1 });
// Action frequency analysis
userActivityLogSchema.index({ action: 1, createdAt: -1 });

const UserActivityLog = mongoose.model("UserActivityLog", userActivityLogSchema);
export default UserActivityLog;
