import mongoose from 'mongoose';
import User from './models/user.model.js';
import Auction from './models/auction.model.js';
import { generateToken } from './utils/jwt.js';

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/auction');

    const admin = await User.findOne();
    if (!admin) return console.log("No user found");

    const token = generateToken(admin._id, admin.role);

    const auctions = await Auction.find({ status: "active" });
    if (!auctions.length) return console.log("No active auctions");

    const auction = auctions[0];
    console.log("Mock bidding on auction:", auction._id.toString(), "owned by:", auction.seller.toString(), "user:", admin._id.toString());

    const res = await fetch("http://127.0.0.1:3000/auction/" + auction._id.toString() + "/bid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "auth_token=" + token
      },
      body: JSON.stringify({ bidAmount: auction.currentPrice + 10 }),
    });
    
    const data = await res.json();
    console.log("Response Status:", res.status);
    console.log("Response Body:", data);
  } catch (err) {
    console.error("Test execution failed:", err);
  }
  process.exit(0);
}
test();
