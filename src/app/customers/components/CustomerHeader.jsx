"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Mail,
  Phone,
  Hash,
  Sparkles,
} from "lucide-react";

export default function CustomerHeader({
  customer,
  docId,
  onRefresh,
  isRefreshing,
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const name = customer?.name || "Customer";
  const email = customer?.email || "";
  const phone = customer?.phone_number ? String(customer.phone_number) : "";
  const source = customer?.source || "Direct";
  const isVendor = Boolean(customer?.vendor);
  const profilePic = customer?.profile_pic;
  const walletBalance =
    typeof customer?.wallet === "number"
      ? customer.wallet
      : typeof customer?.wallet === "object" && customer?.wallet !== null
        ? customer.wallet.total || customer.wallet.balance || 0
        : Number(customer?.wallet) || 0;

  return (
    <header className="rounded-2xl border border-[#DCE5F1] bg-white p-4 sm:p-5 shadow-sm transition">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section: Back button + Avatar + Details */}
        <div className="flex items-start gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] text-[#53647F] transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Profile Picture / Initials */}
          <div className="relative shrink-0">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-white object-cover shadow-md ring-2 ring-[#DCE5F1]"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2A67EC] to-[#704CF3] text-xl font-bold text-white shadow-md ring-2 ring-[#DCE5F1] ${profilePic ? "hidden" : "flex"
                }`}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#151D35]">
                {name}
              </h1>

              {isVendor && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#F4D877] bg-[#FFF8E9] px-2.5 py-0.5 text-xs font-bold text-[#C87513]">
                  <Sparkles className="h-3 w-3" />
                  Vendor
                </span>
              )}

              {source && (
                <span className="inline-flex items-center rounded-full border border-[#DCE5F1] bg-[#F2F5FA] px-2.5 py-0.5 text-xs font-medium text-[#53647F]">
                  {source}
                </span>
              )}
            </div>

            {/* Meta Items with Copy Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#53647F]">
              {email && (
                <button
                  type="button"
                  onClick={() => handleCopy(email, "email")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE5F1] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#53647F] transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]"
                  title="Click to copy email"
                >
                  <Mail className="h-3.5 w-3.5 text-[#8190A9]" />
                  <span>{email}</span>
                  {copiedKey === "email" ? (
                    <Check className="h-3 w-3 text-[#16B879]" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#8190A9] opacity-70" />
                  )}
                </button>
              )}

              {phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(phone, "phone")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE5F1] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#53647F] transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]"
                  title="Click to copy phone number"
                >
                  <Phone className="h-3.5 w-3.5 text-[#8190A9]" />
                  <span>{phone}</span>
                  {copiedKey === "phone" ? (
                    <Check className="h-3 w-3 text-[#16B879]" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#8190A9] opacity-70" />
                  )}
                </button>
              )}

              {docId && (
                <button
                  type="button"
                  onClick={() => handleCopy(docId, "docId")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE5F1] bg-[#F8FAFC] px-2.5 py-1 font-mono text-[11px] text-[#53647F] transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]"
                  title="Click to copy Customer ID"
                >
                  <Hash className="h-3 w-3 text-[#8190A9]" />
                  <span>{docId}</span>
                  {copiedKey === "docId" ? (
                    <Check className="h-3 w-3 text-[#16B879]" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#8190A9] opacity-70" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Refresh + Wallet Highlight */}
        <div className="flex items-center justify-between sm:justify-end gap-5 border-t border-[#DCE5F1]/60 pt-4 lg:border-t-0 lg:pt-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5F1] bg-white px-3.5 py-2 text-xs font-bold text-[#53647F] shadow-sm transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] active:scale-95 disabled:opacity-50"
          >
            <RotateCcw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#2A67EC]" : ""}`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#71809A]">
              Wallet Balance
            </p>
            <p className="text-2xl font-bold tracking-tight text-[#16B879]">
              ₹{Number(walletBalance).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
