import mongoose from "mongoose";

const auctionExtensionSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The bidder who caused the extension near the deadline
      required: true,
    },
    originalEndDate: {
      type: Date,
      required: true,
    },
    newEndDate: {
      type: Date,
      required: true,
    },
    extendedByMs: {
      type: Number,
      required: true, // e.g. 300000 for 5 minutes
    },
    reason: {
      type: String,
      default: "anti-sniping safety extension",
    },
  },
  { timestamps: { createdAt: "extendedAt", updatedAt: false } }
);

// High-speed audit capability for extensions on a given auction
auctionExtensionSchema.index({ auctionId: 1, extendedAt: -1 });

const AuctionExtension = mongoose.model("AuctionExtension", auctionExtensionSchema);
export default AuctionExtension;
