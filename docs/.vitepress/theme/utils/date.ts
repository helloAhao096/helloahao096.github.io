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
export function formatDate(date: string | number | Date): string {
  const originalInput = normalizeInput(date);
  const parsed = parseDate(date);
  if (!parsed) {
    return originalInput;
  }

  const monthKey = String(parsed.getMonth() + 1).padStart(2, "0");
  const month = MONTH_MAP[monthKey] || "Month";
  const day = pad(parsed.getDate());
  const base = `${month} ${day}, ${parsed.getFullYear()}`;

  if (!hasTimeComponent(originalInput)) {
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
export function normalizeDateString(date?: string | number | Date): string {
  const originalInput = normalizeInput(date);
  const parsed = parseDate(date);
  if (!parsed) {
    return originalInput;
  }

  const base = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate()
  )}`;

  if (!hasTimeComponent(originalInput)) {
    return base;
  }

  return `${base} ${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(
    parsed.getSeconds()
  )}`;
}

/**
 * 纯数字格式：YYYY-MM-DD HH:mm:ss（用于列表等，无英文月份）
 * 无时分秒的日期会补 00:00:00。
 */
export function formatDateTimeNum(date?: string | number | Date): string {
  const parsed = parseDate(date);
  if (!parsed) return "";
  const y = parsed.getFullYear();
  const m = pad(parsed.getMonth() + 1);
  const d = pad(parsed.getDate());
  const h = pad(parsed.getHours());
  const min = pad(parsed.getMinutes());
  const s = pad(parsed.getSeconds());
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

/**
 * 将日期字符串转换为毫秒时间戳
 */
export function dateToTimestamp(date?: string | number | Date): number {
  const parsed = parseDate(date);
  return parsed ? parsed.getTime() : 0;
}

function parseDate(date?: string | number | Date): Date | null {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : new Date(date.getTime());
  }

  if (typeof date === "number") {
    const numericDate = new Date(date);
    return Number.isNaN(numericDate.getTime()) ? null : numericDate;
  }

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

function normalizeInput(date?: string | number | Date): string {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }
  if (typeof date === "number") {
    const numericDate = new Date(date);
    return Number.isNaN(numericDate.getTime()) ? "" : numericDate.toISOString();
  }
  return (date ?? "").toString().trim();
}

