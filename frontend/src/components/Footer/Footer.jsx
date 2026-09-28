function Footer() {
  return (
    <footer className="bg-red-600 text-white mt-16">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-3 gap-10">

        {/* Logo */}
        <div>
          <h2 className="text-3xl font-bold">🩸 LifeLink</h2>
          <p className="mt-4 text-gray-200">
            Donate Blood, Save Lives.
            <br />
            Connecting donors with patients quickly and safely.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2">
            <li>Home</li>
            <li>About</li>
            <li>Find Donor</li>
            <li>Request Blood</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>

          <p>📧 support@lifelink.com</p>
          <p className="mt-2">📞 +91 9876543210</p>
          <p className="mt-2">📍 Lucknow, India</p>
        </div>

      </div>

      <div className="border-t border-red-400 text-center py-4">
        © 2026 LifeLink. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;