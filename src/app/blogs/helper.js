/**
 * DACBY Blogs Helper Utilities
 */

/**
 * Converts a Firebase Storage image URL to the Dacby Database Web App CDN format.
 *
 * Example:
 * Input:
 *   "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/1%20NEW%20WEBSITE%20LISTING%2Fblogs%2Fimage.jpg?alt=media&token=..."
 * Output:
 *   "https://dacby-database.web.app/cdn/1%20NEW%20WEBSITE%20LISTING%2Fblogs%2Fimage.jpg?alt=media&token=..."
 *
 * @param {string} url - Image URL string
 * @returns {string} CDN URL or original URL
 */
export function toCDN(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("//")) {
    trimmed = `https:${trimmed}`;
  }

  const FIREBASE_PREFIX =
    "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o";
  const CDN_PREFIX = "https://dacby-database.web.app/cdn";

  if (trimmed.startsWith(FIREBASE_PREFIX)) {
    return trimmed.replace(FIREBASE_PREFIX, CDN_PREFIX);
  }

  return trimmed;
}

export const convertImageToCdn = toCDN;

/**
 * Formats Firestore timestamps or standard dates for blog cards and detail views.
 *
 * @param {Object|string|number|Date} timestamp
 * @returns {string} Formatted human-readable date
 */
export function formatBlogDate(timestamp) {
  if (!timestamp) return "Recently added";

  // Firestore timestamp support: { _seconds, _nanoseconds } or { seconds, nanoseconds }
  const seconds = timestamp?._seconds ?? timestamp?.seconds;
  if (typeof seconds === "number") {
    const d = new Date(seconds * 1000);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (typeof timestamp === "string" || typeof timestamp === "number" || timestamp instanceof Date) {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  return "Recently added";
}

