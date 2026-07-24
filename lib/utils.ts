import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number with thin thousands separators, e.g. 1,240,000 */
export function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Returns the next `count` days as label/value pairs for the booking flow. */
export function getUpcomingDays(count: number, from: Date = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from);
    date.setDate(from.getDate() + index);

    return {
      value: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isToday: index === 0,
    };
  });
}

/** Strips non-dialable characters so `tel:` / `wa.me` links stay valid. */
export function toDialable(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
