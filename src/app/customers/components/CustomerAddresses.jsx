"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Phone,
  User,
  Check,
  Copy,
  Search,
  ExternalLink,
  Star,
  X,
} from "lucide-react";

export default function CustomerAddresses({ addresses = [], primaryAddressId }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "primary"

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullAddress = (addr, key) => {
    const parts = [
      addr.name,
      addr.street,
      [addr.city, addr.state].filter(Boolean).join(", "),
      addr.pincode ? `PIN: ${addr.pincode}` : "",
      addr.phone_number ? `Phone: ${addr.phone_number}` : "",
    ].filter(Boolean);

    const fullText = parts.join("\n");
    handleCopy(fullText, key);
  };

  // 1. Sort addresses so Primary Address is ALWAYS FIRST (Index 0)
  const sortedAddresses = useMemo(() => {
    if (!Array.isArray(addresses)) return [];
    return [...addresses].sort((a, b) => {
      const aIsPrimary = a.id === primaryAddressId;
      const bIsPrimary = b.id === primaryAddressId;
      if (aIsPrimary && !bIsPrimary) return -1;
      if (!aIsPrimary && bIsPrimary) return 1;
      return 0;
    });
  }, [addresses, primaryAddressId]);

  // Filtered & Searched Addresses
  const filteredAddresses = useMemo(() => {
    return sortedAddresses.filter((addr, idx) => {
      const isPrimary =
        addr.id === primaryAddressId || (!primaryAddressId && idx === 0);

      if (filterType === "primary" && !isPrimary) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = String(addr.name || "").toLowerCase().includes(q);
        const matchStreet = String(addr.street || "").toLowerCase().includes(q);
        const matchCity = String(addr.city || "").toLowerCase().includes(q);
        const matchState = String(addr.state || "").toLowerCase().includes(q);
        const matchPin = String(addr.pincode || "").toLowerCase().includes(q);
        const matchPhone = String(addr.phone_number || "").includes(q);

        return (
          matchName ||
          matchStreet ||
          matchCity ||
          matchState ||
          matchPin ||
          matchPhone
        );
      }

      return true;
    });
  }, [sortedAddresses, primaryAddressId, filterType, searchQuery]);

  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-[#DCE5F1] bg-white p-14 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF3FF] text-[#2A67EC]">
          <MapPin className="h-6 w-6" />
        </div>
        <h3 className="mt-3.5 text-base font-bold text-[#151D35]">
          No Addresses Found
        </h3>
        <p className="mt-1 text-xs text-[#71809A]">
          This customer has not registered any shipping delivery destinations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-2xs">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#151D35]">
                Saved Addresses
              </h2>
              <span className="rounded-full bg-[#EDF3FF] border border-[#C9DCFF] px-2.5 py-0.5 text-xs font-bold text-[#2A67EC]">
                {addresses.length} Total
              </span>
            </div>
            <p className="text-sm font-medium text-[#53647F]">
              Complete record of customer shipping destinations and primary fulfillment address.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Omni-Search & Filter Toolbar */}
      <div className="space-y-3 rounded-2xl border border-[#DCE5F1] bg-[#F8FAFC] p-3.5 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Omni Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8190A9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by recipient, street, city, state, PIN, or phone..."
              className="w-full rounded-xl border border-[#DCE5F1] bg-white pl-9 pr-8 py-1.5 text-xs text-[#151D35] placeholder:text-[#8190A9] focus:outline-none focus:border-[#2A67EC] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8190A9] hover:text-[#151D35] p-0.5"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                filterType === "all"
                  ? "bg-[#2A67EC] text-white shadow-xs"
                  : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#F8FAFC]"
              }`}
            >
              All ({addresses.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType("primary")}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                filterType === "primary"
                  ? "bg-[#2A67EC] text-white shadow-xs"
                  : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#EDF3FF] hover:text-[#2A67EC]"
              }`}
            >
              <Star className="h-3 w-3" />
              <span>Primary (1)</span>
            </button>
          </div>
        </div>

        {/* Active Filter Notice */}
        {(searchQuery || filterType !== "all") && (
          <div className="flex items-center justify-between border-t border-[#DCE5F1]/60 pt-2 text-xs">
            <span className="text-[#53647F]">
              Showing <strong className="text-[#151D35]">{filteredAddresses.length}</strong> of{" "}
              <strong>{addresses.length}</strong> addresses
              {searchQuery && (
                <span> matching &ldquo;<strong className="text-[#2A67EC]">{searchQuery}</strong>&rdquo;</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
              }}
              className="font-bold text-[#2A67EC] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Reset filter</span>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Industry-Level Address Cards Grid */}
      {filteredAddresses.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-12 text-center shadow-xs">
          <MapPin className="mx-auto h-9 w-9 text-[#8190A9]" />
          <p className="mt-3 text-sm font-bold text-[#151D35]">
            No addresses match your filter criteria
          </p>
          <p className="mt-1 text-sm text-[#53647F]">
            Try adjusting your search terms or clearing the filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
            }}
            className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1E57D2] transition cursor-pointer"
          >
            <span>Show All Addresses</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAddresses.map((addr, idx) => {
            const isPrimary =
              addr.id === primaryAddressId || (!primaryAddressId && idx === 0);

            const googleMapsQuery = encodeURIComponent(
              [addr.street, addr.city, addr.state, addr.pincode]
                .filter(Boolean)
                .join(", ")
            );

            return (
              <div
                key={addr.id || idx}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4.5 sm:p-5 transition-all duration-150 ${
                  isPrimary
                    ? "border-[#2A67EC] bg-[#FAFCFF] shadow-xs"
                    : "border-[#DCE5F1] bg-white hover:border-[#C9DCFF] hover:shadow-xs"
                }`}
              >
                <div>
                  {/* Card Header: User Icon + Recipient Name & Primary Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isPrimary
                            ? "bg-[#EDF3FF] text-[#2A67EC] border border-[#C9DCFF]"
                            : "bg-[#F8FAFC] text-[#53647F] border border-[#DCE5F1]"
                        }`}
                      >
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <h3
                        className="font-bold text-base text-[#151D35] truncate"
                        title={addr.name || "Recipient"}
                      >
                        {addr.name || "Recipient"}
                      </h3>
                    </div>

                    {isPrimary && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFBF3] border border-[#B7F1CD] px-2.5 py-0.5 text-xs font-bold text-[#157348] shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16B879]" />
                        <span>Primary</span>
                      </span>
                    )}
                  </div>

                  {/* Card Body: Street & Locality */}
                  <div className="mt-3.5 space-y-1">
                    <p
                      className="font-semibold text-sm text-[#151D35] leading-relaxed line-clamp-2 min-h-[40px]"
                      title={addr.street}
                    >
                      {addr.street || "No street address specified"}
                    </p>

                    <div className="flex items-center gap-1.5 text-[#53647F] font-medium text-xs sm:text-sm pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-[#8190A9] shrink-0" />
                      <span className="truncate">
                        {[addr.city, addr.state].filter(Boolean).join(", ")}
                        {addr.pincode ? ` · ${addr.pincode}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Phone with Copy, Copy Full Address, Open Maps */}
                <div className="mt-4 pt-3 border-t border-[#DCE5F1]/70 flex items-center justify-between gap-2 text-xs">
                  {/* Phone with copy */}
                  <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-semibold text-[#151D35] min-w-0">
                    <Phone className="h-3.5 w-3.5 text-[#8190A9] shrink-0" />
                    <span className="truncate">{addr.phone_number || "—"}</span>
                    {addr.phone_number && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(addr.phone_number, `ph-${addr.id || idx}`)
                        }
                        className="text-[#8190A9] hover:text-[#2A67EC] transition cursor-pointer p-0.5 shrink-0"
                        title="Copy Phone Number"
                      >
                        {copiedKey === `ph-${addr.id || idx}` ? (
                          <Check className="h-3 w-3 text-[#16B879]" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Actions: Copy Full Address & Open Maps */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyFullAddress(addr, `full-${addr.id || idx}`)
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-[#DCE5F1] bg-white px-2 py-1 text-xs font-bold text-[#46546D] hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer shadow-2xs"
                      title="Copy complete address"
                    >
                      {copiedKey === `full-${addr.id || idx}` ? (
                        <>
                          <Check className="h-3 w-3 text-[#16B879]" />
                          <span className="text-[#16B879]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-[#DCE5F1] bg-white text-[#8190A9] hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer shadow-2xs"
                      title="Open destination in Google Maps"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

