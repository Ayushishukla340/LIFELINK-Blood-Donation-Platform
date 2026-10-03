
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../../services/api";

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

  const isAdmin = user?.role === "Admin";
  const isDonor = user?.role === "Blood Donor";
  const isPatient = user?.role === "Patient";

  // Keep login information updated when the user navigates.
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

  // Fetch notifications for the logged-in user.
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }

    let active = true;

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

  // Close popups when clicking outside.
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

  const navClass = ({ isActive }) =>
    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-red-50 text-red-600"
        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
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
    if (notification.isRead) return;

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
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

    return notificationDate.toLocaleDateString();
  };

  const publicLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/find-donor", label: "Find Donor" },
    { to: "/request-blood", label: "Request Blood" },
    { to: "/donate", label: "Donate" },
  ];

  const accountLinks = [
    { to: "/dashboard", label: "Dashboard" },
    ...(isPatient
      ? [{ to: "/my-requests", label: "My Requests" }]
      : []),
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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-2"
          >
            <span className="text-3xl" aria-hidden="true">
              🩸
            </span>

            <span>
              <span className="block text-2xl font-extrabold leading-tight text-red-600">
                LifeLink
              </span>
              <span className="block text-[10px] text-gray-500 sm:text-xs">
                Donate Blood, Save Lives
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
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

          {/* Account actions */}
          <div className="flex shrink-0 items-center gap-2">
            {token ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    type="button"
                    aria-label={`Notifications, ${unreadCount} unread`}
                    aria-expanded={showNotifications}
                    onClick={() => setShowNotifications((previous) => !previous)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl transition hover:bg-gray-100"
                  >
                    🔔

                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-[min(24rem,90vw)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                      <div className="flex items-center justify-between gap-3 border-b bg-gray-50 px-4 py-3">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Notifications
                          </h3>
                          <p className="text-xs text-gray-500">
                            {unreadCount} unread
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="text-xs font-semibold text-red-600 hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-5 py-8 text-center text-sm text-gray-500">
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
                              className={`w-full border-b px-4 py-4 text-left transition hover:bg-gray-50 ${
                                notification.isRead ? "bg-white" : "bg-red-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span aria-hidden="true">🔔</span>

                                <span className="min-w-0 flex-1">
                                  <span className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-bold text-gray-800">
                                      {notification.title}
                                    </span>

                                    {!notification.isRead && (
                                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />
                                    )}
                                  </span>

                                  <span className="mt-1 block text-sm text-gray-600">
                                    {notification.message}
                                  </span>

                                  <span className="mt-2 block text-xs text-gray-400">
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

                {/* Admin quick links for narrower desktop widths */}
                {isAdmin && (
                  <div className="relative hidden lg:block xl:hidden" ref={adminMenuRef}>
                    <button
                      type="button"
                      onClick={() => setShowAdminMenu((previous) => !previous)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Admin ▾
                    </button>

                    {showAdminMenu && (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                        {[
                          { to: "/admin-dashboard", label: "Admin Dashboard" },
                          { to: "/blood-requests", label: "Blood Requests" },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeMenus}
                            className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:px-4"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 sm:px-4"
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
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-xl hover:bg-gray-50 xl:hidden"
            >
              {showMobileMenu ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {showMobileMenu && (
          <nav
            aria-label="Mobile navigation"
            className="max-h-[75vh] space-y-1 overflow-y-auto border-t border-gray-100 py-3 xl:hidden"
          >
            <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-gray-400">
              Explore LifeLink
            </p>

            {publicLinks.map(renderLink)}

            {token && (
              <>
                <p className="px-3 pb-1 pt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
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
                  className="flex-1 rounded-lg border border-red-600 py-2 text-center font-semibold text-red-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}

            {token && (
              <p className="px-3 pb-2 pt-4 text-xs text-gray-500">
                Signed in as {user?.fullName || user?.role || "LifeLink user"}
              </p>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
