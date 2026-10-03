"use client";

import React from "react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import GlobalProductSearch from "./GlobalProductSearch";
import { useRouter } from "next/navigation";

export default function TopNavigationBar() {
  const router = useRouter();

  return (
    <div className=" w-full items-center justify-between border-b border-slate-200 bg-slate-50/50 px-2 py-2">
      {/* Left side: Home & Search Bar */}
      <div className="flex w-full max-w-2xl items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="relative flex h-15 w-36 shrink-0 items-center justify-center rounded-lg transition"
          title="Home"
        >
          <Image
            src="/dacby-assets/dacby-icon.png"
            alt="Dacby Logo"
            fill
            className="object-contain"
          />
        </button>
        <div className="flex-1">
          <GlobalProductSearch 
            onSelect={(productId) => router.push(`/update-inventory/${productId}`)}
            onLedgerClick={(productId) => router.push(`/ledger/${productId}`)}
          />
        </div>
      </div>

      {/* Right side: User Profile (Mockup) */}
      {/* <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-900">Khushboo Kachhi</span>
          <span className="text-xs font-medium text-slate-500">Operations Manager</span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-sm font-bold text-white shadow-sm">
          KK
        </div>
        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 ml-1">
          <LogOut className="h-5 w-5" />
        </button>
      </div> */}
    </div>
  );
}
