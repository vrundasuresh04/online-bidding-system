import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuctionCard from "../components/AuctionCard";
import LoadingScreen from "../components/LoadingScreen";
import { useGetMyBids } from "../hooks/useAuction";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const MyBids = () => {
  useDocumentTitle("My Bids");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyBids(page);

  if (isLoading) return <LoadingScreen />;

  const rawData = data || {};
  const auctions = Array.isArray(rawData) ? rawData : rawData.auctions || [];
  const pagination = Array.isArray(rawData) ? {} : rawData.pagination || {};

  const filteredAuctions =
    filter === "all"
      ? auctions
      : filter === "active"
        ? auctions.filter((a) => !a.isExpired)
        : auctions.filter((a) => a.isExpired);

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">My Bids</h1>
          <p className="text-lg text-slate-400 mt-2">
            Auctions you&apos;ve participated in
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3">
            {["all", "active", "ended"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  filter === f
                    ? "bg-indigo-500 border-indigo-400/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-sm shadow-sm"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {filteredAuctions.length > 0 && (
          <div className="mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></div>
            <p className="text-lg font-bold text-white drop-shadow-sm">
              {filter === "all" ? "All bids" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-2 text-slate-400 font-medium">
                ({filteredAuctions.length})
              </span>
            </p>
          </div>
        )}

        {filteredAuctions.length === 0 ? (
          <div className="text-center py-20 glass-panel flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-white/5">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-lg mb-6">
              {filter === "all"
                ? "You haven't placed any bids yet"
                : `No ${filter} auctions.`}
            </p>
            {filter === "all" && (
              <Link
                to="/auction"
                className="glass-btn gap-2"
              >
                Browse auctions
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-14">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-all border ${
                    p === page
                      ? "bg-indigo-500 border-indigo-400/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                      : "bg-white/5 border-white/10 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 backdrop-blur-sm"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
