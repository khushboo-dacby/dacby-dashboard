"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  PackagePlus,
  Package,
  Activity,
  ShieldAlert,
  Users,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";

/**
 * Navigation items configuration matching the DACBY Operations Dashboard.
 */
export const NAV_ITEMS = [
  {
    id: "buy-orders",
    label: "Buy Orders",
    icon: ShoppingBag,
    type: "group",
    subItems: [
      { id: "forward-orders", label: "Forward Orders", href: "/buy-orders/forward" },
      { id: "return-orders", label: "Return Orders", href: "/buy-orders/returns" },
    ],
  },
  {
    id: "sell-orders",
    label: "Sell Orders",
    icon: PackagePlus,
    href: "/sell-orders",
    type: "link",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    type: "group",
    subItems: [
      { id: "product-inventory", label: "Product Inventory", href: "/" },
      { id: "add-product", label: "Add Product", href: "/add-product" },
    ],
  },
  {
    id: "live-data",
    label: "Live Data",
    icon: Activity,
    href: "/live-data-industry",
    type: "link",
    badge: "Live",
    badgeTone: "green",
  },
  {
    id: "sla-breach",
    label: "SLA Breach",
    icon: ShieldAlert,
    href: "/sla-industry",
    type: "link",
    badge: "Breach",
    badgeTone: "rose",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: "/customers",
    type: "link",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    type: "link",
  },
  {
    id: "ledger",
    label: "Ledger",
    icon: BookOpen,
    href: "/ledger-analytics",
    type: "link",
  },
];

export default function GlobalSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const pathname = usePathname();
  const [activeQueryTab, setActiveQueryTab] = useState("");

  // Track search query params on client side safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setActiveQueryTab(params.get("tab") || "");
    }
  }, [pathname]);

  // Determine active item based on current route
  const activeId = useMemo(() => {
    if (
      pathname.startsWith("/buy-orders/forward") ||
      pathname.startsWith("/buy-orders/forward-orders")
    ) {
      return "forward-orders";
    }
    if (
      pathname.startsWith("/buy-orders/returns") ||
      pathname.startsWith("/buy-orders/return-orders")
    ) {
      return "return-orders";
    }
    if (pathname.startsWith("/sell-orders") || pathname.startsWith("/sell-order")) {
      return "sell-orders";
    }
    if (pathname === "/live-data-industry" || pathname === "/live-data-next") {
      return "live-data";
    }
    if (pathname === "/sla-industry") {
      return "sla-breach";
    }
    if (pathname.startsWith("/customers")) {
      return "customers";
    }
    if (pathname === "/analytics") {
      if (activeQueryTab === "sell") return "sell-orders";
      if (activeQueryTab === "forward") return "forward-orders";
      if (activeQueryTab === "returns") return "return-orders";
      return "analytics";
    }
    if (pathname === "/" || pathname.startsWith("/update-inventory")) {
      return "product-inventory";
    }
    if (pathname.startsWith("/add-product")) {
      return "add-product";
    }
    if (pathname.startsWith("/ledger-analytics") || pathname.startsWith("/ledger")) {
      return "ledger";
    }
    return "";
  }, [pathname, activeQueryTab]);

  // State to manage open/close accordions for groups in expanded mode
  const [openGroups, setOpenGroups] = useState({
    "buy-orders": false,
    inventory: true, // Default open for inventory
  });

  // Auto-expand parent group if active child route matches
  useEffect(() => {
    if (activeId === "forward-orders" || activeId === "return-orders") {
      setOpenGroups((prev) => ({ ...prev, "buy-orders": true }));
    }
    if (activeId === "product-inventory" || activeId === "add-product") {
      setOpenGroups((prev) => ({ ...prev, inventory: true }));
    }
  }, [activeId]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Close mobile sidebar on route navigation
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname, onCloseMobile]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation overlay"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") onCloseMobile();
          }}
          className="fixed inset-0 z-40 bg-[#102449]/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Main Sidebar Aside Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#DCE5F1] bg-white transition-all duration-300 ease-in-out lg:z-50 ${
          collapsed ? "w-[76px] overflow-visible" : "w-[264px] overflow-hidden"
        } ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          boxShadow:
            "0 4px 20px -2px rgba(16, 36, 73, 0.05), 0 2px 6px -1px rgba(16, 36, 73, 0.03)",
        }}
      >
        {/* Top Header / Branding */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-[#DCE5F1]/80 px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 overflow-hidden transition hover:opacity-90"
            title="Dacby Operations Dashboard"
          >
            <div className="relative h-9 w-28 shrink-0">
              <Image
                src="/dacby-assets/dacby-icon.png"
                alt="DACBY Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {!collapsed && (
              <span className="hidden sm:inline-flex rounded-md bg-[#EDF3FF] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1B4DB8]">
                OPS
              </span>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71809A] hover:bg-[#F2F5FA] hover:text-[#151D35] transition lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse/Expand button on desktop */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-[#71809A] hover:bg-[#F2F5FA] hover:text-[#151D35] transition cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <div
          className={`flex-1 px-3 py-4 space-y-1.5 ${
            collapsed ? "overflow-visible" : "overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200"
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            // 1. Group / Accordion item (e.g. Buy Orders, Inventory)
            if (item.type === "group") {
              const isOpen = openGroups[item.id] || false;
              const hasActiveChild = item.subItems.some((sub) => sub.id === activeId);

              return (
                <div key={item.id} className="relative group space-y-1 hover:z-[60]">
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed && onToggleCollapse) {
                        onToggleCollapse();
                      }
                      toggleGroup(item.id);
                    }}
                    className={`relative flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-[15px] font-semibold transition-all duration-200 cursor-pointer ${
                      hasActiveChild && !isOpen
                        ? "bg-[#EDF3FF] text-[#1B4DB8] font-bold"
                        : "text-[#53647F] hover:bg-[#F2F5FA] hover:text-[#151D35]"
                    } ${collapsed ? "justify-center px-2" : ""}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={`h-5 w-5 shrink-0 transition-colors ${
                          hasActiveChild && !isOpen
                            ? "text-[#1B4DB8]"
                            : "text-[#53647F] group-hover:text-[#151D35]"
                        }`}
                        strokeWidth={2}
                      />
                      {!collapsed && (
                        <span className="truncate tracking-[-0.01em]">{item.label}</span>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#71809A] transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#151D35]" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Accordion Sub-items (in expanded mode) */}
                  {isOpen && !collapsed && (
                    <div className="space-y-1 pt-0.5 pb-1">
                      {item.subItems.map((sub) => {
                        const isSubActive = sub.id === activeId;

                        return (
                          <Link
                            key={sub.id}
                            href={sub.href}
                            className={`relative block rounded-xl pl-11 pr-3 py-2 text-sm transition-all duration-150 ${
                              isSubActive
                                ? "bg-[#EDF3FF] text-[#1B4DB8] font-bold shadow-2xs"
                                : "text-[#53647F] hover:bg-[#F2F5FA] hover:text-[#151D35] font-medium"
                            }`}
                          >
                            {isSubActive && (
                              <span className="absolute left-8 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#1B4DB8]" />
                            )}
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* WHITE FLOATING FLYOUT POPOVER ON HOVER WHEN CONTRACTED     */}
                  {/* ========================================================= */}
                  {collapsed && (
                    <div className="pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] w-60 rounded-2xl border border-[#DCE5F1] bg-white p-3.5 shadow-[0_16px_38px_rgba(16,36,73,0.18),0_2px_8px_rgba(16,36,73,0.06)]">
                      {/* Invisible bridge to prevent hover loss when mouse moves over gap */}
                      <div className="absolute -left-3 inset-y-0 w-3 pointer-events-auto" />

                      {/* White Arrow / Pointer facing the icon */}
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border-l border-b border-[#DCE5F1] bg-white" />

                      {/* Header with icon and page name */}
                      <div className="relative flex items-center gap-2.5 pb-2.5 border-b border-[#DCE5F1]/80">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                            hasActiveChild
                              ? "bg-[#2A67EC] text-white shadow-xs"
                              : "bg-[#EDF3FF] text-[#1B4DB8]"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#151D35]">
                            {item.label}
                          </p>
                          <p className="text-[10px] font-semibold text-[#71809A]">
                            {item.subItems.length} Sub-Pages
                          </p>
                        </div>
                      </div>

                      {/* Sub-Pages List with Direct Click Navigation */}
                      <div className="relative mt-2.5 space-y-1">
                        <p className="px-1 text-[10px] font-black uppercase tracking-wider text-[#71809A]">
                          Sub-Pages
                        </p>
                        {item.subItems.map((sub) => {
                          const isSubActive = sub.id === activeId;

                          return (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition ${
                                isSubActive
                                  ? "bg-[#2A67EC] text-white shadow-xs"
                                  : "text-[#334155] hover:bg-[#EDF3FF] hover:text-[#1B4DB8]"
                              }`}
                            >
                              <span>{sub.label}</span>
                              <ChevronRight
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  isSubActive ? "text-white" : "text-[#71809A]"
                                }`}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // 2. Direct Link Item (e.g. Sell Orders, Live Data, SLA Breach, Customers, etc.)
            const isActive = item.id === activeId;

            return (
              <div key={item.id} className="relative group hover:z-[60]">
                <Link
                  href={item.href}
                  className={`relative flex items-center justify-between w-full rounded-2xl px-3.5 py-3 text-[15px] transition-all duration-200 ${
                    isActive
                      ? "bg-[#2A67EC] text-white font-bold shadow-[0_8px_20px_rgba(42,103,236,0.32)]"
                      : "text-[#53647F] font-semibold hover:bg-[#F2F5FA] hover:text-[#151D35]"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                >
                  {/* Active Indicator: signature white vertical pill on left edge */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-r-full bg-white shadow-xs" />
                  )}

                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#53647F] group-hover:text-[#151D35]"
                      }`}
                      strokeWidth={isActive ? 2.2 : 2}
                    />
                    {!collapsed && (
                      <span className="truncate tracking-[-0.01em]">{item.label}</span>
                    )}
                  </div>

                  {/* Optional Badges (e.g., Live Pulse or Counter) */}
                  {!collapsed && item.badge && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeTone === "green"
                          ? "bg-[#ECFBF3] text-[#157348] border border-[#B7F1CD]"
                          : "bg-[#FFF0F2] text-[#B83852] border border-[#F5C2CA]"
                      }`}
                    >
                      {item.badgeTone === "green" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#16B879] animate-pulse" />
                      )}
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* ========================================================= */}
                {/* WHITE FLOATING FLYOUT POPOVER ON HOVER WHEN CONTRACTED     */}
                {/* ========================================================= */}
                {collapsed && (
                  <div className="pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-out absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] w-56 rounded-2xl border border-[#DCE5F1] bg-white p-3.5 shadow-[0_16px_38px_rgba(16,36,73,0.18),0_2px_8px_rgba(16,36,73,0.06)]">
                    {/* Invisible bridge to prevent hover loss when moving mouse */}
                    <div className="absolute -left-3 inset-y-0 w-3 pointer-events-auto" />

                    {/* White Arrow / Pointer facing the icon */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 border-l border-b border-[#DCE5F1] bg-white" />

                    {/* Header with icon, page name and badge */}
                    <div className="relative flex items-center gap-2.5 pb-2.5 border-b border-[#DCE5F1]/80">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-[#2A67EC] text-white shadow-xs"
                            : "bg-[#EDF3FF] text-[#1B4DB8]"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#151D35]">
                          {item.label}
                        </p>
                        <p className="text-[10px] font-semibold text-[#71809A]">
                          Direct Route
                        </p>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            item.badgeTone === "green"
                              ? "bg-[#ECFBF3] text-[#157348] border border-[#B7F1CD]"
                              : "bg-[#FFF0F2] text-[#B83852] border border-[#F5C2CA]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Direct Action Link */}
                    <div className="relative mt-2.5">
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                          isActive
                            ? "bg-[#2A67EC] text-white shadow-xs"
                            : "bg-[#F8FAFC] text-[#151D35] hover:bg-[#EDF3FF] hover:text-[#1B4DB8] border border-[#DCE5F1]/80"
                        }`}
                      >
                        <span>Open {item.label}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / System Status Card */}
        <div className="shrink-0 border-t border-[#DCE5F1]/80 p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#DCE5F1]/80 bg-[#F8FAFC] p-2.5 shadow-2xs">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#102449] text-xs font-black text-white shadow-xs">
                DO
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-[#151D35]">
                  DACBY Operations
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16B879] animate-pulse" />
                  <p className="truncate text-[10px] font-semibold text-[#53647F]">
                    Live Online · v2.4
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group flex justify-center hover:z-[60]">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102449] text-xs font-black text-white shadow-xs cursor-default"
              >
                DO
              </div>

              {/* Status Popover when hovering DO avatar in collapsed mode */}
              <div className="pointer-events-none opacity-0 invisible group-hover:pointer-events-auto group-hover:opacity-100 group-hover:visible transition-all duration-150 absolute left-full ml-3 bottom-0 z-[70] w-52 rounded-2xl border border-[#DCE5F1] bg-white p-3 shadow-[0_16px_38px_rgba(16,36,73,0.18)]">
                <div className="absolute -left-1.5 bottom-3.5 h-3 w-3 rotate-45 border-l border-b border-[#DCE5F1] bg-white" />
                <p className="text-xs font-extrabold text-[#151D35]">DACBY Operations</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16B879]" />
                  <p className="text-[11px] font-semibold text-[#53647F]">Admin Console Online</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
