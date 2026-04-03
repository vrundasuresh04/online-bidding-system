import React from "react";
import { Link } from "react-router";

export const CTA = () => {
  return (
    <section className="relative py-20 sm:py-28 z-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 sm:p-20 text-center glass-panel shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)] border border-indigo-500/30">
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
              Ready to Start Bidding?
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community today and discover amazing deals or turn your items
              into cash. The premium experience is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/signup"
                className="glass-btn !px-8 !py-4 text-lg items-center inline-flex shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                Create Free Account
              </Link>
              <Link
                to="/auction"
                className="glass-btn-outline !px-8 !py-4 text-lg items-center inline-flex"
              >
                Explore Auctions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
