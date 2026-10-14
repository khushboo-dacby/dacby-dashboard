"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export default function LiveData_Analytics() {
    const [activeTab, setActiveTab] = useState("b2c-sales");

    const navTabs = [
        { id: "b2c-sales", label: "B2C sales" },
        { id: "b2c-volume", label: "B2C volume" },
        { id: "b2b-sales", label: "B2B sales" },
        { id: "b2b-quality", label: "B2B quality" },
        { id: "b2c-purchase", label: "B2C purchase" },
        { id: "b2b-purchase", label: "B2B purchase" },
        { id: "inventory", label: "Inventory" },
        { id: "returns", label: "Returns" },
    ];

    const scrollToSection = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // View toggle: "30days" (overall 30 days) vs "today" (today only)
    const [salesViewMode, setSalesViewMode] = useState("30days");

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
            {/* Top Header */}
            <div className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-xs">
                <div className="w-full px-6 py-3.5 sm:px-10 lg:px-16 xl:px-20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Title & Brand Icon */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1e254d] text-base font-bold text-white shadow-xs">
                                D
                            </div>
                            <div className="flex items-baseline gap-2.5">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                                    DACBY Analytics
                                </h1>
                                {/* <span className="text-sm font-medium text-slate-600">
                                    Live as of 13 Oct 2026, 9:30 AM IST
                                </span> */}
                            </div>
                        </div>
                    </div>

                    {/* Quick Sub Navigation Tabs */}
                    <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-200/80 pt-2.5">
                        {navTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => scrollToSection(tab.id)}
                                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition cursor-pointer ${activeTab === tab.id
                                        ? "bg-[#1e254d] text-white shadow-xs font-semibold"
                                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="w-full px-6 pt-8 space-y-10 sm:px-10 lg:px-16 xl:px-20">

                {/* ========================================================================= */}
                {/* SECTION 1: B2C sales */}
                {/* ========================================================================= */}
                <section id="b2c-sales" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2C sales</h2>
                    </div>

                    {/* Top KPI Cards Row */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Combined Sales Card */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Sales (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹4.82L | ₹1.28Cr
                            </h3>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                186 | 5,412 units
                            </p>
                        </div>

                        {/* Total Orders Card */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Total orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                172 | 4,980
                            </h3>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                Units 186 | 5,412
                            </p>
                        </div>

                        {/* Cancelled Orders Card */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Cancelled orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹21K | ₹6.4L
                            </h3>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                9 | 281 units
                            </p>
                        </div>

                        {/* App vs Website KPI Card */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    App vs website Sales (30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                64% | 36%
                            </h3>
                            <p className="mt-3 text-xs font-medium text-slate-600">
                                App | Website
                            </p>
                        </div>
                    </div>

                    {/* Sales performance (commented down for now) */}
                    {/*
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200 lg:col-span-12 flex flex-col justify-between">
                            <div>
                                // Card Header with View Mode Toggle
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm sm:text-base font-bold text-slate-950">
                                            {salesViewMode === "30days"
                                                ? "Sales performance (Overall 30 days)"
                                                : "Sales performance (Today only)"}
                                        </h4>
                                        <p className="mt-0.5 text-xs font-medium text-slate-600">
                                            {salesViewMode === "30days"
                                                ? "Aggregated 30-day gross revenue & volume metrics"
                                                : "Live real-time revenue & fulfillment status"}
                                        </p>
                                    </div>

                                    // Pill Toggle
                                    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setSalesViewMode("30days")}
                                            className={`cursor-pointer rounded-lg px-3.5 py-1 text-xs font-semibold transition ${salesViewMode === "30days"
                                                    ? "bg-[#1e254d] text-white shadow-xs"
                                                    : "text-slate-700 hover:text-slate-950"
                                                }`}
                                        >
                                            Overall 30 days
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSalesViewMode("today")}
                                            className={`cursor-pointer rounded-lg px-3.5 py-1 text-xs font-semibold transition ${salesViewMode === "today"
                                                    ? "bg-[#1e254d] text-white shadow-xs"
                                                    : "text-slate-700 hover:text-slate-950"
                                                }`}
                                        >
                                            Today only
                                        </button>
                                    </div>
                                </div>

                                // Content for Overall 30 Days
                                {salesViewMode === "30days" ? (
                                    <div className="mt-5 space-y-4">
                                        // KPI Banner
                                        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                                            <div>
                                                <p className="text-xs font-medium text-slate-600">Total 30-Day Revenue</p>
                                                <div className="mt-1 flex items-baseline gap-2.5">
                                                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                                        ₹1.28 Cr
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-300">
                                                        <TrendingUp className="h-3 w-3" /> +11.4%
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs font-medium text-slate-600">5,412 units across 4,980 orders</p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-xs font-medium text-slate-600">Target Completion</p>
                                                <p className="mt-1 text-sm font-bold text-slate-800">
                                                    91.4% <span className="font-medium text-xs text-slate-600">(Target: ₹1.40 Cr)</span>
                                                </p>
                                                <div className="mt-1.5 h-2 w-36 sm:w-44 overflow-hidden rounded-full bg-slate-200">
                                                    <div className="h-full rounded-full bg-[#1e254d]" style={{ width: "91.4%" }} />
                                                </div>
                                            </div>
                                        </div>

                                        // Category Contribution Distribution
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-slate-700">Category Share in 30 Days</span>
                                                <span className="text-slate-600 font-medium">Consoles · Discs · Accessories · Collectibles</span>
                                            </div>

                                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div className="h-full bg-[#1e254d]" style={{ width: "52%" }} title="Consoles: 52%" />
                                                <div className="h-full bg-[#334155]" style={{ width: "28%" }} title="Games & Discs: 28%" />
                                                <div className="h-full bg-[#64748b]" style={{ width: "14%" }} title="Accessories: 14%" />
                                                <div className="h-full bg-[#94a3b8]" style={{ width: "6%" }} title="Collectibles: 6%" />
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#1e254d]" />
                                                    <span className="text-slate-700">Consoles: <strong className="text-slate-800 font-bold">52% (₹66.5L)</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#334155]" />
                                                    <span className="text-slate-700">Discs: <strong className="text-slate-800 font-bold">28% (₹35.8L)</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#64748b]" />
                                                    <span className="text-slate-700">Accs: <strong className="text-slate-800 font-bold">14% (₹17.9L)</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
                                                    <span className="text-slate-700">Others: <strong className="text-slate-800 font-bold">6% (₹7.8L)</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 space-y-4">
                                        // KPI Banner Today
                                        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
                                            <div>
                                                <p className="text-xs font-medium text-slate-600">Live Sales Today</p>
                                                <div className="mt-1 flex items-baseline gap-2.5">
                                                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                                        ₹4.82L
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-300">
                                                        <TrendingUp className="h-3 w-3" /> +6.2% vs avg
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs font-medium text-slate-600">186 units across 172 orders</p>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-xs font-medium text-slate-600">Daily Target Pace</p>
                                                <p className="mt-1 text-sm font-bold text-emerald-800">
                                                    112% Achieved <span className="font-medium text-xs text-slate-600">(Target: ₹4.30L)</span>
                                                </p>
                                                <div className="mt-1.5 h-2 w-36 sm:w-44 overflow-hidden rounded-full bg-slate-200">
                                                    <div className="h-full rounded-full bg-emerald-600" style={{ width: "100%" }} />
                                                </div>
                                            </div>
                                        </div>

                                        // Fulfillment Pipeline Today
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-slate-700">Today&apos;s Dispatch Status</span>
                                                <span className="text-slate-600 font-medium">186 Units Total</span>
                                            </div>

                                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div className="h-full bg-[#1e254d]" style={{ width: "85%" }} title="Dispatched: 85%" />
                                                <div className="h-full bg-[#64748b]" style={{ width: "10%" }} title="Processing: 10%" />
                                                <div className="h-full bg-slate-300" style={{ width: "5%" }} title="Cancelled: 5%" />
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#1e254d]" />
                                                    <span className="text-slate-700">Dispatched: <strong className="text-slate-800 font-bold">158 units (85%)</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-[#64748b]" />
                                                    <span className="text-slate-700">Packing: <strong className="text-slate-800 font-bold">19 units (10%)</strong></span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                                                    <span className="text-slate-700">Cancelled: <strong className="text-slate-800 font-bold">9 units (5%)</strong></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            // Bottom 3 Micro-Metrics Bar
                            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3.5 text-xs">
                                <div>
                                    <span className="text-slate-600 font-medium">
                                        {salesViewMode === "30days" ? "Daily Avg Run-Rate" : "Avg Order Value"}
                                    </span>
                                    <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-800">
                                        {salesViewMode === "30days" ? "₹4.27L / day" : "₹2,802"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-600 font-medium">
                                        {salesViewMode === "30days" ? "Avg Order Value (AOV)" : "Peak Hour Sales"}
                                    </span>
                                    <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-800">
                                        {salesViewMode === "30days" ? "₹2,591" : "5 PM – 6 PM (₹68K)"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-600 font-medium">
                                        {salesViewMode === "30days" ? "Delivery Success Rate" : "Dispatch Efficiency"}
                                    </span>
                                    <p className="mt-0.5 text-xs sm:text-sm font-bold text-emerald-800">
                                        {salesViewMode === "30days" ? "94.8% Completed" : "85% Out for Delivery"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    */}
                </section>

                {/* ========================================================================= */}
                {/* SECTION 2: B2C sales volume */}
                {/* ========================================================================= */}
                <section id="b2c-volume" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2C sales volume</h2>
                    </div>

                    {/* KPI Cards Row (All 4 cards in one row) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Card 1 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Orders pending for dispatch
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                64 units
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">₹1.9L</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">In-transit orders</p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                312 units
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">₹9.4L</p>
                        </div>

                        {/* Card 3 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">Orders in return</p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                47 units
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">₹1.6L</span>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Dispatch per day (today | 30-day avg)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                158 | 171
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                ₹4.4L | ₹4.9L
                            </p>
                        </div>
                    </div>

                    {/* Products & Cities Tables */}
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Top 7 products sold (30 days) */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h4 className="text-sm sm:text-base font-bold text-slate-950">
                                Top 7 products sold (30 days)
                            </h4>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <span>Product</span>
                                <span>% value</span>
                            </div>
                            <div className="divide-y divide-slate-200/70">
                                {[
                                    { name: "iPhone 13, 128 GB", pct: 18 },
                                    { name: "Samsung S21 FE", pct: 14 },
                                    { name: "OnePlus 9R", pct: 11 },
                                    { name: "iPhone 12, 64 GB", pct: 9 },
                                    { name: "Redmi Note 11 Pro", pct: 7 },
                                    { name: "Pixel 6a", pct: 6 },
                                    { name: "Realme GT Neo 2", pct: 5 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                                {item.pct}%
                                            </span>
                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-[#1e254d]"
                                                    style={{ width: `${item.pct * 4}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top 7 cities (30 days) */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h4 className="text-sm sm:text-base font-bold text-slate-950">
                                Top 7 cities (30 days)
                            </h4>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <span>City</span>
                                <span>% value</span>
                            </div>
                            <div className="divide-y divide-slate-200/70">
                                {[
                                    { name: "Delhi", pct: 24 },
                                    { name: "Bengaluru", pct: 16 },
                                    { name: "Mumbai", pct: 13 },
                                    { name: "Hyderabad", pct: 10 },
                                    { name: "Pune", pct: 8 },
                                    { name: "Jaipur", pct: 6 },
                                    { name: "Chandigarh", pct: 5 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                                {item.pct}%
                                            </span>
                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-[#1e254d]"
                                                    style={{ width: `${item.pct * 3.5}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 3: B2B sales */}
                {/* ========================================================================= */}
                <section id="b2b-sales" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2B sales</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Sales (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹7.6L | ₹2.1Cr
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                28 | 740 units
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Total orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹7.6L | ₹2.1Cr
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                 28 | 740 units
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Cancelled orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹0 | ₹3.2L
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                0 | 14 units
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 4: B2B quality */}
                {/* ========================================================================= */}
                <section id="b2b-quality" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2B quality</h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950">
                            Top 7 products sold (30 days)
                        </h4>
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                            <span>Product</span>
                            <span>% value</span>
                        </div>
                        <div className="divide-y divide-slate-200/70">
                            {[
                                { name: "iPhone 12, 64 GB", pct: 21 },
                                { name: "iPhone 11, 64 GB", pct: 16 },
                                { name: "Samsung A52", pct: 12 },
                                { name: "Redmi Note 10", pct: 10 },
                                { name: "OnePlus Nord", pct: 8 },
                                { name: "Realme 8 Pro", pct: 6 },
                                { name: "Vivo V21", pct: 5 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                    <span className="font-medium text-slate-900">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                            {item.pct}%
                                        </span>
                                        <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100 sm:w-56">
                                            <div
                                                className="h-full rounded-full bg-[#1e254d]"
                                                style={{ width: `${item.pct * 4}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 5: B2C purchase */}
                {/* ========================================================================= */}
                <section id="b2c-purchase" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2C purchase</h2>
                    </div>

                    {/* Row 1 KPI Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Purchase (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹7.6L | ₹2.1Cr
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                28 | 740 units
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Total orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                             <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹7.6L | ₹2.1Cr
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">
                                28 | 740 units
                            </p>
                        </div>

                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Payment released per day (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹2.7L | ₹74L
                            </h3>
                        </div>
                    </div>

                    {/* Row 2 KPI Cards */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Picked up, not yet at warehouse
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                96 units
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">₹2.8L</p>
                        </div>

                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Received, payment pending
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                53 units
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">₹1.5L</span>
                            </div>
                        </div>

                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Cancelled orders (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹18K | ₹5.1L
                            </h3>
                            <p className="mt-1 text-sm font-medium text-slate-600">7 | 214 units</p>
                        </div>
                    </div>

                    {/* Row 3 KPI Cards */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Picked up, not delivered for more than 7 days
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                11 orders
                            </h3>
                            <div className="mt-1">
                                <span className="text-sm font-medium text-slate-600">₹1.5L</span>
                            </div>
                        </div>

                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Orders not picked up (logistics)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                19 orders
                            </h3>
                            <div className="mt-1">
                                <span className="text-sm font-medium text-slate-600">₹1.5L</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Products & Cities Purchased */}
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Top 7 products purchased */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h4 className="text-sm sm:text-base font-bold text-slate-950">
                                Top 7 products purchased (30 days)
                            </h4>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <span>Product</span>
                                <span>% value</span>
                            </div>
                            <div className="divide-y divide-slate-200/70">
                                {[
                                    { name: "iPhone 13, 128 GB", pct: 20 },
                                    { name: "Samsung S21 FE", pct: 15 },
                                    { name: "iPhone 12, 64 GB", pct: 12 },
                                    { name: "OnePlus 9R", pct: 9 },
                                    { name: "Redmi Note 11 Pro", pct: 7 },
                                    { name: "Pixel 6a", pct: 6 },
                                    { name: "Realme GT Neo 2", pct: 4 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                                {item.pct}%
                                            </span>
                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-[#1e254d]"
                                                    style={{ width: `${item.pct * 4}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top 7 cities purchased */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                            <h4 className="text-sm sm:text-base font-bold text-slate-950">
                                Top 7 cities (30 days)
                            </h4>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <span>City</span>
                                <span>% value</span>
                            </div>
                            <div className="divide-y divide-slate-200/70">
                                {[
                                    { name: "Delhi", pct: 26 },
                                    { name: "Noida", pct: 15 },
                                    { name: "Gurugram", pct: 12 },
                                    { name: "Jaipur", pct: 10 },
                                    { name: "Chandigarh", pct: 8 },
                                    { name: "Lucknow", pct: 6 },
                                    { name: "Ghaziabad", pct: 5 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                        <span className="font-medium text-slate-900">{item.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                                {item.pct}%
                                            </span>
                                            <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-[#1e254d]"
                                                    style={{ width: `${item.pct * 3.5}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 6: B2B purchase */}
                {/* ========================================================================= */}
                <section id="b2b-purchase" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">B2B purchase</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Purchase (today | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹5.2L | ₹1.6Cr
                            </h3>
                           <p className="mt-1 text-sm font-medium text-slate-600">
                                28 | 740 units
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Extra amount paid to vendors
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹84K
                            </h3>
                        </div>

                        {/* Card 3 */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-medium text-slate-600">
                                    Payment released per week (this week | 30 days)
                                </p>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                            </div>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                ₹18L | ₹71L
                            </h3>
                        </div>
                    </div>

                    {/* Top 7 products purchased */}
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950">
                            Top 7 products purchased (30 days)
                        </h4>
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                            <span>Product</span>
                            <span>% value</span>
                        </div>
                        <div className="divide-y divide-slate-200/70">
                            {[
                                { name: "iPhone 12, 64 GB", pct: 23 },
                                { name: "iPhone 11, 64 GB", pct: 17 },
                                { name: "Samsung A52", pct: 12 },
                                { name: "Redmi Note 10", pct: 9 },
                                { name: "OnePlus Nord", pct: 8 },
                                { name: "Realme 8 Pro", pct: 6 },
                                { name: "Vivo V21", pct: 4 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                    <span className="font-medium text-slate-900">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                            {item.pct}%
                                        </span>
                                        <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100 sm:w-56">
                                            <div
                                                className="h-full rounded-full bg-[#1e254d]"
                                                style={{ width: `${item.pct * 4}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 7: Inventory */}
                {/* ========================================================================= */}
                <section id="inventory" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">Inventory</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                        {/* Total inventory Card */}
                        <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer lg:col-span-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-medium text-slate-600">Total inventory</p>
                                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-800 transition-colors" />
                                </div>
                                <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                                    8,420 units
                                </h3>
                                <p className="mt-2 text-sm font-bold text-slate-800">₹6.9Cr</p>
                            </div>

                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                                    <span>Warehouse health</span>
                                    <span className="font-bold text-emerald-800">Optimal</span>
                                </div>
                                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div className="h-full bg-[#1e254d]" style={{ width: "82%" }} />
                                </div>
                            </div>
                        </div>

                        {/* By status Table Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200 lg:col-span-8">
                            <h4 className="text-sm sm:text-base font-bold text-slate-950">By status</h4>
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                                <span className="w-1/3">Status</span>
                                <span className="w-1/3 text-center">% value</span>
                                <span className="w-1/3 text-right">Value</span>
                            </div>
                            <div className="divide-y divide-slate-200/70">
                                {[
                                    {
                                        status: "Ready to sell",
                                        pct: "68%",
                                        value: "₹4.69Cr",
                                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                                    },
                                    {
                                        status: "Under evaluation",
                                        pct: "14%",
                                        value: "₹96L",
                                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                                    },
                                    {
                                        status: "In repair",
                                        pct: "12%",
                                        value: "₹83L",
                                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                                    },
                                    {
                                        status: "Damaged",
                                        pct: "6%",
                                        value: "₹41L",
                                        badge: "bg-slate-100 text-slate-700 border-slate-200",
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                        <div className="w-1/3">
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${item.badge}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                        <span className="w-1/3 text-center font-bold text-slate-800">
                                            {item.pct}
                                        </span>
                                        <span className="w-1/3 text-right font-medium text-slate-800">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTION 8: Returns */}
                {/* ========================================================================= */}
                <section id="returns" className="scroll-mt-36">
                    <div className="mb-3.5 flex items-center gap-2">
                        <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
                        <h2 className="text-base sm:text-lg font-bold text-slate-950">Returns</h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <h4 className="text-sm sm:text-base font-bold text-slate-950">
                            Return reasons (% value)
                        </h4>
                        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200">
                            <span>Reason</span>
                            <span>% value</span>
                        </div>
                        <div className="divide-y divide-slate-200/70">
                            {[
                                { name: "Defective / not working", pct: 41 },
                                { name: "Not as described", pct: 27 },
                                { name: "Damaged in shipping", pct: 19 },
                                { name: "Wrong product sent", pct: 13 },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-3 text-sm">
                                    <span className="font-medium text-slate-900">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 text-right font-semibold text-slate-800 text-xs sm:text-sm">
                                            {item.pct}%
                                        </span>
                                        <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100 sm:w-64">
                                            <div
                                                className="h-full rounded-full bg-[#1e254d]"
                                                style={{ width: `${item.pct * 2.3}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

