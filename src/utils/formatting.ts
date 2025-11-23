import {
  format,
  parseISO,
  isValid,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns";
import { Rate } from "../types/api";

// Date formatting utilities
export const formatDate = (
  date: string | Date,
  formatString: string = "MMM dd, yyyy"
): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
    return format(dateObj, formatString);
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatTime = (
  date: string | Date,
  formatString: string = "HH:mm"
): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Time";
    return format(dateObj, formatString);
  } catch (error) {
    return "Invalid Time";
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, "MMM dd, yyyy HH:mm");
};

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, "MMM dd");
};

export const formatDateLong = (date: string | Date): string => {
  return formatDate(date, "EEEE, MMMM dd, yyyy");
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 13 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

export const formatPhoneNumberDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length >= 10) {
    return `+91 ${cleaned.slice(-10, -5)} ${cleaned.slice(-5)}`;
  }
  return phone;
};

// Number formatting
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatCurrency = (
  amount: number,
  currency: string = "₹"
): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

export const formatLiters = (liters: number | string): string => {
  const num = typeof liters === "string" ? parseFloat(liters) : liters;
  return `${num.toFixed(2)} L`;
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Text formatting
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Status formatting
export const formatDeliveryStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    scheduled: "Scheduled",
    delivered: "Delivered",
    failed: "Failed",
    skipped: "Skipped",
  };
  return statusMap[status] || status;
};

export const formatSkipReason = (reason: string): string => {
  const reasonMap: Record<string, string> = {
    traveling: "Traveling",
    excess_stock: "Excess Stock",
    health: "Health Issues",
    other: "Other",
  };
  return reasonMap[reason] || reason;
};

// Time formatting
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(targetDate)) return "Invalid Date";

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(targetDate, "MMM dd, yyyy");
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Address formatting
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const isValidDate = (date: string): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

export const isPastDate = (date: string): boolean => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

// Array formatting
export const formatList = (
  items: string[],
  separator: string = ", "
): string => {
  return items.join(separator);
};

export const formatListWithAnd = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(", ")}, and ${lastItem}`;
};

// Number formatting with Indian number system
export const formatIndianNumber = (num: number): string => {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(1)} L`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} K`;
  }
  return num.toString();
};

// Get active rate from rate history for a specific date
export const getActiveRateForDate = (
  rateHistory: Rate[],
  targetDate: Date,
  fallbackRate?: string
): string => {
  if (!rateHistory || rateHistory.length === 0) {
    return fallbackRate || "0";
  }

  const date = new Date(targetDate);
  date.setHours(0, 0, 0, 0);

  // Sort rate_history by effective_from (most recent first) to check latest rates first
  const sortedRates = [...rateHistory].sort((a, b) => {
    const dateA = parseISO(a.effective_from).getTime();
    const dateB = parseISO(b.effective_from).getTime();
    return dateB - dateA;
  });

  // Find the rate that covers the target date
  for (const rate of sortedRates) {
    const effectiveFrom = parseISO(rate.effective_from);
    effectiveFrom.setHours(0, 0, 0, 0);

    const effectiveTo = rate.effective_to ? parseISO(rate.effective_to) : null;
    if (effectiveTo) {
      effectiveTo.setHours(23, 59, 59, 999); // Include the entire end date
    }

    // Check if target date is within the effective date range
    const isAfterOrEqualFrom =
      isEqual(date, effectiveFrom) || isAfter(date, effectiveFrom);
    const isBeforeOrEqualTo =
      !effectiveTo || isEqual(date, effectiveTo) || isBefore(date, effectiveTo);

    if (isAfterOrEqualFrom && isBeforeOrEqualTo) {
      return rate.daily_liters;
    }
  }

  // If no rate found for the target date, return fallback or the most recent rate's value
  return fallbackRate || sortedRates[0]?.daily_liters || "0";
};

// Get current active rate from rate history based on current date
export const getCurrentActiveRate = (
  rateHistory: Rate[],
  fallbackRate?: string
): string => {
  const today = new Date();
  return getActiveRateForDate(rateHistory, today, fallbackRate);
};

// Calculate average of all rate history values
export const getAverageRate = (rateHistory: Rate[]): string => {
  if (!rateHistory || rateHistory.length === 0) {
    return "0";
  }

  // Sum all daily_liters values
  const sum = rateHistory.reduce((acc, rate) => {
    const liters = parseFloat(rate.daily_liters) || 0;
    return acc + liters;
  }, 0);

  // Calculate average
  const average = sum / rateHistory.length;

  // Return formatted to 2 decimal places
  return average.toFixed(2);
};
