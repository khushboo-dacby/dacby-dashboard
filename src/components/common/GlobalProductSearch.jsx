"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, LoaderCircle, ExternalLink, X } from "lucide-react";
import { searchProducts } from "../../app/apis/api";

export default function GlobalProductSearch({ onSelect, onLedgerClick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setIsSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchProducts(value.trim());
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value ?? 0);
  };

  return (
    <div ref={wrapperRef} className="relative w-full shrink-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            if (query.trim()) setShowDropdown(true);
          }}
          placeholder="Search all products..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#3B5BDB] focus:ring-1 focus:ring-[#3B5BDB]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowDropdown(false);
            }}
            className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-[400px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl left-0">
          {isSearching ? (
            <div className="flex items-center justify-center p-6 text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
              <span className="text-sm">Searching products...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-100">
              {results.map((result) => {
                const product = result.product || result;
                const docId = result.docId || product.id;
                const variantsCount = product.variants ?? 0;
                const thumbnail = product.image || "/dacby-assets/download.svg";
                
                return (
                  <div
                    key={docId}
                    className="flex cursor-pointer items-center gap-4 p-3 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowDropdown(false);
                      setQuery("");
                      if (onSelect) onSelect(docId, product);
                    }}
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                      <Image
                        src={thumbnail}
                        alt="Product"
                        fill
                        className={`object-contain p-1 ${!product.image ? "opacity-40" : ""}`}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {product.product_title || "Unnamed Product"}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-medium text-slate-600">{product.category || "—"}</span>
                        {product.code && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                            {product.code}
                          </span>
                        )}
                        <span className="text-orange-600 font-medium">
                          {variantsCount} {variantsCount === 1 ? "variant" : "variants"}
                        </span>
                        {product.condition && (
                          <span className="rounded bg-red-50 px-1.5 py-0.5 font-bold text-red-600 uppercase text-[10px]">
                            {product.condition}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {formatPrice(product.price || 0)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(false);
                          setQuery("");
                          if (onLedgerClick) onLedgerClick(docId, product);
                        }}
                        className="inline-flex items-center gap-1 rounded bg-[#3B5BDB]/10 px-2.5 py-1 text-xs font-semibold text-[#3B5BDB] transition hover:bg-[#3B5BDB]/20"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ledger Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">
              No products found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
