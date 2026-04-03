import React from "react";
import { Link } from "react-router";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Background accents */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 backdrop-blur-md text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live auctions happening now
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8 drop-shadow-lg">
            Bid, Win &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 drop-shadow-sm">
              Sell Online
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover unique items, place competitive bids, and sell your
            treasures to a global audience. The premium marketplace trusted by thousands.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/signup"
              className="glass-btn !px-8 !py-4 text-lg items-center inline-flex"
            >
              Get Started Free
              <svg
                className="w-5 h-5 ml-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              to="/login"
              className="glass-btn-outline !px-8 !py-4 text-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Free to join
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Real-time bidding
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
              <svg
                className="w-4 h-4 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payments
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
