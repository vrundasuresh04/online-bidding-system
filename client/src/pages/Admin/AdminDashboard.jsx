import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import AuctionCard from "../../components/AuctionCard";
import LoadingScreen from "../../components/LoadingScreen";
import { getAdminDashboard, getAllUsers } from "../../api/admin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const statConfig = [
  {
    key: "activeAuctions",
    label: "Active Auctions",
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
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
    key: "totalAuctions",
    label: "Total Auctions",
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
    borderColor: "border-indigo-500/30",
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    key: "totalUsers",
    label: "Total Users",
    color: "text-violet-400",
    bg: "bg-violet-500/20",
    borderColor: "border-violet-500/30",
    icon: (
      <svg
        className="w-6 h-6 text-violet-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
  {
    key: "recentUsers",
    label: "Recent Signups",
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
    icon: (
      <svg
        className="w-6 h-6 text-amber-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
];

export const AdminDashboard = () => {
  useDocumentTitle("Admin Dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const data = await getAdminDashboard();
      setDashboardData(data || {});
      setUsers(data.recentUsersList || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
      setDashboardData({});
      setUsers([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchDashboardData();
      } catch (error) {
        console.error("Error loading admin data:", error);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl p-4 font-semibold backdrop-blur-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 bg-transparent">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/4 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-400 mt-2">
              Manage auctions, users, and monitor activity
            </p>
          </div>
          <Link
            to="/admin/users"
            className="glass-btn gap-2 inline-flex !py-2.5 !px-5"
          >
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
              />
            </svg>
            All Users
          </Link>
        </div>

        {/* Stats */}
        {dashboardData && dashboardData.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {statConfig.map((stat) => (
              <div
                key={stat.key}
                className="glass-panel border-white/10 p-5 flex items-center gap-5 hover:border-white/20 transition-colors group"
              >
                <div className={`${stat.bg} border ${stat.borderColor} p-3.5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-black ${stat.color} tabular-nums`}
                  >
                    {dashboardData.stats[stat.key] || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Auctions */}
        {dashboardData && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
                Recent Active Auctions
              </h2>
              <Link
                to="/auction"
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
              >
                View all &rarr;
              </Link>
            </div>

            {!dashboardData.recentAuctions ||
            dashboardData.recentAuctions.length === 0 ? (
              <div className="text-center py-20 glass-panel border border-white/10">
                <p className="text-lg text-slate-400 font-medium">
                  No active auctions at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardData.recentAuctions.map((auction) => (
                  <AuctionCard key={auction._id} auction={auction} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Users */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full inline-block"></span>
              Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="glass-panel border-white/10 overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {!users || users.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-slate-400 font-medium">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        User
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Role
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Last Login
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(users || []).map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 border border-indigo-400/30 group-hover:scale-110 transition-transform">
                              <span className="text-sm font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-base font-semibold text-white">
                                {user.name}
                              </p>
                              <p className="text-xs font-medium text-slate-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span
                            className={`inline-flex text-xs font-bold px-3 py-1.5 rounded-full border ${
                              user.role === "admin"
                                ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-300">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
