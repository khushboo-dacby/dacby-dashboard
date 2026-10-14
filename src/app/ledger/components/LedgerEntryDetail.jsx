"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Box, Info, Tag, DollarSign, Activity, User, Truck, Calendar, Mail, Phone, RefreshCw, XCircle, ArrowDown, ArrowUp, TrendingUp, TrendingDown, Clock, ShoppingCart } from "lucide-react";
import ItemJourneyTimeline from "./ItemJourneyTimeline";
import { dummyTimeline } from "./dummyTimelineData";
// import TopNavigationBar from "@/components/common/TopNavigationBar";

export default function LedgerEntryDetail({ entry, onBack }) {
  if (!entry) {
    return null;
  }

  // Helpers
  const formatPrice = (val) => {
    if (val === undefined || val === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateObj) => {
    if (!dateObj || typeof dateObj._seconds !== "number") {
      return "—";
    }

    const date = new Date(
      dateObj._seconds * 1000 + Math.floor((dateObj._nanoseconds || 0) / 1_000_000)
    );

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const getAgingDays = (item) => {
    if (!item.created_at || typeof item.created_at._seconds !== "number") return "—";
    const startDate = new Date(
      item.created_at._seconds * 1000 + Math.floor((item.created_at._nanoseconds || 0) / 1_000_000)
    );
    let endDate = new Date();
    if (item.destination?.created_at && typeof item.destination.created_at._seconds === "number") {
      endDate = new Date(
        item.destination.created_at._seconds * 1000 + Math.floor((item.destination.created_at._nanoseconds || 0) / 1_000_000)
      );
    }
    const diffTime = endDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays >= 0 ? diffDays : 0}`;
  };

  const renderCompactField = (label, value, isMono = false, isHighlight = false, colorClass = "text-slate-800", href = null, labelColorClass = "text-slate-500") => {
    const valStr = value !== undefined && value !== null && value !== "" ? value : "—";
    
    let content;
    if (label === "Payment Method" && valStr !== "—") {
      content = (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 w-fit">
          {valStr}
        </span>
      );
    } else {
      content = (
        <span className={`text-[13px] ${isMono ? 'font-mono' : 'font-medium'} ${isHighlight ? 'text-lg font-bold' : ''} ${valStr === "—" ? 'text-slate-400' : colorClass} truncate`}>
          {valStr}
        </span>
      );
    }

    return (
      <div className="flex flex-col overflow-hidden">
        <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${labelColorClass}`}>{label}</span>
        {href && valStr !== "—" ? (
          <a href={href} className="hover:underline hover:text-blue-600 transition-colors w-fit truncate">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* <TopNavigationBar /> */}
      
      <div className="px-4 lg:px-6 py-6">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center max-w-[1600px] mx-auto">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ledger Entry Details</h1>
          </div>
        </header>

        <div className="flex flex-col gap-4 max-w-[1600px] mx-auto">
          {/* Top Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm">
             <div className="flex justify-between items-start mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
               <span>Overview</span>
               <div className="text-right">
                 <span>Last Updated</span>
                 <div className="text-slate-900 font-medium normal-case text-xs mt-0.5">{formatDate(entry.current_status?.updated_at || entry.updated_at)}</div>
               </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">{entry.product_title || "Unknown Product"}</h2>
             
             <div className="flex flex-wrap gap-2 mb-6">
               <span className="inline-flex items-center h-7 px-3 rounded-full text-[11px] border border-[#e2e8f0] bg-[#f8fafc]">
                  <span className="text-slate-500 font-medium mr-1">Category:</span>
                  <span className="text-[#334155] font-bold">{entry.category?.name || "—"} · {entry.category?.code || "—"} · {entry.category?.type || "—"}</span>
               </span>
               <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] border border-slate-200 bg-white shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#272F5A] shrink-0"></span>
                  <span>
                    <span className="text-slate-500 font-medium mr-1">Status:</span>
                    <span className="text-slate-900 font-bold">{entry.current_status?.status || "Unknown"}</span>
                  </span>
               </span>
               <span className="inline-flex items-center h-7 px-3 rounded-full text-[11px] border border-[#272F5A] bg-[#272F5A]">
                  <span className="text-white/70 font-medium mr-1">Code:</span>
                  <span className="text-white font-bold">{entry.current_status?.code || "—"}</span>
               </span>
             </div>

             <div className="border-t border-dashed border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
               {renderCompactField("SKU", entry.sku, true)}
               {renderCompactField("Serial Number", entry.serial_number, true)}
               {renderCompactField("Product ID", entry.product_id, true)}
             </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {(() => {
                const profitVal = entry.profit ?? (entry.sell_price && entry.buy_price ? entry.sell_price - entry.buy_price : null);
                const isProfitable = profitVal !== null ? profitVal > 0 : null;
                const isLoss = profitVal !== null ? profitVal < 0 : null;
                
                const saleColor = isProfitable ? "text-emerald-600" : (isLoss ? "text-rose-600" : "text-slate-900");
                const profitColor = isProfitable ? "text-emerald-600" : (isLoss ? "text-rose-600" : "text-slate-900");
                
                const dynamicBg = isProfitable ? "bg-emerald-50" : (isLoss ? "bg-rose-50" : "bg-slate-100");
                const dynamicIconColor = isProfitable ? "text-emerald-600" : (isLoss ? "text-rose-600" : "text-slate-500");
                
                let margin = "—";
                if (profitVal !== null && entry.buy_price) {
                  margin = `≈ ${((profitVal / entry.buy_price) * 100).toFixed(1)}% margin`;
                }

                return (
                  <>
                     {/* Buy Price */}
                     <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-1.5 rounded-lg bg-blue-50">
                             <ShoppingCart className="w-4 h-4 text-blue-500" />
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Buy Price</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900">{formatPrice(entry.buy_price)}</span>
                     </div>
                     
                     {/* Sale Price */}
                     <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                           <div className={`p-1.5 rounded-lg ${dynamicBg}`}>
                             <Tag className={`w-4 h-4 ${dynamicIconColor}`} />
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sale Price</span>
                        </div>
                        <span className={`text-2xl font-bold ${saleColor}`}>{formatPrice(entry.sell_price)}</span>
                     </div>
                     
                     {/* Profit */}
                     <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                           <div className={`p-1.5 rounded-lg ${dynamicBg}`}>
                             {isLoss ? (
                               <TrendingDown className="w-4 h-4 text-rose-600" />
                             ) : (
                               <TrendingUp className={`w-4 h-4 ${dynamicIconColor}`} />
                             )}
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profit</span>
                        </div>
                        <span className={`text-2xl font-bold mb-1 ${profitColor}`}>{formatPrice(profitVal)}</span>
                        <span className="text-xs text-slate-500 font-medium">{margin}</span>
                     </div>
                     
                     {/* Inventory Aging */}
                     <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="p-1.5 rounded-lg bg-amber-50">
                             <Clock className="w-4 h-4 text-amber-500" />
                           </div>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inventory Aging</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900">{getAgingDays(entry)} days</span>
                     </div>
                  </>
                );
             })()}
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             
             {/* Left Column (Timeline) */}
             <div className="lg:col-span-2 relative h-[500px] lg:h-auto lg:min-h-0">
                <div className="lg:absolute lg:inset-0 h-full">
                   <ItemJourneyTimeline events={dummyTimeline} />
                </div>
             </div>

             {/* Right Column (Cards) */}
             <div className="flex flex-col gap-4">
                
                {/* Source */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                   <div className="flex items-center gap-2 mb-5 text-slate-900">
                     <div className="bg-indigo-50 p-2 rounded-lg"><ArrowDown className="w-4 h-4 text-indigo-700" /></div>
                     <h3 className="font-bold text-sm">Source (Purchase)</h3>
                   </div>
                   {entry.source ? (
                     <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                             {entry.source.name ? entry.source.name[0].toUpperCase() : 'S'}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-sm text-slate-900">{entry.source.name}</span>
                             <span className="text-[10px] font-mono text-slate-500">{entry.source.orderId || "—"}</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           {renderCompactField("Phone", entry.source.phone_number)}
                           {renderCompactField("Email", entry.source.email)}
                           <div className="col-span-2">
                             {renderCompactField("Purchase Date", formatDate(entry.source.created_at))}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <p className="text-sm text-slate-400">No source data.</p>
                   )}
                </div>

                {/* Destination */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                   <div className="flex items-center gap-2 mb-5 text-slate-900">
                     <div className="bg-indigo-50 p-2 rounded-lg"><ArrowUp className="w-4 h-4 text-indigo-700" /></div>
                     <h3 className="font-bold text-sm">Destination (Sale)</h3>
                   </div>
                   {entry.destination ? (
                     <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                             {entry.destination.name ? entry.destination.name[0].toUpperCase() : 'D'}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-sm text-slate-900">{entry.destination.name}</span>
                             <span className="text-[10px] font-mono text-slate-500">{entry.destination.orderId || "—"}</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           {renderCompactField("Phone", entry.destination.phone_number)}
                           {renderCompactField("Email", entry.destination.email)}
                           <div className="col-span-2">
                             {renderCompactField("Sale Date", formatDate(entry.destination.created_at))}
                           </div>
                        </div>
                     </div>
                   ) : (
                     <p className="text-sm text-slate-400">No destination data.</p>
                   )}
                </div>

                {/* Extra Charges */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                   <div className="flex items-center gap-2 mb-5 text-slate-900">
                     <div className="bg-indigo-50 p-2 rounded-lg"><span className="w-4 h-4 text-indigo-700 text-sm font-bold flex items-center justify-center">₹</span></div>
                     <h3 className="font-bold text-sm">Extra Charges</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                     {renderCompactField("Shipment Charge", formatPrice(entry.shipment_charge))}
                     {renderCompactField("Repairing Charge", formatPrice(entry.repairing_charge))}
                   </div>
                </div>


                {/* Additional Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                   <div className="flex items-center gap-2 mb-5 text-slate-900">
                     <div className="bg-indigo-50 p-2 rounded-lg"><Info className="w-4 h-4 text-indigo-700" /></div>
                     <h3 className="font-bold text-sm">Additional Information</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                     {renderCompactField("Payment Method", entry.method)}
                     {renderCompactField("Product Ref", entry.product)}
                     <div className="col-span-2">
                        {renderCompactField("Created At", formatDate(entry.created_at))}
                     </div>
                     <div className="col-span-2">
                        {renderCompactField("Updated At", formatDate(entry.updated_at))}
                     </div>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
