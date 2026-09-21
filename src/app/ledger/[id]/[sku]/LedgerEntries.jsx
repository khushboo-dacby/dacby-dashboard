"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { 
  ArrowLeft, RefreshCw, Search, Box, XCircle, 
  Eye, Calendar, Filter, X,
  List, ShieldAlert, Wrench, PackageCheck, LogOut, Link2, ShoppingCart, TrendingUp, BarChart3
} from "lucide-react";
import { getLedgerBySku } from "../../../apis/api";
import LedgerEntryModal from "../../../../components/ledger/LedgerEntryModal";

const formatPrice = (val) => {
  if (val === undefined || val === null || isNaN(val)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDateShort = (dateObj) => {
  if (!dateObj || !dateObj._seconds) return "—";
  const date = new Date(dateObj._seconds * 1000);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

export default function LedgerEntries({ id, sku }) {
  const router = useRouter();
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `ledger-entries-${sku}`,
    () => getLedgerBySku(sku),
    { revalidateOnFocus: false }
  );

  const [selectedEntry, setSelectedEntry] = useState(null);

  // Filters State
  const initialFilters = {
    search: "",
    status: "",
    buyPrice: "",
    salePrice: ""
  };
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const items = Array.isArray(data?.items) ? data.items : [];
  const stats = data?.stats || {};
  const totalCount = data?.count || 0;

  // Apply filters locally on Search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const { search, status, buyPrice, salePrice } = appliedFilters;
      
      // 1. Search (Serial, Source Name/OrderID, Dest Name/OrderID)
      if (search.trim()) {
        const q = search.toLowerCase();
        const serial = item.serial_number?.toLowerCase() || "";
        const sourceName = item.source?.name?.toLowerCase() || "";
        const sourceOrder = item.source?.orderId?.toLowerCase() || "";
        const destName = item.destination?.name?.toLowerCase() || "";
        const destOrder = item.destination?.orderId?.toLowerCase() || "";
        
        if (
          !serial.includes(q) &&
          !sourceName.includes(q) &&
          !sourceOrder.includes(q) &&
          !destName.includes(q) &&
          !destOrder.includes(q)
        ) {
          return false;
        }
      }

      // 2. Status
      if (status && item.current_status?.code !== status) {
        return false;
      }

      // 3. Purchase Price
      if (buyPrice && item.buy_price !== Number(buyPrice)) {
        return false;
      }

      // 4. Sale Price
      if (salePrice && item.sell_price !== Number(salePrice)) {
        return false;
      }

      return true;
    });
  }, [items, appliedFilters]);

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
        <XCircle className="mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-slate-800">Failed to load entries</h2>
        <p className="mb-6 text-slate-500">{error.message}</p>
        <button
          onClick={() => mutate()}
          className="rounded-lg bg-[#3B5BDB] px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-[#2F4BB5]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const avgInventoryValue = totalCount > 0 
    ? (stats.total_buy_price || 0) / totalCount 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push(`/ledger/${id}`)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to SKU List
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl">Ledger Entries</h1>
            <p className="mt-1 text-sm text-slate-500">SKU: {sku}</p>
          </div>
        </div>
        <button
          onClick={() => mutate()}
          disabled={isValidating}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {/* SUMMARY CARDS */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <SummaryCard label="Total Entries" value={totalCount} icon={List} bgClass="bg-sky-50" iconColor="text-sky-600" />
          <SummaryCard label="Under Evaluation" value={stats.LDR_001_under_evaluation} icon={ShieldAlert} bgClass="bg-amber-50" iconColor="text-amber-600" />
          <SummaryCard label="Under Repair" value={stats.LDR_002_under_repair} icon={Wrench} bgClass="bg-rose-50" iconColor="text-rose-600" />
          <SummaryCard label="Ready to Ship" value={stats.LDR_003_ready_to_ship} icon={PackageCheck} bgClass="bg-blue-50" iconColor="text-blue-600" />
          <SummaryCard label="Ledger Out" value={stats.LDR_005_ledger_out} valueColor="text-emerald-700" icon={LogOut} bgClass="bg-emerald-50" iconColor="text-emerald-600" />
          <SummaryCard label="Attached" value={stats.LDR_004_product_attached} icon={Link2} bgClass="bg-purple-50" iconColor="text-purple-600" />
          <SummaryCard label="Purchase Val" value={formatPrice(stats.total_buy_price)} icon={ShoppingCart} bgClass="bg-orange-50" iconColor="text-orange-600" />
          <SummaryCard label="Sale Value" value={formatPrice(stats.total_sell_price)} valueColor="text-emerald-700" icon={TrendingUp} bgClass="bg-emerald-50" iconColor="text-emerald-600" />
          <SummaryCard label="Avg Inv Val" value={formatPrice(avgInventoryValue)} icon={BarChart3} bgClass="bg-indigo-50" iconColor="text-indigo-600" />
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={draftFilters.search}
              onChange={(e) => setDraftFilters(p => ({ ...p, search: e.target.value }))}
              placeholder="Serial No., Name, Order ID..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB]"
            />
          </div>
        </div>
        
        <div className="w-full lg:w-48">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status</label>
          <select
            value={draftFilters.status}
            onChange={(e) => setDraftFilters(p => ({ ...p, status: e.target.value }))}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB]"
          >
            <option value="">All Statuses</option>
            <option value="LDR-001">Under Evaluation</option>
            <option value="LDR-002">Under Repair</option>
            <option value="LDR-003">Ready to Ship</option>
            <option value="LDR-004">Product Attached</option>
            <option value="LDR-005">Ledger Out</option>
          </select>
        </div>

        <div className="w-full lg:w-36">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Buy Price</label>
          <input
            type="number"
            value={draftFilters.buyPrice}
            onChange={(e) => setDraftFilters(p => ({ ...p, buyPrice: e.target.value }))}
            placeholder="e.g. 45000"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB]"
          />
        </div>

        <div className="w-full lg:w-36">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Sell Price</label>
          <input
            type="number"
            value={draftFilters.salePrice}
            onChange={(e) => setDraftFilters(p => ({ ...p, salePrice: e.target.value }))}
            placeholder="e.g. 52000"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB]"
          />
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <button
            onClick={() => setAppliedFilters(draftFilters)}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#3B5BDB] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#2F4BB5]"
          >
            <Filter className="h-4 w-4" />
            Search
          </button>
          <button
            onClick={() => {
              setDraftFilters(initialFilters);
              setAppliedFilters(initialFilters);
            }}
            className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            title="Clear Filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <Box className="h-5 w-5 text-[#3B5BDB]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Ledger Entries <span className="ml-2 bg-slate-200/50 text-slate-600 px-2.5 py-1 rounded-full text-sm font-medium">({filteredItems.length} of {totalCount} total)</span>
          </h2>
        </div>

        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-900 font-bold border-b border-slate-200 shadow-sm">
              <tr>
                <th className="px-6 py-4">Serial Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Purchase Price</th>
                <th className="px-6 py-4">Sale Price</th>
                <th className="px-6 py-4">Profit</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-300" />
                    Loading entries...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-400">
                    No ledger entries found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const sellPrice = item.sell_price;
                  const buyPrice = item.buy_price;
                  const profit = (sellPrice && buyPrice) ? (sellPrice - buyPrice) : null;
                  const profitColorClass = profit > 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold";

                  // Determine status badge colors
                  let statusClasses = "bg-slate-100 text-slate-700 border-slate-200";
                  switch (item.current_status?.code) {
                    case 'LDR-001': statusClasses = "bg-amber-50 text-amber-700 border-amber-200"; break;
                    case 'LDR-002': statusClasses = "bg-rose-50 text-rose-700 border-rose-200"; break;
                    case 'LDR-003': statusClasses = "bg-blue-50 text-blue-700 border-blue-200"; break;
                    case 'LDR-004': statusClasses = "bg-purple-50 text-purple-700 border-purple-200"; break;
                    case 'LDR-005': statusClasses = "bg-emerald-50 text-emerald-700 border-emerald-200"; break;
                  }

                  return (
                    <tr key={item.ledgerId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{item.serial_number || "—"}</td>
                      <td className="px-6 py-4">
                        {item.current_status?.status ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusClasses}`}>
                            {item.current_status.status}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 font-medium">{formatPrice(buyPrice)}</td>
                      <td className={`px-6 py-4 font-medium ${sellPrice ? profitColorClass : ''}`}>
                        {sellPrice ? formatPrice(sellPrice) : "—"}
                      </td>
                      <td className={`px-6 py-4 font-medium ${profit !== null ? profitColorClass : ''}`}>
                        {profit !== null ? formatPrice(profit) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {item.source ? (
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-sm">{item.source.name || "—"}</span>
                            <span className="text-slate-900 text-sm font-mono">{item.source.orderId || "—"}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {item.destination ? (
                          <div className="flex flex-col">
                            <span className="text-slate-500 text-sm">{item.destination.name || "—"}</span>
                            <span className="text-slate-900 text-sm font-mono">{item.destination.orderId || "—"}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {formatDateShort(item.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedEntry(item)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 shadow-sm transition hover:bg-orange-100 hover:text-orange-700 hover:border-orange-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedEntry && (
        <LedgerEntryModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}
    </div>
  );
}

// Subcomponent for Summary Cards
function SummaryCard({ label, value, valueColor = "text-slate-900", icon: Icon, bgClass = "bg-white", iconColor = "text-slate-600" }) {
  return (
    <div className={`rounded-xl border border-slate-200 ${bgClass} p-5 shadow-sm flex flex-col transition-transform hover:-translate-y-1`}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className={`h-4 w-4 ${iconColor}`} />}
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate">{label}</span>
      </div>
      <span className={`text-2xl font-black ${valueColor} truncate`}>{value ?? 0}</span>
    </div>
  );
}
