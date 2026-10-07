import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import api from "../../services/api";

function VerifyCertificate() {
  const { certId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(false);
        const res = await api.get(`/api/certificates/${certId}`);
        if (res.data?.success && res.data?.certificate) {
          setCertificate(res.data.certificate);
        } else {
          setError("Certificate not found or invalid.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to verify certificate. Please check the Certificate ID."
        );
      } finally {
        setLoading(false);
      }
    };

    if (certId) {
      fetchCertificate();
    }
  }, [certId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = certificate?.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Verified on LifeLink";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-rose-50/30 to-slate-100 dark:from-slate-950 dark:via-red-950/10 dark:to-slate-900 py-12 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        {/* TOP BRAND HEADER */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-black text-red-600 dark:text-red-500 tracking-tight hover:opacity-90 transition"
          >
            <span>🩸</span>
            <span>LifeLink</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold ml-1">
              Verification Portal
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Official Public Certificate Verification & Authenticity Check
          </p>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-lg">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
              Verifying certificate ID against LifeLink records...
            </p>
          </div>
        )}

        {/* ERROR / NOT FOUND STATE */}
        {!loading && error && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900/60 p-8 sm:p-12 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Certificate Not Found
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              We could not find an authentic record for Certificate ID:{" "}
              <span className="font-mono font-bold text-red-600 dark:text-red-400">
                {certId}
              </span>
              . Please verify the ID or URL.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
              >
                Go to Homepage
              </Link>
              <Link
                to="/find-donor"
                className="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
              >
                Find Donors
              </Link>
            </div>
          </div>
        )}

        {/* VERIFIED CERTIFICATE CARD */}
        {!loading && certificate && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            {/* Verification Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3">
                <span>🛡️</span>
                <span>Officially Verified Authentic Record</span>
                <span>✓</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Valid Blood Donation Certificate
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
                This certificate was verified live through the LifeLink Central Network.
              </p>
            </div>

            {/* Certificate Details Body */}
            <div className="p-6 sm:p-10 space-y-8">
              
              {/* Highlight Donor Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-amber-50/50 dark:from-slate-800/80 dark:via-slate-800/40 dark:to-slate-800/80 border border-amber-200/70 dark:border-amber-900/40">
                <div className="text-center sm:text-left space-y-1">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Recognized Life Saver
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                    {certificate.donorName || "Valued Blood Donor"}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Officially credited voluntary blood donation milestone.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                    <QRCodeSVG
                      value={window.location.href}
                      size={80}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-right hidden sm:block text-[10px] text-slate-400 font-mono">
                    <span className="block font-bold text-slate-600 dark:text-slate-300">
                      LIVE QR
                    </span>
                    <span>Scannable</span>
                  </div>
                </div>
              </div>

              {/* Grid of Verified Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Blood Group
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-500 mt-1 block">
                    {certificate.bloodGroup}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Donation Milestone
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                    #{certificate.donationNumber || 1}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Points Credited
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                    +{certificate.pointsEarned || 20} Pts
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Hospital / Center
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block truncate">
                    {certificate.hospitalName || "Partner Hospital"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    City Location
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {certificate.city || "National"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Issue Date
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {formattedDate}
                  </span>
                </div>

              </div>

              {/* Security ID Strip */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Official Certificate ID
                  </span>
                  <span className="text-sm font-mono font-black text-slate-900 dark:text-slate-100">
                    {certificate.certificateId || certId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-600 shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{copied ? "✓ Copied" : "📋 Copy Link"}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🖨️</span>
                    <span>Print Page</span>
                  </button>
                </div>
              </div>

              {/* Authenticity Guarantee Note */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3">
                <span className="text-lg">🛡️</span>
                <p className="leading-relaxed">
                  <span className="font-bold">Authenticity Guarantee:</span> This certificate has been issued following physical hospital donation verification via 4-Digit OTP security protocol. It is suitable for verification by employers, colleges, and medical authorities.
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="px-6 sm:px-10 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                LifeLink National Blood Donation Platform
              </span>
              <div className="flex gap-4">
                <Link
                  to="/request-blood"
                  className="font-bold text-red-600 hover:underline"
                >
                  Request Blood
                </Link>
                <Link
                  to="/donate"
                  className="font-bold text-slate-700 dark:text-slate-300 hover:underline"
                >
                  Become a Donor
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyCertificate;
