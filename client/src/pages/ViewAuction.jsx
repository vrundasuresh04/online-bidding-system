import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useViewAuction, usePlaceBid } from "../hooks/useAuction.js";
import { useSocket } from "../hooks/useSocket.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import toast from "react-hot-toast";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

export const ViewAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.user?._id;
  const inputRef = useRef();
  const [bidding, setBidding] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data: fetchedData, isLoading } = useViewAuction(id);
  const { mutateAsync: placeBidMutation } = usePlaceBid();
  const { activeUsers, liveAuction, socketError, isConnected } = useSocket(
    id,
    currentUserId,
  );

  const data = liveAuction || fetchedData;
  useDocumentTitle(data?.itemName ? data.itemName : "Auction Details");

  // Live countdown timer — must be called before any early return to satisfy Rules of Hooks
  useEffect(() => {
    if (!data?.itemEndDate) return;
    const updateCountdown = () => {
      const diff = Math.max(0, new Date(data.itemEndDate) - new Date());
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data?.itemEndDate]);

  if (isLoading || !data) return <LoadingScreen />;

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const bidAmount = e.target.bidAmount.value.trim();
    if (!bidAmount) return;

    setBidding(true);
    try {
      await placeBidMutation({ bidAmount: Number(bidAmount), id });
      toast.success("Bid placed successfully!", {
        style: {
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      });
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place bid";
      toast.error(msg, {
        style: {
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      });
    } finally {
      setBidding(false);
    }
  };

  const timeLeft = Math.max(0, new Date(data.itemEndDate) - new Date());
  const isActive = timeLeft > 0;
  const isSeller = data.seller._id === currentUserId;
  const winnerData = data.winner;

  const otherUsers = activeUsers.filter((u) => u.userId !== currentUserId);

  const avatarColors = [
    "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    "bg-rose-500/20 text-rose-300 border-rose-500/30",
    "bg-amber-500/20 text-amber-300 border-amber-500/30",
    "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "bg-violet-500/20 text-violet-300 border-violet-500/30",
    "bg-sky-500/20 text-sky-300 border-sky-500/30",
  ];
  const getAvatarColor = (name) => {
    const hash = (name || "")
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
  };

  const BidHistoryList = () =>
    data.bids.length === 0 ? (
      <div className="py-10 text-center">
        <p className="text-slate-400 text-sm">No bids yet</p>
        <p className="text-slate-500 text-xs mt-1">
          Be the first to place a bid!
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {data.bids.map((bid, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
              index === 0
                ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                : "bg-white/5 border-white/5 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${getAvatarColor(bid.bidder?.name)}`}
              >
                {bid.bidder?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {bid.bidder?.name}
                  {index === 0 && (
                    <span className="text-[10px] font-bold uppercase text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                      Leading
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(bid.bidTime).toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-base font-bold text-white tabular-nums drop-shadow-sm">
              Rs {bid.bidAmount}
            </span>
          </div>
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative">
        {/* Back Button */}
        <button
          onClick={() => {
            if (document.startViewTransition) {
              document.startViewTransition(() => navigate(-1));
            } else {
              navigate(-1);
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left — Image + Bid History */}
          <div className="lg:col-span-7 line-clamp-none">
            <div className="sticky top-24 space-y-6">
              {/* Image */}
              <div className="relative group">
                <div className="aspect-[4/3] glass-panel overflow-hidden border border-white/10 shadow-xl p-2 rounded-[2rem]">
                  <img
                    src={data.itemPhoto || "https://picsum.photos/601"}
                    alt={data.itemName}
                    className="h-full w-full object-cover rounded-3xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/80 via-transparent to-transparent opacity-40 rounded-3xl pointer-events-none"></div>
                </div>
                {/* Floating status badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-4 py-2 rounded-full backdrop-blur-md shadow-lg border uppercase tracking-widest ${
                      isActive
                        ? "bg-emerald-500/80 border-emerald-400/30 text-white"
                        : "bg-rose-500/80 border-rose-400/30 text-white"
                    }`}
                  >
                    {isActive ? "Live Auction" : "Ended"}
                  </span>
                  {isConnected && isActive && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      {activeUsers.length} watching
                    </span>
                  )}
                </div>
              </div>

              {/* Bid History — Desktop */}
              <div className="hidden lg:block glass-panel rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
                  Bid History
                </h3>
                <BidHistoryList />
              </div>
            </div>
          </div>

          {/* Right — Details */}
          <div className="lg:col-span-5 space-y-6 lg:pt-2">
            {/* Title & Category */}
            <div className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-full shadow-sm">
                  {data.itemCategory}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-sm mb-4">
                {data.itemName}
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                {data.itemDescription}
              </p>
            </div>

            {/* Price Card */}
            <div className="glass-panel rounded-3xl overflow-hidden shadow-lg border border-white/5">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
                      Current Bid
                    </p>
                    <p className="text-4xl sm:text-5xl font-extrabold text-white tabular-nums drop-shadow-md">
                      Rs {data.currentPrice}
                    </p>
                    <p className="text-sm font-medium text-slate-400 mt-2">
                      Started at Rs {data.startingPrice}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {data.bids.length} bid{data.bids.length !== 1 && "s"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Left Bar */}
              {isActive ? (
                <div className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-t border-rose-500/20 px-8 py-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-rose-400 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-rose-300 font-bold uppercase tracking-wider">
                        Time remaining
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {countdown.days > 0 && (
                        <div className="flex flex-col items-center">
                          <span className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-lg font-bold w-12 h-12 flex items-center justify-center rounded-xl tabular-nums shadow-inner backdrop-blur-sm">
                            {countdown.days}
                          </span>
                          <span className="text-[10px] text-rose-400/80 font-semibold uppercase mt-1">Days</span>
                        </div>
                      )}
                      <span className="text-rose-500/50 font-bold text-xl mb-4">:</span>
                      <div className="flex flex-col items-center">
                        <span className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-lg font-bold w-12 h-12 flex items-center justify-center rounded-xl tabular-nums shadow-inner backdrop-blur-sm">
                          {String(countdown.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-rose-400/80 font-semibold uppercase mt-1">Hrs</span>
                      </div>
                      <span className="text-rose-500/50 font-bold text-xl mb-4">:</span>
                      <div className="flex flex-col items-center">
                        <span className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-lg font-bold w-12 h-12 flex items-center justify-center rounded-xl tabular-nums shadow-inner backdrop-blur-sm">
                          {String(countdown.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-rose-400/80 font-semibold uppercase mt-1">Min</span>
                      </div>
                      <span className="text-rose-500/50 font-bold text-xl mb-4">:</span>
                      <div className="flex flex-col items-center">
                        <span className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-lg font-bold w-12 h-12 flex items-center justify-center rounded-xl tabular-nums shadow-inner backdrop-blur-sm text-rose-100">
                          {String(countdown.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-rose-400/80 font-semibold uppercase mt-1">Sec</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border-t border-white/5 px-8 py-5 text-center backdrop-blur-sm">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Auction ended
                  </p>
                </div>
              )}
            </div>

            {/* Winner Section */}
            {!isActive && winnerData && (
              <div className="bg-amber-500/10 rounded-3xl border border-amber-500/20 shadow-lg p-6 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/30 shadow-inner">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3l3.057-3L12 3.943 15.943 0 19 3l-7 7-7-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 10v4m0 0l-3 6h6l-3-6z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Winner
                    </p>
                    <p className="text-xl font-extrabold text-white">
                      {winnerData.name}
                    </p>
                  </div>
                </div>
                <p className="text-base text-amber-200/80 relative z-10">
                  Won with a bid of{" "}
                  <span className="font-extrabold text-amber-400 text-lg tabular-nums">Rs {data.currentPrice}</span>
                </p>
                {winnerData._id === currentUserId && (
                  <div className="mt-4 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold px-5 py-3 rounded-xl backdrop-blur-sm shadow-inner text-center relative z-10">
                    🎉 Congratulations! You won this auction!
                  </div>
                )}
              </div>
            )}

            {!isActive && !winnerData && data.bids.length === 0 && (
              <div className="glass-panel rounded-3xl p-6 text-center">
                <p className="text-sm font-medium text-slate-400">
                  This auction ended with no bids.
                </p>
              </div>
            )}

            {/* Bid Form */}
            {!isSeller && isActive && (
              <form
                onSubmit={handleBidSubmit}
                className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden group border border-indigo-500/20 shadow-[0_4px_30px_rgba(99,102,241,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <label
                      htmlFor="bidAmount"
                      className="text-base font-bold text-white flex items-center gap-2"
                    >
                      <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"></span>
                      Place your bid
                    </label>
                    <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      Min Rs {data.currentPrice + 1}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        Rs
                      </span>
                      <input
                        type="number"
                        name="bidAmount"
                        id="bidAmount"
                        ref={inputRef}
                        min={data.currentPrice + 1}
                        className="glass-input w-full !pl-12 !py-3.5 text-lg font-bold tabular-nums"
                        placeholder={String(data.currentPrice + 1)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={bidding}
                      className={`glass-btn !py-3.5 !px-8 text-base ${
                        bidding ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {bidding ? "Bidding..." : "Bid Now"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 font-medium text-center sm:text-left">
                    Place a bid higher than the current price. No maximum limit.
                  </p>
                </div>
              </form>
            )}

            {/* Socket Error */}
            {socketError && (
              <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold px-5 py-3 rounded-xl backdrop-blur-sm text-center">
                {socketError}
              </div>
            )}

            {/* Active Users & Seller flex row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Seller */}
              <div className="glass-panel rounded-3xl p-5 border border-white/5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Seller
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border ${getAvatarColor(data.seller.name)} shadow-inner`}
                  >
                    {data.seller.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      {data.seller.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Auction creator</p>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              {otherUsers.length > 0 && (
                <div className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Also watching
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {otherUsers.slice(0, 3).map((u) => (
                      <div
                        key={u.userId}
                        className="flex items-center gap-1.5 bg-white/5 pl-1.5 pr-2.5 py-1 rounded-full border border-white/10"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${getAvatarColor(u.userName)}`}
                        >
                          {u.userName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[60px]">
                          {u.userName}
                        </span>
                      </div>
                    ))}
                    {otherUsers.length > 3 && (
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white">
                        +{otherUsers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bid History — Mobile */}
        <div className="mt-8 lg:hidden glass-panel rounded-3xl p-6">
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block"></span>
            Bid History
          </h3>
          <BidHistoryList />
        </div>
      </div>
    </div>
  );
};
