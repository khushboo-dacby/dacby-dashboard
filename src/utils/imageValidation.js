import { toast } from "sonner";

/**
 * Diagnoses whether an image URL is valid.
 * Protocol-relative URLs (//) and non-http/https URLs are treated as invalid.
 *
 * @param {string} rawUrl
 * @returns {{ isValid: boolean, reason?: string, message: string, sanitizedUrl?: string }}
 */
export function diagnoseImageUrl(rawUrl) {
  const url = String(rawUrl || "").trim();

  if (!url) {
    return {
      isValid: false,
      reason: "empty",
      message: "Please fill correct url using http or https",
    };
  }

  // Protocol-relative URLs are explicitly invalid as input
  if (url.startsWith("//")) {
    return {
      isValid: false,
      reason: "protocol_relative",
      message: "Please fill correct url using http or https",
    };
  }

  // Must begin with http:// or https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return {
      isValid: false,
      reason: "missing_protocol",
      message: "Please fill correct url using http or https",
    };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        isValid: false,
        reason: "invalid_protocol",
        message: "Please fill correct url using http or https",
      };
    }
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return {
        isValid: false,
        reason: "invalid_domain",
        message: "Please fill correct url using http or https",
      };
    }
  } catch {
    return {
      isValid: false,
      reason: "malformed_url",
      message: "Please fill correct url using http or https",
    };
  }

  return {
    isValid: true,
    message: "",
    sanitizedUrl: url,
  };
}

/**
 * Shows an error toast notifying the user to use http or https.
 * Uses Sonner's toast.error (displayed in red).
 *
 * @param {string} [customMessage]
 */
export function notifyInvalidImageUrl(customMessage) {
  toast.error(customMessage || "Please fill correct url using http or https", {
    id: "invalid-image-url-toast",
  });
}

/**
 * Sanitizes any image URL for safe rendering in next/image.
 * Converts protocol-relative URLs (//) to https://.
 * Returns an empty string if the URL is completely invalid, preventing next/image crashes.
 *
 * @param {any} rawUrl
 * @returns {string}
 */
export function sanitizeImageSrc(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let trimmed = rawUrl.trim();
  if (!trimmed) return "";

  // Convert protocol-relative to absolute https URL
  if (trimmed.startsWith("//")) {
    trimmed = `https:${trimmed}`;
  }

  // Allow local assets e.g. /dacby-assets/download.svg
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "";
  }

  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return "";
  }
}

/**
 * Handles onChange for image URL input fields.
 * If input starts with // or exceeds 8 characters without starting with http:// or https://,
 * it instantly resets the input to empty and displays a red toast notification.
 *
 * @param {string} value
 * @param {(val: string) => void} setValue
 * @returns {boolean} true if value was accepted, false if invalid and cleared
 */
export function handleImageInputChange(value, setValue) {
  const trimmed = value.trim();

  // Instantly block protocol-relative URLs
  if (trimmed.startsWith("//")) {
    setValue("");
    notifyInvalidImageUrl();
    return false;
  }

  // If user entered more than 8 chars (longer than "https://") but it's not http:// or https://
  if (
    trimmed.length > 8 &&
    !trimmed.startsWith("http://") &&
    !trimmed.startsWith("https://")
  ) {
    setValue("");
    notifyInvalidImageUrl();
    return false;
  }

  setValue(value);
  return true;
}

/**
 * Handles onPaste for image URL input fields.
 * If pasted text is invalid, prevents paste, clears input, and shows toast.
 *
 * @param {ClipboardEvent} event
 * @param {(val: string) => void} setValue
 * @returns {boolean}
 */
export function handleImageInputPaste(event, setValue) {
  const pastedText = event.clipboardData?.getData("text") || "";
  const diagnosis = diagnoseImageUrl(pastedText);

  if (!diagnosis.isValid) {
    event.preventDefault();
    setValue("");
    notifyInvalidImageUrl();
    return false;
  }

  return true;
}

/**
 * Handles onBlur for image URL input fields.
 * If non-empty field has an invalid URL, clears input and shows toast.
 *
 * @param {string} value
 * @param {(val: string) => void} setValue
 * @returns {boolean}
 */
export function handleImageInputBlur(value, setValue) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true;

  const diagnosis = diagnoseImageUrl(trimmed);
  if (!diagnosis.isValid) {
    setValue("");
    notifyInvalidImageUrl();
    return false;
  }

  return true;
}
