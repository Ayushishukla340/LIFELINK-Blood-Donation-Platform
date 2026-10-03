import { Link } from "react-router-dom";

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Find a Donor", path: "/find-donor" },
    { name: "Request Blood", path: "/request-blood" },
    { name: "Donate Blood", path: "/donate-blood" },
  ];

  return (
    <footer className="mt-16 border-t border-red-100 bg-slate-50 text-slate-700">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              🩸
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-red-600">
              LifeLink
            </span>
          </Link>

          <p className="mt-5 max-w-sm leading-7 text-slate-600">
            Donate Blood, Save Lives.
            <br />
            Connecting donors and patients through a simple, accessible
            blood donation platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Built to connect and support
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Quick Links
          </h3>

          <div className="mt-5 h-1 w-10 rounded-full bg-red-500" />

          <ul className="mt-5 space-y-3">
            {quickLinks.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="inline-flex items-center gap-2 text-slate-600 transition hover:translate-x-1 hover:text-red-600"
                >
                  <span className="text-red-400">›</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact / Project Info */}
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            About the Platform
          </h3>

          <div className="mt-5 h-1 w-10 rounded-full bg-red-500" />

          <p className="mt-5 leading-7 text-slate-600">
            LifeLink helps users discover available donors, submit blood
            requests and track request updates.
          </p>

          <div className="mt-5 rounded-2xl border border-red-100 bg-white p-4">
            <p className="font-semibold text-slate-800">
              Every connection matters.
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Explore the platform to get started.
            </p>
            <Link
              to="/find-donor"
              className="mt-3 inline-flex font-semibold text-red-600 hover:text-red-700"
            >
              Explore donors →
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-sm text-slate-500 sm:flex-row sm:text-left lg:px-10">
          <p>
            © {new Date().getFullYear()} LifeLink. All rights reserved.
          </p>
          <p>Donate Blood. Support Life. ❤️</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
