import { FaClock, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router";

const auctions = [
  {
    img: "https://res.cloudinary.com/dhv8qx1qy/image/upload/v1750644725/miekytfqgwnlj4jqai5k.png",
    title: "Vintage Film Camera - Excellent Condition",
    price: "$245.00",
    bids: 12,
    time: "2h 15m",
    color: "bg-rose-500/80 border-rose-400/30",
  },
  {
    img: "https://res.cloudinary.com/dhv8qx1qy/image/upload/v1750644637/lk7l3ar3sptniptieyo3.png",
    title: "Luxury Swiss Watch - Gold Plated",
    price: "$1,250.00",
    bids: 28,
    time: "5h 42m",
    color: "bg-amber-500/80 border-amber-400/30",
  },
  {
    img: "https://res.cloudinary.com/dhv8qx1qy/image/upload/v1750644675/tatznfsoekfp3vsoeswd.png",
    title: "Original Oil Painting - Abstract Art",
    price: "$890.00",
    bids: 7,
    time: "1d 3h",
    color: "bg-emerald-500/80 border-emerald-400/30",
  },
];

export const Auction = () => {
  return (
    <section className="py-20 sm:py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Trending
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
              Live Auctions
            </h2>
          </div>
          <Link
            to="/signup"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            View all <FaChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {auctions.map((item) => (
            <Link
              key={item.title}
              to="/signup"
              className="group block w-full glass-panel rounded-2xl hover-lift overflow-hidden"
            >
              <div className="relative aspect-[3/2] bg-slate-900/50 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-[1.05] transition-transform duration-500 p-4"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`${item.color} backdrop-blur-md border text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg inline-flex items-center gap-1.5`}
                  >
                    <FaClock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base text-white mb-4 line-clamp-1 group-hover:text-indigo-400 transition-colors duration-300 drop-shadow-sm">
                  {item.title}
                </h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                      Current Bid
                    </p>
                    <p className="text-xl font-extrabold text-white tabular-nums drop-shadow-sm">
                      {item.price}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    {item.bids} bids
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link to="/signup" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            View all auctions &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};
