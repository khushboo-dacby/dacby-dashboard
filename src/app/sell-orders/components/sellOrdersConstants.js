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
    rejected_COU001: "Rejected Pickup Pending",
    rejected_pickup_pending: "Rejected Pickup Pending",
    COU001: "Pickup Pending",
    COU002: "Shipment Picked Up",
    COU003: "In Transit",
    COU004: "Delivered",
    COU007: "Shipment Lost",
    COU008: "Cancelled",

    // DACBY Statuses
    fast_delivery: "Same Day Pickup",
    selfship: "Selfship",
    DAC001: "Not Booked",
    DAC002: "Shipment Booked",
    DAC006: "Received In Warehouse",
    DAC007: "Accepted",
    DAC023: "Advance Transferred",
    DAC008: "Cancelled Before Dispatch",
    DAC009: "Return Initiated",
    DAC010: "Return Shipment Booked",
    DAC011: "Customer Confirmation Required",
    DAC012: "Not Accepted",
    DAC013: "Not Received",
    DAC014: "Payment Transferred",
    DAC019: "Picked Up",
    DAC021: "Under QC-1",
    DAC028: "Deduction Approval Pending (B2B)",
    DAC026: "Deduction Approved",
    DAC029: "Balance Payment Confirmation Pending",
    DAC030: "Balance Approved",
    b2b_payments_initiated_advance: "B2B Payments Initiated (Advance)",
};

export const STATUS_CODE_TS_KEYS = {
    rejected_COU001: ["rejected_pickup_pending", "pickup_pending", "COU001"],
    rejected_pickup_pending: ["rejected_pickup_pending", "pickup_pending", "COU001"],
    COU001: ["pickup_pending", "COU001"],
    COU002: ["shipment_picked_up", "picked_up", "COU002"],
    COU003: ["in_transit", "transit", "COU003"],
    COU004: ["delivered", "COU004"],
    COU007: ["shipment_lost", "lost", "COU007"],
    COU008: ["cancelled", "COU008"],
    fast_delivery: ["fast_delivery"],
    selfship: ["selfship"],
    DAC001: ["order_placed", "created_at", "not_booked", "DAC001"],
    DAC002: ["shipment_booked", "booked", "DAC002"],
    DAC006: ["received_in_warehouse", "warehouse_received", "DAC006"],
    DAC007: ["accepted", "DAC007"],
    DAC023: ["advance_transferred", "DAC023"],
    DAC008: ["cancelled", "cancelled_before_dispatch", "DAC008"],
    DAC009: ["return_initiated", "DAC009"],
    DAC010: ["return_shipment_booked", "DAC010"],
    DAC011: ["customer_confirmation_required", "DAC011"],
    DAC012: ["not_accepted", "DAC012"],
    DAC013: ["not_received", "DAC013"],
    DAC014: ["payment_transferred", "DAC014"],
    DAC019: ["picked_up", "DAC019"],
    DAC021: ["under_qc", "qc", "under_qc_1", "DAC021"],
    DAC028: ["deduction_approval_pending", "DAC028"],
    DAC026: ["deduction_approved", "DAC026"],
    DAC029: ["balance_payment_confirmation_pending", "DAC029"],
    DAC030: ["balance_approved", "DAC030"],
    b2b_payments_initiated_advance: ["b2b_payments_initiated_advance"],
};

export const COURIER_STATUS_OPTIONS = [
    { value: "all", label: "All Statuses", code: "in_process", rejected: false },
    { value: "rejected_COU001", label: "Rejected Pickup Pending (COU001)", code: "COU001", rejected: true },
    { value: "COU001", label: "Pickup Pending (COU001)", code: "COU001", rejected: false },
    { value: "COU002", label: "Shipment Picked Up (COU002)", code: "COU002", rejected: false },
    { value: "COU003", label: "In Transit (COU003)", code: "COU003", rejected: false },
    { value: "COU004", label: "Delivered (COU004)", code: "COU004", rejected: false },
    { value: "COU007", label: "Shipment Lost (COU007)", code: "COU007", rejected: false },
    { value: "COU008", label: "Cancelled (COU008)", code: "COU008", rejected: false },
];

export const DACBY_STATUS_OPTIONS = [
    { value: "all", label: "All DACBY Statuses" },
    { value: "fast_delivery", label: "Same Day Pickup (fast_delivery)" },
    { value: "selfship", label: "Selfship (selfship)" },
    { value: "DAC001", label: "Not Booked (DAC001)" },
    { value: "DAC002", label: "Shipment Booked (DAC002)" },
    { value: "DAC006", label: "Received In Warehouse (DAC006)" },
    { value: "DAC007", label: "Accepted (DAC007)" },
    { value: "DAC023", label: "Advance Transferred (DAC023)" },
    { value: "DAC008", label: "Cancelled Before Dispatch (DAC008)" },
    { value: "DAC009", label: "Return Initiated (DAC009)" },
    { value: "DAC010", label: "Return Shipment Booked (DAC010)" },
    { value: "DAC011", label: "Customer Confirmation Required (DAC011)" },
    { value: "DAC012", label: "Not Accepted (DAC012)" },
    { value: "DAC013", label: "Not Received (DAC013)" },
    { value: "DAC014", label: "Payment Transferred (DAC014)" },
    { value: "DAC019", label: "Picked Up (DAC019)" },
    { value: "DAC021", label: "Under QC-1 (DAC021)" },
    { value: "DAC028", label: "Deduction Approval Pending (B2B) (DAC028)" },
    { value: "DAC026", label: "Deduction Approved (DAC026)" },
    { value: "DAC029", label: "Balance Payment Confirmation Pending (DAC029)" },
    { value: "DAC030", label: "Balance Approved (DAC030)" },
    { value: "b2b_payments_initiated_advance", label: "B2B Payments Initiated (Advance) (b2b_payments_initiated_advance)" },
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
 * Computes all display properties for a sell order item consistently
 * across table view and mobile card view.
 */
export function getOrderComputedData(
    order,
    { courierStatusFilter = "all", dacbyStatusFilter = "all" } = {}
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
    // Products attached / Shipment booked
    const hasAttachedTimestamp = Boolean(
        rawStatusTs.ledger_attached ||
        rawStatusTs.shipment_booked ||
        rawStatusTs.DAC002
    );
    const isLedgerAttached = Boolean(
        hasAttachedTimestamp ||
        rawStatus.ledger_attached === true ||
        rawStatus.shipment_booked === true ||
        order.ledger_attached === true ||
        order.ledgerAttached === true
    );
    const rawAttachedTs =
        rawStatusTs.ledger_attached ||
        rawStatusTs.shipment_booked ||
        rawStatusTs.DAC002 ||
        order.ledgerAttachedTime ||
        order.shipmentBookedTime;
    const ledgerAttachedTime = formatMilestoneTime(
        typeof rawAttachedTs === "string" && !rawAttachedTs.startsWith("{")
            ? rawAttachedTs
            : formatFirebaseTimestamp(rawAttachedTs)
    ) || (order.ledgerAttachedTime ? formatMilestoneTime(order.ledgerAttachedTime) : null);

    // Ledger Completed (Ledger out / Warehouse received)
    const hasLedgerOutTimestamp = Boolean(
        rawStatusTs.ledger_out_done ||
        rawStatusTs.ledger_completed ||
        rawStatusTs.received_in_warehouse ||
        rawStatusTs.DAC006
    );
    const isLedgerOutDone = Boolean(
        hasLedgerOutTimestamp ||
        rawStatus.ledger_completed === true ||
        rawStatus.ledger_out_done === true ||
        rawStatus.received_in_warehouse === true ||
        order.ledger_completed === true ||
        order.ledgerCompleted === true ||
        order.ledgerOutDone === true
    );
    const rawLedgerOutTs =
        rawStatusTs.ledger_out_done ||
        rawStatusTs.ledger_completed ||
        rawStatusTs.received_in_warehouse ||
        rawStatusTs.DAC006 ||
        order.ledgerOutTime;
    const ledgerOutTime = formatMilestoneTime(
        typeof rawLedgerOutTs === "string" && !rawLedgerOutTs.startsWith("{")
            ? rawLedgerOutTs
            : formatFirebaseTimestamp(rawLedgerOutTs)
    ) || (order.ledgerOutTime ? formatMilestoneTime(order.ledgerOutTime) : null);

    // Ledger Completed (check if ledger_completed is present)
    const isLedgerCompleted = Boolean(
        rawStatusTs.ledger_completed ||
        rawStatus.ledger_completed === true ||
        order.ledger_completed === true ||
        order.ledgerCompleted === true
    );

    // Rejected Products check (add red badge in place of return or replacement)
    const hasRejectedProducts = Boolean(
        rawStatusTs.rejected_products ||
        rawStatus.rejected_products === true ||
        order.rejected_products === true ||
        order._rawData?.status?.rejected_products === true ||
        order.rejected === true ||
        order._rawData?.rejected === true
    );

    // 4. Return vs Selfship vs Replacement vs Rejected Badges
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
        rawStatusTs.DAC009 ||
        rawStatusTs.DAC010
    );

    let orderBadge = null;
    let orderBadgeType = "blue"; // "blue" | "red"

    if (hasRejectedProducts) {
        orderBadge = "REJECTED";
        orderBadgeType = "red";
    } else if (hasReplacementStamp) {
        orderBadge = "REPLACEMENT";
        orderBadgeType = "blue";
    } else if (hasReturnStamp) {
        orderBadge = "RETURN";
        orderBadgeType = "blue";
    }

    const isFastDelivery = Boolean(
        order.fastDelivery ||
        rawStatus.fast_delivery ||
        order._rawData?.fast_delivery ||
        rawStatus.last_status_code === "fast_delivery" ||
        order.lastStatusCode === "fast_delivery"
    );

    const isFilterActive = courierStatusFilter !== "all" || dacbyStatusFilter !== "all";
    const activeFilterCode = courierStatusFilter !== "all" ? courierStatusFilter : dacbyStatusFilter;

    let lastUpdatedStatusLabel = "Updated";
    let targetTimestamp = null;

    if (isFilterActive) {
        const rawLabel = STATUS_CODE_LABELS[activeFilterCode] || activeFilterCode;
        lastUpdatedStatusLabel = (rawLabel || "").replace(/\s*\([^)]*\)/g, "").trim();
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
                if (matchStage?.time) {
                    filterTs = matchStage.time;
                }
            }
        }

        if (!filterTs) {
            const rawProductsMap = order._rawData?.products || {};
            for (const pKey of Object.keys(rawProductsMap)) {
                const p = rawProductsMap[pKey];
                const hist = p?.status_history || {};
                for (const hKey of Object.keys(hist)) {
                    const st = hist[hKey];
                    if ((st?.code || "").toUpperCase() === activeFilterCode.toUpperCase() && st?.timestamp) {
                        filterTs = st.timestamp;
                        break;
                    }
                }
                if (filterTs) break;
            }
        }

        if (filterTs) {
            targetTimestamp = formatLastUpdatedDateTime(filterTs);
        } else {
            const fallbackTs =
                rawStatus.last_updated ||
                rawStatus.updated_at ||
                order.updated_at ||
                order._rawData?.updated_at ||
                order.created_at ||
                order._rawData?.created_at;
            targetTimestamp = formatLastUpdatedDateTime(fallbackTs);
        }
    }

    const pickupDate =
        order.pickupDate ||
        order.pickup_date ||
        order._rawData?.pickup_date ||
        order._rawData?.pickup?.date ||
        order._rawData?.logistics?.pickup_date ||
        order._rawData?.status?.pickup_date ||
        null;

    const pickupSlot =
        order.pickupSlot ||
        order.pickup_slot ||
        order._rawData?.pickup_slot ||
        order._rawData?.pickup?.slot ||
        order._rawData?.logistics?.pickup_slot ||
        order._rawData?.status?.pickup_slot ||
        null;

    let pickupStatusText = null;
    if (pickupDate && pickupSlot) {
        pickupStatusText = `Pickup: ${pickupDate} · ${pickupSlot}`;
    } else if (pickupDate) {
        pickupStatusText = `Pickup: ${pickupDate}`;
    } else if (pickupSlot) {
        pickupStatusText = `Pickup: ${pickupSlot}`;
    }

    return {
        totalProductsCount,
        productImage,
        productName,
        isFullyPaid,
        paidPct,
        customerType,
        displayFinalStatus,
        isCancelled,
        cancelledTime,
        isLedgerAttached,
        ledgerAttachedTime,
        isLedgerOutDone,
        ledgerOutTime,
        isLedgerCompleted,
        hasRejectedProducts,
        orderBadge,
        orderBadgeType,
        isFastDelivery,
        isFilterActive,
        activeFilterCode,
        lastUpdatedStatusLabel,
        targetTimestamp,
        pickupDate,
        pickupSlot,
        pickupStatusText,
    };
}
