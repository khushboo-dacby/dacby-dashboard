"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, RefreshCw, Search, Package, CheckCircle, XCircle } from "lucide-react";
import { getProductSkus } from "../../apis/api";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function LedgerDetail({ id }) {
  const router = useRouter();
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `ledger-skus-${id}`,
    () => getProductSkus(id),
    {
      revalidateOnFocus: false,
    }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Safely default to an empty array
  const skus = Array.isArray(data?.skus) ? data.skus : [];

  // Local filtering
  const filteredSkus = useMemo(() => {
    if (!searchQuery.trim()) return skus;
    const lowerQuery = searchQuery.toLowerCase();
    return skus.filter(
      (sku) =>
        sku.sku?.toLowerCase().includes(lowerQuery) ||
        sku.title?.toLowerCase().includes(lowerQuery)
    );
  }, [skus, searchQuery]);

  const handleRefresh = () => {
    mutate();
  };

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <XCircle className="mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-slate-800">Failed to load SKUs</h2>
        <p className="mb-6 text-slate-500">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={handleRefresh}
          className="rounded-lg bg-[#3B5BDB] px-6 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:scale-[1.03] hover:bg-[#2F4BB5] active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            {isLoading ? (
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200"></div>
            ) : (
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                {data?.productTitle || "Product SKUs"}
              </h1>
            )}
            <p className="mt-1 text-sm text-slate-500">Manage product SKU variants</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isValidating}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {/* SEARCH & METRICS */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search SKU, color, storage, condition..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB]"
            />
          </div>
          
          {/* Dropdown Suggestions */}
          {isSearchFocused && searchQuery && (
            <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
              {filteredSkus.length > 0 ? (
                filteredSkus.slice(0, 5).map((sku) => (
                  <button
                    key={sku.sku}
                    className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-slate-50"
                    onClick={() => {
                      setSearchQuery(sku.sku);
                      setIsSearchFocused(false);
                      // Adding a small delay to let render happen then scroll
                      setTimeout(() => {
                        const el = document.getElementById(`sku-${sku.sku}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 50);
                    }}
                  >
                    <span className="text-sm font-medium text-slate-900">{sku.sku}</span>
                    <span className="text-xs text-slate-500">Price: {formatPrice(sku.sell_price)}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500">No matching SKUs found</div>
              )}
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="flex gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:px-5 md:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#3B5BDB]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total SKUs</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "-" : data?.totalSkus ?? skus.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:px-5 md:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Found Results</p>
              <p className="text-lg font-bold text-slate-900">{isLoading ? "-" : filteredSkus.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex aspect-video w-full animate-pulse items-center justify-center bg-slate-100">
                <div className="h-20 w-20 rounded-full bg-slate-200"></div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
                <div className="space-y-3">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200"></div>
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200"></div>
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
                </div>
                <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : skus.length === 0 ? (
        // Empty State
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
          <Package className="mb-3 h-10 w-10 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-800">No SKUs found</h3>
          <p className="text-sm text-slate-500">There's currently no SKU information available for this product.</p>
        </div>
      ) : filteredSkus.length === 0 ? (
        // Search Empty State
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
          <Search className="mb-3 h-10 w-10 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-800">No matching SKUs found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search terms.</p>
        </div>
      ) : (
        // SKU Grid
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkus.map((sku) => {
            const hasImage = !!sku.firstImage;
            const discount =
              sku.mrp > sku.price
                ? Math.round(((sku.mrp - sku.price) / sku.mrp) * 100)
                : 0;

            return (
              <div
                id={`sku-${sku.sku}`}
                key={sku.sku}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image Section */}
                <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-50 border-b border-slate-100 p-4">
                  {hasImage ? (
                    <Image
                      src={sku.firstImage}
                      alt={sku.sku}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Package className="mb-2 h-10 w-10" />
                      <span className="text-xs font-medium">No Image</span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-900" title={sku.sku}>
                      {sku.sku}
                    </h3>
                  </div>

                  <div className="mb-4 mt-auto rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      {sku.mrp > sku.price && (
                        <span className="text-sm font-semibold text-slate-600 line-through">
                          MRP {formatPrice(sku.mrp)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-slate-700 uppercase tracking-wider font-bold">
                          Sell Price
                        </div>
                        <div className="text-xl font-black text-rose-600 leading-none mt-1 tracking-tight">
                          {formatPrice(sku.sell_price)}
                        </div>
                      </div>
                      {sku.price && (
                        <div className="flex-1">
                          <div className="text-xs text-slate-700 uppercase tracking-wider font-bold">
                            Buy Price
                          </div>
                          <div className="text-xl font-black text-emerald-600 leading-none mt-1 tracking-tight">
                            {formatPrice(sku.price)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    {sku.stock !== undefined && (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-400">Stock</span>
                        <span className="font-medium text-slate-700">{sku.stock}</span>
                      </div>
                    )}
                    {sku.condition && (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-400">Condition</span>
                        <span className="font-medium text-slate-700">{sku.condition}</span>
                      </div>
                    )}
                    {sku.color && (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-400">Color</span>
                        <span className="font-medium text-slate-700">{sku.color}</span>
                      </div>
                    )}
                    {sku.storage && (
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-400">Storage</span>
                        <span className="font-medium text-slate-700">{sku.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/ledger/${id}/${sku.sku}`);
                    }}
                    className="w-full rounded-lg bg-[#3B5BDB] py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.03] hover:bg-[#2F4BB5] hover:shadow-md active:scale-[0.98]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
