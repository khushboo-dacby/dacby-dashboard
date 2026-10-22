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
    formatMilestoneTime,
    getOrderComputedData,
} from "./sellOrdersConstants";

export default function SellOrdersTable({
    orders = [],
    filteredOrders = [],
    isLoading = false,
    isStatusFilterApplied = false,
    tableGridClass = "",
    courierStatusFilter = "all",
    dacbyStatusFilter = "all",
    activeStatusCode = "in_process",
    handleResetFilters,
    copiedKey,
    handleCopy,
    baseRoute = "/sell-orders",
    emptyMessage = "No sell orders found",
}) {
    const router = useRouter();

    return (
        <div className="mt-4 sm:mt-5 hidden md:block overflow-x-auto pb-4">
            <div className={`w-full ${isStatusFilterApplied ? "min-w-[1650px]" : "min-w-[1400px]"} rounded-xl border border-gray-200 bg-white shadow-xs`}>
                {/* Table Headings Bar */}
                <div className={`grid ${tableGridClass} items-center text-sm font-semibold text-slate-600 bg-[#F9FAFB] border-b border-gray-200 rounded-t-xl`}>
                    <div className="md:sticky md:left-0 z-20 bg-[#F9FAFB] py-4 px-6 md:border-r border-gray-200 rounded-tl-xl whitespace-nowrap">
                        Order & Products
                    </div>
                    <div className="py-4 px-6 whitespace-nowrap">Customer Details</div>
                    <div className="py-4 px-6 whitespace-nowrap">Financials</div>
                    <div className="py-4 px-6 whitespace-nowrap">Status & Platform</div>
                    <div className="py-4 px-6 text-center whitespace-nowrap">Ledger Completed</div>
                    {isStatusFilterApplied && (
                        <div className="py-4 px-6 text-left whitespace-nowrap">Last Updated Timestamp</div>
                    )}
                    <div className="py-4 px-6 text-left rounded-tr-xl whitespace-nowrap">Created At</div>
                </div>

                {/* Table Body - Line by Line Dividers */}
                <div className="divide-y divide-gray-200">
                    {isLoading && orders.length === 0 ? (
                        <div className="divide-y divide-gray-200">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className={`animate-pulse grid ${tableGridClass} items-stretch`}
                                >
                                    <div className="md:sticky md:left-0 z-10 bg-white py-4 px-6 md:border-r border-gray-200 flex items-start gap-3.5 min-w-0">
                                        <div className="h-14 w-14 rounded-lg bg-gray-200 shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-32 bg-gray-200 rounded" />
                                            <div className="h-4 w-44 bg-gray-200 rounded" />
                                            <div className="h-3 w-20 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="py-4 px-6 space-y-1.5 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-4 w-28 bg-gray-200 rounded" />
                                            <div className="h-4 w-8 bg-gray-100 rounded" />
                                        </div>
                                        <div className="h-3 w-40 bg-gray-100 rounded" />
                                        <div className="h-3 w-32 bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-4 px-6 space-y-2 min-w-0">
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                        <div className="h-4 w-full bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-4 px-6 space-y-1.5 min-w-0 flex flex-col justify-center">
                                        <div className="h-5 w-24 bg-gray-200 rounded-md" />
                                        <div className="h-4 w-16 bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-4 px-6 min-w-0 flex items-center justify-center">
                                        <div className="h-6 w-6 rounded-full bg-gray-200" />
                                    </div>
                                    {isStatusFilterApplied && (
                                        <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1.5">
                                            <div className="h-5 w-36 bg-indigo-50/80 border border-indigo-100 rounded-md" />
                                            <div className="h-3.5 w-28 bg-gray-100 rounded" />
                                        </div>
                                    )}
                                    <div className="py-4 px-6 min-w-0 flex items-center">
                                        <div className="h-4 w-32 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <p className="text-base font-semibold text-gray-800">{emptyMessage}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {courierStatusFilter !== "all" || dacbyStatusFilter !== "all"
                                    ? `No orders matching status code "${activeStatusCode}".`
                                    : "Try checking back later."}
                            </p>
                            {(courierStatusFilter !== "all" || dacbyStatusFilter !== "all") && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <X className="h-3.5 w-3.5 text-gray-400" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
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
                                    key={order.id}
                                    onClick={() => router.push(`${baseRoute}/${order.id}`)}
                                    className={`grid ${tableGridClass} items-stretch transition hover:bg-gray-50/80 cursor-pointer group`}
                                >
                                    {/* Order & Products with Sticky Order Column */}
                                    <div className="md:sticky md:left-0 z-10 bg-white group-hover:bg-[#F9FAFB] transition-colors py-4 px-6 md:border-r border-gray-200 flex items-start gap-3.5 min-w-0">
                                        {/* Product Thumbnail (56x56) */}
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
                                            <div
                                                className={`fallback-icon flex h-full w-full items-center justify-center text-gray-400 ${productImage ? "hidden" : "flex"
                                                    }`}
                                            >
                                                <Package className="h-6 w-6" />
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                             {/* Line 1: Order ID with Copy + Fast Delivery Icon */}
                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                <span className="text-base font-semibold text-[#151D35] whitespace-nowrap">
                                                    {order.id}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopy?.(order.id, `id-${order.id}`);
                                                    }}
                                                    className="text-slate-500 hover:text-slate-800 p-0.5 rounded transition cursor-pointer shrink-0"
                                                    title="Copy Order ID"
                                                >
                                                    {copiedKey === `id-${order.id}` ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                                {isFastDelivery && (
                                                    <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" title="Fast Delivery" />
                                                )}
                                            </div>

                                            {/* Line 2: Product Title directly from order.product */}
                                            <p className="mt-1 text-[15px] font-medium text-slate-700 truncate" title={productName}>
                                                {productName}
                                            </p>

                                            {/* Line 3: Multi-Product Badge then Return / Selfship / Replacement Badge */}
                                            {(totalProductsCount > 1 || orderBadge) && (
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    {/* Multi-Product Badge: + X more */}
                                                    {totalProductsCount > 1 && (
                                                        <span className="inline-flex items-center rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                                            +{totalProductsCount - 1} more
                                                        </span>
                                                    )}

                                                    {/* Order Badge: Red for REJECTED, Blue for others */}
                                                    {orderBadge && (
                                                        <span
                                                            className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase shrink-0 ${
                                                                orderBadgeType === "red"
                                                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                                                    : "bg-[#DBEAFE] text-[#1D4ED8]"
                                                            }`}
                                                        >
                                                            {orderBadge}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <p className="text-base font-semibold text-gray-900 truncate" title={order.customerName}>
                                                {order.customerName}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase shrink-0 ${
                                                    customerType === "B2B"
                                                        ? "bg-[#F4F0FF] text-[#552AA8] border border-[#DDD2FC]"
                                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                                }`}
                                            >
                                                {customerType}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium flex-wrap">
                                            {order.customerPhone && order.customerPhone !== "N/A" && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                    <span>{order.customerPhone}</span>
                                                </span>
                                            )}
                                            {order.customerPhone && order.customerPhone !== "N/A" && order.city && (
                                                <span className="text-gray-300 select-none">·</span>
                                            )}
                                            {order.city && (
                                                <span className="inline-flex items-center gap-1 min-w-0" title={order.city}>
                                                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                    <span className="truncate">{order.city}</span>
                                                </span>
                                            )}
                                        </div>

                                        {order.customerEmail && (
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium min-w-0" title={order.customerEmail}>
                                                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                <span className="truncate">{order.customerEmail}</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Financials */}
                                    <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-bold text-[#151D35] tracking-tight">
                                                ₹{order.totalAmount.toLocaleString("en-IN")}
                                            </span>
                                            <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase border border-gray-300 bg-gray-100 text-gray-700 shrink-0">
                                                {order.paymentMethod || "UPI"}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {isFullyPaid ? (
                                                <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                                                    <span>Paid</span>
                                                </p>
                                            ) : (
                                                <div className="space-y-1 pr-1 max-w-[190px]">
                                                    <div className="flex items-center justify-between text-xs font-semibold">
                                                        <span className="text-emerald-700">Paid: ₹{order.amountPaid.toLocaleString("en-IN")}</span>
                                                        <span className="text-rose-600">Due: ₹{order.amountLeft.toLocaleString("en-IN")}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                                            style={{ width: `${paidPct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Platform */}
                                    <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1.5">
                                        <div>
                                            <span
                                                className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold ${
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

                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                            {order.platform === "Web" ? (
                                                <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                            ) : (
                                                <Smartphone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                            )}
                                            <span>{order.platform || "Web"}</span>
                                        </div>
                                    </div>

                                    {/* Ledger Completed: Check if present, Cross if not present */}
                                    <div className="py-4 px-6 min-w-0 flex items-center justify-center">
                                        {isLedgerCompleted ? (
                                            <CircleCheckBig className="h-6 w-6 text-emerald-600 stroke-[2.2]" title="Ledger Completed" />
                                        ) : (
                                            <XCircle className="h-6 w-6 text-rose-500 stroke-[2.2]" title="Ledger Not Completed" />
                                        )}
                                    </div>

                                    {/* Optional Column: Last Updated Timestamp (shown when status filter applied) */}
                                    {isStatusFilterApplied && (
                                        <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1">
                                            <div>
                                                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold shadow-2xs ${
                                                    lastUpdatedStatusLabel === "Selfship" || activeFilterCode === "selfship"
                                                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                                        : "border-[#B2CCFF] bg-[#EEF4FF] text-[#2D31A6]"
                                                }`}>
                                                    <Clock className={`h-3.5 w-3.5 shrink-0 ${
                                                        lastUpdatedStatusLabel === "Selfship" || activeFilterCode === "selfship"
                                                            ? "text-emerald-700"
                                                            : "text-[#3538CD]"
                                                    }`} />
                                                    <span className="whitespace-nowrap" title={lastUpdatedStatusLabel}>
                                                        {lastUpdatedStatusLabel}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium whitespace-nowrap">
                                                <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                <span>{targetTimestamp || "Timestamp unavailable"}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Created At & Pickup Status */}
                                    <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1 text-sm">
                                        <span className="font-medium text-slate-700 whitespace-nowrap">{order.createdAt || "N/A"}</span>
                                        {pickupStatusText && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#832608] whitespace-nowrap">
                                                <Calendar className="h-3.5 w-3.5 shrink-0 text-[#832608]" />
                                                <span>{pickupStatusText}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
