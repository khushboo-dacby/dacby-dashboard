"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  Mail,
  User,
  Loader2,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import { searchUsers } from "../api";

export default function CustomerTopNav({
  userData = {},
  docId = "",
  onRefresh,
  isRefreshing,
  onSearchUser,
}) {
  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Focus search input on ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Submit search ONLY on hit Enter (no debounce while typing)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = searchId.trim();
    if (!query) return;

    // Extract digits for phone numbers (e.g. +91 73552 32730 -> 7355232730)
    let phoneQuery = query.replace(/\D/g, "");
    if (phoneQuery.length === 12 && phoneQuery.startsWith("91")) {
      phoneQuery = phoneQuery.slice(2);
    }

    setIsSearching(true);
    setSearchError(null);
    setIsDropdownOpen(true);

    try {
      const targetPhone = phoneQuery.length >= 7 ? phoneQuery : query;
      const res = await searchUsers(targetPhone);
      setSearchResults(res?.users || []);
    } catch (err) {
      console.warn("searchUsers error:", err);
      const msg = err?.message || "Search failed";
      if (String(msg).toLowerCase().includes("valid number")) {
        setSearchError("Please search using a 10-digit mobile phone number.");
      } else {
        setSearchError(msg);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (userDocId) => {
    if (!userDocId) return;
    setIsDropdownOpen(false);
    if (onSearchUser) {
      onSearchUser(userDocId);
    }
  };

  const handleClear = () => {
    setSearchId("");
    setSearchResults(null);
    setSearchError(null);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-[#DCE5F1] bg-white px-4 sm:px-6 shadow-2xs">
      {/* Search Input Container Placed on the Far Left */}
      <div ref={containerRef} className="relative w-full max-w-md sm:max-w-lg">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
          <Search className="absolute left-3.5 h-4 w-4 text-[#8190A9] pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by name or phone no."
            className="h-10 w-full rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] pl-10 pr-9 text-sm font-medium text-[#151D35] placeholder-[#8190A9] placeholder:text-sm focus:border-[#2A67EC] focus:bg-white focus:outline-none transition shadow-inner"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-[#2A67EC]" />
            )}

            {searchId && !isSearching && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md p-1 text-[#8190A9] hover:bg-[#EEF3FF] hover:text-[#151D35] transition cursor-pointer"
                title="Clear input"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Search Results Dropdown with Max Height & Scroll Behavior */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-full rounded-2xl border border-[#DCE5F1] bg-white shadow-xl z-50 overflow-hidden animate-in fade-in duration-100">
            {/* Header / Status Bar */}
            <div className="flex items-center justify-between border-b border-[#DCE5F1] bg-[#F8FAFC] px-4 py-2 text-[11px] font-semibold text-[#71809A]">
              <span>
                {isSearching
                  ? "Searching customer database..."
                  : searchResults
                  ? `Found ${searchResults.length} customer${searchResults.length === 1 ? "" : "s"}`
                  : "Search customer"}
              </span>
              <span className="text-[10px] text-[#8190A9]">Esc to close</span>
            </div>

            {/* Scrollable Container with Max Height */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#DCE5F1]/70 scrollbar-thin scrollbar-thumb-[#DCE5F1]">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2A67EC]" />
                  <p className="mt-2 text-xs font-medium text-[#71809A]">
                    Looking up phone number...
                  </p>
                </div>
              ) : searchError && (!searchResults || searchResults.length === 0) ? (
                <div className="p-4 text-center">
                  <AlertCircle className="mx-auto h-6 w-6 text-[#E03137]" />
                  <p className="mt-1.5 text-xs font-semibold text-[#E03137]">
                    {searchError}
                  </p>
                  {searchId.trim().length >= 10 && (
                    <button
                      type="button"
                      onClick={() => handleSelectUser(searchId.trim())}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1E57D2] transition cursor-pointer"
                    >
                      <span>Open Customer ID directly: {searchId.trim()}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ) : searchResults && searchResults.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-xs font-semibold text-[#151D35]">
                    No customer found for &quot;{searchId}&quot;
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#71809A]">
                    Please verify the 10-digit mobile number and try again.
                  </p>
                  {searchId.trim().length >= 10 && (
                    <button
                      type="button"
                      onClick={() => handleSelectUser(searchId.trim())}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#C9DCFF] bg-[#EDF3FF] px-3 py-1.5 text-xs font-bold text-[#2A67EC] hover:bg-[#DDE9FF] transition cursor-pointer"
                    >
                      <span>Open as Customer ID ({searchId.trim()})</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                searchResults.map((user, idx) => (
                  <button
                    key={user.docId || idx}
                    type="button"
                    onClick={() => handleSelectUser(user.docId)}
                    className="flex w-full items-center justify-between p-3.5 text-left transition hover:bg-[#F2F6FD] cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[#151D35] group-hover:text-[#2A67EC] transition">
                            {user.name || "Customer"}
                          </p>
                          {user.source && (
                            <span className="rounded-md bg-[#F2F5FA] px-1.5 py-0.5 text-[10px] font-semibold text-[#53647F]">
                              {user.source}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#71809A]">
                          {user.phone_number && (
                            <span className="inline-flex items-center gap-1 font-mono">
                              <Phone className="h-3 w-3 text-[#8190A9]" />
                              {user.phone_number}
                            </span>
                          )}
                          {user.email && (
                            <span className="inline-flex items-center gap-1 truncate max-w-[180px]">
                              <Mail className="h-3 w-3 text-[#8190A9]" />
                              {user.email}
                            </span>
                          )}
                        </div>

                        {user.docId && (
                          <p className="text-[10px] font-mono text-[#8190A9]">
                            ID: <span className="text-[#53647F]">{user.docId}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-transparent text-[#8190A9] group-hover:bg-[#EDF3FF] group-hover:text-[#2A67EC] transition">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                ))
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
