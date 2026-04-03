import mongoose from 'mongoose';
import User from './models/user.model.js';
import Auction from './models/auction.model.js';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

async function fixSeller() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/auction');

    // Create a dummy seller
    const hashedPassword = await bcrypt.hash("hiddenpassword", 10);
    const dummySeller = new User({
      name: "Vintage Store Official",
      email: "vintagestore@auction.com",
      password: hashedPassword,
      role: "user"
    });
    await dummySeller.save();

    // Reassign all active auctions to this dummy seller
    const updated = await Auction.updateMany({}, { $set: { seller: dummySeller._id } });
    
    console.log("Fixed! Reassigned " + updated.modifiedCount + " auctions to a new dummy seller.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixSeller();
