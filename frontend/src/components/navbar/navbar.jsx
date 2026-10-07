import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const notificationRef = useRef(null);
  const adminMenuRef = useRef(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const rawRole = user?.role || user?.user?.role || "";
  const role = rawRole.trim().toLowerCase();
  const isAdmin = role === "admin";
  const isDonor = role === "blood donor" || role === "donor";
  const isPatient = role === "patient";

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"));

      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("lifelink-auth-changed", syncAuth);

    syncAuth();

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("lifelink-auth-changed", syncAuth);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUser(null);
      return;
    }

    let active = true;

    // Refresh profile to guarantee accurate role detection
    api
      .get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (active && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      })
      .catch(() => {});

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active && response.data.success) {
          setNotifications(response.data.notifications || []);
        }
      } catch (error) {
        if (active) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)
      ) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMenus = () => {
    setShowMobileMenu(false);
    setShowAdminMenu(false);
    setShowNotifications(false);
  };

  // ===============================
  // LIFE LINK RED THEME
  // ===============================

  const navClass = ({ isActive }) =>
    `whitespace-nowrap px-3.5 py-1 text-sm font-semibold transition-all duration-200 relative ${
      isActive
        ? "text-red-600 font-bold after:content-[''] after:absolute after:-bottom-2 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-red-600 dark:text-red-400 dark:after:bg-red-500"
        : "text-slate-700 hover:text-red-600 dark:text-slate-200 dark:hover:text-red-400"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setNotifications([]);

    closeMenus();

    window.dispatchEvent(new Event("lifelink-auth-changed"));
    navigate("/login");
  };

  const handleNotificationClick = async (notification) => {
    closeMenus();

    if (!notification.isRead) {
      try {
        await api.put(
          `/api/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (notification.relatedRequestId) {
      if (
        notification.title?.includes("Message") ||
        notification.title?.includes("Chat") ||
        notification.message?.includes("chat")
      ) {
        navigate(`/chat/${notification.relatedRequestId}`);
      } else if (isDonor) {
        navigate("/donor-requests");
      } else {
        navigate("/my-requests");
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put(
        "/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const formatNotificationTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);

    const difference = Math.floor(
      (Date.now() - notificationDate.getTime()) / 60000
    );

    if (difference < 1) return "Just now";
    if (difference < 60) return `${difference} min ago`;

    const hours = Math.floor(difference / 60);

    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  const publicLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/find-donor", label: "Find Donor" },
    { to: "/request-blood", label: "Request Blood" },
    ...(!isDonor ? [{ to: "/donate", label: "Donate" }] : []),
    { to: "/about", label: "About" },
  ];

  const accountLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/my-requests", label: "My Requests" },
    ...(isDonor
      ? [{ to: "/donor-requests", label: "Donor Requests" }]
      : []),
  ];

  const renderLink = (item) => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.end}
      className={navClass}
      onClick={closeMenus}
    >
      {item.label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-red-100 bg-white/95 backdrop-blur-md shadow-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/60">
      {/* Top red accent */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-red-600 to-red-500" />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          
          {/* ================= BRAND ================= */}
          <Link
            to="/"
            onClick={closeMenus}
            className="group flex shrink-0 items-center gap-3"
          >
            {/* Blood drop */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl shadow-sm transition group-hover:bg-red-100 dark:bg-slate-800 dark:group-hover:bg-slate-700">
              🩸
            </div>

            <span>
              <span className="block text-2xl font-extrabold leading-tight tracking-tight text-red-700 dark:text-red-500">
                LifeLink
              </span>

              <span className="block text-[10px] font-medium tracking-wide text-gray-500 dark:text-slate-400 sm:text-xs">
                Donate Blood, Save Lives
              </span>
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav
            aria-label="Main navigation"
            className="hidden flex-1 flex-wrap items-center justify-center gap-1 xl:flex"
          >
            {publicLinks.map(renderLink)}

            {token && accountLinks.map(renderLink)}

            {token && isAdmin && (
              <>
                <NavLink
                  to="/admin-dashboard"
                  className={navClass}
                  onClick={closeMenus}
                >
                  Admin Dashboard
                </NavLink>

                <NavLink
                  to="/blood-requests"
                  className={navClass}
                  onClick={closeMenus}
                >
                  Blood Requests
                </NavLink>
              </>
            )}
          </nav>

          {/* ================= ACCOUNT ACTIONS ================= */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {token ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    aria-label={`Notifications, ${unreadCount} unread`}
                    aria-expanded={showNotifications}
                    onClick={() =>
                      setShowNotifications((previous) => !previous)
                    }
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-lg transition hover:bg-red-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    🔔

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white shadow-sm">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[min(24rem,90vw)] overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/70">
                      
                      <div className="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/80">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-slate-100">
                            Notifications
                          </h3>

                          <p className="text-xs text-red-600 dark:text-red-400">
                            {unreadCount} unread
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline dark:text-red-400 dark:hover:text-red-300"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-5 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                            No notifications. You are all caught up!
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              type="button"
                              key={notification._id}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`w-full border-b px-4 py-4 text-left transition ${
                                notification.isRead
                                  ? "border-red-50 bg-white hover:bg-red-50/50 dark:border-slate-800/80 dark:bg-slate-900 dark:hover:bg-slate-800/60"
                                  : "border-red-100 bg-red-50/70 hover:bg-red-100/70 dark:border-slate-800 dark:bg-slate-800/70 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span aria-hidden="true">🔔</span>

                                <span className="min-w-0 flex-1">
                                  <span className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-bold text-gray-800 dark:text-slate-100">
                                      {notification.title}
                                    </span>

                                    {!notification.isRead && (
                                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />
                                    )}
                                  </span>

                                  <span className="mt-1 block text-sm text-gray-600 dark:text-slate-300">
                                    {notification.message}
                                  </span>

                                  <span className="mt-2 block text-xs text-gray-400 dark:text-slate-400">
                                    {formatNotificationTime(
                                      notification.createdAt
                                    )}
                                  </span>
                                </span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin menu */}
                {isAdmin && (
                  <div
                    className="relative hidden lg:block xl:hidden"
                    ref={adminMenuRef}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setShowAdminMenu((previous) => !previous)
                      }
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700"
                    >
                      Admin ▾
                    </button>

                    {showAdminMenu && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-red-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        {[
                          {
                            to: "/admin-dashboard",
                            label: "Admin Dashboard",
                          },
                          {
                            to: "/blood-requests",
                            label: "Blood Requests",
                          },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeMenus}
                            className="block rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-red-50 hover:text-red-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-red-400"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="rounded-full border-2 border-red-600 px-4 py-1.5 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-slate-800"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-red-200 transition hover:bg-red-700 hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={showMobileMenu}
              onClick={() => setShowMobileMenu((previous) => !previous)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-xl text-red-700 transition hover:bg-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700 xl:hidden"
            >
              {showMobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* ================= MOBILE NAV ================= */}
        {showMobileMenu && (
          <nav
            aria-label="Mobile navigation"
            className="max-h-[75vh] space-y-1 overflow-y-auto border-t border-red-100 py-3 dark:border-slate-800 dark:bg-slate-900 xl:hidden"
          >
            {/* Theme switcher row on mobile */}
            <div className="mx-2 mb-3 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300">
                Theme
              </span>
              <ThemeToggle showLabel={true} />
            </div>

            <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-red-500">
              Explore LifeLink
            </p>

            {publicLinks.map(renderLink)}

            {token && (
              <>
                <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-red-500">
                  My Account
                </p>

                {accountLinks.map(renderLink)}

                {isAdmin && (
                  <>
                    {renderLink({
                      to: "/admin-dashboard",
                      label: "Admin Dashboard",
                    })}

                    {renderLink({
                      to: "/blood-requests",
                      label: "Blood Requests",
                    })}
                  </>
                )}
              </>
            )}

            {!token && (
              <div className="flex gap-2 px-3 pt-3">
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="flex-1 rounded-xl border-2 border-red-600 py-2 text-center font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:border-red-500 dark:hover:bg-slate-800"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="flex-1 rounded-xl bg-red-600 py-2 text-center font-bold text-white transition hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}

            {token && (
              <p className="px-3 pb-2 pt-4 text-xs text-gray-500 dark:text-slate-400">
                Signed in as{" "}
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {user?.fullName || user?.role || "LifeLink user"}
                </span>
              </p>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;