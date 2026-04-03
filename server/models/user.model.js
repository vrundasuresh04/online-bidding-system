import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String },
      isp: { type: String },
    },
    signupAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Advanced Indexing Strategy
// Unique index on email for O(1) lookups and constraints
userSchema.index({ email: 1 }, { unique: true });
// Compound index to quickly find users by role (e.g., all admins) sorted by newest
userSchema.index({ role: 1, createdAt: -1 });

/**
 * Note on $jsonSchema Support:
 * While Mongoose handles robust application-level validation, in a true strict-DB architecture,
 * we can sync this schema to a pure MongoDB $jsonSchema string.
 * This ensures no raw driver queries bypass our validation rules.
 */

const User = mongoose.model("User", userSchema);

export default User;
