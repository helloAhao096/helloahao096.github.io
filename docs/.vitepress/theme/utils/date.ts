// 日期格式化工具

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

/**
 * 将日期字符串转换为 "Month Day, Year" 格式
 * @param date 日期字符串，格式：YYYY-MM-DD
 * @returns 格式化后的日期字符串，如 "Jan 15, 2024"
 */
export function formatDate(date: string): string {
  const dateArray = date.split("-");
  if (dateArray.length < 3) {
    return date;
  }

  const year = dateArray[0];
  const month = MONTH_MAP[dateArray[1]] || "Month";
  const day = dateArray[2];

  return `${month} ${day}, ${year}`;
}

