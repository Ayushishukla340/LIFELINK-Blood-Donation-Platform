/**
 * 90-Day Blood Donation Medical Cooldown & Eligibility Utility
 * Medical Rule: Whole blood donors must wait at least 90 days (3 months)
 * between consecutive donations to allow hemoglobin & iron stores to recover.
 */

export const COOLDOWN_DAYS = 90;

export function calculateDonationEligibility(lastDonationDate) {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      cooldownActive: false,
      daysRemaining: 0,
      daysPassed: null,
      totalCooldownDays: COOLDOWN_DAYS,
      nextEligibleDate: null,
      formattedNextDate: null,
      formattedLastDate: null,
      progressPercent: 100,
      statusMessage: "Ready to Donate! Medically eligible.",
    };
  }

  const donationDate = new Date(lastDonationDate);
  if (isNaN(donationDate.getTime())) {
    return {
      isEligible: true,
      cooldownActive: false,
      daysRemaining: 0,
      daysPassed: null,
      totalCooldownDays: COOLDOWN_DAYS,
      nextEligibleDate: null,
      formattedNextDate: null,
      formattedLastDate: null,
      progressPercent: 100,
      statusMessage: "Ready to Donate! Medically eligible.",
    };
  }

  const now = new Date();
  const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  const nextEligibleTime = donationDate.getTime() + cooldownMs;
  const nextEligibleDate = new Date(nextEligibleTime);

  const diffMs = nextEligibleTime - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  const daysPassed = Math.max(
    0,
    Math.floor((now.getTime() - donationDate.getTime()) / (24 * 60 * 60 * 1000))
  );

  const cooldownActive = daysRemaining > 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((daysPassed / COOLDOWN_DAYS) * 100))
  );

  const formattedNextDate = nextEligibleDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedLastDate = donationDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    isEligible: !cooldownActive,
    cooldownActive,
    daysRemaining,
    daysPassed,
    totalCooldownDays: COOLDOWN_DAYS,
    nextEligibleDate,
    formattedNextDate,
    formattedLastDate,
    progressPercent,
    statusMessage: cooldownActive
      ? `You can donate again in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`
      : "Ready to Donate! Medically eligible.",
  };
}

export default calculateDonationEligibility;
