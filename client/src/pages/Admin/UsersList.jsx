import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import LoadingScreen from "../../components/LoadingScreen";
import { getAllUsers } from "../../api/admin";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export const UsersList = () => {
  useDocumentTitle("Manage Users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchUsers = async (
    page = 1,
    search = "",
    sort = "createdAt",
    order = "desc",
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(page, search, "all", 20, sort, order);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, sortBy, sortOrder);
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLocation = (location) => {
    if (!location) return "Unknown";
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(", ") : "Unknown";
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return (
        <svg
          className="w-4 h-4 text-slate-500 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-indigo-400 font-extrabold"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-indigo-400 font-extrabold"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen relative z-10 bg-transparent">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/4 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">All Users</h1>
            <p className="text-lg text-slate-400 mt-2">
              {pagination.totalUsers
                ? `${pagination.totalUsers} registered users`
                : "Manage all users"}
            </p>
          </div>
          <Link
            to="/admin"
            className="glass-btn-outline inline-flex gap-2 items-center !px-5 !py-2.5"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="glass-input w-full !pl-12 !py-3.5"
            />
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold rounded-xl p-4 mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="glass-panel border border-white/10 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"></div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th
                    className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      User <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      Role <SortIcon field="role" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Joined <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest cursor-pointer hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("lastLogin")}
                  >
                    <div className="flex items-center gap-2">
                      Last Login <SortIcon field="lastLogin" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-20 text-center text-slate-400 text-lg font-medium"
                    >
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => {
                    const avatarColors = [
                      "from-indigo-400 to-violet-500",
                      "from-emerald-400 to-teal-500",
                      "from-amber-400 to-orange-500",
                      "from-rose-400 to-pink-500",
                      "from-sky-400 to-blue-500",
                    ];
                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-10 w-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-110 transition-transform shadow-lg`}
                            >
                              <span className="text-sm font-bold text-white shadow-sm">
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
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-300">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-300">
                          {formatLocation(user.location)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-white/10 px-6 py-5 flex items-center justify-between bg-white/5">
              <p className="text-sm text-slate-400 font-medium">
                Showing{" "}
                <span className="font-bold text-white">
                  {(currentPage - 1) * pagination.limit + 1}
                </span>{" "}
                &ndash;{" "}
                <span className="font-bold text-white">
                  {Math.min(
                    currentPage * pagination.limit,
                    pagination.totalUsers,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-bold text-white">
                  {pagination.totalUsers}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                      strokeWidth={2.5}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      Math.max(
                        1,
                        Math.min(pagination.totalPages - 4, currentPage - 2),
                      ) + i;
                    if (pageNum > pagination.totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          pageNum === currentPage
                            ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400"
                            : "text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-transparent"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1),
                    )
                  }
                  disabled={!pagination.hasNextPage}
                  className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
