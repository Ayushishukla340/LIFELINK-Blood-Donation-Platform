import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function CertificateModal({ certificate, donor, onClose }) {
  const certificateRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const donorName = certificate.donorName || donor?.fullName || "Valued Blood Donor";
  const bloodGroup = certificate.bloodGroup || donor?.bloodGroup || "O+";
  const certId = certificate.certificateId || "LL-CERT-2026-0001";
  const donationNumber = certificate.donationNumber || 1;
  const verificationUrl = `${window.location.origin}/verify-certificate/${certId}`;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloadingPdf(true);
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FAF6EE",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 8, 8, pdfWidth - 16, pdfHeight - 16);
      pdf.save(`LifeLink-Certificate-${certId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

  const formattedDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Official Blood Donation Certificate
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>📥</span>
              <span>{downloadingPdf ? "Generating..." : "Download PDF"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE OFFICIAL CERTIFICATE PRINTABLE AREA */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
          <div
            ref={certificateRef}
            id="printable-certificate"
            className="relative mx-auto bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9] text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border-8 border-double border-[#C6A24D] overflow-hidden"
            style={{
              minHeight: "560px",
            }}
          >
            {/* Ornamental Corner Filigrees */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-[#C6A24D] pointer-events-none" />
            <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-[#C6A24D] pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-[#C6A24D] pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-[#C6A24D] pointer-events-none" />

            {/* Inner Border */}
            <div className="absolute inset-4 border border-[#C6A24D]/40 pointer-events-none rounded-lg" />

            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none text-9xl font-black">
              🩸 LifeLink
            </div>

            {/* Certificate Header */}
            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-3xl">🩸</span>
                <span className="text-2xl font-black tracking-wider text-red-600 font-serif">
                  LifeLink
                </span>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-500">
                  National Blood Network
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-widest text-[#8B1E1E] font-serif mt-2">
                Certificate of Appreciation
              </h1>

              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#C6A24D] to-transparent mx-auto my-3" />

              <p className="text-xs sm:text-sm uppercase tracking-wider text-slate-600 font-medium">
                This honor is proudly awarded to
              </p>

              {/* Donor Name */}
              <div className="my-5">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif italic border-b-2 border-slate-300 pb-2 inline-block px-8 max-w-full">
                  {donorName}
                </h2>
              </div>

              {/* Citation */}
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                In sincere recognition of your selfless generosity and noble contribution to saving human life
                through voluntary blood donation. Your compassion has breathed life and hope into a patient in need.
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8 pt-4 border-t border-[#C6A24D]/30 text-center relative z-10">
              <div className="bg-white/70 p-2.5 rounded-xl border border-[#C6A24D]/30">
                <span className="block text-[10px] uppercase font-bold text-slate-500">
                  Blood Group
                </span>
                <span className="text-base sm:text-lg font-black text-red-600">
                  {bloodGroup}
                </span>
              </div>

              <div className="bg-white/70 p-2.5 rounded-xl border border-[#C6A24D]/30">
                <span className="block text-[10px] uppercase font-bold text-slate-500">
                  Donation Milestone
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  #{donationNumber} Donation
                </span>
              </div>

              <div className="bg-white/70 p-2.5 rounded-xl border border-[#C6A24D]/30">
                <span className="block text-[10px] uppercase font-bold text-slate-500">
                  Points Credited
                </span>
                <span className="text-base sm:text-lg font-black text-amber-600">
                  +20 Points
                </span>
              </div>

              <div className="bg-white/70 p-2.5 rounded-xl border border-[#C6A24D]/30">
                <span className="block text-[10px] uppercase font-bold text-slate-500">
                  Date of Issue
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Footer / Signatures & Seal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[#C6A24D]/30 relative z-10">
              {/* Left: Certificate ID & Live QR Code */}
              <div className="flex items-center gap-3 text-left">
                <div className="p-1.5 bg-white rounded-xl border border-[#C6A24D]/40 shadow-sm shrink-0">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={74}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-mono font-bold text-slate-900">
                    ID: {certId}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Scan QR to Verify Live
                  </p>
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    verify-certificate ↗
                  </a>
                </div>
              </div>

              {/* Center: Official Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#C6A24D] bg-gradient-to-tr from-[#9B7A28] via-[#F3E5AB] to-[#C6A24D] p-1 flex items-center justify-center shadow-lg transform rotate-[-6deg]">
                  <div className="w-full h-full rounded-full border border-dashed border-[#8B1E1E] flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase text-[#8B1E1E] tracking-tighter">
                      LIFELINK
                    </span>
                    <span className="text-base sm:text-xl leading-none">🩸</span>
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-[#8B1E1E] tracking-tighter">
                      OFFICIAL SEAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Signature */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic text-lg sm:text-xl text-slate-800 font-bold border-b border-slate-400 pb-1 px-4">
                  Dr. Rajiv Sharma
                </div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Medical Director, LifeLink
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 print:hidden">
          <span>💡 5 Certificates & 100 Points grant 100% Free Blood Privilege.</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CertificateModal;
