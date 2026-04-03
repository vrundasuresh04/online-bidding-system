import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: [1, "Starting price must be at least 1"],
    },
    currentPrice: {
      type: Number,
      required: true,
      default: function() { return this.startingPrice; }
    },
    reservePrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "active", "ended", "cancelled"],
      default: "active",
    },
    images: [{
      type: String,
    }],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    // Anti-sniping fields
    extensionCount: {
      type: Number,
      default: 0,
    },
    lastExtendedAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true },
);

// Partial index for active listings only — dramatically speeds up the main feed
auctionSchema.index({ status: 1, endDate: 1 });
auctionSchema.index({ seller: 1, createdAt: -1 });
// For category filtering capabilities
auctionSchema.index({ categoryId: 1, status: 1 });

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
