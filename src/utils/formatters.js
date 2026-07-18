export function normalizeAttributeKey(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function normalizeAttributeKeyInput(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+/g, "");
}

export function formatDescriptionKey(value, { trimEnd = true } = {}) {
  const normalized = String(value || "")
    .trimStart()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+/g, "");
  const cleaned = trimEnd ? normalized.replace(/_+$/g, "") : normalized;
  const trailingUnderscore = !trimEnd && cleaned.endsWith("_");

  const formatted = cleaned
    .split("_")
    .filter(Boolean)
    .map((part) =>
      part === part.toUpperCase()
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join("_");

  return trailingUnderscore && formatted ? `${formatted}_` : formatted;
}

export function formatAttributeValue(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      if (word === word.toUpperCase()) return word;
      return word
        .split("-")
        .map((part) =>
          part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : "",
        )
        .join("-");
    })
    .join(" ");
}

export function formatAttributeDisplayName(value) {
  return String(value || "")
    .trim()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
export function toCDN(url) {
  const FIREBASE_PREFIX =
  "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o";

const CDN_PREFIX =
  "https://dacby-database.web.app/cdn";
  
  return typeof url === "string"
    ? url.replace(FIREBASE_PREFIX, CDN_PREFIX)
    : url;
}