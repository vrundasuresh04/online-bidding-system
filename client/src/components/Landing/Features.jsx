import React from "react";
import { FaClock, FaGavel, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaGavel className="text-2xl text-indigo-400" />,
    bg: "bg-indigo-500/20 border-indigo-500/30",
    title: "Easy Bidding",
    desc: "Place bids with confidence using our intuitive interface. Track your bids and get real-time updates.",
  },
  {
    icon: <FaShieldAlt className="text-2xl text-emerald-400" />,
    bg: "bg-emerald-500/20 border-emerald-500/30",
    title: "Secure & Trusted",
    desc: "Your transactions are protected with industry-standard security. Buy and sell with peace of mind.",
  },
  {
    icon: <FaClock className="text-2xl text-amber-400" />,
    bg: "bg-amber-500/20 border-amber-500/30",
    title: "24/7 Auctions",
    desc: "Never miss an opportunity. Our platform runs around the clock so you can bid whenever you want.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-3">
            Why choose us
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
            Built for Buyers & Sellers
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need for a seamless and premium auction experience, all in one
            place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative glass-panel rounded-3xl p-8 shadow-lg hover-lift transition-all group overflow-hidden border border-white/5"
            >
              {/* Subtle Glow Overlay */}
              <div className="absolute -inset-2 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10">
                <div
                  className={`${f.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-inner transition-transform group-hover:scale-110 duration-500`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-base leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
