import AuctionCard from "../components/AuctionCard.jsx";
import { Link } from "react-router";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useDashboardStats } from "../hooks/useAuction.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

const statConfig = [
  {
    key: "totalAuctions",
    label: "Total Auctions",
    color: "text-slate-100",
    bg: "bg-slate-700/50",
    icon: (
      <svg
        className="w-6 h-6 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    key: "activeAuctions",
    label: "Active Now",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    icon: (
      <svg
        className="w-6 h-6 text-emerald-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    key: "userAuctionCount",
    label: "Your Listings",
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
    icon: (
      <svg
        className="w-6 h-6 text-indigo-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">Dashboard</h1>
            <p className="text-slate-400 mt-2 text-lg">
              Overview of marketplace activity
            </p>
          </div>
          <Link
            to="/create"
            className="hidden sm:inline-flex glass-btn !py-2.5 !px-5 gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Auction
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {statConfig.map((stat) => (
            <div
              key={stat.key}
              className="glass-panel p-6 flex items-center gap-5 hover-lift"
            >
              <div className={`${stat.bg} p-4 rounded-2xl shadow-inner border border-white/5`}>{stat.icon}</div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p
                  className={`text-3xl font-bold ${stat.color} tabular-nums mt-1`}
                >
                  {data[stat.key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* All Auctions */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
              Latest Auctions
            </h2>
            <Link
              to="/auction"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          {data.latestAuctions.length === 0 ? (
            <div className="text-center py-16 glass-panel">
              <p className="text-slate-400">No auctions available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.latestAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          )}
        </section>

        {/* Your Auctions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white drop-shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              Your Auctions
            </h2>
            <Link
              to="/myauction"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          {data.latestUserAuctions.length === 0 ? (
            <div className="text-center py-16 glass-panel flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-400 mb-6 text-lg">
                You haven&apos;t listed anything yet.
              </p>
              <Link
                to="/create"
                className="glass-btn gap-2"
              >
                Create your first auction
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.latestUserAuctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} />
              ))}
            </div>
          )}
        </section>

        {/* Mobile FAB */}
        <Link
          to="/create"
          className="sm:hidden fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:bg-indigo-700 active:scale-95 transition-all z-50 border border-indigo-400/30"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
