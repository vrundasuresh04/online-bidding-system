import mongoose from "mongoose";
import User from "./models/user.model.js";
import Auction from "./models/auction.model.js";
import { config } from "dotenv";
config(); // Load .env file

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/auction");
    
    // Get the first user to act as the seller
    const user = await User.findOne();
    if (!user) {
      console.log("ERROR: No user found. Please sign up or login at least once so a user exists in the DB.");
      process.exit(1);
    }

    // Advanced architecture requires fields like title, endDate, images
    const mockAuctions = [
      {
        title: "Vintage Rolex Submariner",
        description: "A pristine condition 1980s Rolex Submariner with original box and papers. Beautiful patina on the dial index markers. A true collector's piece.",
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"],
        startingPrice: 12500,
        currentPrice: 12500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        seller: user._id,
        status: "active"
      },
      {
        title: "Custom High-End Gaming PC",
        description: "Top-of-the-line gaming rig. RTX 4090, i9-13900k, 64GB DDR5 6400MHz. Custom water loop with RGB lighting. Barely used and ready for 4K streaming.",
        images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800"],
        startingPrice: 3200,
        currentPrice: 3200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        seller: user._id,
        status: "active"
      },
      {
        title: "1960s Fender Stratocaster",
        description: "All original parts, sunburst finish. Incredible tone and playability. Comes with the original hardcase. Perfect condition.",
        images: ["https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&q=80&w=800"],
        startingPrice: 8500,
        currentPrice: 8500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        seller: user._id,
        status: "active"
      },
      {
        title: "Modern Abstract Oil Painting",
        description: "Large contemporary abstract oil painting on canvas. Measuring 60x60 inches. Striking blue and gold accents.",
        images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=800"],
        startingPrice: 800,
        currentPrice: 800,
        startDate: new Date(),
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        seller: user._id,
        status: "active"
      }
    ];

    await Auction.insertMany(mockAuctions);
    console.log(`Successfully seeded ${mockAuctions.length} advanced mock auctions assigned to user: ${user.name}`);
    process.exit(0);

  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
}

seed();
