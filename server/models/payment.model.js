import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      // unique: true, // Should be unique when populated by gateway
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// One verified payment per auction/buyer combination
paymentSchema.index({ auctionId: 1, buyerId: 1 }, { unique: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
