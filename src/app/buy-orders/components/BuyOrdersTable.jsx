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
} from "lucide-react";
import {
    formatMilestoneTime,
    getOrderComputedData,
} from "./buyOrdersConstants";

export default function BuyOrdersTable({
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
    baseRoute = "/buy-orders/forward",
    emptyMessage = "No buy orders found",
    isReturns = false,
}) {
    const router = useRouter();

    return (
        <div className="mt-4 sm:mt-5 hidden md:block overflow-x-auto pb-4">
            <div className={`w-full ${isStatusFilterApplied ? "min-w-[1450px]" : "min-w-[1200px]"} rounded-xl border border-gray-200 bg-white shadow-xs`}>
                {/* Table Headings Bar */}
                <div className={`grid ${tableGridClass} items-center text-sm font-semibold text-slate-600 bg-[#F9FAFB] border-b border-gray-200 rounded-t-xl`}>
                    <div className="md:sticky md:left-0 z-20 bg-[#F9FAFB] py-3.5 px-5 md:border-r border-gray-200 rounded-tl-xl whitespace-nowrap">
                        Order & Products
                    </div>
                    <div className="py-3.5 pl-8 pr-5 whitespace-nowrap">Customer Details</div>
                    <div className="py-3.5 px-5 whitespace-nowrap">Financials</div>
                    <div className="py-3.5 px-5 whitespace-nowrap">Status & Platform</div>
                    <div className="py-3.5 px-5 text-left whitespace-nowrap">Fulfillment Status</div>
                    {isStatusFilterApplied && (
                        <div className="py-3.5 px-5 text-left whitespace-nowrap">Last Updated Timestamp</div>
                    )}
                    <div className="py-3.5 px-5 text-left rounded-tr-xl whitespace-nowrap">Created At</div>
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
                                    <div className="md:sticky md:left-0 z-10 bg-white py-4 px-5 md:border-r border-gray-200 flex items-start gap-3.5 min-w-0">
                                        <div className="h-14 w-14 rounded-lg bg-gray-200 shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-32 bg-gray-200 rounded" />
                                            <div className="h-4 w-44 bg-gray-200 rounded" />
                                            <div className="h-3 w-20 bg-gray-100 rounded" />
                                        </div>
                                    </div>
                                    <div className="py-4 pl-8 pr-5 space-y-1.5 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-4 w-28 bg-gray-200 rounded" />
                                            <div className="h-4 w-8 bg-gray-100 rounded" />
                                        </div>
                                        <div className="h-3 w-40 bg-gray-100 rounded" />
                                        <div className="h-3 w-32 bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-4 px-5 space-y-2 min-w-0">
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                        <div className="h-4 w-full bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-4 px-5 space-y-1.5 min-w-0 flex flex-col justify-center">
                                        <div className="h-5 w-24 bg-gray-200 rounded-md" />
                                        <div className="h-4 w-16 bg-gray-100 rounded" />
                                    </div>
                                    <div className="py-3.5 px-5 min-w-0 flex flex-col justify-center">
                                        <div className="flex flex-col">
                                            <div className="relative flex items-start gap-2.5 pb-2">
                                                <div className="absolute left-[7px] top-2 -bottom-2 w-[2px] bg-gray-200" />
                                                <div className="relative z-[1] h-4 w-4 rounded-full bg-gray-200 shrink-0" />
                                                <div className="space-y-1">
                                                    <div className="h-3.5 w-28 bg-gray-200 rounded" />
                                                    <div className="h-3 w-20 bg-gray-100 rounded" />
                                                </div>
                                            </div>
                                            <div className="relative flex items-start gap-2.5">
                                                <div className="relative z-[1] h-4 w-4 rounded-full bg-gray-200 shrink-0" />
                                                <div className="space-y-1">
                                                    <div className="h-3.5 w-24 bg-gray-200 rounded" />
                                                    <div className="h-3 w-20 bg-gray-100 rounded" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isStatusFilterApplied && (
                                        <div className="py-4 px-5 min-w-0 flex flex-col justify-center space-y-1.5">
                                            <div className="h-5 w-36 bg-indigo-50/80 border border-indigo-100 rounded-md" />
                                            <div className="h-3.5 w-28 bg-gray-100 rounded" />
                                        </div>
                                    )}
                                    <div className="py-4 px-5 min-w-0 flex items-center">
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
                            } = getOrderComputedData(order, { courierStatusFilter, dacbyStatusFilter, isReturns });

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => router.push(`${baseRoute}/${order.id}`)}
                                    className={`group grid ${tableGridClass} items-stretch hover:bg-[#F9FAFB] transition-colors cursor-pointer`}
                                >
                                    {/* Left Block: Product Thumbnail + Order ID + Badges (B2C, RETURN/REPLACEMENT, ⚡) + (+ X more badge) */}
                                    <div className="md:sticky md:left-0 z-10 bg-white group-hover:bg-[#F9FAFB] py-3.5 px-4 md:border-r border-gray-200 flex items-start gap-3 min-w-0 transition-colors">
                                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                            {productImage ? (
                                                <Image
                                                    src={productImage}
                                                    alt={productName}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
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
                                                    className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition cursor-pointer shrink-0"
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

                                            {/* Line 3: Multi-Product Badge then Return / Replacement Badge */}
                                            {(totalProductsCount > 1 || orderBadge) && (
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    {/* Multi-Product Badge: + X more */}
                                                    {totalProductsCount > 1 && (
                                                        <span className="inline-flex items-center rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-700">
                                                            +{totalProductsCount - 1} more
                                                        </span>
                                                    )}

                                                    {/* Return / Replacement Badge */}
                                                    {orderBadge && (
                                                        <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase shrink-0 bg-[#DBEAFE] text-[#1D4ED8]">
                                                            {orderBadge}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer Details */}
                                    <div className="py-4 pl-8 pr-5 min-w-0 flex flex-col justify-center space-y-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <p className="text-base font-semibold text-gray-900 truncate" title={order.customerName}>
                                                {order.customerName}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase shrink-0 ${
                                                    customerType === "B2B"
                                                        ? "bg-[#F4F0FF] text-[#633DB8] border border-[#DDD2FC]"
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
                                                <span className="inline-flex items-center gap-1 min-w-0" title={order.fullAddress || order.city}>
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

                                    {/* Financials & Settlement Status */}
                                    <div className="py-4 px-5 min-w-0 flex flex-col justify-center space-y-1.5">
                                        {/* Primary Total Value + Payment Channel Pill */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base font-bold text-[#151D35] tracking-tight">
                                                ₹{order.totalAmount?.toLocaleString("en-IN")}
                                            </span>
                                            <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase border border-gray-300 bg-gray-100 text-gray-700 shrink-0">
                                                {order.paymentMethod || (order.isCod ? "COD" : "PREPAID")}
                                            </span>
                                        </div>

                                        {/* Settlement Status / Progress */}
                                        {isFullyPaid ? (
                                            <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                <span>Paid</span>
                                            </p>
                                        ) : order.amountPaid > 0 ? (
                                            <div className="space-y-1 pr-1 max-w-[190px]">
                                                <div className="flex items-center justify-between text-xs font-semibold">
                                                    <span className="text-emerald-700">Paid: ₹{order.amountPaid?.toLocaleString("en-IN")}</span>
                                                    <span className="text-rose-600">Due: ₹{order.amountLeft?.toLocaleString("en-IN")}</span>
                                                </div>
                                                {/* Visual payment ratio progress bar */}
                                                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                                        style={{ width: `${paidPct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                                                <span>Due: ₹{order.amountLeft?.toLocaleString("en-IN") || order.totalAmount?.toLocaleString("en-IN")}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Status & Platform */}
                                    <div className="py-4 px-5 min-w-0 flex flex-col justify-center space-y-1.5">
                                        {/* Status Badge */}
                                        <div>
                                            <span
                                                className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-sm font-semibold ${
                                                    displayFinalStatus === "Unsuccess"
                                                        ? "border-rose-200 bg-rose-50 text-rose-700"
                                                        : displayFinalStatus === "Success"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                                            : "border-amber-200/80 bg-amber-50 text-amber-800"
                                                }`}
                                            >
                                                <span>{displayFinalStatus}</span>
                                            </span>
                                        </div>

                                        {/* Platform with Device Icon */}
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                            {order.platform === "Web" ? (
                                                <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                            ) : (
                                                <Smartphone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                            )}
                                            <span>{order.platform || "Mobile"}</span>
                                        </div>
                                    </div>

                                    {/* Fulfillment Status: Classic Vertical Stepper */}
                                    <div className="py-3.5 px-5 min-w-0 flex flex-col justify-center">
                                        <div className="flex flex-col">
                                            {/* Step 1: Products attached */}
                                            <div className="relative flex items-start gap-2.5 pb-2">
                                                <div
                                                    className={`absolute left-[7px] top-2 -bottom-2 ${
                                                        isLedgerOutDone
                                                            ? "w-[2px] bg-[#86EFAC]"
                                                            : "w-0 border-l-[1.5px] border-dotted border-gray-400"
                                                    }`}
                                                />
                                                {isLedgerAttached ? (
                                                    <span className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1EA768] text-white">
                                                        <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                                                    </span>
                                                ) : (
                                                    <span className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#94A3B8] bg-white" />
                                                )}
                                                <div className="min-w-0 leading-tight">
                                                    <p className="text-sm font-semibold text-[#111827]">Products attached</p>
                                                    {ledgerAttachedTime ? (
                                                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                                                            {ledgerAttachedTime}
                                                        </p>
                                                    ) : !isLedgerAttached ? (
                                                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                                                            Pending
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Step 2: Ledger out */}
                                            <div className={`relative flex items-start gap-2.5 ${isCancelled ? "pb-2" : ""}`}>
                                                {isCancelled && (
                                                    <div className="absolute left-[7px] top-2 -bottom-2 w-[2px] bg-rose-300" />
                                                )}
                                                {isLedgerOutDone ? (
                                                    <span className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1EA768] text-white">
                                                        <Check className="h-2.5 w-2.5 stroke-[3.5]" />
                                                    </span>
                                                ) : (
                                                    <span className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#94A3B8] bg-white" />
                                                )}
                                                <div className="min-w-0 leading-tight">
                                                    <p className="text-sm font-semibold text-[#111827]">Ledger out</p>
                                                    {ledgerOutTime ? (
                                                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                                                            {ledgerOutTime}
                                                        </p>
                                                    ) : !isLedgerOutDone ? (
                                                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                                                            Pending
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {/* Step 3: Cancelled (ONLY attached if cancelled: true is found) */}
                                            {isCancelled && (
                                                <div className="relative flex items-start gap-2.5">
                                                    <span className="relative z-[1] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E11D48] text-white">
                                                        <X className="h-2.5 w-2.5 stroke-[3.5]" />
                                                    </span>
                                                    <div className="min-w-0 leading-tight">
                                                    <p className="text-sm font-semibold text-[#E11D48]">Cancelled</p>
                                                        {cancelledTime && (
                                                        <p className="text-xs text-rose-600 font-medium mt-0.5">
                                                                {cancelledTime}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Updated Timestamp Column: Conditionally rendered only when status filter is applied */}
                                    {isStatusFilterApplied && (
                                        <div className="py-4 px-5 min-w-0 flex flex-col justify-center space-y-1.5">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50/80 px-2.5 py-0.5 text-xs font-bold text-indigo-700 whitespace-nowrap shadow-2xs">
                                                    <Package className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                                                    <span className="whitespace-nowrap">{lastUpdatedStatusLabel}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium pl-0.5 whitespace-nowrap">
                                                <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                <span className="whitespace-nowrap">{formattedDateTime}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rightmost Block: Created Date */}
                                    <div className="py-4 px-5 min-w-0 flex items-center whitespace-nowrap">
                                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                                            {order.createdAt || "N/A"}
                                        </span>
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
