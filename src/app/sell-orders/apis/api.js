import axios from "axios";

/**
 * DACBY Cloud Function Base URL & Endpoints for Sell Orders Pipeline
 */
export const BASE_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi";

export const FILTER_SELL_ORDERS_ENDPOINT = `${BASE_URL}/api/Orders/sell/filter-by-code`;

const LEGACY_IMAGE_CDN_PREFIX = "https://dacby-database.web.app/cdn/";
const FIREBASE_STORAGE_PREFIX =
  "https://firebasestorage.googleapis.com/v0/b/dacby-database.appspot.com/o/";

function normalizeOrderImageUrl(imageUrl) {
  if (typeof imageUrl !== "string") return imageUrl || null;

  const trimmedUrl = imageUrl.trim();
  if (!trimmedUrl) return null;

  return trimmedUrl.startsWith(LEGACY_IMAGE_CDN_PREFIX)
    ? `${FIREBASE_STORAGE_PREFIX}${trimmedUrl.slice(LEGACY_IMAGE_CDN_PREFIX.length)}`
    : trimmedUrl;
}

/**
 * Filter and fetch Sell Orders from the DACBY database Cloud Function.
 *
 * @param {Object} options
 * @param {number} [options.page=1] - Page number (defaults to 1)
 * @param {number} [options.limit=20] - Number of orders per page (defaults to 20)
 * @param {string|null} [options.startAfter=null] - Firestore document cursor
 * @param {string} [options.status_code="in_process"] - Status code to filter by (defaults to "in_process")
 * @returns {Promise<{ Orders: Array<Object>, pagination: Object, rawResponse: Object }>}
 */
export async function filterSellOrdersByCode(options = {}) {
  const {
    page = 1,
    limit = 20,
    startAfter = null,
    status_code = "in_process",
    rejected = false,
  } = options;

  // Payload for sell orders API
  const payload = {
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    startAfter: typeof startAfter === "string" && startAfter ? startAfter : null,
    status_code: status_code || "in_process",
  };

  if (Boolean(rejected)) {
    payload.rejected = true;
  }

  try {
    const response = await axios.post(FILTER_SELL_ORDERS_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response?.data || {};

    if (data?.error && !data?.Orders) {
      throw new Error(data.details || data.error || "Failed to fetch sell orders");
    }

    const rawOrders = Array.isArray(data?.Orders)
      ? data.Orders
      : Array.isArray(data?.orders)
        ? data.orders
        : [];

    const pagination = data?.pagination || {
      page: payload.page,
      limit: payload.limit,
      total: rawOrders.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
      nextPageStartAfter: null,
    };

    // Normalize each order item for seamless UI consumption while preserving _rawData
    const normalizedOrders = rawOrders.map(normalizeSellOrderItem);

    return {
      Orders: normalizedOrders,
      rawOrders,
      pagination,
      rawResponse: data,
    };
  } catch (error) {
    const errorMsg =
      error?.response?.data?.details ||
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load sell orders from DACBY portal API.";
    throw new Error(errorMsg);
  }
}

/**
 * Convenience helper to fetch Sell Orders.
 *
 * @param {Object} options - { page, limit, startAfter, status_code }
 */
export async function getSellOrders(options = {}) {
  return filterSellOrdersByCode(options);
}

/**
 * Helper to normalize an order object from the API response into a standard format
 *
 * @param {Object} order - Raw order object from the API
 * @returns {Object} Normalized UI-ready order
 */
export function normalizeSellOrderItem(order) {
  if (!order || typeof order !== "object") return {};

  const raw = order._rawData || order;
  const productsObj = raw.products || {};
  const productEntries = Object.entries(productsObj);
  const firstProduct = productEntries.length > 0 ? productEntries[0][1] : null;

  // Extract all products into an array
  const productsList = productEntries.map(([key, p]) => ({
    key,
    title: p?.title || "Product",
    sku: p?.sku || "N/A",
    category: p?.category?.name || "Gaming",
    imageUrl: normalizeOrderImageUrl(p?.image_url || p?.imageUrl || order.image || raw.image),
    unitPrice: Number(p?.unit_price ?? 0),
    totalPrice: Number(p?.total_price ?? 0),
    quantity: Number(p?.quantity ?? 1),
    ledgerId: p?.ledgerId || null,
    cogs: p?.cogs || null,
    ledgerOutDone: Boolean(p?.ledger_out_done),
    statusHistory: p?.status_history || {},
  }));

  const trackingObj = raw.tracking || {};
  const firstTrackingKey = Object.keys(trackingObj)[0];
  const firstTracking = firstTrackingKey ? trackingObj[firstTrackingKey] : null;

  const source = raw.source || order.source || {};
  const address = source.address || {};
  const payment = raw.payment || order.payment || {};
  const statusObj = raw.status || order.status || {};
  const statusTs = raw.status_timestamp || order.status_timestamp || {};

  // Formatted date from Firebase _seconds
  const createdAtFormatted = formatFirebaseTimestamp(order.created_at || raw.created_at);
  const ledgerAttachedTime = formatFirebaseTimestamp(statusTs.ledger_attached || statusTs.shipment_booked);
  const shipmentBookedTime = formatFirebaseTimestamp(statusTs.shipment_booked);
  const ledgerOutTime = formatFirebaseTimestamp(statusTs.ledger_out_done || statusTs.ledger_completed);

  // Extract stage history array
  const rawHistory = firstProduct?.status_history || {};
  const stageList = Object.values(rawHistory).map((st) => ({
    code: st?.code || "N/A",
    status: st?.status || "In Process",
    time: formatFirebaseTimestamp(st?.timestamp),
  }));

  const street = address.street || "";
  const city = address.city || order.city || "Unknown City";
  const state = address.state || "";
  const pincode = address.pincode ? String(address.pincode) : "";
  const fullAddress = [street, city, state, pincode].filter(Boolean).join(", ");

  return {
    id: order.id || raw.orderId || "N/A",
    orderId: raw.orderId || order.id || "N/A",
    customerName: source.name || order.customerName || "Customer",
    customerPhone: source.phone_number ? String(source.phone_number) : (order.customerPhone || "N/A"),
    customerEmail: source.email || order.customerEmail || "",
    customerType: (raw.customer_type || order.customer_type || source.customer_type || "B2C").toUpperCase(),
    userId: source.userId || "",
    city: city,
    state: state,
    pincode: pincode,
    street: street,
    fullAddress: fullAddress || city,
    product: order.product || raw.product || firstProduct?.title || "Product",
    image: normalizeOrderImageUrl(order.image || raw.image || firstProduct?.image_url || firstProduct?.imageUrl),
    sku: firstProduct?.sku || "N/A",
    category: firstProduct?.category?.name || "Consoles / CDs",
    products: productsList,
    totalAmount: Number(order.totalAmount ?? raw.final_amount ?? 0),
    amountPaid: Number(order.amountPaid ?? payment.amount_paid ?? 0),
    amountLeft: Number(order.amountLeft ?? payment.amount_left ?? 0),
    balanceAmount: Number(order.balanceAmount ?? 0),
    deliveryFee: Number(payment.delivery_fee ?? 0),
    paymentMethod: payment.method ? payment.method.toUpperCase() : payment.cod ? "COD" : "UPI",
    isCod: Boolean(payment.cod),
    isAdvance: Boolean(payment.advance),
    status: order.status || statusObj.overall_status || "in_process",
    lastStatusCode: order.last_status_code || statusObj.last_status_code || "Manifested",
    courier: firstTracking?.courier || "Delhivery",
    awb: firstTracking?.awb || "N/A",
    trackingLink: firstTracking?.link || firstProduct?.logistics?.logistics_1?.tracking_url || "",
    platform: raw.platform ? (raw.platform.toLowerCase() === "mobile" ? "Mobile" : "Web") : "Web",
    fastDelivery: Boolean(order.fast_delivery ?? raw.fast_delivery),
    specialAttention: order.special_attention?.reason || null,
    orderNotes: statusObj.notes || null,
    // Stepper milestone tracking states
    ledgerAttached: Boolean(statusTs.ledger_attached || statusObj.ledger_attached || statusTs.shipment_booked),
    ledgerAttachedTime: ledgerAttachedTime !== "N/A" ? ledgerAttachedTime : null,
    shipmentBookedTime: shipmentBookedTime !== "N/A" ? shipmentBookedTime : null,
    ledgerCompleted: Boolean(statusTs.ledger_completed || statusObj.ledger_completed),
    ledgerOutDone: Boolean(statusTs.ledger_out_done || statusTs.ledger_completed || statusObj.ledger_completed || statusObj.ledger_out_done || firstProduct?.ledger_out_done),
    ledgerOutTime: ledgerOutTime !== "N/A" ? ledgerOutTime : null,
    cancelled: Boolean(statusObj.cancelled === true || raw.cancelled === true || order.cancelled === true),
    final_status: statusObj.final_status || raw.final_status || null,
    stages: stageList,
    ledgerId: firstProduct?.ledgerId || null,
    cogs: firstProduct?.cogs || null,
    pickupDate: raw.pickup_date || order.pickup_date || raw.pickup?.date || raw.pickupDate || statusObj.pickup_date || null,
    pickupSlot: raw.pickup_slot || order.pickup_slot || raw.pickup?.slot || raw.pickupSlot || statusObj.pickup_slot || null,
    pickup_date: raw.pickup_date || order.pickup_date || raw.pickup?.date || raw.pickupDate || statusObj.pickup_date || null,
    pickup_slot: raw.pickup_slot || order.pickup_slot || raw.pickup?.slot || raw.pickupSlot || statusObj.pickup_slot || null,
    createdAt: createdAtFormatted,
    rawTimestamp: order.created_at || raw.created_at,
    _rawData: raw,
  };
}

/**
 * Parse Firebase timestamp {_seconds, _nanoseconds} into a human readable string.
 */
export function formatFirebaseTimestamp(ts) {
  if (!ts) return "N/A";
  try {
    const millis =
      typeof ts._seconds === "number"
        ? ts._seconds * 1000
        : typeof ts === "number"
          ? ts
          : null;

    if (!millis) return "N/A";

    const date = new Date(millis);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
}
