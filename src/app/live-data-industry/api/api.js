const ORDERS_ANALYSIS_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/analytics/orders-analysis";

function toApiDate(value) {
  if (typeof value !== "string") {
    throw new TypeError("A date string is required.");
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return value;
  }

  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoDate) {
    const [, year, month, day] = isoDate;
    return `${day}-${month}-${year}`;
  }

  throw new TypeError("Use DD-MM-YYYY or YYYY-MM-DD dates.");
}

/**
 * Fetch order-analysis data for an inclusive date range.
 *
 * @param {{ startDate: string, endDate: string, signal?: AbortSignal }} options
 * @returns {Promise<object>} The API's analytics payload.
 */
export async function getOrdersAnalysis({ startDate, endDate, signal } = {}) {
  if (!startDate || !endDate) {
    throw new Error("Both startDate and endDate are required.");
  }

  const params = new URLSearchParams({
    start_date: toApiDate(startDate),
    end_date: toApiDate(endDate),
  });
  const response = await fetch(`${ORDERS_ANALYSIS_URL}?${params.toString()}`, {
    signal,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Orders analysis returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Orders analysis failed (${response.status}).`);
  }

  if (payload?.success === false) {
    throw new Error(payload.message || "Orders analysis was unsuccessful.");
  }

  return payload?.data ?? payload;
}

export { ORDERS_ANALYSIS_URL };
