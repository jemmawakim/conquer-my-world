export type WarrantyStatus =
  { state: "active"; daysLeft: number } | { state: "expired"; daysAgo: number };

const MS_PER_DAY = 86_400_000;

/** `expiresOn` is an ISO date (YYYY-MM-DD); coverage includes that whole day (UTC). */
export function getWarrantyStatus(expiresOn: string, now: Date = new Date()): WarrantyStatus {
  const endOfCoverage = Date.parse(`${expiresOn}T23:59:59.999Z`);
  const diffDays = Math.ceil((endOfCoverage - now.getTime()) / MS_PER_DAY);
  return diffDays > 0
    ? { state: "active", daysLeft: diffDays }
    : { state: "expired", daysAgo: Math.abs(diffDays) };
}

export function formatIsoDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Must match the `warranty_months` column default in the database. */
export const WARRANTY_MONTHS = 12;

/**
 * Adds calendar months to an ISO date, clamping to the month's last day
 * (Jan 31 + 1 month = Feb 28), matching Postgres `date + interval`.
 */
export function addMonthsIso(isoDate: string, months: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}
