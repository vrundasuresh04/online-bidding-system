import express from "express";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import mongoose from "mongoose";

const analyticsRoutes = express.Router();

// 1. Highest bids per auction (aggregation)
analyticsRoutes.get("/highest-bids/:auctionId", async (req, res) => {
  try {
    const { auctionId } = req.params;
    const pipeline = [
      { $match: { auctionId: new mongoose.Types.ObjectId(auctionId) } },
      { $sort: { amount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "bidderId",
          foreignField: "_id",
          as: "bidderInfo"
        }
      },
      { $unwind: "$bidderInfo" },
      {
        $project: {
          _id: 1,
          amount: 1,
          createdAt: 1,
          "bidderInfo.name": 1,
          "bidderInfo.avatar": 1
        }
      }
    ];
    const topBids = await Bid.aggregate(pipeline);
    res.json(topBids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Platform-wide System Stats (Facets & Complex Aggregation)
analyticsRoutes.get("/global-stats", async (req, res) => {
  try {
    const pipeline = [
      {
        $facet: {
          auctionStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          totalPlatformValue: [
            { $match: { isSold: true } },
            { $group: { _id: null, totalValue: { $sum: "$currentPrice" } } }
          ],
          mostPopularCategory: [
            { $group: { _id: "$categoryId", totalBids: { $sum: "$totalBids" } } },
            { $sort: { totalBids: -1 } },
            { $limit: 3 }
          ]
        }
      }
    ];
    const stats = await Auction.aggregate(pipeline);
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Leaderboard - Most Active Users
analyticsRoutes.get("/most-active-users", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$bidderId",
          bidsPlaced: { $sum: 1 },
          totalBidVolume: { $sum: "$amount" }
        }
      },
      { $sort: { bidsPlaced: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          bidsPlaced: 1,
          totalBidVolume: 1,
          "user.name": 1
        }
      }
    ];
    const leaderboard = await Bid.aggregate(pipeline);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default analyticsRoutes;
