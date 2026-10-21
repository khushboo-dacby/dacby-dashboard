"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Copy,
  Check,
  Package,
  CreditCard,
  MapPin,
  Clock,
  Calendar,
  Phone,
  Mail,
  User,
  Smartphone,
  Globe,
  Tag,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Truck,
  Shield,
  Layers,
  Printer,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
  TrendingDown,
  Info,
} from "lucide-react";
import {
  formatDateTime,
  formatRelativeTime,
  formatCurrencyINR,
  parseTimestamp,
} from "../customerUtils";

// Helper: Visual Fulfillment Stepper for Modal
function ModalFulfillmentStepper({ isSell, statusObj, statusTimestamp, overallStatus }) {
  const isCancelled =
    Boolean(statusObj?.cancelled) ||
    String(overallStatus || "").toLowerCase().includes("cancel");
  const isSuccess =
    Boolean(statusObj?.completed) ||
    String(statusObj?.final_status || "").toLowerCase() === "success" ||
    String(overallStatus || "").toLowerCase().includes("complete") ||
    String(overallStatus || "").toLowerCase().includes("deliver");

  const sellStages = [
    { key: "placed", label: "Placed", desc: "Trade-in registered" },
    { key: "pickup", label: "Pickup", desc: "Courier dispatched" },
    { key: "warehouse", label: "Intake", desc: "Received at hub" },
    { key: "qc", label: "QC Grading", desc: "Graded & evaluated" },
    { key: "settled", label: "Payout", desc: "Funds disbursed" },
  ];

  const buyStages = [
    { key: "placed", label: "Placed", desc: "Order confirmed" },
    { key: "processing", label: "Packed", desc: "Boxed for shipment" },
    { key: "dispatched", label: "Dispatched", desc: "Handed to courier" },
    { key: "transit", label: "In Transit", desc: "On vehicle" },
    { key: "delivered", label: "Delivered", desc: "Handed to buyer" },
  ];

  const stages = isSell ? sellStages : buyStages;

  // Compute active stage index based on status timestamps and flags
  const activeStageIndex = useMemo(() => {
    if (isCancelled) return -1;
    if (isSuccess) return stages.length - 1;

    const tsKeys = Object.keys(statusTimestamp || {}).map((k) =>
      k.toLowerCase()
    );

    if (isSell) {
      if (
        tsKeys.some((k) => k.includes("disbursed") || k.includes("payment_made"))
      )
        return 4;
      if (
        tsKeys.some(
          (k) =>
            k.includes("ledger") ||
            k.includes("qc") ||
            k.includes("evaluation") ||
            k.includes("payment_to_be_made")
        )
      )
        return 3;
      if (
        tsKeys.some(
          (k) => k.includes("warehouse") || k.includes("received_in_warehouse")
        )
      )
        return 2;
      if (
        tsKeys.some(
          (k) =>
            k.includes("pickup") ||
            k.includes("dispatch") ||
            k.includes("assigned")
        )
      )
        return 1;
      return 0;
    } else {
      if (tsKeys.some((k) => k.includes("deliver"))) return 4;
      if (tsKeys.some((k) => k.includes("transit") || k.includes("out_for_delivery")))
        return 3;
      if (tsKeys.some((k) => k.includes("dispatch") || k.includes("shipped")))
        return 2;
      if (tsKeys.some((k) => k.includes("pack") || k.includes("process")))
        return 1;
      return 0;
    }
  }, [isSell, isSuccess, isCancelled, statusTimestamp, stages.length]);

  return (
    <div className="rounded-2xl border border-[#DCE5F1] bg-gradient-to-b from-[#F8FAFC] to-white p-4 shadow-2xs">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-bold text-[10px] uppercase tracking-wider text-[#8190A9]">
          Fulfillment Journey · {isSell ? "Trade-in Lifecycle" : "Outbound Delivery"}
        </span>
        {isCancelled ? (
          <span className="rounded-md bg-[#FFF0F2] border border-[#F5C2CA] px-2 py-0.5 text-[10px] font-bold text-[#B83852]">
            Cancelled / RTO
          </span>
        ) : (
          <span className="rounded-md bg-[#ECFBF3] border border-[#B7F1CD] px-2 py-0.5 text-[10px] font-bold text-[#157348]">
            Stage {activeStageIndex + 1} of {stages.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {stages.map((st, idx) => {
          const isPassed = !isCancelled && idx < activeStageIndex;
          const isCurrent = !isCancelled && idx === activeStageIndex;
          const isPending = isCancelled || idx > activeStageIndex;

          return (
            <div key={st.key} className="flex flex-col items-center text-center">
              {/* Node indicator */}
              <div className="relative flex items-center justify-center w-full">
                {/* Connecting Line Left */}
                {idx > 0 && (
                  <div
                    className={`absolute left-0 right-1/2 top-3 h-0.5 -translate-y-1/2 ${
                      isPassed || isCurrent ? "bg-[#2A67EC]" : "bg-[#E2E8F0]"
                    }`}
                  />
                )}
                {/* Connecting Line Right */}
                {idx < stages.length - 1 && (
                  <div
                    className={`absolute left-1/2 right-0 top-3 h-0.5 -translate-y-1/2 ${
                      isPassed ? "bg-[#2A67EC]" : "bg-[#E2E8F0]"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition ${
                    isPassed
                      ? "bg-[#2A67EC] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#2A67EC] text-white ring-4 ring-[#C9DCFF]"
                      : "bg-[#F1F5F9] text-[#8190A9] border border-[#DCE5F1]"
                  }`}
                >
                  {isPassed ? "✓" : idx + 1}
                </div>
              </div>

              {/* Title & Desc */}
              <p
                className={`mt-1.5 text-xs font-bold ${
                  isCurrent
                    ? "text-[#2A67EC]"
                    : isPassed
                    ? "text-[#151D35]"
                    : "text-[#8190A9]"
                }`}
              >
                {st.label}
              </p>
              <p className="hidden sm:block text-[10px] text-[#8190A9] leading-tight">
                {st.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  userId = null,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- 1. EXTRACT DATA DIRECTLY FROM USER-ORDERS RESPONSE ---
  const orderId = String(order.orderId || order.id || "ORD-N/A");
  const docId = String(order.id || "");
  const isSell =
    Boolean(order.sell) ||
    String(order.type || order.order_type || "").toLowerCase().includes("sell") ||
    orderId.endsWith("S");
  const orderType = isSell ? "Sell Order" : "Buy Order";

  // Products normalization
  let productsList = [];
  if (order.products && typeof order.products === "object") {
    if (Array.isArray(order.products)) {
      productsList = order.products;
    } else {
      productsList = Object.entries(order.products).map(([key, p]) => ({
        _productKey: key,
        ...p,
      }));
    }
  } else if (Array.isArray(order.items)) {
    productsList = order.items.map((item, idx) => ({
      _productKey: `item_${idx + 1}`,
      ...(typeof item === "object" ? item : { title: String(item) }),
    }));
  }

  // Payment
  const payment = order.payment || {};
  const finalAmount = Number(
    order.final_amount ?? order.total ?? order.amount ?? 0
  );
  const amountPaid = Number(payment.amount_paid ?? 0);
  const amountLeft = Number(
    payment.amount_left ??
      (finalAmount - amountPaid >= 0 ? finalAmount - amountPaid : 0)
  );
  const paymentMethod =
    payment.method ||
    order.payment_method ||
    (payment.cash ? "cod" : "wallet");
  const accountDetails = payment.account_details || {};
  const bankAccountNo =
    accountDetails.account_number || payment.account_no || "";
  const bankName = accountDetails.bank_name || payment.bank_name || "";
  const accountHolder =
    accountDetails.account_holder || payment.account_holder_name || "";
  const ifscCode = accountDetails.ifsc_code || payment.ifsc || "";
  const upiId = payment.upi_id || "";

  // Source / Address
  const source = order.source || {};
  const sourceAddress = source.address || {};
  const recipientName = source.name || "Customer";
  const recipientPhone = source.phone_number
    ? String(source.phone_number)
    : "";
  const recipientEmail = source.email || "";
  const effectiveUserId = source.userId || userId || "o7c3upYdXDVnqclgLxQs";

  // Status & Timestamps
  const statusObj =
    typeof order.status === "object" && order.status !== null
      ? order.status
      : {};
  const overallStatus =
    statusObj.overall_status ||
    (typeof order.status === "string" ? order.status : "Order Placed");
  const finalStatus =
    statusObj.final_status || (statusObj.completed ? "success" : "in_process");
  const lastCodes = Array.isArray(statusObj.last_codes)
    ? statusObj.last_codes
    : [];
  const statusTimestamp = order.status_timestamp || {};
  const activities = Array.isArray(order.activity) ? order.activity : [];

  // Badges styling
  const isCancelled =
    Boolean(statusObj.cancelled) ||
    String(overallStatus).toLowerCase().includes("cancel");
  const isSuccess =
    statusObj.completed === true ||
    finalStatus === "success" ||
    String(overallStatus).toLowerCase().includes("complete") ||
    String(overallStatus).toLowerCase().includes("deliver");

  // QC Deductions count
  const qcDeductionItems = productsList.filter(
    (p) => Number(p.deduction || 0) > 0 || Boolean(p.rejection_reason)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#102449]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card - Single-Pane SaaS Flow */}
      <div
        className="relative z-10 w-full max-w-6xl rounded-2xl bg-white shadow-2xl border border-[#DCE5F1] flex flex-col max-h-[94vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. MODAL TOP SAAS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE5F1] px-5 py-3.5 bg-white">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="font-mono text-base sm:text-lg font-black text-[#151D35]">
                {orderId}
              </span>

              {/* Copy Order ID */}
              <button
                type="button"
                onClick={() => handleCopy(orderId, "modal-order-id")}
                className="text-[#8190A9] hover:text-[#2A67EC] transition p-1 rounded-md hover:bg-[#F2F5FA] cursor-pointer"
                title="Copy Order ID"
              >
                {copiedKey === "modal-order-id" ? (
                  <Check className="h-4 w-4 text-[#16B879]" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>

              {/* Order Type Badge */}
              <span
                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border ${
                  isSell
                    ? "bg-[#F3EEFF] text-[#704CF3] border-[#DDD0FF]"
                    : "bg-[#EDF3FF] text-[#2459C4] border-[#C9DCFF]"
                }`}
              >
                {orderType}
              </span>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border ${
                  isSuccess
                    ? "bg-[#ECFBF3] text-[#157348] border-[#B7F1CD]"
                    : isCancelled
                    ? "bg-[#FFF0F2] text-[#B83852] border-[#F5C2CA]"
                    : "bg-[#FFF8E9] text-[#C87513] border-[#F4D877]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSuccess
                      ? "bg-[#16B879]"
                      : isCancelled
                      ? "bg-[#D34D5D]"
                      : "bg-[#E69919]"
                  }`}
                />
                <span>{overallStatus || finalStatus}</span>
              </span>

              {/* Platform Badge */}
              {order.platform && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#F2F5FA] border border-[#DCE5F1] px-2 py-0.5 text-[11px] font-semibold text-[#53647F]">
                  {String(order.platform).toLowerCase() === "mobile" ? (
                    <Smartphone className="h-3 w-3" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  <span>{order.platform}</span>
                </span>
              )}
            </div>

            {/* Subline: Timestamps */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#71809A]">
              <span>Placed {formatDateTime(order.created_at)}</span>
              <span className="text-[#C7D5E8]">
                ({formatRelativeTime(order.created_at)})
              </span>
              {order.updated_at && (
                <>
                  <span>•</span>
                  <span>Updated {formatDateTime(order.updated_at)}</span>
                </>
              )}
            </div>
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Print Invoice */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 text-xs font-bold text-[#53647F] shadow-2xs hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer"
              title="Print Order Summary"
            >
              <Printer className="h-3.5 w-3.5 text-[#8190A9]" />
              <span className="hidden sm:inline">Print</span>
            </button>


            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCE5F1] bg-white text-[#53647F] hover:bg-[#FFF0F2] hover:text-[#D34D5D] hover:border-[#F5C2CA] transition shadow-2xs cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. UNIFIED SCROLLABLE SINGLE-PANE WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#F8FAFC]">
          {/* Visual Fulfillment Stepper */}
          <ModalFulfillmentStepper
            isSell={isSell}
            statusObj={statusObj}
            statusTimestamp={statusTimestamp}
            overallStatus={overallStatus}
          />

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-[#DCE5F1] bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8190A9]">
                Final Amount
              </span>
              <p className="mt-0.5 text-base font-black text-[#2A67EC]">
                {formatCurrencyINR(finalAmount)}
              </p>
            </div>
            <div className="rounded-xl border border-[#DCE5F1] bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8190A9]">
                Total Line Items
              </span>
              <p className="mt-0.5 text-base font-black text-[#151D35]">
                {productsList.length}{" "}
                {productsList.length === 1 ? "Product" : "Products"}
              </p>
            </div>
            <div className="rounded-xl border border-[#DCE5F1] bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8190A9]">
                Payment Status
              </span>
              <p className="mt-0.5 font-bold text-xs">
                {amountLeft === 0 ? (
                  <span className="text-[#157348] font-extrabold">Fully Paid</span>
                ) : amountPaid > 0 ? (
                  <span className="text-[#C87513]">Partial Paid</span>
                ) : (
                  <span className="text-[#D34D5D]">Unpaid</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-[#DCE5F1] bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8190A9]">
                Fulfillment Mode
              </span>
              <p className="mt-0.5 font-bold text-xs text-[#151D35]">
                {order.fast_delivery ? "Fast Delivery" : "Standard"}
              </p>
            </div>
          </div>

          {/* 2-Column Split: Unified Left Flow + Pinned Right Rail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Flow (8 cols): Line Items + QC Deductions + Lifecycle History */}
            <div className="lg:col-span-8 space-y-6">
              {/* SECTION 1: LINE ITEMS TABLE */}
              <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCE5F1] pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#2A67EC]" />
                    <h3 className="text-sm font-bold text-[#151D35]">
                      Line Items ({productsList.length})
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#71809A]">
                    Total Units:{" "}
                    <strong className="text-[#151D35]">
                      {productsList.reduce(
                        (sum, p) => sum + (Number(p.quantity) || 1),
                        0
                      )}
                    </strong>
                  </span>
                </div>

                <div className="space-y-3.5">
                  {productsList.map((p, pIdx) => {
                    const pTitle =
                      p.title || p.name || p.sku || `Product ${pIdx + 1}`;
                    const pCatName =
                      p.category?.name || p.category || p.spec_id || "General";
                    const pCatCode = p.category?.code || "";
                    const pQty = Number(p.quantity || 1);
                    const pUnitPrice = Number(p.unit_price || p.price || 0);
                    const pTotalPrice = Number(
                      p.total_price || pUnitPrice * pQty || 0
                    );
                    const stages = p.status_history
                      ? Object.entries(p.status_history)
                      : [];

                    return (
                      <div
                        key={p._productKey || pIdx}
                        className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-4 text-xs space-y-3 transition hover:bg-white hover:shadow-xs"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Image */}
                          <div className="relative h-16 w-16 min-w-16 rounded-xl border border-[#DCE5F1] bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={pTitle}
                                className="h-full w-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <Package className="h-6 w-6 text-[#8190A9]" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm text-[#151D35]">
                                  {pTitle}
                                </h4>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[#71809A]">
                                  <span className="rounded-md bg-[#EDF3FF] px-2 py-0.5 font-bold text-[#2A67EC]">
                                    {pCatName} {pCatCode ? `(${pCatCode})` : ""}
                                  </span>
                                  {p.sku && (
                                    <span className="font-mono text-[#53647F]">
                                      SKU: <strong>{p.sku}</strong>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-left sm:text-right shrink-0">
                                <p className="text-base font-extrabold text-[#151D35]">
                                  {formatCurrencyINR(pTotalPrice)}
                                </p>
                                <p className="text-[11px] text-[#71809A]">
                                  {pQty} × {formatCurrencyINR(pUnitPrice)}
                                </p>
                              </div>
                            </div>

                            {/* Item Specs Badges */}
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] rounded-lg bg-white border border-[#DCE5F1] p-2">
                              <div>
                                <span className="text-[#8190A9]">Product ID:</span>
                                <p className="font-mono font-bold text-[#151D35] truncate">
                                  {p.product_id || "—"}
                                </p>
                              </div>
                              <div>
                                <span className="text-[#8190A9]">Weight:</span>
                                <p className="font-bold text-[#151D35]">
                                  {p.weight ? `${p.weight} kg` : "—"}
                                </p>
                              </div>
                              {p.deduction !== undefined && (
                                <div>
                                  <span className="text-[#8190A9]">Deduction:</span>
                                  <p className="font-bold text-[#D34D5D]">
                                    {formatCurrencyINR(p.deduction)}
                                  </p>
                                </div>
                              )}
                              {p.rejection_reason && (
                                <div>
                                  <span className="text-[#8190A9]">Rejection:</span>
                                  <p className="font-bold text-[#B83852] truncate">
                                    {p.rejection_reason}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Stage history */}
                            {stages.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {stages.map(([stKey, stVal]) => (
                                  <span
                                    key={stKey}
                                    className="inline-flex items-center gap-1 rounded-md bg-white border border-[#DCE5F1] px-2 py-0.5 text-[10px] font-semibold text-[#53647F]"
                                  >
                                    <span className="text-[#2A67EC]">✓</span>
                                    <span>{stVal.status || stKey}</span>
                                    {stVal.timestamp && (
                                      <span className="text-[#8190A9] font-mono">
                                        ({formatRelativeTime(stVal.timestamp)})
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: QC VALUATION & DEDUCTIONS BREAKDOWN */}
              {qcDeductionItems.length > 0 && (
                <div className="rounded-2xl border border-[#F4D877] bg-[#FFFDF5] p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F4D877]/80 pb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-[#C87513]" />
                      <h3 className="text-sm font-bold text-[#7A4B05]">
                        QC Valuation & Deductions Matrix ({qcDeductionItems.length})
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#FFF0D4] border border-[#F4D877] px-2 py-0.5 text-[10px] font-bold text-[#C87513]">
                      Evaluation Report
                    </span>
                  </div>

                  <div className="space-y-3">
                    {qcDeductionItems.map((item, qIdx) => (
                      <div
                        key={qIdx}
                        className="rounded-xl border border-[#F4D877]/80 bg-white p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div>
                          <p className="font-bold text-[#151D35]">
                            {item.title || item.sku || `Product ${qIdx + 1}`}
                          </p>
                          {item.rejection_reason && (
                            <p className="mt-0.5 text-[#B83852] font-semibold">
                              Reason: {item.rejection_reason}
                            </p>
                          )}
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-sm font-extrabold text-[#D34D5D]">
                            -{formatCurrencyINR(item.deduction || 0)}
                          </p>
                          <span className="text-[10px] font-bold uppercase text-[#8190A9]">
                            Deduction Applied
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: LIFECYCLE AUDIT TRAIL */}
              {(activities.length > 0 || Object.keys(statusTimestamp).length > 0) && (
                <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#DCE5F1] pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2A67EC]" />
                      <h3 className="text-sm font-bold text-[#151D35]">
                        Lifecycle Activity & Audit Stream
                      </h3>
                    </div>
                    {statusObj.cancellation_reason && (
                      <span className="text-xs font-bold text-[#D34D5D]">
                        Cancelled: {statusObj.cancellation_reason}
                      </span>
                    )}
                  </div>

                  {/* Activity List */}
                  <div className="divide-y divide-[#DCE5F1]/60 text-xs">
                    {activities.length > 0 ? (
                      activities.map((act, aIdx) => (
                        <div
                          key={act.id || aIdx}
                          className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#2A67EC]" />
                            <span className="font-semibold text-[#151D35]">
                              {act.status || act.action || "Status Update"}
                            </span>
                            {act.code && (
                              <span className="rounded bg-[#F2F5FA] px-1.5 py-0.2 font-mono text-[10px] text-[#53647F]">
                                {act.code}
                              </span>
                            )}
                            {act.user_name && (
                              <span className="text-[#8190A9]">
                                by <strong>{act.user_name}</strong>
                              </span>
                            )}
                          </div>
                          <span className="text-[#8190A9] text-[11px] font-mono">
                            {formatDateTime(act.timestamp)}
                          </span>
                        </div>
                      ))
                    ) : (
                      Object.entries(statusTimestamp).map(([sKey, sVal]) => (
                        <div
                          key={sKey}
                          className="py-2 flex items-center justify-between gap-4"
                        >
                          <span className="font-semibold text-[#151D35] capitalize">
                            {sKey.replace(/_/g, " ")}
                          </span>
                          <span className="font-mono text-[#8190A9]">
                            {formatDateTime(sVal)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Inspector Rail (4 cols): Customer + Payment Summary */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Customer & Shipping Recipient */}
              <div className="rounded-2xl border border-[#DCE5F1] bg-white p-4 sm:p-5 shadow-xs space-y-3.5 text-xs">
                <div className="flex items-center gap-2 border-b border-[#DCE5F1] pb-2.5 font-bold text-sm text-[#151D35]">
                  <User className="h-4 w-4 text-[#2A67EC]" />
                  <span>Customer & Recipient</span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#8190A9]">Name</p>
                  <p className="mt-0.5 font-bold text-sm text-[#151D35]">
                    {recipientName}
                  </p>
                </div>

                {recipientPhone && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#8190A9]">Phone</p>
                    <div className="mt-0.5 flex items-center gap-1.5 font-bold text-[#151D35]">
                      <span>{recipientPhone}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(recipientPhone, "modal-phone")}
                        className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer"
                        title="Copy phone"
                      >
                        {copiedKey === "modal-phone" ? (
                          <Check className="h-3 w-3 text-[#16B879]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {recipientEmail && (
                  <div>
                    <p className="text-[11px] font-semibold text-[#8190A9]">Email</p>
                    <p className="mt-0.5 font-medium text-[#151D35] truncate">
                      {recipientEmail}
                    </p>
                  </div>
                )}

                {/* Delivery Address */}
                <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3">
                  <div className="flex items-center gap-1.5 font-bold text-[#151D35] mb-1">
                    <MapPin className="h-3.5 w-3.5 text-[#2A67EC]" />
                    <span>Address</span>
                  </div>
                  <p className="font-semibold text-xs text-[#151D35] leading-snug">
                    {sourceAddress.street || "No street address recorded"}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#53647F]">
                    {[sourceAddress.city, sourceAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                    {sourceAddress.pincode ? ` · ${sourceAddress.pincode}` : ""}
                  </p>
                </div>
              </div>

              {/* Card 2: Payment Settlement & Breakdown */}
              <div className="rounded-2xl border border-[#DCE5F1] bg-white p-4 sm:p-5 shadow-xs space-y-3.5 text-xs">
                <div className="flex items-center gap-2 border-b border-[#DCE5F1] pb-2.5 font-bold text-sm text-[#151D35]">
                  <CreditCard className="h-4 w-4 text-[#2A67EC]" />
                  <span>Financial Breakdown</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#71809A]">Total Amount:</span>
                    <strong className="text-[#151D35]">
                      {formatCurrencyINR(finalAmount)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#71809A]">Amount Paid:</span>
                    <strong className="text-[#157348]">
                      {formatCurrencyINR(amountPaid)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#71809A]">Amount Due / Left:</span>
                    <strong
                      className={
                        amountLeft > 0 ? "text-[#D34D5D]" : "text-[#157348]"
                      }
                    >
                      {formatCurrencyINR(amountLeft)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-[#DCE5F1]/60">
                    <span className="text-[#71809A]">Method:</span>
                    <strong className="uppercase font-bold text-[#2A67EC]">
                      {paymentMethod}
                    </strong>
                  </div>
                </div>

                {/* Bank / UPI Settlement Details */}
                {(bankAccountNo || upiId) && (
                  <div className="mt-3 rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#151D35] mb-1">
                      <Building2 className="h-3.5 w-3.5 text-[#16B879]" />
                      <span>Payout Account</span>
                    </div>
                    {bankAccountNo && (
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-[#71809A]">A/C:</span>
                        <strong className="text-[#151D35]">{bankAccountNo}</strong>
                      </div>
                    )}
                    {ifscCode && (
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-[#71809A]">IFSC:</span>
                        <strong className="text-[#151D35]">{ifscCode}</strong>
                      </div>
                    )}
                    {upiId && (
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-[#71809A]">UPI:</span>
                        <strong className="text-[#151D35]">{upiId}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. MODAL FOOTER */}
        <div className="border-t border-[#DCE5F1] px-5 py-3 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#8190A9]">
              Doc ID: {docId || orderId}
            </span>
            <span className="text-[#C7D5E8]">·</span>
            <span className="text-[#157348] font-bold text-[11px]">
              Live from user-orders API
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DCE5F1] bg-white px-4 py-2 font-bold text-[#53647F] shadow-2xs hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
