"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, RefreshCw, Search, Package, CheckCircle, XCircle, Filter, RotateCcw } from "lucide-react";
import { getProductSkus } from "../../apis/api";
import TopNavigationBar from "@/components/common/TopNavigationBar";
import skusJson from "./[sku]/skus.json";
import { PhotoProvider, PhotoView } from "react-photo-view";


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

  const [filters, setFilters] = useState({});

  // Safely default to an empty array
  const skus = Array.isArray(skusJson?.skus) ? skusJson.skus : [];

  const filterKeys = useMemo(() => {
    if (!skus || skus.length === 0) return [];
    const baseKeys = ["sku", "title", "images", "firstImage", "price", "mrp", "sell_price", "id"];
    const allKeys = new Set();
    skus.forEach(sku => {
      Object.keys(sku).forEach(key => {
        if (!baseKeys.includes(key) && typeof sku[key] === 'string') {
          allKeys.add(key);
        }
      });
    });
    return Array.from(allKeys);
  }, [skus]);

  const filterOptions = useMemo(() => {
    const options = {};
    filterKeys.forEach(key => {
      const distinctValues = new Set();
      skus.forEach(sku => {
        if (sku[key] !== undefined && sku[key] !== null && sku[key] !== "") {
          distinctValues.add(sku[key]);
        }
      });
      options[key] = Array.from(distinctValues).sort();
    });
    return options;
  }, [skus, filterKeys]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!value || value === "All") {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  };

  const effectiveFilters = useMemo(() => {
    const eff = { ...filters };
    Object.keys(filterOptions).forEach(key => {
      if (filterOptions[key].length === 1) {
        eff[key] = filterOptions[key][0];
      }
    });
    return eff;
  }, [filters, filterOptions]);

  // Local filtering
  const filteredSkus = useMemo(() => {
    return skus.filter(sku => {
      for (const key of Object.keys(effectiveFilters)) {
        if (sku[key] !== effectiveFilters[key]) {
          return false;
        }
      }
      return true;
    });
  }, [skus, effectiveFilters]);

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
    <div className="min-h-screen bg-slate-50/50">
      <TopNavigationBar />
      <div className="p-4 md:p-6">
        {/* HEADER */}
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push('/')}
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
                  {skusJson?.productTitle || "Product SKUs"}
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

        {/* FILTERS CONTAINER */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Filter className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">Filters</h2>
            </div>
            <button
              onClick={() => setFilters({})}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition group"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition">
                <RotateCcw className="h-3.5 w-3.5" />
              </div>
              Clear Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-4 items-center w-full">
            {filterKeys.map(key => (
              <div key={key} className="flex flex-col gap-1 min-w-[150px]">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <select
                  className={`h-9 w-full rounded-lg border px-3 text-sm font-semibold shadow-sm outline-none transition focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB] cursor-pointer ${
                    effectiveFilters[key] !== undefined && effectiveFilters[key] !== "All"
                      ? "border-[#3B5BDB] bg-blue-50/50 text-[#3B5BDB]"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                  value={effectiveFilters[key] || "All"}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                >
                  <option value="All">All</option>
                  {filterOptions[key].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm w-full sm:w-auto">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#3B5BDB]">
              <Package className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total SKUs</p>
              <p className="text-sm font-bold text-slate-900 leading-none">{isLoading ? "-" : skusJson?.totalSkus ?? skus.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm w-full sm:w-auto">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Found Results</p>
              <p className="text-sm font-bold text-slate-900 leading-none">{isLoading ? "-" : filteredSkus.length}</p>
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
          // SKU Table
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
            <div className="max-h-[65vh] overflow-auto">
              <PhotoProvider>
                <table className="w-full text-left text-sm text-slate-600 relative">
                  <thead className="bg-slate-50 text-sm uppercase text-slate-900 sticky top-0 z-10 border-b border-slate-200 outline outline-1 outline-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">Image</th>
                      <th className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">SKU</th>
                      {filterKeys.map(key => (
                        <th key={key} className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">{key.replace(/_/g, ' ')}</th>
                      ))}
                      <th className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">MRP</th>
                      <th className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">Buy Price</th>
                      <th className="px-4 py-3 font-black whitespace-nowrap bg-slate-50">Sell Price</th>
                      <th className="px-4 py-3 font-black text-center whitespace-nowrap bg-slate-50">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSkus.map((sku) => (
                      <tr key={sku.sku} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition-all hover:border-slate-300 hover:shadow-sm">
                            {sku.firstImage ? (
                              <PhotoView src={sku.firstImage}>
                                <Image 
                                  src={sku.firstImage} 
                                  alt={sku.sku} 
                                  width={48} 
                                  height={48} 
                                  className="h-full w-full object-contain p-1 cursor-pointer" 
                                />
                              </PhotoView>
                            ) : (
                              <Package className="h-5 w-5 text-slate-300" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-[250px] truncate" title={sku.sku}>
                          {sku.sku}
                        </td>
                        {filterKeys.map(key => (
                          <td key={key} className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                            {sku[key] || "-"}
                          </td>
                        ))}
                        <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                          {sku.mrp ? formatPrice(sku.mrp) : "-"}
                        </td>
                        <td className="px-4 py-3 font-black text-emerald-700 whitespace-nowrap">
                          {sku.price ? formatPrice(sku.price) : "-"}
                        </td>
                        <td className="px-4 py-3 font-black text-rose-600 whitespace-nowrap">
                          {sku.sell_price ? formatPrice(sku.sell_price) : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/ledger/${id}/${sku.sku}`);
                            }}
                            className="rounded-lg bg-[#3B5BDB] px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-[#2F4BB5] active:scale-[0.98] whitespace-nowrap"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PhotoProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
