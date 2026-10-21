/**
 * Utility functions for customer data formatting and parsing.
 */

export function parseTimestamp(ts) {
  if (!ts) return null;
  if (typeof ts === "object" && typeof ts._seconds === "number") {
    return new Date(ts._seconds * 1000);
  }
  if (typeof ts === "number") {
    return new Date(ts > 1e11 ? ts : ts * 1000);
  }
  const parsed = new Date(ts);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTime(ts) {
  const date = parseTimestamp(ts);
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatRelativeTime(ts) {
  const date = parseTimestamp(ts);
  if (!date) return "Never";
  
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSec < 0) return "Just now"; // handles slight clock skew
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}d ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

export function formatCurrencyINR(amount) {
  if (typeof amount !== "number") amount = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

