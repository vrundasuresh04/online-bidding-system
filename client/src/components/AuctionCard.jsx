import { Link } from "react-router";
import { usePrefetchHandlers } from "../hooks/useAuction.js";

export default function AuctionCard({ auction }) {
  console.log(auction);
  const daysLeft = Math.ceil(auction.timeLeft / (1000 * 60 * 60 * 24));
  const isActive = daysLeft > 0;
  const { prefetchAuction } = usePrefetchHandlers();

  return (
    <Link
      to={`/auction/${auction._id}`}
      viewTransition
      onMouseEnter={() => prefetchAuction(auction._id)}
      className="group block w-full glass-panel rounded-2xl hover-lift overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-900/50">
        <img
          src={auction.itemPhoto || "https://picsum.photos/300"}
          alt={auction.itemName}
          className="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white bg-indigo-500/80 backdrop-blur-md border border-indigo-400/30 px-3 py-1.5 rounded-full shadow-lg">
            {auction.itemCategory}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border ${
              isActive
                ? "bg-emerald-500/80 border-emerald-400/30 text-white"
                : "bg-rose-500/80 border-rose-400/30 text-white"
            }`}
          >
            {isActive ? `${daysLeft}d left` : "Ended"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 relative">
        <h3 className="font-bold text-base text-white mb-1.5 line-clamp-1 group-hover:text-indigo-400 transition-colors duration-300 drop-shadow-sm">
          {auction.itemName}
        </h3>
        <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed h-8">
          {auction.itemDescription}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
              Current Bid
            </p>
            <p className="text-xl font-extrabold text-white tabular-nums drop-shadow-sm">
              Rs {auction.currentPrice || auction.startingPrice}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <svg
                className="w-3.5 h-3.5"
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
              {auction.bidsCount} bids
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <span className="text-[10px] text-indigo-300 font-bold">
                {(auction?.sellerName || auction?.seller?.name)?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400 truncate max-w-[100px]">
               {auction?.sellerName || auction?.seller?.name || "Unknown"}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-300">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
