import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import mongoose from "mongoose";

// Track users in auction rooms: { auctionId: Map<socketId, { userId, userName }> }
const auctionRooms = new Map();

export const registerAuctionHandlers = (io, socket) => {
  // Use verified identity from socket auth middleware
  const userId = socket.user.id;
  const userName = socket.user.name;

  // Join auction room
  socket.on("auction:join", ({ auctionId }) => {
    if (!auctionId) return;

    socket.join(auctionId);

    if (!auctionRooms.has(auctionId)) {
      auctionRooms.set(auctionId, new Map());
    }

    const room = auctionRooms.get(auctionId);
    room.set(socket.id, { userId, userName });

    // Broadcast to all users in room
    io.to(auctionId).emit("auction:userJoined", {
      userName,
      userId,
      activeUsers: getActiveUsers(auctionId),
    });

    console.log(`${userName} joined auction: ${auctionId}`);
  });

  // Leave auction room
  socket.on("auction:leave", ({ auctionId }) => {
    handleLeaveAuction(io, socket, auctionId);
  });

  // Place bid via socket — uses authenticated userId, not client-supplied
  socket.on("auction:bid", async ({ auctionId, bidAmount }) => {
    try {
      if (!auctionId || bidAmount == null) return;

      // Coerce to number to prevent string comparison bugs
      const amount = Number(bidAmount);
      if (isNaN(amount)) {
        socket.emit("auction:error", { message: "Invalid bid amount" });
        return;
      }

      // Graceful local standalone fallback for transactions
      const isReplicaSet = process.env.MONGO_URL?.includes("replicaSet") || process.env.MONGO_URL?.includes("mongodb+srv");
      let session = null;
      if (isReplicaSet) {
        session = await mongoose.startSession();
        session.startTransaction();
      }
      
      let updatedAuction;

      try {
        const auction = isReplicaSet 
          ? await Auction.findById(auctionId).session(session)
          : await Auction.findById(auctionId);
        if (!auction) throw new Error("Auction not found");
        if (new Date(auction.endDate) < new Date() || auction.status !== 'active') {
          throw new Error("Auction has already ended");
        }
        if (auction.seller.toString() === userId) {
          throw new Error("You cannot bid on your own auction");
        }
        
        const minBid = Math.max(auction.currentPrice, auction.startingPrice) + 1;
        if (amount < minBid) {
          throw new Error(`Bid must be at least Rs ${minBid}`);
        }

        // 1. Update previous active bids to outbid
        await Bid.updateMany(
          { auctionId, status: "active" },
          { $set: { status: "outbid" } },
          isReplicaSet ? { session } : undefined
        );

        // 2. Insert new bid
        const newBid = new Bid({
          auctionId,
          bidderId: userId,
          amount,
        });
        await newBid.save(isReplicaSet ? { session } : undefined);

        // 3. Update auction
        // Anti-sniping: extend by 5 minutes if bid is placed within last 5 mins
        const timeRemainingMs = new Date(auction.endDate).getTime() - Date.now();
        let newEndDate = auction.endDate;
        if (timeRemainingMs < 5 * 60 * 1000 && timeRemainingMs > 0) {
          newEndDate = new Date(Date.now() + 5 * 60 * 1000);
          auction.extensionCount += 1;
          auction.lastExtendedAt = new Date();
        }

        auction.currentPrice = amount;
        auction.endDate = newEndDate;
        auction.totalBids += 1;
        await auction.save(isReplicaSet ? { session } : undefined);

        if (isReplicaSet) {
          await session.commitTransaction();
          session.endSession();
        }
        
        updatedAuction = auction;
      } catch (err) {
        if (isReplicaSet && session) {
          await session.abortTransaction();
          session.endSession();
        }
        socket.emit("auction:error", { message: err.message || "Bid failed" });
        return;
      }

      // We fetch frontend-styled populates separately after transaction
      const populatedAuction = await Auction.findById(auctionId).populate("seller", "name");
      const bids = await Bid.find({ auctionId }).sort({ amount: -1 }).populate("bidderId", "name");
      
      const mappedAuction = {
        _id: populatedAuction._id,
        itemName: populatedAuction.title,
        currentPrice: populatedAuction.currentPrice,
        itemEndDate: populatedAuction.endDate,
        seller: populatedAuction.seller,
        bids: bids.map(b => ({
          bidder: { _id: b.bidderId._id, name: b.bidderId.name },
          bidAmount: b.amount,
          bidTime: b.createdAt
        }))
      };

      // Broadcast updated auction data to all users in the room
      io.to(auctionId).emit("auction:bidPlaced", {
        auction: mappedAuction,
        bidderName: userName,
        bidAmount: amount,
        message: `${userName} placed a bid of Rs ${amount}`,
      });
    } catch (error) {
      console.error("Socket bid error:", error.message);
      socket.emit("auction:error", {
        message: "Error placing bid",
      });
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    cleanupSocket(io, socket);
  });
};

const handleLeaveAuction = (io, socket, auctionId) => {
  if (!auctionId || !auctionRooms.has(auctionId)) return;

  const room = auctionRooms.get(auctionId);
  const userData = room.get(socket.id);

  if (userData) {
    room.delete(socket.id);

    // Remove empty rooms
    if (room.size === 0) {
      auctionRooms.delete(auctionId);
    }

    socket.leave(auctionId);

    io.to(auctionId).emit("auction:userLeft", {
      userName: userData.userName,
      userId: userData.userId,
      activeUsers: getActiveUsers(auctionId),
    });

    console.log(`${userData.userName} left auction: ${auctionId}`);
  }
};

const cleanupSocket = (io, socket) => {
  for (const [auctionId, room] of auctionRooms.entries()) {
    if (room.has(socket.id)) {
      handleLeaveAuction(io, socket, auctionId);
    }
  }
};

const getActiveUsers = (auctionId) => {
  const room = auctionRooms.get(auctionId);
  if (!room) return [];

  const users = [];
  const seen = new Set();

  for (const { userId, userName } of room.values()) {
    if (!seen.has(userId)) {
      seen.add(userId);
      users.push({ userId, userName });
    }
  }

  return users;
};
