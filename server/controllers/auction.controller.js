import getImageUrl from "../services/cloudinaryService.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import BidLog from "../models/bidLog.model.js";
import Notification from "../models/notification.model.js";
import AuctionExtension from "../models/auctionExtension.model.js";
import mongoose from "mongoose";
import { getIO } from "../socket/index.js";

// Helper to map an Auction + Bids to the format the frontend currently expects
const formatAuctionForFrontend = (auction, bids = []) => {
  return {
    _id: auction._id,
    itemName: auction.title,
    itemDescription: auction.description,
    itemCategory: "General", // Placeholder for categories feature
    itemPhoto: auction.images && auction.images[0] ? auction.images[0] : "",
    startingPrice: auction.startingPrice,
    currentPrice: auction.currentPrice,
    itemStartDate: auction.startDate,
    itemEndDate: auction.endDate,
    seller: auction.seller,
    winner: auction.winner,
    isSold: auction.isSold,
    bids: bids.map(b => ({
      bidder: b.bidderId,
      bidAmount: b.amount,
      bidTime: b.createdAt
    }))
  };
};

export const createAuction = async (req, res) => {
  try {
    const {
      itemName,
      startingPrice,
      itemDescription,
      itemCategory,
      itemStartDate,
      itemEndDate,
    } = req.body;
    let imageUrl = "";

    if (req.file) {
      try {
        imageUrl = getImageUrl(req.file);
      } catch (error) {
        return res.status(500).json({
          message: "Error uploading image to Cloudinary",
          error: error.message,
        });
      }
    }

    const start = itemStartDate ? new Date(itemStartDate) : new Date();
    const end = new Date(itemEndDate);
    if (end <= start) {
      return res.status(400).json({ message: "Auction end date must be after start date" });
    }

    const newAuction = new Auction({
      title: itemName,
      description: itemDescription,
      startingPrice,
      currentPrice: startingPrice,
      images: imageUrl ? [imageUrl] : [],
      startDate: start,
      endDate: end,
      seller: req.user.id,
      status: "active",
    });
    
    await newAuction.save();

    res.status(201).json({ message: "Auction created successfully", newAuction });
  } catch (error) {
    res.status(500).json({ message: "Error creating auction", error: error.message });
  }
};

export const showAuction = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const total = await Auction.countDocuments({ endDate: { $gt: new Date() }, status: "active" });

    // Advanced Aggregation Pipeline with $lookup joins (Interview level)
    const pipeline = [
      { $match: { endDate: { $gt: new Date() }, status: "active" } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        // Join with Users collection to get seller profile
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "sellerDetails"
        }
      },
      { $unwind: "$sellerDetails" },
      {
        // Project EXACTLY what the UI expects, preventing over-fetching
        $project: {
          _id: 1,
          itemName: "$title",
          itemDescription: "$description",
          currentPrice: 1,
          bidsCount: "$totalBids",
          itemEndDate: "$endDate",
          itemCategory: { $literal: "General" },
          itemPhoto: { $arrayElemAt: ["$images", 0] },
          sellerName: "$sellerDetails.name",
        }
      }
    ];

    const auctions = await Auction.aggregate(pipeline);

    // Minor formatting map for the UI `timeLeft` calculations which happen client-side ideally,
    // but the UI currently expects `timeLeft` to be injected
    const formatted = auctions.map((item) => ({
      ...item,
      timeLeft: Math.max(0, new Date(item.itemEndDate) - new Date()),
    }));

    res.status(200).json({
      auctions: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
};

export const auctionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const auction = await Auction.findById(id)
      .populate("seller", "name")
      .populate("winner", "name");

    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Fetch related bids from separated collection (NoSQL 1-to-many technique)
    let bids = await Bid.find({ auctionId: id })
      .sort({ amount: -1 })
      .populate("bidderId", "name");

    const isExpired = new Date(auction.endDate) < new Date();
    
    // Auto-set winner if auction is expired 
    if (isExpired && !auction.winner && bids.length > 0) {
      const highestBid = bids[0];
      auction.winner = highestBid.bidderId._id;
      auction.isSold = true;
      auction.status = "ended";
      await auction.save();
      await auction.populate("winner", "name");
    }

    if (isExpired) {
      const userId = req.user.id;
      const isSeller = auction.seller._id.toString() === userId;
      const isBidder = bids.some(b => b.bidderId._id.toString() === userId);
      if (!isSeller && !isBidder) {
        return res.status(403).json({ message: "This auction has ended" });
      }
    }

    const payload = formatAuctionForFrontend(auction, bids);
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
};

export const placeBid = async (req, res) => {
  // Graceful fallback for local Standalone MongoDB (interview demonstration feature)
  const isReplicaSet = process.env.MONGO_URL?.includes("replicaSet") || process.env.MONGO_URL?.includes("mongodb+srv");
  let session = null;
  
  if (isReplicaSet) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const bidAmount = Number(req.body.bidAmount);
    const userId = req.user.id;
    const { id: auctionId } = req.params;

    if (isNaN(bidAmount)) throw new Error("Invalid bid amount");

    // Lock the auction document within the transaction
    const auction = isReplicaSet 
      ? await Auction.findById(auctionId).session(session)
      : await Auction.findById(auctionId);
    if (!auction) throw new Error("Auction not found");

    if (auction.seller.toString() === userId) {
      throw new Error("You cannot bid on your own auction");
    }

    if (new Date(auction.endDate) < new Date() || auction.status !== 'active') {
      throw new Error("Auction has already ended");
    }

    // Bid validation logic
    const minBid = Math.max(auction.currentPrice, auction.startingPrice) + 1;
    if (bidAmount < minBid) {
      throw new Error(`Bid must be at least Rs ${minBid}`);
    }

    // Capture highest previous bid for logging/notifications
    const previousHighestBidQuery = Bid.findOne({ 
      auctionId, status: "active" 
    }).sort({ amount: -1 });
    const previousHighestBid = isReplicaSet 
      ? await previousHighestBidQuery.session(session) 
      : await previousHighestBidQuery;

    // 1. Update all existing bids to 'outbid'
    await Bid.updateMany(
      { auctionId, status: "active" },
      { $set: { status: "outbid" } },
      isReplicaSet ? { session } : undefined
    );

    // 2. Insert the new winning bid
    const newBid = new Bid({
      auctionId,
      bidderId: userId,
      amount: bidAmount,
      ipAddress: req.ip
    });
    await newBid.save(isReplicaSet ? { session } : undefined);

    // 3. Write immutable audit log
    const bidLog = new BidLog({
      auctionId,
      bidderId: userId,
      amount: bidAmount,
      previousPrice: auction.currentPrice,
      priceDelta: bidAmount - auction.currentPrice,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    await bidLog.save(isReplicaSet ? { session } : undefined);

    // 4. Create Notification for the outbid user
    if (previousHighestBid && previousHighestBid.bidderId.toString() !== userId) {
      const notification = new Notification({
        userId: previousHighestBid.bidderId,
        type: "outbid",
        payload: {
          auctionId,
          auctionTitle: auction.title,
          outbidAmount: bidAmount,
        }
      });
      await notification.save(isReplicaSet ? { session } : undefined);
    }

    // 5. Advanced Component: Anti-Sniping Feature
    // Overtime rule: Any bid in the last 5 minutes extends the auction by 5 min
    const msRemaining = new Date(auction.endDate).getTime() - Date.now();
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    
    if (msRemaining > 0 && msRemaining < FIVE_MINUTES_MS) {
      auction.endDate = new Date(Date.now() + FIVE_MINUTES_MS);
      auction.extensionCount += 1;
      auction.lastExtendedAt = new Date();
      
      const extensionRecord = new AuctionExtension({
        auctionId,
        triggeredBy: userId,
        originalEndDate: new Date(auction.endDate.getTime() - FIVE_MINUTES_MS),
        newEndDate: auction.endDate,
        extendedByMs: FIVE_MINUTES_MS
      });
      await extensionRecord.save(isReplicaSet ? { session } : undefined);
    }

    // 6. Finalize auction updates
    auction.currentPrice = bidAmount;
    auction.totalBids += 1;
    await auction.save(isReplicaSet ? { session } : undefined);

    // Commit Transaction atomically
    await session.commitTransaction();
    session.endSession();

    // -- Post-Transaction Formatting for UI --
    const populatedAuction = await Auction.findById(auctionId).populate("seller", "name");
    const allBids = await Bid.find({ auctionId }).sort({ amount: -1 }).populate("bidderId", "name");
    const payload = formatAuctionForFrontend(populatedAuction, allBids);

    // Broadcast to sockets
    try {
      const io = getIO();
      const bidderName = allBids.find(b => b.bidderId._id.toString() === userId)?.bidderId?.name || "Someone";
      io.to(auctionId).emit("auction:bidPlaced", {
        auction: payload,
        bidderName,
        bidderId: userId,
        bidAmount,
      });
    } catch (sockErr) {
      console.error("Socket error mapping post-bid:", sockErr);
    }

    res.status(200).json({ message: "Bid placed successfully", auction: payload });
  } catch (error) {
    if (isReplicaSet && session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Bid Debug Error:", error);
    res.status(error.message.includes("must be") || error.message.includes("ended") ? 400 : 500)
       .json({ message: error.message });
  }
};

export const dashboardData = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const dateNow = new Date();
    
    // Complex Faceted Aggregation Pipeline for fast parallel aggregation computation
    const stats = await Auction.aggregate([
      {
        $facet: {
          totalAuctions: [{ $count: "count" }],
          userAuctionCount: [
            { $match: { seller: userObjectId } },
            { $count: "count" },
          ],
          activeAuctions: [
            {
              $match: {
                status: "active",
                endDate: { $gte: dateNow },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const totalAuctions = stats[0].totalAuctions[0]?.count || 0;
    const userAuctionCount = stats[0].userAuctionCount[0]?.count || 0;
    const activeAuctions = stats[0].activeAuctions[0]?.count || 0;

    // Helper aggregation to fetch and map preview items
    const getPreviewAuctions = async (matchQuery) => {
      return await Auction.aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $limit: 4 },
        { $lookup: { from: "users", localField: "seller", foreignField: "_id", as: "sellerDetails" } },
        { $unwind: "$sellerDetails" },
        {
          $project: {
            _id: 1,
            itemName: "$title",
            itemDescription: "$description",
            currentPrice: 1,
            bidsCount: "$totalBids",
            itemEndDate: "$endDate",
            itemCategory: { $literal: "General" },
            itemPhoto: { $arrayElemAt: ["$images", 0] },
            sellerName: "$sellerDetails.name",
          }
        }
      ]);
    };

    const latestAuctions = await getPreviewAuctions({ endDate: { $gt: dateNow }, status: "active" });
    const latestUserAuctions = await getPreviewAuctions({ seller: userObjectId });

    return res.status(200).json({
      totalAuctions,
      userAuctionCount,
      activeAuctions,
      latestAuctions: latestAuctions.map(a => ({ ...a, timeLeft: Math.max(0, new Date(a.itemEndDate) - new Date()) })),
      latestUserAuctions: latestUserAuctions.map(a => ({ ...a, timeLeft: Math.max(0, new Date(a.itemEndDate) - new Date()) })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting dashboard data", error: error.message });
  }
};

export const myAuction = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { seller: new mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: "users", localField: "seller", foreignField: "_id", as: "sellerDetails" } },
      { $unwind: "$sellerDetails" },
      {
        $project: {
          _id: 1,
          itemName: "$title",
          itemDescription: "$description",
          currentPrice: 1,
          bidsCount: "$totalBids",
          itemEndDate: "$endDate",
          itemCategory: { $literal: "General" },
          itemPhoto: { $arrayElemAt: ["$images", 0] },
          sellerName: "$sellerDetails.name",
        }
      }
    ];

    const auctions = await Auction.aggregate(pipeline);
    const total = await Auction.countDocuments({ seller: req.user.id });

    const formatted = auctions.map((item) => ({
      ...item,
      timeLeft: Math.max(0, new Date(item.itemEndDate) - new Date()),
    }));

    res.status(200).json({
      auctions: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching auctions", error: error.message });
  }
};

export const myBids = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Advanced Aggregation: 
    // Join from distinct Bids collection -> group by Auction -> shape like the classic Auction feed
    const myBidsPipeline = [
      { $match: { bidderId: userId } },
      {
        $group: {
           // Distinct auctions I bid on
           _id: "$auctionId",
        }
      },
      {
        $lookup: {
          from: "auctions",
          localField: "_id",
          foreignField: "_id",
          as: "auctionData"
        }
      },
      { $unwind: "$auctionData" },
      { $sort: { "auctionData.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "auctionData.seller",
          foreignField: "_id",
          as: "sellerDetails"
        }
      },
      { $unwind: "$sellerDetails" },
      // Optional winner lookup
      {
        $lookup: {
          from: "users",
          localField: "auctionData.winner",
          foreignField: "_id",
          as: "winnerDetails"
        }
      },
      {
        $project: {
          _id: "$auctionData._id",
          itemName: "$auctionData.title",
          itemDescription: "$auctionData.description",
          currentPrice: "$auctionData.currentPrice",
          bidsCount: "$auctionData.totalBids",
          itemEndDate: "$auctionData.endDate",
          itemCategory: { $literal: "General" },
          itemPhoto: { $arrayElemAt: ["$auctionData.images", 0] },
          sellerName: "$sellerDetails.name",
          isSold: "$auctionData.isSold",
          winner: { $arrayElemAt: ["$winnerDetails", 0] }
        }
      }
    ];

    const auctionsResult = await Bid.aggregate(myBidsPipeline);
    
    // Aggregation for total unique auctions bid on
    const uniqueAuctionsCount = await Bid.aggregate([
      { $match: { bidderId: userId } },
      { $group: { _id: "$auctionId" } },
      { $count: "total" }
    ]);
    const total = uniqueAuctionsCount.length > 0 ? uniqueAuctionsCount[0].total : 0;

    const formatted = auctionsResult.map((item) => {
      const isExpired = new Date(item.itemEndDate) < new Date();
      return {
        ...item,
        timeLeft: Math.max(0, new Date(item.itemEndDate) - new Date()),
        isExpired,
        winner: item.winner ? { _id: item.winner._id, name: item.winner.name } : null,
      };
    });

    res.status(200).json({
      auctions: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching my bids", error: error.message });
  }
};
