# Frontend Client Architecture

This document provides a highly detailed breakdown of the React-based frontend client for the Online Auction System. It is designed to help new developers understand the core abstractions, state management, and real-time connectivity patterns used throughout the user interface.

## ⚛️ Tech Stack & Core Framework

- **Framework:** React 19 (Single Page Application)
- **Build Tool:** Vite (v6)
- **Styling:** TailwindCSS 4 (Utility-first CSS)
- **Routing:** React Router v7 (Data Router API)
- **State Management:** Hybrid (Redux Toolkit + React Query)
- **WebSockets:** Socket.io-client (v4)
- **Notifications:** React Hot Toast

---

## 🧠 Hybrid State Management Strategy

The client employs a **Hybrid State Architecture** to prevent unnecessary re-renders during high-frequency real-time events (like active bidding). State is strictly divided between global UI state and server-side data cache.

### 1. Global User State (Redux Toolkit)
Located in `src/store/`. Redux is **only** used for application-critical synchronous data—specifically Authentication (`authSlice`). 
- It tracks `isAuthenticated`, `user` (name, avatar, role), and `loading` states.
- Because the entire application's routing depends on knowing if the user is an admin or a regular user, Redux acts as the single, synchronous source of truth.

### 2. Server Data State (React Query)
Located in `src/hooks/useAuction.js` and others. `@tanstack/react-query` handles all asynchronous data fetching, caching, and mutation.
- **Cache Keys:** Data is strictly cached against unique keys like `["auctions", page]` or `["dashboardStats"]`.
- **Automatic Invalidation:** When the `usePlaceBid` mutation successfully places a bid via the API, React Query forces silent background refetches on the affected keys (`["auction"]`, `["auctions"]`), seamlessly updating the UI without a hard page reload.
- **Instant Navigation (Prefetching):** The `usePrefetchHandlers` hook exposes functions to preload data explicitly. When a user hovers over an auction card, the app prefetches the auction details, making the actual click navigation feel instantaneous.

---

## 📡 Real-Time Bidding Interface (WebSockets)

Instead of mixing Socket.IO logic directly inside React UI components, the real-time engine is cleanly abstracted into the `useSocket(auctionId, userId)` hook.

**How `useSocket` works:**
1. **Singleton Connection:** It imports the active Socket.IO instance. If it isn't connected, it bridges the connection across instances.
2. **Room Registration:** It emits `auction:join` with the `auctionId` to subscribe to the specific WebSocket room.
3. **Event Listening:** It listens for continuous background events: `auction:bidPlaced`, `auction:userJoined`, and `auction:userLeft`.
4. **Smart Notifications:** The hook strategically evaluates `userId !== currentUserId` to ensure toast popups only trigger when *other* people bid or join the room, preventing UX fatigue for the active bidder.
5. **Auto Cleanup:** It emits `auction:leave` automatically when the component unmounts to free up server overhead.

---

## 🗺️ Routing & Security Guards

Routes are defined in `src/routers/` and injected into `src/main.jsx` using `createBrowserRouter`.

| Route Group | File | Description & Guard Rules |
|-------------|------|---------------------------|
| **Public** | `openRoutes.jsx` | Open to everyone. Includes Landing, Login, Signup, and Legal pages. |
| **Protected** | `protectedRoutes.jsx` | Encapsulated in a layout that checks the Redux Auth state (via `InitAuth` wrapper). Redirects unauthenticated users to `/login`. |
| **Admin** | `adminRouter.jsx` | High-security routes. Explicitly checks if `user.role === 'admin'` before allowing the layout to render. |

---

## 🧱 Component & Service Architecture

The frontend strictly adheres to the principle of **Separation of Concerns**. UI components never communicate directly with the backend.

### The Data Flow Pattern:
1. **UI Component** (`ViewAuction.jsx`) triggers an action (e.g., clicking 'Place Bid').
2. **Custom Hook** (`usePlaceBid` from `useAuction.js`) intercepts the action, manages loading and error states, and calls the service.
3. **Service Layer** (`auction.service.js`) formats the payload and executes the Axios request.
4. **API Instance** (`api.js`) handles the underlying HTTP request, securely attaching the JWT HTTP-only cookies securely to the backend payload.

### Key Directories:
- `src/components/`: Reusable, generic UI blocks (e.g., `AuctionCard.jsx`, `DialogBox.jsx`, `AdsComponent.jsx`).
- `src/layout/`: Page wrappers that manage Navigation bars, Footer rendering, and layout alignment.
- `src/pages/`: Massive route-level components where business logic meets UI layout framework.
- `src/services//:` Pure JavaScript functions wrapping backend API paths, cleanly decoupled from UI lifecycles.
