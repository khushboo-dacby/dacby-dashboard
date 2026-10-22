"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Package,
    Check,
    Copy,
    Phone,
    MapPin,
    Mail,
    Clock,
    X,
    Globe,
    Smartphone,
    Zap,
    CircleCheckBig,
    XCircle,
    Calendar,
} from "lucide-react";
import {
    formatShortTitle,
    getOrderComputedData,
} from "./sellOrdersConstants";

export default function SellOrderMobileCard({
    order,
    isStatusFilterApplied = false,
    courierStatusFilter = "all",
    dacbyStatusFilter = "all",
    activeStatusCode = "in_process",
    copiedKey,
    handleCopy,
    baseRoute = "/sell-orders",
}) {
    const router = useRouter();

    const {
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
        orderBadge,
        orderBadgeType,
        isFastDelivery,
        activeFilterCode,
        lastUpdatedStatusLabel,
        targetTimestamp,
        pickupStatusText,
    } = getOrderComputedData(order, {
        courierStatusFilter,
        dacbyStatusFilter,
    });

    return (
        <div
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-2xs space-y-3 cursor-pointer hover:border-blue-300 transition"
        >
            {/* Top Row: Thumbnail + Order ID, Product Title, Status Pill */}
            <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {productImage ? (
                        <Image
                            src={productImage}
                            alt={productName}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon");
                                if (fallback) fallback.classList.remove("hidden");
                            }}
                        />
                    ) : null}
                    <div className={`flex h-full w-full items-center justify-center text-gray-400 ${productImage ? "hidden" : "flex"}`}>
                        <Package className="h-5 w-5" />
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    {/* Line 1: Order ID, copy, fast delivery icon, and In Process / Final Status pill */}
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-base font-semibold text-[#151D35] truncate">
                                {order.id}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy?.(order.id, `mob-id-${order.id}`);
                                }}
                                className="text-slate-500 hover:text-slate-800 p-0.5 rounded cursor-pointer shrink-0"
                                title="Copy Order ID"
                            >
                                {copiedKey === `mob-id-${order.id}` ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                            {isFastDelivery && (
                                <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" title="Fast Delivery" />
                            )}
                        </div>

                        <span
                            className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold shrink-0 ${
                                displayFinalStatus === "Unsuccess"
                                    ? "border-rose-300 bg-rose-50 text-rose-800"
                                    : displayFinalStatus === "Success"
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                                        : "border-amber-300 bg-amber-50 text-amber-900"
                            }`}
                        >
                            {displayFinalStatus}
                        </span>
                    </div>

                    {/* Line 2: Product Name & Multi-Product */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-base font-medium text-slate-700 truncate" title={productName}>
                            {formatShortTitle(productName, 5)}
                        </h4>
                        {totalProductsCount > 1 && (
                            <span className="inline-flex items-center rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-sm font-semibold text-sky-700 shrink-0 whitespace-nowrap">
                                +{totalProductsCount - 1} more
                            </span>
                        )}
                    </div>

                    {/* Line 3: Order Badges (if present) - Red for REJECTED, Blue for others */}
                    {orderBadge && (
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-bold tracking-wide uppercase shrink-0 ${
                                    orderBadgeType === "red"
                                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                                        : "bg-[#DBEAFE] text-[#1D4ED8]"
                                }`}
                            >
                                {orderBadge}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Details Strip */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3.5 text-base space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-gray-900 text-base truncate">{order.customerName}</span>
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-sm font-bold uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                            {customerType}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-slate-700 font-medium shrink-0">
                        {order.platform === "Web" ? (
                            <Globe className="h-3 w-3 text-slate-500" />
                        ) : (
                            <Smartphone className="h-3 w-3 text-slate-500" />
                        )}
                        <span>{order.platform || "Web"}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 text-sm font-medium">
                    {order.customerPhone && order.customerPhone !== "N/A" && (
                        <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                            {order.customerPhone}
                        </span>
                    )}
                    {order.city && (
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                            {order.city}
                        </span>
                    )}
                </div>
            </div>

            {/* Financials Strip */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-sm">
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#151D35] text-xl">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center rounded bg-gray-100 border border-gray-300 px-2 py-0.5 text-xs font-bold text-gray-700">
                        {order.paymentMethod || "UPI"}
                    </span>
                </div>

                <div>
                    {isFullyPaid ? (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            Paid
                        </span>
                    ) : (
                        <div className="text-right text-sm">
                            <span className="text-emerald-700 font-semibold">
                                Paid: ₹{order.amountPaid.toLocaleString("en-IN")}
                            </span>
                            <span className="text-slate-400 mx-1">·</span>
                            <span className="text-rose-600 font-semibold">
                                Due: ₹{order.amountLeft.toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Ledger Completed Check / Cross */}
            <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700 text-sm">
                    Ledger Completed
                </span>
                <div>
                    {isLedgerCompleted ? (
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-sm">
                            <CircleCheckBig className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                            <span>Completed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-rose-600 font-semibold text-sm">
                            <XCircle className="h-4 w-4 text-rose-500 stroke-[2.2]" />
                            <span>Pending</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Pickup Status (if present) */}
            {pickupStatusText && (
                <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 text-sm">Pickup</span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#832608]">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-[#832608]" />
                        <span>{pickupStatusText}</span>
                    </div>
                </div>
            )}

            {/* Optional Timestamp badge if filter applied */}
            {isStatusFilterApplied && (
                <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between gap-2 text-sm">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-sm font-semibold shrink-0 ${
                        lastUpdatedStatusLabel === "Selfship" || activeFilterCode === "selfship"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "bg-[#EEF4FF] border-[#B2CCFF] text-[#2D31A6]"
                    }`}>
                        <Clock className={`h-3 w-3 shrink-0 ${
                            lastUpdatedStatusLabel === "Selfship" || activeFilterCode === "selfship"
                                ? "text-emerald-700"
                                : "text-[#3538CD]"
                        }`} />
                        <span>{lastUpdatedStatusLabel}</span>
                    </span>
                    <span className="text-slate-700 font-medium truncate">{targetTimestamp || "N/A"}</span>
                </div>
            )}
        </div>
    );
}
