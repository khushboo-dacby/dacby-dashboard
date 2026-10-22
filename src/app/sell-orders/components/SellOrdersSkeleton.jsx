"use client";

import React from "react";

export default function SellOrdersSkeleton({
    pageTitle = "Sell Orders",
    isStatusFilterApplied = false,
    tableGridClass,
}) {
    const gridClass = tableGridClass || (isStatusFilterApplied
        ? "grid-cols-[minmax(320px,1.2fr)_minmax(260px,1.1fr)_minmax(180px,0.9fr)_minmax(200px,1fr)_minmax(200px,1fr)_minmax(260px,1.2fr)_minmax(220px,1fr)]"
        : "grid-cols-[minmax(320px,1.2fr)_minmax(260px,1.2fr)_minmax(180px,0.9fr)_minmax(200px,1fr)_minmax(200px,1fr)_minmax(240px,1.1fr)]");

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-gray-900 p-3.5 sm:p-6 lg:p-7 animate-pulse">
            {/* Top Search Bar Skeleton */}
            <div className="sticky top-14 lg:top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md -mx-3.5 sm:-mx-6 lg:-mx-7 px-3.5 sm:px-6 lg:px-7 -mt-3.5 sm:-mt-6 lg:-mt-7 pt-3.5 sm:pt-5 lg:pt-6 pb-4 mb-4 border-b border-slate-200/60">
                <div className="h-12 w-full max-w-[660px] bg-gray-200/80 rounded-lg" />
            </div>

            {/* 1. Header Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <div className="h-7 w-52 sm:w-64 bg-gray-200 rounded-lg" />
                    <div className="h-6 w-20 bg-sky-100/70 rounded-md" />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="h-9 w-24 bg-gray-200 rounded-xl" />
                    <div className="h-9 w-36 bg-gray-200 rounded-xl" />
                </div>
            </div>

            {/* 2. Desktop Filters Strip Skeleton */}
            <div className="hidden md:flex flex-wrap items-center gap-4 mt-5">
                <div className="h-9 w-52 bg-gray-200 rounded-xl" />
                <div className="h-9 w-48 bg-gray-200 rounded-xl" />
            </div>

            {/* 3a. Desktop Table Skeleton (Full Screen) */}
            <div className="hidden md:block mt-5 overflow-x-auto pb-4">
                <div className={`w-full ${isStatusFilterApplied ? "min-w-[1650px]" : "min-w-[1400px]"} rounded-xl border border-gray-200 bg-white shadow-xs`}>
                    {/* Table Headings Bar */}
                    <div className={`grid ${gridClass} items-center text-sm font-semibold text-slate-600 bg-[#F9FAFB] border-b border-gray-200 rounded-t-xl`}>
                        <div className="py-4 px-6 border-r border-gray-200">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                        <div className="py-4 px-6">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                        </div>
                        <div className="py-4 px-6">
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                        </div>
                        <div className="py-4 px-6">
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                        </div>
                        <div className="py-4 px-6">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                        </div>
                        {isStatusFilterApplied && (
                            <div className="py-4 px-6">
                                <div className="h-4 w-36 bg-gray-200 rounded" />
                            </div>
                        )}
                        <div className="py-4 px-6">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                    </div>

                    {/* Table Rows Skeleton: 8 full rows to fill the screen */}
                    <div className="divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className={`grid ${gridClass} items-stretch`}
                            >
                                {/* Column 1: Order & Products */}
                                <div className="bg-white py-4 px-6 border-r border-gray-200 flex items-start gap-3.5 min-w-0">
                                    <div className="h-14 w-14 rounded-lg bg-gray-200 shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                        <div className="h-4 w-44 bg-gray-200 rounded" />
                                        <div className="h-3 w-20 bg-gray-100 rounded" />
                                    </div>
                                </div>

                                {/* Column 2: Customer Details */}
                                <div className="py-4 px-6 space-y-1.5 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-4 w-28 bg-gray-200 rounded" />
                                        <div className="h-4 w-8 bg-gray-100 rounded" />
                                    </div>
                                    <div className="h-3 w-40 bg-gray-100 rounded" />
                                    <div className="h-3 w-32 bg-gray-100 rounded" />
                                </div>

                                {/* Column 3: Financials */}
                                <div className="py-4 px-6 space-y-2 min-w-0 flex flex-col justify-center">
                                    <div className="h-4 w-24 bg-gray-200 rounded" />
                                    <div className="h-4 w-20 bg-gray-100 rounded" />
                                </div>

                                {/* Column 4: Status & Platform */}
                                <div className="py-4 px-6 space-y-1.5 min-w-0 flex flex-col justify-center">
                                    <div className="h-5 w-24 bg-gray-200 rounded-full" />
                                    <div className="h-4 w-16 bg-gray-100 rounded" />
                                </div>

                                {/* Column 5: Ledger Completed */}
                                <div className="py-4 px-6 min-w-0 flex items-center justify-center">
                                    <div className="h-6 w-6 rounded-full bg-gray-200" />
                                </div>

                                {/* Optional Filter Column */}
                                {isStatusFilterApplied && (
                                    <div className="py-4 px-6 min-w-0 flex flex-col justify-center space-y-1.5">
                                        <div className="h-5 w-36 bg-gray-200 rounded-md" />
                                        <div className="h-3.5 w-28 bg-gray-100 rounded" />
                                    </div>
                                )}

                                {/* Column 6: Created At */}
                                <div className="py-4 px-6 min-w-0 flex items-center">
                                    <div className="h-4 w-32 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3b. Mobile Cards Skeleton */}
            <div className="block md:hidden mt-4 space-y-3.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
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

            {/* 4. Pagination Skeleton */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-4">
                <div className="h-4 w-44 bg-gray-200 rounded" />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                    <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
