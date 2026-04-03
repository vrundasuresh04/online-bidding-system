import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
  },
  { timestamps: { createdAt: "addedAt", updatedAt: false } }
);

// Prevent users from adding the same auction twice (Many-to-Many relation constraint)
watchlistSchema.index({ userId: 1, auctionId: 1 }, { unique: true });
// For determining how many users are watching a specific auction
watchlistSchema.index({ auctionId: 1 });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
