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
