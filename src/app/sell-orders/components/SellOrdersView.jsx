"use client";

import React, { useState, useCallback, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
    Package,
    Truck,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    RefreshCw,
    AlertCircle,
    Filter,
} from "lucide-react";
import { filterSellOrdersByCode } from "../apis/api";
import {
    STATUS_CODE_LABELS,
    COURIER_STATUS_OPTIONS,
    DACBY_STATUS_OPTIONS,
} from "./sellOrdersConstants";
import SellOrdersTable from "./SellOrdersTable";
import SellOrderMobileCard from "./SellOrderMobileCard";
import SellOrdersSkeleton from "./SellOrdersSkeleton";
import OrderSearch from "../../buy-orders/components/OrderSearch";

// Module-level in-memory cache preserved across client-side page transitions
let sellOrdersStateCache = null;

function getSavedSellOrdersState() {
    if (sellOrdersStateCache) {
        return sellOrdersStateCache;
    }
    if (typeof window !== "undefined") {
        try {
            const raw = sessionStorage.getItem("sell_orders_state");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    sellOrdersStateCache = parsed;
                    return parsed;
                }
            }
        } catch (_) {}
    }
    return null;
}

export default function SellOrdersView({
    title = "Sell Orders",
    baseRoute = "/sell-orders",
    emptyMessage = "No sell orders found",
}) {
    const pageTitle = title;
    const route = baseRoute;
    const emptyText = emptyMessage;

    const { cache } = useSWRConfig();

    // Keep the server and the first browser render identical. Session storage is
    // restored after hydration, because it is only available in the browser.
    const [currentPage, setCurrentPage] = useState(1);
    const [cursor, setCursor] = useState(null);
    const [cursorHistory, setCursorHistory] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isStateRestored, setIsStateRestored] = useState(false);
    const [restoredResponse, setRestoredResponse] = useState(null);

    // Active status code sent to the API payload (defaults to "in_process")
    const [activeStatusCode, setActiveStatusCode] = useState("in_process");
    const [isRejected, setIsRejected] = useState(false);

    // Filters matching operational workflows
    const [courierStatusFilter, setCourierStatusFilter] = useState("all");
    const [dacbyStatusFilter, setDacbyStatusFilter] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Copy feedback
    const [copiedKey, setCopiedKey] = useState(null);

    const handleCopy = (text, key) => {
        if (!text) return;
        navigator.clipboard?.writeText(text);
        setCopiedKey(key);
        setTimeout(() => {
            setCopiedKey(null);
        }, 1500);
    };

    useEffect(() => {
        const saved = getSavedSellOrdersState();

        if (saved) {
            setCurrentPage(saved.currentPage ?? 1);
            setCursor(saved.cursor ?? null);
            setCursorHistory(saved.cursorHistory ?? []);
            setActiveStatusCode(saved.activeStatusCode ?? "in_process");
            setIsRejected(saved.isRejected ?? false);
            setCourierStatusFilter(saved.courierStatusFilter ?? "all");
            setDacbyStatusFilter(saved.dacbyStatusFilter ?? "all");
            setRestoredResponse(saved.response ?? null);
        }

        setIsStateRestored(true);
    }, []);

    // Do not start a data request until the browser-only state has been restored.
    const cacheKey = isStateRestored
        ? `sell-orders:${activeStatusCode}:${isRejected ? "rej" : "norm"}:${currentPage}:${cursor || "none"}`
        : null;

    // SWR fetcher invoking the live API with strictly required payload fields
    const fetcher = useCallback(async () => {
        return await filterSellOrdersByCode({
            page: currentPage,
            limit: 20,
            startAfter: cursor,
            status_code: activeStatusCode || "in_process",
            rejected: isRejected,
        });
    }, [currentPage, cursor, activeStatusCode, isRejected]);

    const {
        data,
        error: fetchError,
        isLoading,
        isValidating,
        mutate,
    } = useSWR(cacheKey, fetcher, {
        fallbackData: restoredResponse || undefined,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    });

    const orders = data?.Orders && Array.isArray(data.Orders) ? data.Orders : [];
    const pagination = data?.pagination || {
        page: currentPage,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        nextPageStartAfter: null,
    };

    // Persist current filters, pagination, and response data across navigations
    useEffect(() => {
        if (!isStateRestored) return;

        const stateToSave = {
            currentPage,
            cursor,
            cursorHistory,
            activeStatusCode,
            isRejected,
            courierStatusFilter,
            dacbyStatusFilter,
            response: (data && Array.isArray(data.Orders) && data.Orders.length > 0)
                ? data
                : (sellOrdersStateCache?.response || null),
        };

        sellOrdersStateCache = stateToSave;

        if (typeof window !== "undefined") {
            try {
                sessionStorage.setItem("sell_orders_state", JSON.stringify(stateToSave));
            } catch (e) {
                try {
                    const fallbackMinimal = { ...stateToSave, response: null };
                    sessionStorage.setItem("sell_orders_state", JSON.stringify(fallbackMinimal));
                } catch (_) {}
            }
        }
    }, [
        isStateRestored,
        currentPage,
        cursor,
        cursorHistory,
        activeStatusCode,
        isRejected,
        courierStatusFilter,
        dacbyStatusFilter,
        data,
    ]);

    // Purge cached entries for sell-orders, re-fetch current query, and populate new cache
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            if (cache && typeof cache.keys === "function") {
                for (const key of Array.from(cache.keys())) {
                    if (typeof key === "string" && key.includes("sell-orders")) {
                        cache.delete(key);
                    }
                }
            }
            if (sellOrdersStateCache) {
                sellOrdersStateCache.response = null;
            }
            await mutate(fetcher(), { revalidate: true });
        } catch (err) {
            console.error("Refresh error:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCourierFilterChange = (val) => {
        setCourierStatusFilter(val);
        setDacbyStatusFilter("all"); // Mutually exclusive: reset the second filter

        let codeToSend = "in_process";
        let rejectedToSend = false;

        if (val === "all") {
            codeToSend = "in_process";
            rejectedToSend = false;
        } else if (val === "rejected_COU001") {
            codeToSend = "COU001";
            rejectedToSend = true;
        } else {
            codeToSend = val;
            rejectedToSend = false;
        }

        setActiveStatusCode(codeToSend);
        setIsRejected(rejectedToSend);
        setCurrentPage(1);
        setCursor(null);
        setCursorHistory([]);
    };

    const handleDacbyFilterChange = (val) => {
        setDacbyStatusFilter(val);
        setCourierStatusFilter("all"); // Mutually exclusive: reset the first filter
        const isAll = val === "all";
        const codeToSend = isAll ? "in_process" : val;

        setActiveStatusCode(codeToSend);
        setIsRejected(false);
        setCurrentPage(1);
        setCursor(null);
        setCursorHistory([]);
    };

    const handleResetFilters = () => {
        setCourierStatusFilter("all");
        setDacbyStatusFilter("all");
        setActiveStatusCode("in_process");
        setIsRejected(false);
        setCurrentPage(1);
        setCursor(null);
        setCursorHistory([]);

        sellOrdersStateCache = null;
        if (typeof window !== "undefined") {
            try {
                sessionStorage.removeItem("sell_orders_state");
            } catch (_) {}
        }
    };

    const handleNextPage = () => {
        if (pagination.hasNext && pagination.nextPageStartAfter) {
            setCursorHistory((prev) => [...prev, cursor]);
            setCursor(pagination.nextPageStartAfter);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const prevHistory = [...cursorHistory];
            const prevCursor = prevHistory.pop() ?? null;
            setCursorHistory(prevHistory);
            setCursor(prevCursor);
            setCurrentPage((prev) => prev - 1);
        }
    };

    // Live orders directly from the API response
    const filteredOrders = orders;

    // Show Last Updated Timestamp column only when a status filter is actively applied
    const isStatusFilterApplied =
        courierStatusFilter !== "all" ||
        (dacbyStatusFilter !== "all" && dacbyStatusFilter !== "fast_delivery");

    const tableGridClass = isStatusFilterApplied
        ? "grid-cols-[minmax(320px,1.2fr)_minmax(260px,1.1fr)_minmax(180px,0.9fr)_minmax(200px,1fr)_minmax(200px,1fr)_minmax(260px,1.2fr)_minmax(220px,1fr)]"
        : "grid-cols-[minmax(320px,1.2fr)_minmax(260px,1.2fr)_minmax(180px,0.9fr)_minmax(200px,1fr)_minmax(200px,1fr)_minmax(240px,1.1fr)]";

    if (!isStateRestored || isRefreshing || (isLoading && !data)) {
        return (
            <SellOrdersSkeleton
                pageTitle={pageTitle}
                isStatusFilterApplied={isStatusFilterApplied}
                tableGridClass={tableGridClass}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 p-3.5 sm:p-6 lg:p-7">
            {/* Sticky Top Search Bar (Above Sell Orders) */}
            <div className="sticky top-14 lg:top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md -mx-3.5 sm:-mx-6 lg:-mx-7 px-3.5 sm:px-6 lg:px-7 -mt-3.5 sm:-mt-6 lg:-mt-7 pt-3.5 sm:pt-5 lg:pt-6 pb-4 mb-4 border-b border-slate-200/60 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-all">
                <OrderSearch />
            </div>

            {/* 1. Header (Title + Total Counter + Action Buttons) */}
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900">
                        {pageTitle}
                    </h1>
                    <span className="inline-flex items-center rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-700">
                        {pagination.total > 0 ? `${pagination.total.toLocaleString()} total` : `${filteredOrders.length} total`}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Full Refresh Button on Desktop */}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading || isRefreshing || isValidating}
                        className="hidden md:inline-flex items-center gap-1.5 h-9 rounded-xl border border-gray-300 bg-white px-3.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                        aria-label="Refresh orders"
                        title="Refresh orders"
                    >
                        <RefreshCw className={`h-4 w-4 text-gray-600 ${isLoading || isRefreshing || isValidating ? "animate-spin text-blue-600" : ""}`} />
                        <span>Refresh</span>
                    </button>

                    {/* Icon-only Refresh on Mobile */}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading || isRefreshing || isValidating}
                        className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                        aria-label="Refresh orders"
                        title="Refresh orders"
                    >
                        <RefreshCw className={`h-4 w-4 text-gray-600 ${isLoading || isRefreshing || isValidating ? "animate-spin text-blue-600" : ""}`} />
                    </button>

                    {/* Filter (Icon-only with toggle, visible ONLY on mobile/responsive screens) */}
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className={`md:hidden relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 cursor-pointer shadow-2xs shrink-0 ${
                            isFilterOpen
                                ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                                : (courierStatusFilter !== "all" || dacbyStatusFilter !== "all")
                                    ? "border-blue-400 bg-blue-50/80 text-blue-700 hover:bg-blue-100"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-label="Toggle filters"
                        title={isFilterOpen ? "Close filters" : "Filter orders"}
                    >
                        <Filter className={`h-4 w-4 ${(courierStatusFilter !== "all" || dacbyStatusFilter !== "all" || isFilterOpen) ? "text-blue-600" : "text-gray-600"}`} />
                        {(courierStatusFilter !== "all" || dacbyStatusFilter !== "all") && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 ring-2 ring-white" />
                            </span>
                        )}
                    </button>

                    {/* Create Sell Order Button */}
                    <button
                        type="button"
                        disabled
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gray-200 px-3.5 text-xs sm:text-sm font-medium text-gray-500 cursor-not-allowed whitespace-nowrap"
                    >
                        <span>+ Create Sell Order</span>
                    </button>
                </div>
            </div>

            {/* 2a. Desktop Operational Filters Strip */}
            <div className="hidden md:flex flex-wrap items-center gap-4 mt-5">
                {/* Status by Courier Filter */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#151D35]">
                        <Filter className="h-4 w-4 text-[#151D35] shrink-0 stroke-[2.2]" />
                        <span>Status by Courier</span>
                    </div>
                    <select
                        aria-label="Filter by courier status"
                        value={courierStatusFilter}
                        onChange={(e) => handleCourierFilterChange(e.target.value)}
                        className={`rounded-xl border px-3.5 py-1.5 text-sm font-semibold outline-none transition cursor-pointer shadow-2xs ${
                            courierStatusFilter !== "all"
                                ? "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold"
                                : "border-[#CBD5E1] bg-white text-[#151D35] hover:border-[#94A3B8]"
                        }`}
                    >
                        {COURIER_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status by DACBY Filter */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#151D35]">
                        <Filter className="h-4 w-4 text-[#151D35] shrink-0 stroke-[2.2]" />
                        <span>Status by DACBY</span>
                    </div>
                    <select
                        aria-label="Filter by DACBY status"
                        value={dacbyStatusFilter}
                        onChange={(e) => handleDacbyFilterChange(e.target.value)}
                        className={`rounded-xl border px-3.5 py-1.5 text-sm font-semibold outline-none transition cursor-pointer shadow-2xs ${
                            dacbyStatusFilter !== "all"
                                ? "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold"
                                : "border-[#CBD5E1] bg-white text-[#151D35] hover:border-[#94A3B8]"
                        }`}
                    >
                        {DACBY_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {(courierStatusFilter !== "all" || dacbyStatusFilter !== "all") && (
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer shadow-2xs"
                    >
                        <X className="h-3.5 w-3.5" />
                        <span>Clear Filter</span>
                    </button>
                )}
            </div>

            {/* Collapsed Active Filter Pill Bar (Mobile/Responsive only, visible when filters are applied but panel is closed) */}
            {(courierStatusFilter !== "all" || dacbyStatusFilter !== "all") && !isFilterOpen && (
                <div className="md:hidden mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-gray-500">Filtered by:</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-800 shadow-2xs">
                        {courierStatusFilter !== "all" ? (
                            <>
                                <Truck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                <span>Courier: {STATUS_CODE_LABELS[courierStatusFilter] || courierStatusFilter}</span>
                            </>
                        ) : (
                            <>
                                <Package className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                <span>DACBY: {STATUS_CODE_LABELS[dacbyStatusFilter] || dacbyStatusFilter}</span>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="ml-1 rounded-full p-0.5 hover:bg-blue-200/60 text-blue-700 transition cursor-pointer"
                            title="Clear filter"
                            aria-label="Clear active filter"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(true)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        Change Filter
                    </button>
                </div>
            )}

            {/* 2b. Collapsible Slide-Down Filters Panel (Mobile / Responsive screens only) */}
            <div
                className={`md:hidden grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${
                    isFilterOpen
                        ? "grid-rows-[1fr] opacity-100 mt-3 pointer-events-auto"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none mt-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                    Filter Orders by Status
                                </span>
                            </div>

                            {(courierStatusFilter !== "all" || dacbyStatusFilter !== "all") && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition cursor-pointer shadow-2xs"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Clear Filter</span>
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3.5">
                            {/* Status by Courier Filter */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    <Truck className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span>Status by Courier</span>
                                </label>
                                <div className="relative">
                                    <select
                                        aria-label="Filter by courier status"
                                        value={courierStatusFilter}
                                        onChange={(e) => handleCourierFilterChange(e.target.value)}
                                        className={`w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-xs sm:text-sm outline-none transition cursor-pointer shadow-2xs ${
                                            courierStatusFilter !== "all"
                                                ? "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold"
                                                : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                                        }`}
                                    >
                                        {COURIER_STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Status by DACBY Filter */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                    <Package className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span>Status by DACBY</span>
                                </label>
                                <div className="relative">
                                    <select
                                        aria-label="Filter by DACBY status"
                                        value={dacbyStatusFilter}
                                        onChange={(e) => handleDacbyFilterChange(e.target.value)}
                                        className={`w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-xs sm:text-sm outline-none transition cursor-pointer shadow-2xs ${
                                            dacbyStatusFilter !== "all"
                                                ? "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 font-bold"
                                                : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                                        }`}
                                    >
                                        {DACBY_STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message if API fails */}
            {fetchError && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50/80 p-3 text-sm text-red-800">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <span>{fetchError?.message || String(fetchError)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => mutate(fetcher(), { revalidate: true })}
                        className="w-full sm:w-auto rounded bg-white border border-red-300 px-2.5 py-1 text-xs font-semibold hover:bg-red-50 transition cursor-pointer text-red-700 text-center"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* 3. Desktop Table (Line-by-Line Rows, Single Vertical Divider & Sticky Order Column) */}
            <SellOrdersTable
                orders={orders}
                filteredOrders={filteredOrders}
                isLoading={isLoading}
                isStatusFilterApplied={isStatusFilterApplied}
                tableGridClass={tableGridClass}
                courierStatusFilter={courierStatusFilter}
                dacbyStatusFilter={dacbyStatusFilter}
                activeStatusCode={activeStatusCode}
                handleResetFilters={handleResetFilters}
                copiedKey={copiedKey}
                handleCopy={handleCopy}
                baseRoute={route}
                emptyMessage={emptyText}
            />

            {/* 3b. Mobile Cards View (displayed strictly on mobile/responsive screens) */}
            <div className="mt-4 block md:hidden space-y-3.5">
                {isLoading && orders.length === 0 ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-28 bg-gray-200 rounded" />
                                    <div className="h-4 w-16 bg-gray-200 rounded" />
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-3.5 w-3/4 bg-gray-200 rounded" />
                                        <div className="h-3 w-1/2 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="h-14 bg-gray-100 rounded-lg" />
                                <div className="h-8 bg-gray-100 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                        <p className="text-sm font-semibold text-gray-800">{emptyText}</p>
                        <p className="text-xs text-gray-500 mt-1">
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
                    filteredOrders.map((order, idx) => (
                        <SellOrderMobileCard
                            key={order.id || idx}
                            order={order}
                            isStatusFilterApplied={isStatusFilterApplied}
                            courierStatusFilter={courierStatusFilter}
                            dacbyStatusFilter={dacbyStatusFilter}
                            activeStatusCode={activeStatusCode}
                            copiedKey={copiedKey}
                            handleCopy={handleCopy}
                            baseRoute={route}
                        />
                    ))
                )}
            </div>

            {/* 4. Pagination */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-4 text-xs sm:text-sm text-gray-600">
                <div className="text-center sm:text-left">
                    Showing <strong>{filteredOrders.length}</strong> of{" "}
                    <strong>{pagination.total ?? filteredOrders.length}</strong> orders · Page{" "}
                    <strong>{currentPage}</strong> of <strong>{pagination.totalPages ?? 1}</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1 || isLoading || isRefreshing || isValidating}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleNextPage}
                        disabled={!pagination.hasNext || isLoading || isRefreshing || isValidating}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
