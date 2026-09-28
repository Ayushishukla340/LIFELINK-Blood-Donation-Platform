import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-4xl">🩸</div>

            <div>
              <h1 className="text-3xl font-extrabold text-red-600">
                LifeLink
              </h1>

              <p className="text-xs text-gray-500 -mt-1">
                Donate Blood, Save Lives
              </p>
            </div>
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 font-semibold">

            <Link
              to="/"
              className="hover:text-red-600 duration-200"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="hover:text-red-600 duration-200"
            >
              About
            </Link>

            <Link
              to="/find-donor"
              className="hover:text-red-600 duration-200"
            >
              Find Donor
            </Link>

            <Link
              to="/request-blood"
              className="hover:text-red-600 duration-200"
            >
              Request Blood
            </Link>

            <Link
              to="/blood-requests"
              className="hover:text-red-600 duration-200"
            >
              Blood Requests
            </Link>

          </nav>

          {/* Buttons */}
          <div className="flex gap-3">

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;