import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxLength: 1000, // MongoDB schema-level logic mapping down constraints
    }
  },
  { timestamps: true }
);

// A reviewer can only review a specific auction once
reviewSchema.index({ auctionId: 1, reviewerId: 1 }, { unique: true });
// For quickly gathering a seller's rating aggregation
reviewSchema.index({ sellerId: 1, rating: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
