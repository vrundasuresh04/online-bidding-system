# Server & Database Architecture

This document provides an exhaustive, modernized tear-down of the Backend infrastructure for the Online Auction System. The previous "Product-embedded array" model is obsolete. This guide reflects the current, highly-normalized production design.

## 🚀 Server Framework & App Lifecycle

The backend is built as a highly robust **Express.js (v5)** REST API wrapped around a **Node.js** runtime, complemented by a persistent **Socket.IO** server.

### Server Lifecycle (`server.js`)
It implements an advanced **Graceful Shutdown** orchestration pattern:
- The server captures hardware signals (`SIGINT`, `SIGTERM`) and software crashes (`uncaughtException`, `unhandledRejection`).
- When triggered, it stops accepting new HTTP connections immediately.
- It guarantees up to 10 seconds to forcefully conclude ongoing WebSocket threads before issuing a clean `disconnectDB()` command. This safeguards against corrupted database writes during restarts or deployments.
- **Serverless Fallback:** `app.js` checks for `process.env.VERCEL`. If active, it seamlessly connects to the database "per-request," ignoring persistent connection setups.

---

## 🗄️ Master Database Schema (Mongoose)

The codebase has transitioned from a monolithic `Product` schema to a deeply normalized **13-Model Ecosystem**, heavily relying on Mongoose.

### The Core Entity Shift
1. **`auction.model.js` (Replaces Product):** Instead of storing bids in an array, it only stores metadata (`title`, `description`, `startingPrice`, `currentPrice`, `extensionCount`), effectively ensuring document size limits are never reached.
2. **`bid.model.js`:** The explicit tracking of every bid object independently. Links back to the auction via an `auctionId` foreign-key.

### Enterprise Features (The New Core)
The system injects features usually reserved for enterprise bidding platforms:

| Model | Purpose & Function |
|-------|--------------------|
| **`bidLog.model.js`** | **Immutable Audit Trail:** Logs the exact `priceDelta` (how much the bid increased by), along with the bidder's `ipAddress` and `userAgent`. |
| **`auctionExtension.model.js`** | **Anti-Sniping Engine:** Hardcodes the rules where bids placed in the final 5 minutes trigger a hard +5 minute bump to the `endDate` field of the parent auction. |
| **`notification.model.js`** | **Automated Alerts:** Generates distinct `"outbid"` notification objects triggered by competing actors. |
| **`login.model.js`** | **Self-Deleting Audit:** Utilizes native MongoDB TTL Indexes (`expires: 15778463`). After 6 months, old login hashes aggressively delete themselves from the database without server intervention. |

---

## ⚡ Controller Logic & Transaction Safeties

The most critical path of the software operates inside `auction.controller.js`.

### The `placeBid` Transaction Engine
When thousands of users bid concurrently, Data Integrity is the only priority.
1. **Network Type Detection:** The system detects if it is connected to a MongoDB Replica Set (`mongodb+srv`).
2. **ACID Transactions:** If running on a cluster, the `placeBid` function instantly initiates a `mongoose.startSession()`.
3. **Atomic Safety:** It locks the relevant `Auction` natively, rejects outbids, inserts the active `Bid`, commits a newly minted `BidLog`, deletes the previous user's winning placeholder, constructs an `outbid` `Notification`, and extends the `auctionExtension` timer if applicable.
4. **Commit/Abort:** It issues a rigid `session.commitTransaction()`. If *any* of the 5 operations fail, it issues an `abortTransaction()`—effectively rewinding time and restoring database state, preventing phantom bids or locked money.

---

## 📊 Analytics Pipelines (`analytics.routes.js`)

You have circumvented basic looping in Node in favor of running math natively on the MongoDB cluster.
- Using aggregation pipelines containing `$facet` and `$lookup`, the server can instantly synthesize Global Platform values (how much money the site has transacted) or a ranking Leaderboard of the most active users, executing in mere milliseconds without overloading local server memory.

---

## 📡 WebSockets: The Real-Time Engine

The **Socket.IO** `server/socket/index.js` file handles live events, operating under strict security protocols:

1. **JWT Verification Layer:** A user cannot simply connect to your socket port. The server intercepts the WebSocket handshake. If the connection lacks an `auth_token` HTTP cookie that matches a valid User in the DB, it strictly forces `socket.disconnect(true)`.
2. **Room Architecture:** Each socket is bound manually only to its matching string (`auctionId`).
3. **Optimistic Broadcasting:** Following a committed database Transaction, the HTTP Request thread instructs the Socket thread to emit `auction:bidPlaced`, blasting the new highest price to every other user concurrently viewing the page almost instantly.
