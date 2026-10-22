"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftOpen } from "lucide-react";
import GlobalSidebar from "./GlobalSidebar";

export default function GlobalAppShell({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Restore collapsed state preference from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dacby_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (_) {
      // Ignore localStorage errors in private browsing
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("dacby_sidebar_collapsed", String(next));
      } catch (_) {}
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F8FC] text-[#151D35] flex flex-col antialiased">
      {/* Global Sidebar Component */}
      <GlobalSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Mobile Top App Bar (visible only on small screens < lg) */}
      <header className="lg:hidden sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#DCE5F1] bg-white/95 px-4 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE5F1] bg-white text-[#151D35] shadow-2xs hover:bg-[#F2F5FA] transition active:scale-95 cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="relative h-7 w-24 shrink-0">
            <Image
              src="/dacby-assets/dacby-icon.png"
              alt="DACBY"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
        </div>

      </header>

      {/* Main Content Workspace Container */}
      <div
        className={`flex-1 min-w-0 transition-[padding] duration-300 ease-in-out ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"
        }`}
      >
        <main className="min-h-full w-full">{children}</main>
      </div>
    </div>
  );
}
