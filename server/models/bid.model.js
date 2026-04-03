import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Bid amount must be strictly positive"],
    },
    status: {
      type: String,
      enum: ["active", "outbid", "won", "cancelled"],
      default: "active",
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

// Indexing Strategy for Bids
// 1. To quickly find the winning/max bid for a specific auction
bidSchema.index({ auctionId: 1, amount: -1 });

// 2. To quickly load a specific user's bidding history across the platform
bidSchema.index({ bidderId: 1, createdAt: -1 });

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
