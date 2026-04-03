import { Link } from "react-router";
import { RiAuctionLine } from "react-icons/ri";

export const Footer = () => {
  return (
      <footer className="relative border-t border-white/5 bg-[#0b0f19] pt-16 pb-8 overflow-hidden z-20">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <RiAuctionLine className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
                  Online <span className="text-gradient">Auction</span>
                </span>
              </Link>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Premium bidding platform connecting buyers and sellers worldwide with real-time auctions and elegant experiences.
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <h4 className="text-white font-semibold tracking-wide uppercase text-sm">Quick Links</h4>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-300">Home</Link>
                <Link to="/auction" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-300">Browse Auctions</Link>
                <Link to="/login" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-300">Login</Link>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end space-y-4">
              <h4 className="text-white font-semibold tracking-wide uppercase text-sm">Connect</h4>
              <div className="flex flex-col space-y-2 items-center md:items-end">
                <p className="text-slate-500 text-sm mt-4 tracking-wide">
                  © {new Date().getFullYear()} Online Auction. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};
