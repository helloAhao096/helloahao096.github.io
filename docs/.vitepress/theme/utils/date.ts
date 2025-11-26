// 日期格式化与计算工具

const MONTH_MAP: Record<string, string> = {
  "1": "Jan",
  "01": "Jan",
  "2": "Feb",
  "02": "Feb",
  "3": "Mar",
  "03": "Mar",
  "4": "Apr",
  "04": "Apr",
  "5": "May",
  "05": "May",
  "6": "Jun",
  "06": "Jun",
  "7": "Jul",
  "07": "Jul",
  "8": "Aug",
  "08": "Aug",
  "9": "Sep",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const HAS_TIME_REGEX = /\d{1,2}:\d{2}/;

/**
 * 将日期字符串转换为 "Month Day, Year" 或 "Month Day, Year HH:MM:SS" 格式
 */
export function formatDate(date: string): string {
  const parsed = parseDate(date);
  if (!parsed) {
    return date;
  }

  const monthKey = String(parsed.getMonth() + 1).padStart(2, "0");
  const month = MONTH_MAP[monthKey] || "Month";
  const day = pad(parsed.getDate());
  const base = `${month} ${day}, ${parsed.getFullYear()}`;

  if (!hasTimeComponent(date)) {
    return base;
  }

  const time = `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(
    parsed.getSeconds()
  )}`;
  return `${base} ${time}`;
}

/**
 * 将日期字符串统一成 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`
 */
export function normalizeDateString(date?: string): string {
  const parsed = parseDate(date);
  if (!parsed) {
    return (date ?? "").trim();
  }

  const base = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate()
  )}`;

  if (!hasTimeComponent(date)) {
    return base;
  }

  return `${base} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(
    parsed.getSeconds()
  )}`;
}

/**
 * 将日期字符串转换为毫秒时间戳
 */
export function dateToTimestamp(date?: string): number {
  const parsed = parseDate(date);
  return parsed ? parsed.getTime() : 0;
}

function parseDate(date?: string): Date | null {
  const input = (date ?? "").trim();
  const normalized = input
    ? input.includes("T")
      ? input
      : input.replace(" ", "T")
    : "";

  if (normalized) {
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (!input) {
    return new Date();
  }

  const fallback = new Date(input);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

function hasTimeComponent(date?: string): boolean {
  if (!date) {
    return false;
  }
  return HAS_TIME_REGEX.test(date);
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

