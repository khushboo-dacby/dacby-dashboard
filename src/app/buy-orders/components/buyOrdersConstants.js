import { formatFirebaseTimestamp } from "../apis/api";

export const formatMilestoneTime = (timeStr) => {
    if (!timeStr || timeStr === "N/A") return null;
    return timeStr
        .replace(/\s\d{4},/, ",")
        .replace(/\b0(\d:\d\d\s(?:am|pm))/i, "$1");
};

export const formatShortTitle = (name, maxWords = 5) => {
    if (!name || typeof name !== "string") return "Product";
    const words = name.trim().split(/\s+/);
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(" ") + "...";
    }
    return name;
};

export const STATUS_CODE_LABELS = {
    // Courier Statuses
    COU001: "Pickup Pending",
    COU002: "Shipment Picked Up",
    COU003: "In Transit",
    COU004: "Delivered",
    COU005: "RTO Initiated",
    COU006: "RTO Delivered",
    COU007: "Shipment Lost",
    COU008: "Cancelled",
    COU009: "Return Delivered",

    // Forward DACBY Statuses
    DAC001: "Not Booked",
    DAC002: "Shipment Booked",
    DAC003: "Order Being Fulfilled",
    DAC008: "Cancelled Before Dispatch",
    DAC021: "Under QC",
    DAC022: "RTO Marked By Dacby",
    fast_delivery: "Fast Delivery",
    D003Y: "Pre Order",

    // Returns DACBY Statuses
    approved_refunds: "Approved Refunds",
    DAC006: "Received In Warehouse - (Return)",
    DAC009: "Return Initiated",
    DAC010: "Return Shipment Booked",
    DAC015: "Replacement Initiated",
    DAC016: "Replacement Shipment Booked",
    DAC024: "Refund Approved",
};

export const STATUS_CODE_TS_KEYS = {
    DAC001: ["order_placed", "created_at", "not_booked"],
    DAC002: ["shipment_booked", "booked"],
    DAC003: ["order_being_fulfilled", "fulfillment_started"],
    DAC006: ["received_in_warehouse", "warehouse_received", "received_in_warehouse_return", "DAC006"],
    DAC008: ["cancelled", "DAC008", "cancelled_before_dispatch"],
    DAC009: ["return_initiated", "DAC009"],
    DAC010: ["return_shipment_booked", "DAC010"],
    DAC015: ["replacement_initiated", "DAC015"],
    DAC016: ["replacement_shipment_booked", "DAC016"],
    DAC021: ["under_qc", "qc"],
    DAC022: ["rto_marked_by_dacby", "rto"],
    DAC024: ["refund_approved", "approved_refund", "DAC024"],
    approved_refunds: ["approved_refunds", "refund_approved", "refund", "DAC024"],
    COU001: ["pickup_pending", "COU001"],
    COU002: ["shipment_picked_up", "picked_up", "COU002"],
    COU003: ["in_transit", "transit", "COU003"],
    COU004: ["delivered", "COU004"],
    COU005: ["rto_initiated", "COU005"],
    COU006: ["rto_delivered", "COU006"],
    COU007: ["shipment_lost", "lost", "COU007"],
    COU008: ["cancelled", "COU008"],
    COU009: ["return_delivered", "COU009"],
};

export const COURIER_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "COU001", label: "Pickup Pending (COU001)" },
    { value: "COU002", label: "Shipment Picked Up (COU002)" },
    { value: "COU003", label: "In Transit (COU003)" },
    { value: "COU004", label: "Delivered (COU004)" },
    { value: "COU005", label: "RTO Initiated (COU005)" },
    { value: "COU006", label: "RTO Delivered (COU006)" },
    { value: "COU007", label: "Shipment Lost (COU007)" },
    { value: "COU008", label: "Cancelled (COU008)" },
    { value: "COU009", label: "Return Delivered (COU009)" },
];

export const FORWARD_DACBY_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "fast_delivery", label: "Fast Delivery (fast_delivery)" },
    { value: "D003Y", label: "Pre Order (D003Y)" },
    { value: "DAC001", label: "Not Booked (DAC001)" },
    { value: "DAC002", label: "Shipment Booked (DAC002)" },
    { value: "DAC003", label: "Order Being Fulfilled (DAC003)" },
    { value: "DAC008", label: "Cancelled Before Dispatch (DAC008)" },
    { value: "DAC021", label: "Under QC (DAC021)" },
    { value: "DAC022", label: "RTO Marked By Dacby (DAC022)" },
];

export const RETURN_DACBY_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "approved_refunds", label: "Approved Refunds (approved_refunds)" },
    { value: "DAC006", label: "Received In Warehouse - (Return) (DAC006)" },
    { value: "DAC009", label: "Return Initiated (DAC009)" },
    { value: "DAC010", label: "Return Shipment Booked (DAC010)" },
    { value: "DAC015", label: "Replacement Initiated (DAC015)" },
    { value: "DAC016", label: "Replacement Shipment Booked (DAC016)" },
    { value: "DAC024", label: "Refund Approved (DAC024)" },
];

export const formatLastUpdatedDateTime = (rawTs) => {
    if (!rawTs || rawTs === "N/A") return null;
    try {
        let millis = null;
        if (typeof rawTs === "object") {
            if (typeof rawTs._seconds === "number") {
                millis = rawTs._seconds * 1000 + Math.floor((rawTs._nanoseconds || 0) / 1000000);
            } else if (typeof rawTs.seconds === "number") {
                millis = rawTs.seconds * 1000;
            }
        } else if (typeof rawTs === "number") {
            millis = rawTs > 1e11 ? rawTs : rawTs * 1000;
        } else if (typeof rawTs === "string") {
            const d = new Date(rawTs);
            if (!isNaN(d.getTime())) {
                millis = d.getTime();
            }
        }
        if (!millis) return null;

        const date = new Date(millis);
        if (isNaN(date.getTime())) return null;

        const day = String(date.getDate()).padStart(2, "0");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        const formattedHours = String(hours).padStart(2, "0");

        return `${day} ${month} ${year} · ${formattedHours}:${minutes} ${ampm}`;
    } catch {
        return null;
    }
};

/**
 * Computes all display properties for an order item consistently
 * across table view and mobile card view.
 */
export function getOrderComputedData(
    order,
    { courierStatusFilter = "all", dacbyStatusFilter = "all", isReturns = false } = {}
) {
    const rawProducts = order._rawData?.products;
    const totalProductsCount =
        rawProducts && typeof rawProducts === "object"
            ? Object.keys(rawProducts).length
            : Array.isArray(order.products) && order.products.length > 0
                ? order.products.length
                : 1;

    const productImage = order.image || null;
    const productName = order.product || "Product";
    const isFullyPaid =
        (order.amountLeft <= 0 && order.totalAmount > 0) ||
        (order.amountPaid >= order.totalAmount && order.totalAmount > 0);
    const paidPct =
        order.totalAmount > 0
            ? Math.min(100, Math.round(((order.amountPaid || 0) / order.totalAmount) * 100))
            : 0;

    const customerType = (
        order.customerType ||
        order.customer_type ||
        order._rawData?.customer_type ||
        order._rawData?.source?.customer_type ||
        "B2C"
    ).toUpperCase();

    const rawStatus = (typeof order._rawData?.status === "object" && order._rawData?.status !== null)
        ? order._rawData.status
        : (typeof order.status === "object" && order.status !== null)
            ? order.status
            : {};
    const rawStatusTs = (typeof order._rawData?.status_timestamp === "object" && order._rawData?.status_timestamp !== null)
        ? order._rawData.status_timestamp
        : (typeof order.status_timestamp === "object" && order.status_timestamp !== null)
            ? order.status_timestamp
            : {};

    // 1. Status badge: check final_status ONLY
    const rawFinalStatus =
        rawStatus.final_status ||
        order.final_status ||
        order._rawData?.final_status ||
        "";
    const fsLower = String(rawFinalStatus || "").toLowerCase().trim();
    let displayFinalStatus = "In Process";
    if (fsLower === "unsuccess") {
        displayFinalStatus = "Unsuccess";
    } else if (fsLower === "success") {
        displayFinalStatus = "Success";
    } else if (fsLower === "in_process") {
        displayFinalStatus = "In Process";
    } else if (fsLower) {
        displayFinalStatus = fsLower.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
        displayFinalStatus = "In Process";
    }

    // 2. Cancellation: ONLY if cancelled === true field is found
    const isCancelled = Boolean(
        rawStatus.cancelled === true ||
        order.cancelled === true ||
        order._rawData?.cancelled === true ||
        (typeof order.status === "object" && order.status !== null && order.status.cancelled === true)
    );

    const rawCancelTs =
        rawStatusTs.cancelled ||
        rawStatusTs.DAC008 ||
        rawStatusTs.COU008 ||
        rawStatus.cancelled_timestamp ||
        rawStatus.last_updated;
    const cancelledTime = formatMilestoneTime(formatFirebaseTimestamp(rawCancelTs));

    // 3. Fulfillment Milestones:
    // Ledger Attached (Products attached)
    const hasAttachedTimestamp = Boolean(
        rawStatusTs.ledger_attached &&
        (typeof rawStatusTs.ledger_attached === "object" ||
         typeof rawStatusTs.ledger_attached === "number" ||
         typeof rawStatusTs.ledger_attached === "string")
    );
    const isLedgerAttached = Boolean(
        hasAttachedTimestamp ||
        rawStatus.ledger_attached === true ||
        order.ledger_attached === true ||
        order.ledgerAttached === true
    );
    const rawAttachedTs =
        rawStatusTs.ledger_attached ||
        rawStatus.ledger_attached_timestamp ||
        order.ledgerAttachedTime;
    const ledgerAttachedTime = formatMilestoneTime(
        typeof rawAttachedTs === "string" && !rawAttachedTs.startsWith("{")
            ? rawAttachedTs
            : formatFirebaseTimestamp(rawAttachedTs)
    ) || (order.ledgerAttachedTime ? formatMilestoneTime(order.ledgerAttachedTime) : null);

    // Ledger Completed (Ledger out)
    const hasLedgerOutTimestamp = Boolean(
        (rawStatusTs.ledger_out_done && (typeof rawStatusTs.ledger_out_done === "object" || typeof rawStatusTs.ledger_out_done === "number" || typeof rawStatusTs.ledger_out_done === "string")) ||
        (rawStatusTs.ledger_completed && (typeof rawStatusTs.ledger_completed === "object" || typeof rawStatusTs.ledger_completed === "number" || typeof rawStatusTs.ledger_completed === "string"))
    );
    const isLedgerOutDone = Boolean(
        hasLedgerOutTimestamp ||
        rawStatus.ledger_completed === true ||
        rawStatus.ledger_out_done === true ||
        order.ledger_completed === true ||
        order.ledgerCompleted === true ||
        order.ledgerOutDone === true
    );
    const rawLedgerOutTs =
        rawStatusTs.ledger_out_done ||
        rawStatusTs.ledger_completed ||
        order.ledgerOutTime;
    const ledgerOutTime = formatMilestoneTime(
        typeof rawLedgerOutTs === "string" && !rawLedgerOutTs.startsWith("{")
            ? rawLedgerOutTs
            : formatFirebaseTimestamp(rawLedgerOutTs)
    ) || (order.ledgerOutTime ? formatMilestoneTime(order.ledgerOutTime) : null);

    // 4. Return vs Replacement Badges:
    // Check ONLY timestamps in status_timestamp (not any other thing)
    const hasReplacementStamp = Boolean(
        rawStatusTs.replacement_shipment_booked ||
        rawStatusTs.replacement_initiated ||
        rawStatusTs.DAC015 ||
        rawStatusTs.DAC016
    );

    const hasReturnStamp = Boolean(
        rawStatusTs.return_delivered ||
        rawStatusTs.return_initiated ||
        rawStatusTs.return_shipment_booked ||
        rawStatusTs.received_in_warehouse ||
        rawStatusTs.DAC006 ||
        rawStatusTs.DAC009 ||
        rawStatusTs.DAC010 ||
        rawStatusTs.COU009
    );

    let orderBadge = null;
    if (hasReplacementStamp) {
        orderBadge = "REPLACEMENT";
    } else if (hasReturnStamp) {
        orderBadge = "RETURN";
    }

    const isFastDelivery = Boolean(
        order.fastDelivery ||
        rawStatus.fast_delivery ||
        order._rawData?.fast_delivery ||
        rawStatus.last_status_code === "fast_delivery" ||
        order.lastStatusCode === "fast_delivery"
    );

    const isFilterActive = isReturns
        ? courierStatusFilter !== "all" || dacbyStatusFilter !== "all"
        : (courierStatusFilter !== "all" || dacbyStatusFilter !== "all") &&
          dacbyStatusFilter !== "fast_delivery" &&
          dacbyStatusFilter !== "D003Y";
    const activeFilterCode = courierStatusFilter !== "all" ? courierStatusFilter : dacbyStatusFilter;

    let lastUpdatedStatusLabel = "Updated";
    let targetTimestamp = null;

    if (isFilterActive) {
        lastUpdatedStatusLabel = STATUS_CODE_LABELS[activeFilterCode] || activeFilterCode;
        let filterTs =
            rawStatusTs[activeFilterCode] ||
            rawStatusTs[activeFilterCode.toLowerCase()];

        if (!filterTs && STATUS_CODE_TS_KEYS[activeFilterCode]) {
            for (const k of STATUS_CODE_TS_KEYS[activeFilterCode]) {
                if (rawStatusTs[k]) {
                    filterTs = rawStatusTs[k];
                    break;
                }
            }
        }

        if (!filterTs && (activeFilterCode === "DAC008" || activeFilterCode === "COU008")) {
            filterTs = rawCancelTs;
        }

        if (!filterTs) {
            const stagesData = order.stages || order._rawData?.stages;
            if (Array.isArray(stagesData)) {
                const matchStage = stagesData.find(
                    (st) => (st.code || "").toUpperCase() === activeFilterCode.toUpperCase()
                );
                if (matchStage && (matchStage.time || matchStage.timestamp)) {
                    filterTs = matchStage.time || matchStage.timestamp;
                }
            } else if (stagesData && typeof stagesData === "object") {
                for (const stageKey of Object.keys(stagesData)) {
                    const st = stagesData[stageKey];
                    if (st && (st.code || "").toUpperCase() === activeFilterCode.toUpperCase()) {
                        if (st.timestamp || st.time) {
                            filterTs = st.timestamp || st.time;
                            break;
                        }
                    }
                }
            }
        }

        targetTimestamp = filterTs || rawStatus.last_updated || order._rawData?.updated_at || order.rawTimestamp;
    } else {
        if (isCancelled) {
            lastUpdatedStatusLabel = "Cancelled";
            targetTimestamp = rawCancelTs || rawStatus.last_updated || order._rawData?.updated_at || order.rawTimestamp;
        } else if (order.lastStatusCode && STATUS_CODE_LABELS[order.lastStatusCode]) {
            lastUpdatedStatusLabel = STATUS_CODE_LABELS[order.lastStatusCode];
            targetTimestamp = rawStatus.last_updated || order._rawData?.updated_at || order.rawTimestamp;
        } else {
            lastUpdatedStatusLabel = rawStatus.overall_status || order.status || "Updated";
            targetTimestamp = rawStatus.last_updated || order._rawData?.updated_at || order.rawTimestamp;
        }
    }

    const formattedDateTime =
        formatLastUpdatedDateTime(targetTimestamp) ||
        (order.createdAt ? order.createdAt.replace(",", " ·") : "N/A");

    return {
        totalProductsCount,
        productImage,
        productName,
        isFullyPaid,
        paidPct,
        customerType,
        isCancelled,
        cancelledTime,
        displayFinalStatus,
        isLedgerAttached,
        ledgerAttachedTime,
        isLedgerOutDone,
        ledgerOutTime,
        orderBadge,
        isFastDelivery,
        lastUpdatedStatusLabel,
        formattedDateTime,
    };
}
