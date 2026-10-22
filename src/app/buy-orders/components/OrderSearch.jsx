"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import {
    Search,
    X,
    RefreshCw,
    LoaderCircle,
    XCircle,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    Copy,
    Check,
    User,
    Phone,
    Mail,
    MapPin,
    Truck,
    Clock,
    Package,
} from "lucide-react";
import { searchOrdersApi, formatFirebaseTimestamp } from "../apis/api";

const RECENT_SEARCHES_KEY = "dacby_recent_order_searches";
const MAX_RECENT_SEARCHES = 5;

const SEARCH_METHODS = [
    { value: "awb", label: "AWB", placeholder: "AWB tracking number..." },
    { value: "orderId", label: "Order ID", placeholder: "Order ID..." },
    { value: "email", label: "Email", placeholder: "Email address..." },
    { value: "phone", label: "Phone", placeholder: "Phone number..." },
];

const METHOD_CONFIG = {
    awb: {
        label: "AWB",
        icon: Truck,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/90",
        iconClass: "text-blue-600",
    },
    orderId: {
        label: "Order ID",
        icon: Package,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/90",
        iconClass: "text-blue-600",
    },
    phone: {
        label: "Phone",
        icon: Phone,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/90",
        iconClass: "text-blue-600",
    },
    email: {
        label: "Email",
        icon: Mail,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/90",
        iconClass: "text-blue-600",
    },
};

export default function OrderSearch({ className = "", onOrderSelect }) {
    const router = useRouter();
    const { cache, mutate } = useSWRConfig();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const [method, setMethod] = useState("awb");
    const [query, setQuery] = useState("");
    const [lastSearched, setLastSearched] = useState(null);
    const [results, setResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    // Hydration-safe restoration of recent searches from localStorage & seeding into SWR
    useEffect(() => {
        try {
            const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    const validRecent = parsed.slice(0, MAX_RECENT_SEARCHES);
                    setRecentSearches(validRecent);
                    validRecent.forEach((item) => {
                        if (item.method && item.query && Array.isArray(item.results)) {
                            const swrKey = `order-search:${item.method}:${item.query.trim().toLowerCase()}`;
                            mutate(swrKey, item.results, false);
                        }
                    });
                }
            }
        } catch (_) {}
    }, [mutate]);

    // Validation rules:
    // - Phone: Minimum 10 digits
    // - Email: Strict email format regex
    // - AWB / Order ID: Minimum 2 characters
    const validateQuery = useCallback((text, currentMethod) => {
        const trimmed = (text || "").trim();
        if (!trimmed) return false;

        if (currentMethod === "phone") {
            const digits = trimmed.replace(/\D/g, "");
            return digits.length >= 10;
        }

        if (currentMethod === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(trimmed);
        }

        if (currentMethod === "awb" || currentMethod === "orderId") {
            return trimmed.length >= 2;
        }

        return trimmed.length > 0;
    }, []);

    const isValid = validateQuery(query, method);

    // Cmd+K / Ctrl+K keyboard shortcut listener
    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Auto-close popover on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const executeSearch = useCallback(async (searchQuery, searchMethod) => {
        const trimmed = (searchQuery || "").trim();
        if (!trimmed) return;

        setIsSearching(true);
        setError(null);
        setShowDropdown(true);
        setLastSearched({ query: trimmed, method: searchMethod });

        try {
            const data = await searchOrdersApi({
                query: searchMethod === "phone" ? trimmed.replace(/\D/g, "") : trimmed,
                method: searchMethod,
                limit: 20,
            });
            const ordersList = Array.isArray(data) ? data : [];
            setResults(ordersList);

            // Save response in SWR cache
            const swrKey = `order-search:${searchMethod}:${trimmed.toLowerCase()}`;
            mutate(swrKey, ordersList, false);

            // Save in recent searches (up to 5 recent)
            setRecentSearches((prev) => {
                const filtered = prev.filter(
                    (item) => !(item.method === searchMethod && item.query.toLowerCase() === trimmed.toLowerCase())
                );
                const updated = [
                    {
                        id: `${searchMethod}:${trimmed}`,
                        method: searchMethod,
                        query: trimmed,
                        count: ordersList.length,
                        timestamp: Date.now(),
                        results: ordersList,
                    },
                    ...filtered,
                ].slice(0, MAX_RECENT_SEARCHES);

                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                    } catch (_) {}
                }
                return updated;
            });
        } catch (err) {
            console.error("Order search error:", err);
            setError(err.message || "Search failed. Please try again.");
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [mutate]);

    // On click on recent search: Fill search field, show response, do NOT call API!
    const handleSelectRecent = (item) => {
        setMethod(item.method);
        setQuery(item.query);
        setLastSearched({ query: item.query, method: item.method });

        // Retrieve response from SWR cache or fallback to stored item results
        const swrKey = `order-search:${item.method}:${item.query.trim().toLowerCase()}`;
        let cached = null;
        try {
            const swrEntry = cache?.get ? cache.get(swrKey) : null;
            if (swrEntry) {
                cached = swrEntry.data || (Array.isArray(swrEntry) ? swrEntry : null);
            }
        } catch (_) {}

        if (!cached || !Array.isArray(cached)) {
            cached = Array.isArray(item.results) ? item.results : [];
        }

        // Keep SWR updated
        mutate(swrKey, cached, false);

        setResults(cached);
        setError(null);
        setIsSearching(false);
        setShowDropdown(true);
    };

    const handleRemoveRecent = (e, idToRemove) => {
        e.stopPropagation();
        setRecentSearches((prev) => {
            const updated = prev.filter((item) => item.id !== idToRemove);
            if (typeof window !== "undefined") {
                try {
                    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                } catch (_) {}
            }
            return updated;
        });
    };

    const handleClearAllRecent = (e) => {
        e.stopPropagation();
        setRecentSearches([]);
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem(RECENT_SEARCHES_KEY);
            } catch (_) {}
        }
    };

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (!isValid || isSearching) return;
        executeSearch(query, method);
    };

    const handleClear = () => {
        setQuery("");
        setResults(null);
        setError(null);
        setLastSearched(null);
        setShowDropdown(true); // Open recent searches immediately when cleared
        inputRef.current?.focus();
    };

    const handleMethodChange = (newMethod) => {
        setMethod(newMethod);
        setResults(null);
        setError(null);
        setLastSearched(null);
        if (!query.trim()) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
        inputRef.current?.focus();
    };

    const handleCopy = (e, text) => {
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard?.writeText(String(text));
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleItemClick = (order) => {
        setShowDropdown(false);
        if (typeof onOrderSelect === "function") {
            onOrderSelect(order);
            return;
        }

        const id = order.orderId || order.id;
        if (!id) return;

        if (order.sell) {
            router.push(`/sell-orders/${id}`);
        } else if (order.status?.return) {
            router.push(`/buy-orders/returns/${id}`);
        } else {
            router.push(`/buy-orders/forward/${id}`);
        }
    };

    const currentMethodObj = SEARCH_METHODS.find((m) => m.value === method) || SEARCH_METHODS[0];

    const activeSearchMethod = lastSearched?.method || method;
    const activeSearchQuery = lastSearched?.query || query;

    const renderHighlightedText = (text, targetQuery, isFieldSearched) => {
        if (!text) return null;
        const strText = String(text);
        const q = String(targetQuery || "").trim();

        if (q && strText.toLowerCase().includes(q.toLowerCase())) {
            const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
            const parts = strText.split(regex);
            return (
                <span className={isFieldSearched ? "inline-flex items-center bg-amber-50/80 text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-200/60" : ""}>
                    {parts.map((part, i) =>
                        regex.test(part) ? (
                            <mark key={i} className="bg-amber-100 text-amber-900 font-bold px-1 py-0.2 rounded">
                                {part}
                            </mark>
                        ) : (
                            part
                        )
                    )}
                </span>
            );
        }

        if (isFieldSearched) {
            return (
                <span className="inline-flex items-center bg-amber-50/80 text-amber-900 font-semibold px-1.5 py-0.5 rounded border border-amber-200/60">
                    {strText}
                </span>
            );
        }

        return strText;
    };

    return (
        <div ref={containerRef} className={`relative z-30 w-full max-w-[660px] ${className}`}>
            {/* Unified Search Bar Container with reduced border-radius */}
            <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full min-w-0 rounded-lg border border-slate-300/80 bg-white p-1 shadow-2xs transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15"
            >
                {/* Segment 1: SEARCH BY Dropdown */}
                <div className="relative flex flex-col justify-center px-2 sm:px-3.5 py-1 pr-5 sm:pr-8 border-r border-slate-200 cursor-pointer select-none shrink-0">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider leading-none mb-0.5 sm:mb-1">
                        SEARCH BY
                    </span>
                    <div className="flex items-center">
                        <select
                            value={method}
                            onChange={(e) => handleMethodChange(e.target.value)}
                            className="appearance-none bg-transparent text-xs sm:text-[15px] font-bold text-slate-900 outline-none cursor-pointer pr-1 sm:pr-3"
                        >
                            {SEARCH_METHODS.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1.5 sm:right-2.5 bottom-1.5 sm:bottom-2 h-3.5 w-3.5 text-slate-600" />
                    </div>
                </div>

                {/* Segment 2: Query Input + Clear Button */}
                <div className="flex items-center flex-1 px-2 sm:px-4 min-w-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!e.target.value.trim()) {
                                setShowDropdown(true);
                            }
                        }}
                        onFocus={() => {
                            setShowDropdown(true);
                        }}
                        onClick={() => {
                            setShowDropdown(true);
                        }}
                        placeholder={currentMethodObj.placeholder}
                        className="w-full min-w-0 text-xs sm:text-base font-semibold text-slate-900 placeholder:text-slate-500 outline-none bg-transparent py-1 sm:py-1.5"
                    />

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition mr-1 sm:mr-2 shrink-0 cursor-pointer"
                            title="Clear query"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Segment 3: Blue Search Action Button with reduced border-radius */}
                <button
                    type="submit"
                    disabled={!isValid || isSearching}
                    className={`rounded-md p-2 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-1.5 ${
                        isValid && !isSearching
                            ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/15"
                            : "bg-blue-400 opacity-60 cursor-not-allowed"
                    }`}
                    title={
                        !isValid
                            ? method === "phone"
                                ? "Enter at least 10 digits"
                                : method === "email"
                                  ? "Enter a valid email address"
                                  : "Enter at least 2 characters"
                            : "Click to search"
                    }
                    aria-label="Search"
                >
                    {isSearching ? (
                        <>
                            <LoaderCircle className="h-4 w-4 sm:h-3.5 sm:w-3.5 animate-spin shrink-0" />
                            <span className="hidden sm:inline">Search</span>
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4 sm:hidden shrink-0" />
                            <span className="hidden sm:inline">Search</span>
                        </>
                    )}
                </button>
            </form>

            {/* Floating Popover: Recent Searches Box (when search is empty) or Search Results (when query is present) */}
            {showDropdown && (
                <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[620px] md:w-[660px] max-w-[calc(100vw-28px)] sm:max-w-[700px] bg-white rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.18)] p-3.5 sm:p-5 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
                    {!query.trim() ? (
                        /* ================= RECENT SEARCHES BOX ================= */
                        <div>
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                                        Recent Searches
                                    </h4>
                                    {recentSearches.length > 0 && (
                                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {recentSearches.length} / 5
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {recentSearches.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleClearAllRecent}
                                            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer px-2 py-0.5 rounded hover:bg-rose-50"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                                        title="Close"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            {recentSearches.length === 0 ? (
                                <div className="py-8 flex flex-col items-center justify-center text-center px-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2.5">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800">No recent searches yet</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Search by AWB, Order ID, Phone, or Email to save recent searches here.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-3 space-y-2">
                                    <div className="text-xs text-slate-600 font-medium px-1">
                                        Click a recent search to load cached results instantly (no API call):
                                    </div>
                                    {recentSearches.map((item) => {
                                        const config = METHOD_CONFIG[item.method] || METHOD_CONFIG.awb;
                                        const MethodIcon = config.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelectRecent(item)}
                                                className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/40 cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-xs"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    {/* Method Badge */}
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border shrink-0 ${config.badgeClass}`}
                                                    >
                                                        <MethodIcon className={`h-3 w-3 shrink-0 ${config.iconClass}`} />
                                                        <span>{config.label}</span>
                                                    </span>

                                                    {/* Method Value */}
                                                    <span className="font-mono text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-700 transition truncate">
                                                        {item.query}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                                    {/* Results Count Badge */}
                                                    <span className="text-xs font-medium text-slate-700 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                                                        {item.count} {item.count === 1 ? "order" : "orders"}
                                                    </span>

                                                    {/* Action: Chevron by default, Delete button on hover */}
                                                    <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:opacity-0 transition-opacity shrink-0" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleRemoveRecent(e, item.id)}
                                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                                                            title="Remove from recent"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ================= SEARCH RESULTS POPOVER ================= */
                        <div>
                            {/* Popover Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                                        {method.toUpperCase()} SEARCH
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                            {isSearching
                                                ? "Searching orders..."
                                                : `${results?.length || 0} order${results?.length === 1 ? "" : "s"} found`}
                                        </h3>
                                        {lastSearched?.query && !isSearching && (
                                            <span className="text-xs sm:text-sm text-slate-600 font-medium truncate max-w-[200px]">
                                                for "{lastSearched.query}"
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Back to Recent Button */}
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer"
                                        title="View recent searches"
                                    >
                                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                                        <span className="hidden sm:inline">Recent</span>
                                    </button>

                                    {/* Refresh Button */}
                                    <button
                                        type="button"
                                        onClick={() => executeSearch(query || lastSearched?.query, method)}
                                        disabled={isSearching || (!isValid && !lastSearched?.query)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50/70 hover:border-blue-200 transition shadow-2xs cursor-pointer disabled:opacity-50"
                                        title="Re-run search"
                                        aria-label="Refresh search results"
                                    >
                                        <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${isSearching ? "animate-spin" : ""}`} />
                                        <span className="hidden sm:inline">Refresh</span>
                                    </button>

                                    {/* Close Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                                        title="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 my-3.5" />

                            {/* Popover Body */}
                            {isSearching ? (
                        <div className="py-10 flex flex-col items-center justify-center text-slate-600 gap-2.5">
                            <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />
                            <span className="text-sm font-semibold text-slate-700">
                                Searching live orders database...
                            </span>
                        </div>
                    ) : error ? (
                        <div className="py-5 px-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm">
                            <p className="font-bold flex items-center gap-1.5">
                                <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                                Search Request Failed
                            </p>
                            <p className="mt-1 text-xs text-rose-600 pl-5.5">{error}</p>
                        </div>
                    ) : results && results.length === 0 ? (
                        /* Empty State: Pixel-perfect match to screenshot */
                        <div className="py-6 px-3 sm:px-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 shadow-2xs">
                                <XCircle className="h-7 w-7 stroke-[1.6]" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                                    No matching orders
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                                    Check the selected search method and entered value, then try again.
                                </p>
                            </div>
                        </div>
                    ) : results && results.length > 0 ? (
                        /* Polished, Rich Results Cards List */
                        <div className="max-h-[440px] overflow-y-auto space-y-2.5 pr-1.5">
                            {results.map((order, idx) => {
                                const isSell = Boolean(order.sell);
                                const isReturn = Boolean(order.status?.return);
                                const orderId = order.orderId || order.id || `ORDER-${idx}`;
                                const customerName = order.customer?.name || "Customer";
                                const customerPhone = order.customer?.phone;
                                const formattedDate = formatFirebaseTimestamp(order.created_at);
                                const rawCandidates = [
                                    ...(Array.isArray(order.awbs) ? order.awbs : []),
                                    order.awb,
                                    order.tracking?.awb,
                                ].filter(Boolean);

                                const cleanCustomerPhone = String(customerPhone || "").replace(/\D/g, "");
                                const cleanOrderId = String(orderId || "").trim().toLowerCase();

                                const validAwbs = Array.from(new Set(rawCandidates))
                                    .map((item) => String(item).trim())
                                    .filter((awb) => {
                                        if (!awb || awb === "N/A" || awb === "null" || awb === "undefined" || awb === "-") {
                                            return false;
                                        }
                                        if (cleanOrderId && awb.toLowerCase() === cleanOrderId) {
                                            return false;
                                        }
                                        const cleanAwbDigits = awb.replace(/\D/g, "");
                                        if (cleanCustomerPhone && cleanAwbDigits) {
                                            if (cleanAwbDigits === cleanCustomerPhone) return false;
                                            if (
                                                cleanCustomerPhone.length >= 10 &&
                                                (cleanAwbDigits.endsWith(cleanCustomerPhone) || cleanCustomerPhone.endsWith(cleanAwbDigits))
                                            ) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    });

                                // If courier-format AWBs exist, filter out loose 10-digit mobile numbers
                                const hasCourierFormatAwb = validAwbs.some((a) => /[a-zA-Z]/.test(a) || a.replace(/\D/g, "").length > 10);
                                const properAwbs = validAwbs.filter((a) => {
                                    if (hasCourierFormatAwb && /^[6-9]\d{9}$/.test(a.trim())) {
                                        return false;
                                    }
                                    return true;
                                });

                                // Prioritize search query match when searching by AWB
                                if (activeSearchMethod === "awb" && activeSearchQuery) {
                                    const q = activeSearchQuery.trim().toLowerCase();
                                    properAwbs.sort((a, b) => {
                                        const aMatch = a.toLowerCase().includes(q);
                                        const bMatch = b.toLowerCase().includes(q);
                                        if (aMatch && !bMatch) return -1;
                                        if (!aMatch && bMatch) return 1;
                                        return 0;
                                    });
                                }

                                const totalPaid = Number(order.status?.total_money_paid ?? 0);

                                return (
                                    <div
                                        key={orderId || idx}
                                        onClick={() => handleItemClick(order)}
                                        className="group relative rounded-lg border border-slate-200/90 bg-[#FAFBFD] hover:bg-white px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all duration-150 hover:border-blue-400 hover:shadow-xs cursor-pointer"
                                    >
                                        {/* Line 1: Order ID + Copy + Type Badge + Date + Link Icon */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-wrap">
                                                <span className="font-mono text-sm sm:text-base font-bold text-[#151D35] group-hover:text-blue-600 transition tracking-tight">
                                                    {renderHighlightedText(
                                                        orderId,
                                                        activeSearchQuery,
                                                        activeSearchMethod === "orderId"
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleCopy(e, orderId)}
                                                    className="text-slate-500 hover:text-slate-800 transition p-0.5 hover:bg-slate-100 rounded"
                                                    title="Copy Order ID"
                                                >
                                                    {copiedId === orderId ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                                <span
                                                    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold shrink-0 ${
                                                        isSell
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                                    }`}
                                                >
                                                    {isSell ? "Sell" : "Buy"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
                                                <span className="text-xs sm:text-sm font-medium whitespace-nowrap text-slate-700">
                                                    {formattedDate}
                                                </span>
                                                <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                                            </div>
                                        </div>

                                        {/* Line 2: Structured Details (Customer Name, Phone, Email, City, AWB) */}
                                        <div className="mt-1.5 flex items-center gap-x-3.5 gap-y-1 text-xs sm:text-sm text-slate-700 flex-wrap">
                                            <div className="flex items-center gap-1 font-bold text-slate-900 shrink-0">
                                                <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                                <span>{customerName}</span>
                                            </div>

                                            {customerPhone && (
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Phone className={`h-3.5 w-3.5 shrink-0 ${activeSearchMethod === "phone" ? "text-amber-500" : "text-slate-500"}`} />
                                                    <span>
                                                        {renderHighlightedText(
                                                            customerPhone,
                                                            activeSearchQuery,
                                                            activeSearchMethod === "phone"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {order.email && (
                                                <div className="flex items-center gap-1 min-w-0 max-w-[210px] truncate" title={order.email}>
                                                    <Mail className={`h-3.5 w-3.5 shrink-0 ${activeSearchMethod === "email" ? "text-amber-500" : "text-slate-500"}`} />
                                                    <span className="truncate">
                                                        {renderHighlightedText(
                                                            order.email,
                                                            activeSearchQuery,
                                                            activeSearchMethod === "email"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {order.city && (
                                                <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-700 shrink-0">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                                    <span>{order.city}</span>
                                                </div>
                                            )}

                                            {properAwbs.length > 0 && (
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded font-semibold max-w-[260px] truncate shrink-0 ${
                                                        activeSearchMethod === "awb"
                                                            ? "bg-amber-50/80 text-amber-900 font-semibold border border-amber-200/60"
                                                            : "bg-slate-100 text-slate-700 border border-slate-200/70"
                                                    }`}
                                                    title={properAwbs.join(", ")}
                                                >
                                                    <Truck className={`h-3.5 w-3.5 shrink-0 ${activeSearchMethod === "awb" ? "text-amber-500" : "text-slate-500"}`} />
                                                    <span>AWB: </span>
                                                    {renderHighlightedText(
                                                        properAwbs.length === 1
                                                            ? properAwbs[0]
                                                            : properAwbs.join(", ").length <= 25
                                                                ? properAwbs.join(", ")
                                                                : `${properAwbs[0]} (+${properAwbs.length - 1})`,
                                                        activeSearchQuery,
                                                        activeSearchMethod === "awb"
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
