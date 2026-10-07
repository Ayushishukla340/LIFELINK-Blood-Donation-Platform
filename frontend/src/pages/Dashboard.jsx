import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CertificateModal from "../components/CertificateModal/CertificateModal";
import { calculateDonationEligibility } from "../utils/eligibility";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [privilegeStats, setPrivilegeStats] = useState(null);

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    bloodGroup: "",
    city: "",
    lastDonationDate: "",
  });

  // ===============================
  // FETCH PROFILE
  // ===============================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileUser = response.data.user;

        setUser(profileUser);
        localStorage.setItem("user", JSON.stringify(profileUser));
        window.dispatchEvent(new Event("lifelink-auth-changed"));

        setProfileForm({
          fullName: profileUser.fullName || "",
          phone: profileUser.phone || "",
          bloodGroup: profileUser.bloodGroup || "",
          city: profileUser.city || "",
          lastDonationDate: formatDateForInput(profileUser.lastDonationDate),
        });

        if (profileUser.role === "Blood Donor") {
          try {
            const certResponse = await api.get(
              "/api/certificates/my-certificates",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setCertificates(certResponse.data.certificates || []);
            setPrivilegeStats(certResponse.data.stats || null);
          } catch (certError) {
            console.log("Certificate load info:", certError);
          }
        }
      } catch (error) {
        console.log("❌ Profile Error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", { replace: true });
          return;
        }

        setMessage(
          error.response?.data?.message ||
            "Unable to load profile"
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ===============================
  // PROFILE FORM CHANGE
  // ===============================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // OPEN EDIT PROFILE
  // ===============================

  const handleEditProfile = () => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      bloodGroup: user.bloodGroup || "",
      city: user.city || "",
      lastDonationDate: formatDateForInput(user.lastDonationDate),
    });

    setMessage("");
    setEditingProfile(true);
  };

  // ===============================
  // CANCEL EDIT PROFILE
  // ===============================

  const handleCancelEdit = () => {
    setProfileForm({
      fullName: user.fullName || "",
      phone: user.phone || "",
      bloodGroup: user.bloodGroup || "",
      city: user.city || "",
      lastDonationDate: formatDateForInput(user.lastDonationDate),
    });

    setMessage("");
    setEditingProfile(false);
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (
      !profileForm.fullName.trim() ||
      !profileForm.phone.trim() ||
      !profileForm.bloodGroup ||
      !profileForm.city.trim()
    ) {
      setMessage("Please fill all profile fields");
      setMessageType("error");
      return;
    }

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/api/profile",
        {
          fullName: profileForm.fullName.trim(),
          phone: profileForm.phone.trim(),
          bloodGroup: profileForm.bloodGroup,
          city: profileForm.city.trim(),
          lastDonationDate: profileForm.lastDonationDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);

      setProfileForm({
        fullName: response.data.user.fullName || "",
        phone: response.data.user.phone || "",
        bloodGroup: response.data.user.bloodGroup || "",
        city: response.data.user.city || "",
        lastDonationDate: formatDateForInput(response.data.user.lastDonationDate),
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setEditingProfile(false);
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.log("❌ Profile Update Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile"
      );
      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  // ===============================
  // UPDATE AVAILABILITY
  // ===============================

  const handleAvailabilityChange = async (e) => {
    const newAvailability = e.target.value;

    const currentElig = user
      ? calculateDonationEligibility(user.lastDonationDate)
      : null;

    if (
      user?.role === "Blood Donor" &&
      currentElig?.cooldownActive &&
      newAvailability === "Available"
    ) {
      setMessage(
        `Medical Cooldown Active: You cannot set availability to 'Available' until 90 days have elapsed since your last donation. You can donate again in ${currentElig.daysRemaining} days (on ${currentElig.formattedNextDate}).`
      );
      setMessageType("error");
      return;
    }

    try {
      setUpdating(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/api/profile/availability",
        {
          availability: newAvailability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setMessage(response.data.message);
      setMessageType("success");

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      console.log("❌ Availability Update Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Unable to update availability"
      );
      setMessageType("error");
    } finally {
      setUpdating(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-lg font-semibold text-gray-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const eligibility =
    user?.role === "Blood Donor"
      ? calculateDonationEligibility(user.lastDonationDate)
      : null;

  const isCooldownActive = Boolean(eligibility?.cooldownActive);

  const formattedLastDonationDate = user.lastDonationDate
    ? new Date(user.lastDonationDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No donation recorded yet";

  const availabilityColor = isCooldownActive
    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-700/50"
    : user.availability === "Available"
    ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 dark:border dark:border-green-800/40"
    : user.availability === "Temporarily Unavailable"
    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400 dark:border dark:border-yellow-800/40"
    : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 dark:border dark:border-red-800/40";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 transition-colors duration-200 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">

        {/* ===============================
            HEADER
        =============================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-red-50 dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-red-600 dark:text-red-500 font-semibold uppercase tracking-wide">
                LifeLink Dashboard
              </p>

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-slate-100 mt-1">
                Welcome, {user.fullName} ❤️
              </h1>

              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Manage your profile and track your LifeLink activity.
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${availabilityColor}`}
            >
              {user.role === "Blood Donor"
                ? isCooldownActive
                  ? `⏳ Cooldown (${eligibility.daysRemaining}d left)`
                  : `● ${user.availability || "Available"}`
                : "● Active Account"}
            </div>

          </div>
        </div>

        {/* ===============================
            HERO LIFESAVER PRIVILEGE BANNER
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-xl border border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/30 p-6 sm:p-8 backdrop-blur-md relative transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>
                      {privilegeStats?.isPrivilegeUnlocked
                        ? "LifeLink Gold Lifesaver Privilege"
                        : "Lifesaver Milestone Tier"}
                    </span>
                  </span>
                  {privilegeStats?.isPrivilegeUnlocked && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 animate-pulse">
                      ● 100% Free Blood Unlocked
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {privilegeStats?.isPrivilegeUnlocked
                    ? "Free Blood & Zero Charges Privilege is Active!"
                    : "Complete 5 Donations (100 Points) for 100% Free Blood"}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privilegeStats?.isPrivilegeUnlocked
                    ? "Thank you for your heroic contributions! Because you have earned 5+ certificates and 100+ points, you and your immediate family are entitled to 100% free blood with zero screening and processing charges across all LifeLink network centers."
                    : "Every blood donation earns you 1 Official Certificate and +20 Points. Once you reach 5 Certificates & 100 Points, you unlock lifelong 100% free blood emergency coverage for yourself and your family!"}
                </p>
              </div>

              {/* Progress & Badge Box */}
              <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 border border-amber-200 dark:border-slate-800 shadow-sm min-w-72">
                <div className="flex justify-between items-center text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  <span>Goal Progress</span>
                  <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                    {Math.min(
                      100,
                      Math.round(((user.points || 0) / 100) * 100)
                    )}
                    %
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((user.points || 0) / 100) * 100)
                      )}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-amber-50 dark:bg-slate-800/80 p-2 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Certificates
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100">
                      {certificates.length} / 5
                    </span>
                  </div>
                  <div className="bg-amber-50 dark:bg-slate-800/80 p-2 rounded-xl">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Points
                    </span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">
                      {user.points || 0} / 100
                    </span>
                  </div>
                </div>

                {!privilegeStats?.isPrivilegeUnlocked && (
                  <p className="text-[11px] font-semibold text-center text-amber-700 dark:text-amber-400 mt-2.5">
                    ⭐ Only{" "}
                    {Math.max(
                      0,
                      5 - (user.totalDonations || certificates.length)
                    )}{" "}
                    more donation(s) to unlock VIP Free Blood!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===============================
            90-DAY DONATION COOLDOWN & HEALTH ELIGIBILITY
        =============================== */}

        {user.role === "Blood Donor" && eligibility && (
          <div
            className={`mb-8 rounded-3xl overflow-hidden shadow-xl border p-6 sm:p-8 backdrop-blur-md relative transition-all ${
              isCooldownActive
                ? "border-amber-300 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20"
                : "border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Column: Heading & Medical Status */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 ${
                      isCooldownActive
                        ? "bg-gradient-to-r from-amber-500 to-orange-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600"
                    }`}
                  >
                    <span>🩺</span>
                    <span>Medical Eligibility & Health Recovery</span>
                  </span>

                  {isCooldownActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-pulse">
                      ● Cooldown Active ({eligibility.daysRemaining}d left)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      ● Medically Ready to Donate
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {isCooldownActive
                    ? `You can donate again in ${eligibility.daysRemaining} day${
                        eligibility.daysRemaining === 1 ? "" : "s"
                      }`
                    : "You Are Medically Eligible to Donate Blood!"}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isCooldownActive ? (
                    <>
                      Under standard medical regulations, a minimum interval of{" "}
                      <strong>90 days (3 months)</strong> is required between whole
                      blood donations to safely rebuild hemoglobin and iron stores.
                      Your next eligible donation date is{" "}
                      <strong className="text-amber-700 dark:text-amber-400">
                        {eligibility.formattedNextDate}
                      </strong>
                      . For your health and safety, your availability is auto-locked until
                      then.
                    </>
                  ) : (
                    <>
                      {user.lastDonationDate ? (
                        <>
                          Your last recorded donation was on{" "}
                          <strong>{formattedLastDonationDate}</strong> (
                          {eligibility.daysPassed} days ago). Your full 90-day
                          recovery cycle is complete! Ensure your availability is
                          set to <strong>Available</strong> so patients in need can
                          connect with you.
                        </>
                      ) : (
                        <>
                          You do not have a recent donation on record. If you meet
                          standard donor criteria (age 18–65, weight ≥ 50kg, good
                          health), you are ready to be a lifesaver today!
                        </>
                      )}
                    </>
                  )}
                </p>

                {/* Medical Tips Badges */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    ⏱️ 90-Day Medical Safe Gap
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    🩸 Full Iron & RBC Replenishment
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    🔒 Automatic Availability Guard
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Recovery Track & Countdown */}
              <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm min-w-72 sm:w-80 shrink-0">
                <div className="flex justify-between items-center text-xs font-bold mb-2 text-slate-700 dark:text-slate-300">
                  <span>90-Day Recovery Track</span>
                  <span
                    className={`font-black ${
                      isCooldownActive
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {eligibility.progressPercent}%
                  </span>
                </div>

                {/* Recovery Progress Bar */}
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-200 dark:border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isCooldownActive
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600"
                    }`}
                    style={{
                      width: `${eligibility.progressPercent}%`,
                    }}
                  />
                </div>

                {/* Stat Metric Cards */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div
                    className={`p-2 rounded-xl ${
                      isCooldownActive
                        ? "bg-amber-50/80 dark:bg-amber-950/30"
                        : "bg-emerald-50/80 dark:bg-emerald-950/30"
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Days Remaining
                    </span>
                    <span
                      className={`text-base font-black ${
                        isCooldownActive
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {isCooldownActive
                        ? `${eligibility.daysRemaining} Days`
                        : "0 (Eligible)"}
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-xl ${
                      isCooldownActive
                        ? "bg-amber-50/80 dark:bg-amber-950/30"
                        : "bg-emerald-50/80 dark:bg-emerald-950/30"
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Eligible Date
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                      {isCooldownActive
                        ? eligibility.formattedNextDate
                        : "Available Now"}
                    </span>
                  </div>
                </div>

                {isCooldownActive ? (
                  <p className="text-[11px] font-semibold text-center text-amber-700 dark:text-amber-400 mt-2.5">
                    🔒 Status auto-locked during recovery
                  </p>
                ) : (
                  <p className="text-[11px] font-semibold text-center text-emerald-700 dark:text-emerald-400 mt-2.5">
                    ✨ Ready to respond to urgent blood requests
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===============================
            DONOR STATS
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            {/* TOTAL DONATIONS */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500 border border-red-50/50 dark:border-slate-800 dark:border-l-red-500 dark:bg-slate-900">

              <p className="text-gray-500 dark:text-slate-400 text-sm font-semibold">
                Total Donations
              </p>

              <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-2">
                {user.totalDonations || 0}
              </p>

              <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
                Successful donations
              </p>

            </div>

            {/* POINTS */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-yellow-500 border border-red-50/50 dark:border-slate-800 dark:border-l-yellow-500 dark:bg-slate-900">

              <p className="text-gray-500 dark:text-slate-400 text-sm font-semibold">
                LifeLink Points
              </p>

              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {user.points || 0}
              </p>

              <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
                Contribution points
              </p>

            </div>

            {/* BLOOD GROUP */}

            <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500 border border-red-50/50 dark:border-slate-800 dark:border-l-red-500 dark:bg-slate-900">

              <p className="text-gray-500 dark:text-slate-400 text-sm font-semibold">
                Blood Group
              </p>

              <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-2">
                {user.bloodGroup}
              </p>

              <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
                Registered blood group
              </p>

            </div>

          </div>
        )}

        {/* ===============================
            PROFILE + ACTIVITY
        =============================== */}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ===============================
              PROFILE INFORMATION
          =============================== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-red-50 dark:border-slate-800 dark:bg-slate-900">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                  Profile Information
                </h2>

                <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
                  Your registered LifeLink account details
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-100 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400">
                  {user.role}
                </div>

                {!editingProfile && (
                  <button
                    onClick={handleEditProfile}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition shadow-md shadow-red-200 dark:shadow-red-950/50"
                  >
                    Edit Profile
                  </button>
                )}

              </div>

            </div>

            {/* ===============================
                EDIT PROFILE FORM
            =============================== */}

            {editingProfile ? (

              <form onSubmit={handleProfileSubmit}>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* FULL NAME */}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      Full Name
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
                    />
                  </div>

                  {/* EMAIL - NOT EDITABLE */}

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      Email
                    </label>

                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 p-3 rounded-xl cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                    />

                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      Email cannot be changed here.
                    </p>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
                    />
                  </div>

                  {/* BLOOD GROUP */}

                  <div>
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      Blood Group
                    </label>

                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={profileForm.bloodGroup}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* CITY */}

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      disabled={updating}
                      className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
                    />
                  </div>

                  {/* ROLE - NOT EDITABLE */}

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                    >
                      Account Role
                    </label>

                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 p-3 rounded-xl cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                    />

                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                      Account role cannot be changed.
                    </p>
                  </div>

                  {/* LAST DONATION DATE (FOR BLOOD DONORS) */}
                  {user.role === "Blood Donor" && (
                    <div className="md:col-span-2">
                      <label
                        htmlFor="lastDonationDate"
                        className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                      >
                        Last Blood Donation Date
                      </label>

                      <input
                        id="lastDonationDate"
                        name="lastDonationDate"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={profileForm.lastDonationDate}
                        onChange={handleProfileChange}
                        disabled={updating}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 cursor-pointer"
                      />

                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                        Select the date you last donated blood (leave empty if you haven't donated yet).
                      </p>

                      {profileForm.lastDonationDate && (
                        <div className="mt-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/60 text-xs">
                          {(() => {
                            const preview = calculateDonationEligibility(
                              profileForm.lastDonationDate
                            );
                            if (preview.cooldownActive) {
                              return (
                                <div className="text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                  <span className="text-sm shrink-0">⏳</span>
                                  <div>
                                    <p className="font-bold">
                                      Activates 90-Day Medical Cooldown:
                                    </p>
                                    <p className="mt-0.5 text-amber-700 dark:text-amber-400">
                                      {preview.daysRemaining} days remaining (eligible on {preview.formattedNextDate}). Availability will be locked to Temporarily Unavailable.
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div className="text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                                <span className="text-sm shrink-0">✅</span>
                                <div>
                                  <p className="font-bold">
                                    Medically Eligible:
                                  </p>
                                  <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                                    Over 90 days have passed since this donation. You will be fully eligible to donate blood!
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* FORM BUTTONS */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md shadow-red-200 dark:shadow-red-950/50 disabled:bg-red-300"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updating}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              /* ===============================
                 PROFILE DISPLAY
              =============================== */

              <div className="grid md:grid-cols-2 gap-5">

                {/* FULL NAME */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Full Name
                  </p>

                  <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1">
                    {user.fullName}
                  </p>
                </div>

                {/* EMAIL */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Email
                  </p>

                  <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1 break-all">
                    {user.email}
                  </p>
                </div>

                {/* PHONE */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Phone
                  </p>

                  <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1">
                    {user.phone}
                  </p>
                </div>

                {/* BLOOD GROUP */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Blood Group
                  </p>

                  <p className="font-bold text-red-600 dark:text-red-400 text-lg mt-1">
                    {user.bloodGroup}
                  </p>
                </div>

                {/* CITY */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    City
                  </p>

                  <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1">
                    {user.city}
                  </p>
                </div>

                {/* ROLE */}

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Account Role
                  </p>

                  <p className="font-semibold text-red-600 dark:text-red-400 mt-1">
                    {user.role}
                  </p>
                </div>

              </div>

            )}

          </div>

          {/* ===============================
              ACTIVITY CARD
          =============================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-50 dark:border-slate-800 dark:bg-slate-900">

            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
              Activity
            </h2>

            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 mb-6">
              Recent account information
            </p>

            {user.role === "Blood Donor" ? (
              <>

                <div className="border-b border-gray-100 dark:border-slate-800 pb-5 mb-5">

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Last Donation
                  </p>

                  <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1">
                    {formattedLastDonationDate}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Current Availability
                  </p>

                  <p
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${availabilityColor}`}
                  >
                    {user.availability || "Available"}
                  </p>

                </div>

              </>
            ) : (
              <div>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Account Status
                </p>

                <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
                  Active
                </p>

                <p className="text-gray-500 dark:text-slate-400 text-sm mt-5">
                  You can use LifeLink to find donors and manage your blood requests.
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ===============================
            DONOR AVAILABILITY
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 border border-red-50 dark:border-slate-800 dark:bg-slate-900">

            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
                  Donation Availability
                </h2>

                <p className="text-gray-500 dark:text-slate-400 mt-2">
                  Update your current availability so patients can find you through the donor search.
                </p>

              </div>

              <div>

                <label
                  htmlFor="availability"
                  className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2"
                >
                  Current Availability
                </label>

                <select
                  id="availability"
                  value={user.availability || "Available"}
                  onChange={handleAvailabilityChange}
                  disabled={updating}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option
                    value="Available"
                    disabled={isCooldownActive}
                  >
                    {isCooldownActive
                      ? "Available (🔒 Locked - 90d Cooldown Active)"
                      : "Available"}
                  </option>

                  <option value="Temporarily Unavailable">
                    Temporarily Unavailable
                  </option>

                  <option value="Not Available">
                    Not Available
                  </option>
                </select>

                {isCooldownActive && (
                  <div className="mt-3 p-3 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <span className="text-base shrink-0">🔒</span>
                    <div>
                      <p className="font-bold">Medical Recovery Guard Active</p>
                      <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                        Availability is auto-locked to <strong>Temporarily Unavailable</strong> during your 90-day post-donation recovery period. It will automatically unlock on <strong>{eligibility.formattedNextDate}</strong> ({eligibility.daysRemaining} days remaining).
                      </p>
                    </div>
                  </div>
                )}

                {updating && (
                  <p className="text-gray-500 dark:text-slate-400 text-sm mt-2">
                    Updating availability...
                  </p>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ===============================
            MY BLOOD DONATION CERTIFICATES
        =============================== */}

        {user.role === "Blood Donor" && (
          <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-red-50 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>📜</span>
                  <span>My Blood Donation Certificates</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  Official verified certificates awarded for each successful blood donation.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 w-fit">
                {certificates.length} Certificate
                {certificates.length !== 1 ? "s" : ""} Earned
              </span>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-4xl block mb-2">🏅</span>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
                  No Donation Certificates Yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  When you accept a blood request and complete the donation (marked Fulfilled by Admin), your official certificate with +20 points will be generated right here!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certificates.map((cert, index) => (
                  <div
                    key={cert._id || index}
                    className="group relative rounded-2xl border-2 border-[#C6A24D]/40 bg-gradient-to-br from-[#FFFDF9] to-[#FAF6EE] dark:from-slate-800/90 dark:to-slate-900 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          #{cert.donationNumber || index + 1} Donation
                        </span>
                        <span className="text-xs font-extrabold text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/50">
                          {cert.bloodGroup}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base font-serif">
                        Certificate of Appreciation
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ID: {cert.certificateId}
                      </p>

                      <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <p>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Patient:
                          </span>{" "}
                          {cert.patientName || "Patient in Need"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Hospital:
                          </span>{" "}
                          {cert.hospitalName || "Partner Hospital"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Date:
                          </span>{" "}
                          {new Date(
                            cert.issueDate || cert.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🏆</span>
                      <span>View & Print Certificate</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Certificate Modal */}
        {selectedCertificate && (
          <CertificateModal
            certificate={selectedCertificate}
            donor={user}
            onClose={() => setSelectedCertificate(null)}
          />
        )}

        {/* ===============================
            MESSAGE
        =============================== */}

        {message && (
          <div
            className={`mt-8 p-4 rounded-xl text-center font-semibold text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
            }`}
          >
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;