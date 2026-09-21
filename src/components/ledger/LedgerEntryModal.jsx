"use client";

import React, { useEffect } from "react";
import { X, Box, Info, Tag, DollarSign, Activity, User, Truck, Calendar, Mail, Phone } from "lucide-react";

export default function LedgerEntryModal({ entry, onClose }) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!entry) return null;

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
    if (!dateObj || !dateObj._seconds) return "—";
    const date = new Date(dateObj._seconds * 1000);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderField = (label, value, valueClassName = "text-sm font-medium text-slate-900 break-words", Icon = null, href = null) => {
    const valStr = value !== undefined && value !== null && value !== "" ? value : "—";
    
    let content;
    if (label === "Payment Method" && valStr !== "—") {
      content = (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200 w-fit">
          {valStr}
        </span>
      );
    } else if (label === "Shipment Charge" && valStr !== "—") {
      content = (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-sm font-bold bg-purple-100 text-purple-800 border border-purple-200 w-fit">
          {valStr}
        </span>
      );
    } else {
      content = (
        <span className={`flex items-center gap-1.5 ${valueClassName}`}>
          {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
          {valStr}
        </span>
      );
    }

    return (
      <div className="flex flex-col mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</span>
        {href && valStr !== "—" ? (
          <a href={href} className="hover:underline hover:text-blue-600 transition-colors w-fit">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div 
        className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ledger Entry Details</h2>
            <p className="text-sm text-slate-500 mt-1">{entry.ledgerId || "—"}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Overview & Pricing) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Box className="w-5 h-5 text-[#3B5BDB]" />
                  <h3 className="font-semibold text-base">Overview</h3>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2">
                    {entry.product_title || "—"}
                  </h4>
                  {renderField("SKU", entry.sku)}
                  {renderField("Serial Number", entry.serial_number)}
                  {renderField("Product ID", entry.product_id)}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-base">Pricing</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Buy Price</span>
                    <span className="text-lg font-bold text-slate-900">{formatPrice(entry.buy_price)}</span>
                  </div>
                  <div className="flex flex-col mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Sale Price</span>
                    <span className={`text-lg font-bold ${entry.sell_price ? (entry.sell_price - entry.buy_price > 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-900'}`}>{formatPrice(entry.sell_price)}</span>
                  </div>
                  {(() => {
                    const profitVal = entry.profit ?? (entry.sell_price && entry.buy_price ? entry.sell_price - entry.buy_price : null);
                    const profitColor = profitVal !== null ? (profitVal > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold') : 'text-slate-900';
                    return renderField("Profit", formatPrice(profitVal), `text-base ${profitColor} break-words`);
                  })()}
                  {renderField("Shipment Charge", formatPrice(entry.shipment_charge))}
                  {renderField("Repairing Charge", formatPrice(entry.repairing_charge))}
                </div>
              </div>
              
              {/* Category */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-base">Category</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {renderField("Name", entry.category?.name)}
                  {renderField("Code", entry.category?.code)}
                  {renderField("Type", entry.category?.type)}
                </div>
              </div>
            </div>

            {/* Right Columns (Status, Source, Dest, Info) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Status Section */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Activity className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-base">Current Status</h3>
                  </div>
                  {entry.current_status?.status && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {entry.current_status.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {renderField("Status Code", entry.current_status?.code)}
                  {renderField("Last Updated", formatDate(entry.current_status?.updated_at))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Truck className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold text-base">Source (Purchase)</h3>
                  </div>
                  {entry.source ? (
                    <div className="space-y-1">
                      {renderField("Order ID", entry.source.orderId)}
                      {renderField("Name", entry.source.name, "text-base font-bold text-slate-900 break-words")}
                      {renderField("Phone", entry.source.phone_number, "text-sm font-medium text-slate-900 break-words", Phone, entry.source.phone_number ? `tel:${entry.source.phone_number}` : null)}
                      {renderField("Email", entry.source.email, "text-sm font-medium text-slate-900 break-words", Mail, entry.source.email ? `mailto:${entry.source.email}` : null)}
                      {renderField("Purchase Date", formatDate(entry.source.created_at))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No source information available.</p>
                  )}
                </div>

                {/* Destination */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <User className="w-5 h-5 text-rose-500" />
                    <h3 className="font-semibold text-base">Destination (Sale)</h3>
                  </div>
                  {entry.destination ? (
                    <div className="space-y-1">
                      {renderField("Order ID", entry.destination.orderId)}
                      {renderField("Name", entry.destination.name, "text-base font-bold text-slate-900 break-words")}
                      {renderField("Phone", entry.destination.phone_number, "text-sm font-medium text-slate-900 break-words", Phone, entry.destination.phone_number ? `tel:${entry.destination.phone_number}` : null)}
                      {renderField("Email", entry.destination.email, "text-sm font-medium text-slate-900 break-words", Mail, entry.destination.email ? `mailto:${entry.destination.email}` : null)}
                      {renderField("Sale Date", formatDate(entry.destination.created_at))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No destination information available.</p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Info className="w-5 h-5 text-sky-500" />
                  <h3 className="font-semibold text-base">Additional Information</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {renderField("Payment Method", entry.method)}
                  {renderField("Product Ref", entry.product)}
                  {renderField("Created At", formatDate(entry.created_at))}
                  {renderField("Updated At", formatDate(entry.updated_at))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
