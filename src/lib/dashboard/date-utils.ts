const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const REFERENCE_YEAR = new Date().getFullYear();

function cleanDateInput(value: string): string {
  return value
    .split("·")[0]
    .replace(/^due\s+/i, "")
    .replace(/^exam:\s*/i, "")
    .trim();
}

function parseMonthDay(value: string, year = REFERENCE_YEAR): number | null {
  const match = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,\s*(\d{4}))?$/);

  if (!match) {
    return null;
  }

  const month = MONTHS[match[1].slice(0, 3).toLowerCase()];

  if (month === undefined) {
    return null;
  }

  const day = Number(match[2]);
  const parsedYear = match[3] ? Number(match[3]) : year;

  return new Date(parsedYear, month, day).getTime();
}

function parseMonthYear(value: string): number | null {
  const match = value.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);

  if (!match) {
    return null;
  }

  const month = MONTHS[match[1].slice(0, 3).toLowerCase()];

  if (month === undefined) {
    return null;
  }

  return new Date(Number(match[2]), month, 15).getTime();
}

function parseQuarterYear(value: string): number | null {
  const match = value.match(/^Q([1-4])\s+(\d{4})$/i);

  if (!match) {
    return null;
  }

  const quarter = Number(match[1]);
  const year = Number(match[2]);
  const month = (quarter - 1) * 3 + 1;

  return new Date(year, month, 15).getTime();
}

export function parseDashboardDate(value: string | undefined | null): number {
  if (!value) {
    return Number.MAX_SAFE_INTEGER;
  }

  const cleaned = cleanDateInput(value);

  if (!cleaned) {
    return Number.MAX_SAFE_INTEGER;
  }

  const lower = cleaned.toLowerCase();

  if (lower === "today") {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  if (lower === "tomorrow") {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  }

  const isoTimestamp = Date.parse(cleaned);

  if (!Number.isNaN(isoTimestamp)) {
    return isoTimestamp;
  }

  const quarterTimestamp = parseQuarterYear(cleaned);

  if (quarterTimestamp) {
    return quarterTimestamp;
  }

  const monthYearTimestamp = parseMonthYear(cleaned);

  if (monthYearTimestamp) {
    return monthYearTimestamp;
  }

  const monthDayTimestamp = parseMonthDay(cleaned);

  if (monthDayTimestamp) {
    return monthDayTimestamp;
  }

  return Number.MAX_SAFE_INTEGER;
}

export function getRelativeDateLabel(timestamp: number): string {
  if (timestamp === Number.MAX_SAFE_INTEGER) {
    return "";
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(timestamp);
  startOfTarget.setHours(0, 0, 0, 0);
  const diffDays = Math.round((startOfTarget.getTime() - startOfToday.getTime()) / 86400000);

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Tomorrow";
  }

  if (diffDays > 1 && diffDays <= 14) {
    return `In ${diffDays} days`;
  }

  return startOfTarget.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function compareDashboardDates(left: number, right: number): number {
  return left - right;
}
