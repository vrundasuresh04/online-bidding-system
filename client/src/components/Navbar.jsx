import { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/auth/authSlice";
import { usePrefetchHandlers } from "../hooks/useAuction.js";
import {
  MdOutlineCreate,
  MdOutlineDashboard,
  MdMailOutline,
  MdAttachMoney,
  MdOutlineAccountCircle,
  MdOutlineHome,
  MdOutlinePrivacyTip,
  MdAdminPanelSettings,
} from "react-icons/md";
import {
  IoCloseSharp,
  IoDocumentTextOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { RiAuctionLine } from "react-icons/ri";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { FiTarget } from "react-icons/fi";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    prefetchAuctions,
    prefetchMyAuctions,
    prefetchMyBids,
    prefetchDashboard,
  } = usePrefetchHandlers();

  const handlePrefetch = useCallback(
    (link) => {
      const prefetchMap = {
        "/": prefetchDashboard,
        "/auction": prefetchAuctions,
        "/myauction": prefetchMyAuctions,
        "/mybids": prefetchMyBids,
      };
      prefetchMap[link]?.();
    },
    [prefetchAuctions, prefetchMyAuctions, prefetchMyBids, prefetchDashboard],
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = user ? getNavLinks(user.user.role) : navMenu;
  const drawerItems = user ? getAllLinks(user.user.role) : navMenu;

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20 transition-all duration-300">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 p-2 rounded-xl group-hover:scale-110 group-hover:bg-indigo-500/30 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
                <RiAuctionLine className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                Online <span className="text-gradient">Auction</span>
              </span>
            </Link>

            {/* Desktop Navigation — main links only */}
            <nav className="hidden md:flex items-center gap-2 bg-slate-800/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/5">
              {navItems.map((item) => (
                <NavLink
                  to={item.link}
                  key={item.link}
                  end={item.link === "/"}
                  onMouseEnter={() => handlePrefetch(item.link)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Desktop auth buttons */}
              {!user && (
                <div className="hidden md:flex items-center gap-3">
                  <LoginSignup />
                </div>
              )}
              {user && (
                <div className="hidden md:flex items-center gap-3">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                        isActive
                          ? "border-indigo-500/40 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          : "border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-slate-800/50"
                      }`
                    }
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {user.user.avatar ? (
                        <img src={user.user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.user.name?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                    {user.user.name?.split(" ")[0]}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 cursor-pointer"
                    title="Sign out"
                  >
                    <IoLogOutOutline className="h-6 w-6" />
                  </button>
                </div>
              )}

              {/* Hamburger — always visible on small screens */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent shadow-[0_0_0_rgba(0,0,0,0)] focus:border-white/20"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <HiOutlineMenuAlt3 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#0b0f19]/80 backdrop-blur-md z-50 transition-all duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 h-20 border-b border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 p-2 rounded-xl">
              <RiAuctionLine className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Online Phase
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            aria-label="Close menu"
          >
            <IoCloseSharp className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile (logged in) */}
        {user && (
          <div className="px-6 py-5 border-b border-white/5 bg-slate-800/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                {user.user.avatar ? (
                  <img
                    src={user.user.avatar}
                    alt={user.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {user.user.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-md truncate">
                  {user.user.name}
                </p>
                <p className="text-xs text-indigo-300 truncate font-medium">
                  {user.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Links — ALL pages */}
        <nav
          className="px-4 py-4 flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-1">
            {drawerItems.map((item) => (
              <NavLink
                to={item.link}
                key={item.link}
                end={item.link === "/"}
                onMouseEnter={() => handlePrefetch(item.link)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>

          {user ? (
            <div className="mt-6 pt-6 border-t border-white/5">
              <button
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                <IoLogOutOutline className="h-6 w-6" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3 px-2">
              <Link
                to="/login"
                className="glass-btn-outline w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="glass-btn w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export const LoginSignup = () => {
  return (
    <>
      <Link
        to="/login"
        className="glass-btn-outline !py-2 !px-5"
      >
        Log in
      </Link>
      <Link
        to="/signup"
        className="glass-btn !py-2 !px-5"
      >
        Sign up
      </Link>
    </>
  );
};

const navMenu = [
  {
    name: "Home",
    link: "/",
    icon: <MdOutlineHome className="h-5 w-5" />,
  },
];

const protectedNavLink = [
  {
    name: "Dashboard",
    link: "/",
    icon: <MdOutlineDashboard className="h-5 w-5" />,
  },
  {
    name: "Create Auction",
    link: "/create",
    icon: <MdOutlineCreate className="h-5 w-5" />,
  },
  {
    name: "Auctions",
    link: "/auction",
    icon: <RiAuctionLine className="h-5 w-5" />,
  },
  {
    name: "My Auctions",
    link: "/myauction",
    icon: <MdAttachMoney className="h-5 w-5" />,
  },
  {
    name: "My Bids",
    link: "/mybids",
    icon: <FiTarget className="h-5 w-5" />,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: <MdOutlineAccountCircle className="h-5 w-5" />,
  },
];

const adminNavLink = [
  {
    name: "Admin Panel",
    link: "/admin",
    icon: <MdAdminPanelSettings className="h-5 w-5" />,
  },
  {
    name: "Dashboard",
    link: "/",
    icon: <MdOutlineDashboard className="h-5 w-5" />,
  },
  {
    name: "Create Auction",
    link: "/create",
    icon: <MdOutlineCreate className="h-5 w-5" />,
  },
  {
    name: "Auctions",
    link: "/auction",
    icon: <RiAuctionLine className="h-5 w-5" />,
  },
  {
    name: "My Auctions",
    link: "/myauction",
    icon: <MdAttachMoney className="h-5 w-5" />,
  },
  {
    name: "My Bids",
    link: "/mybids",
    icon: <FiTarget className="h-5 w-5" />,
  },
];

// Top nav bar links (limited set for desktop)
const getNavLinks = (userRole) => {
  if (userRole === "admin") {
    return adminNavLink;
  }
  return protectedNavLink.slice(0, 5);
};

// Links for the hamburger drawer
const getAllLinks = (userRole) => {
  if (userRole === "admin") {
    return [
      ...adminNavLink,
      protectedNavLink[5], // Profile
    ];
  }
  return protectedNavLink; // All 6 links
};
