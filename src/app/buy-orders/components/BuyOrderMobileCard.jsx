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
    ExternalLink,
    Zap,
} from "lucide-react";
import {
    formatShortTitle,
    getOrderComputedData,
} from "./buyOrdersConstants";

export default function BuyOrderMobileCard({
    order,
    isStatusFilterApplied,
    courierStatusFilter = "all",
    dacbyStatusFilter = "all",
    copiedKey,
    handleCopy,
    baseRoute = "/buy-orders/forward",
    isReturns = false,
}) {
    const router = useRouter();

    const {
        totalProductsCount,
        productImage,
        productName,
        customerType,
        isCancelled,
        cancelledTime,
        displayFinalStatus,
        isLedgerAttached,
        isLedgerOutDone,
        orderBadge,
        isFastDelivery,
        lastUpdatedStatusLabel,
        formattedDateTime,
    } = getOrderComputedData(order, { courierStatusFilter, dacbyStatusFilter, isReturns });

    return (
        <div
            onClick={() => router.push(`${baseRoute}/${order.id}`)}
            className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 hover:border-gray-300 transition cursor-pointer"
        >
            {/* Top Block: Product Image + Order ID / B2C / Badges / Final Status */}
            <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {productImage ? (
                        <Image
                            src={productImage}
                            alt={productName}
                            fill
                            sizes="48px"
                            className="object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : null}
                    <div className={`flex h-full w-full items-center justify-center text-gray-400 ${productImage ? "hidden" : "flex"}`}>
                        <Package className="h-5 w-5" />
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    {/* Line 1: Order ID, copy, and In Process / Final Status pill */}
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
                                className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer shrink-0"
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
                                    ? "border-rose-200 bg-rose-50 text-rose-700"
                                    : displayFinalStatus === "Success"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                        : "border-amber-200/80 bg-amber-50 text-amber-800"
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

                    {/* Line 3: Return / Replacement Badges (if present) */}
                    {orderBadge && (
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="inline-flex items-center rounded px-2 py-0.5 text-sm font-bold tracking-wide uppercase shrink-0 bg-[#DBEAFE] text-[#1D4ED8]">
                                {orderBadge}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Details Strip */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3.5 text-base space-y-2.5">
                {/* Line 1: Customer Name + Badge (left) & Phone Number (right) */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
                        <span className="font-semibold text-gray-900 text-base break-words" title={order.customerName}>
                            {order.customerName}
                        </span>
                        <span
                            className={`inline-flex items-center rounded px-2 py-0.5 text-sm font-bold tracking-wide uppercase shrink-0 ${
                                customerType === "B2B"
                                    ? "bg-[#F4F0FF] text-[#633DB8] border border-[#DDD2FC]"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                        >
                            {customerType}
                        </span>
                    </div>

                    {order.customerPhone && order.customerPhone !== "N/A" && (
                        <a
                            href={`tel:${order.customerPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-sm text-blue-700 font-medium hover:underline shrink-0"
                        >
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{order.customerPhone}</span>
                        </a>
                    )}
                </div>

                {/* Line 2: City / Address (left) & Email (right, directly below phone number) */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-sm text-slate-700 min-w-0 flex-1">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                        <span className="truncate">{order.city || order.fullAddress || "Address N/A"}</span>
                    </div>

                    {order.customerEmail && (
                        <a
                            href={`mailto:${order.customerEmail}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-sm text-slate-700 hover:text-gray-900 hover:underline truncate max-w-[190px] shrink-0"
                            title={order.customerEmail}
                        >
                            <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                            <span className="truncate">{order.customerEmail}</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Financials & Fulfillment Mini-Grid */}
            <div className="grid grid-cols-2 gap-3 text-base">
                <div className="rounded-lg border border-gray-100 p-2 space-y-0.5 bg-gray-50/50">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide block">
                        Financials
                    </span>
                    <div className="font-bold text-xl text-gray-900">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center justify-between text-sm gap-1">
                        <span className="text-emerald-700 font-medium truncate">Paid: ₹{order.amountPaid?.toLocaleString("en-IN")}</span>
                        <span className="text-red-600 font-medium truncate">Left: ₹{order.amountLeft?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-sm text-slate-800 pt-0.5 truncate">
                        {order.paymentMethod || "COD"} · {order.platform || "Platform"}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-100 p-2 space-y-1 bg-gray-50/50">
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide block">
                        Fulfillment
                    </span>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 font-medium">Products:</span>
                            {isLedgerAttached ? (
                                <span className="text-emerald-600 font-semibold">Attached</span>
                            ) : (
                                <span className="text-amber-600 font-medium">Pending</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 font-medium">Ledger Out:</span>
                            {isLedgerOutDone ? (
                                <span className="text-emerald-600 font-semibold">Done</span>
                            ) : (
                                <span className="text-amber-600 font-medium">Pending</span>
                            )}
                        </div>
                        {isCancelled && (
                            <div className="flex items-center justify-between text-sm pt-1 border-t border-rose-100">
                                <span className="text-rose-600 font-semibold">Cancelled</span>
                                {cancelledTime && (
                                    <span className="text-rose-600 text-sm">{cancelledTime}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Last Updated Timestamp Banner (if filter is active) */}
            {isStatusFilterApplied && (
                <div className="flex items-center justify-between gap-1.5 flex-wrap rounded-lg border border-indigo-100 bg-indigo-50/70 p-2.5 text-sm">
                    <span className="inline-flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-sm font-bold text-indigo-800">
                        <Package className="h-3 w-3 shrink-0" />
                        <span>{lastUpdatedStatusLabel}</span>
                    </span>
                    <div className="flex items-center gap-1 text-sm text-slate-700 shrink-0">
                        <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                        <span>{formattedDateTime}</span>
                    </div>
                </div>
            )}

            {/* Order Created Date */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm text-slate-700">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                    <span>Ordered {order.createdAt}</span>
                </span>
            </div>

            {/* View Full Order Details Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`${baseRoute}/${order.id}`);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 py-2.5 text-base font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
            >
                <span>View Full Order Details</span>
                <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
            </button>
        </div>
    );
}
