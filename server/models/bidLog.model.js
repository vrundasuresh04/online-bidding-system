import mongoose from "mongoose";

const bidLogSchema = new mongoose.Schema(
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
    },
    previousPrice: {
      type: Number,
      required: true,
    },
    priceDelta: {
      type: Number,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { 
    // We only need createdAt, this log is strictly immutable
    timestamps: { createdAt: true, updatedAt: false }, 
    // Strict immutability layer at Mongoose level for audit compliance
    capped: { size: 1073741824, max: 10000000 } // 1GB capped collection for high-throughput logging
  }
);

// High-speed index for loading the temporal history of bids
bidLogSchema.index({ auctionId: 1, createdAt: -1 });

const BidLog = mongoose.model("BidLog", bidLogSchema);
export default BidLog;
