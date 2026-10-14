"use client";

import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

// =============================================================================
// Reusable Category Issues Horizontal Bar Chart Component with Dynamic Status Filter
// =============================================================================
function CategoryIssuesChart({
  categoryTitle,
  issues,
  selectedIssueId,
  onSelectIssueId,
}) {
  const [chartFilter, setChartFilter] = useState("overdue");

  const hasUnconfigured = useMemo(
    () => issues.some((i) => i.status === "SLA Not Configured"),
    [issues]
  );

  const getIssueCountForFilter = (item, filter) => {
    switch (filter) {
      case "due-soon":
        return item.dueSoonCount || 0;
      case "on-track":
        return item.onTrackCount || 0;
      case "unconfigured":
        return item.status === "SLA Not Configured" ? item.openCases || 0 : 0;
      case "all":
        return item.openCases || 0;
      case "overdue":
      default:
        return item.overdueCount || 0;
    }
  };

  const chartFilterLabel = useMemo(() => {
    switch (chartFilter) {
      case "due-soon":
        return "Due Soon Cases";
      case "on-track":
        return "On Track Cases";
      case "unconfigured":
        return "SLA Not Configured";
      case "all":
        return "All Cases";
      case "overdue":
      default:
        return "Overdue Cases";
    }
  }, [chartFilter]);

  const chartSubtitle = useMemo(() => {
    switch (chartFilter) {
      case "due-soon":
        return "Compare cases approaching SLA deadlines to intervene before breach occurs.";
      case "on-track":
        return "Compare cases currently progressing safely within configured SLA limits.";
      case "unconfigured":
        return "Review active cases that have not yet had target SLA policies configured.";
      case "all":
        return `Compare total active open cases across all ${categoryTitle.toLowerCase()} issues.`;
      case "overdue":
      default:
        return `Compare overdue cases across ${categoryTitle.toLowerCase()}-related issues to identify which problems need immediate attention.`;
    }
  }, [chartFilter, categoryTitle]);

  const sortedIssues = useMemo(() => {
    return [...issues].sort((a, b) => {
      const countA = getIssueCountForFilter(a, chartFilter);
      const countB = getIssueCountForFilter(b, chartFilter);
      if (countB !== countA) return countB - countA;
      return (b.openCases || 0) - (a.openCases || 0);
    });
  }, [issues, chartFilter]);

  const maxCount = useMemo(() => {
    const counts = sortedIssues.map((i) => getIssueCountForFilter(i, chartFilter));
    return Math.max(...counts, 1);
  }, [sortedIssues, chartFilter]);

  const filterSelectId = `status-filter-${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
      {/* Chart Title and Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-[#1e254d]" />
            <h3 className="text-sm sm:text-base font-bold text-slate-950">
              {categoryTitle} — {chartFilterLabel} by Issue
            </h3>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {chartSubtitle}
          </p>
        </div>

        {/* Status Filter Dropdown in place of static legend & Clear Filter Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor={filterSelectId}
              className="text-xs font-semibold text-slate-600"
            >
              Status:
            </label>
            <div className="relative">
              <select
                id={filterSelectId}
                value={chartFilter}
                onChange={(e) => setChartFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-400 focus:border-[#1e254d] focus:outline-none focus:ring-1 focus:ring-[#1e254d] transition cursor-pointer"
              >
                <option value="overdue">Overdue Cases</option>
                <option value="on-track">On Track</option>
                <option value="due-soon">Due Soon</option>
                {hasUnconfigured && (
                  <option value="unconfigured">SLA Not Configured</option>
                )}
                <option value="all">All Cases</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {selectedIssueId && (
            <button
              type="button"
              onClick={() => onSelectIssueId(null)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-[#1e254d] hover:bg-slate-100 transition cursor-pointer"
            >
              <span>Clear filter</span>
              <span className="text-slate-400 font-bold">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Bar Chart List */}
      <div className="mt-5 space-y-3">
        {sortedIssues.map((item, idx) => {
          const count = getIssueCountForFilter(item, chartFilter);
          const widthPercent = count > 0 ? (count / maxCount) * 100 : 0;
          const isSelected = selectedIssueId === item.id;

          return (
            <div
              key={item.id}
              onClick={() =>
                onSelectIssueId(selectedIssueId === item.id ? null : item.id)
              }
              title={`${item.event} — ${count} ${chartFilterLabel.toLowerCase()} (SLA Target: ${item.sla}, Status: ${item.status}, Longest Pending: ${item.oldestOpen})`}
              className={`group relative rounded-xl p-2.5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-100/90 ring-1.5 ring-[#1e254d]"
                  : "hover:bg-slate-50/90"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                {/* Issue Rank Number and Label */}
                <div className="flex items-center gap-2 max-w-[72%] sm:max-w-[78%]">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "bg-[#1e254d] text-white"
                        : "bg-slate-100 text-slate-600 group-hover:bg-[#1e254d] group-hover:text-white"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`truncate font-semibold ${
                      isSelected
                        ? "text-[#1e254d]"
                        : "text-slate-900 group-hover:text-[#1e254d]"
                    }`}
                  >
                    {item.event}
                  </span>
                  <span className="hidden md:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    SLA: {item.sla}
                  </span>
                </div>

                {/* Count for active filter */}
                <div className="flex items-center gap-2">
                  {count > 0 ? (
                    <span className="font-bold text-[#1e254d] text-xs sm:text-sm min-w-16 text-right">
                      {count} {count === 1 ? "case" : "cases"}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400 text-xs min-w-16 text-right">
                      0 cases
                    </span>
                  )}
                  <ArrowUpRight
                    className={`h-3.5 w-3.5 transition-colors ${
                      isSelected
                        ? "text-[#1e254d]"
                        : "text-slate-300 group-hover:text-[#1e254d]"
                    }`}
                  />
                </div>
              </div>

              {/* Bar Track */}
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {count > 0 ? (
                  <div
                    className="h-full rounded-full bg-[#1e254d] group-hover:bg-[#151a37] transition-all duration-300"
                    style={{ width: `${widthPercent}%` }}
                  />
                ) : (
                  <div
                    className="h-full rounded-full bg-slate-200/60"
                    style={{ width: "2px" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Click-to-filter helper footer */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 font-medium">
        <span>Click any bar to filter the {categoryTitle} table below</span>
        {selectedIssueId ? (
          <span className="text-[#1e254d] font-semibold">
            Filtered: 1 of {issues.length} issues shown in table
          </span>
        ) : (
          <span>All {issues.length} issues shown in table</span>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Reusable Overall Categories Comparison Bar Chart Component
// =============================================================================
function OverallCategoriesChart({ categoriesData, scrollToSection }) {
  const [filter, setFilter] = useState("overdue");

  const getCategoryCountForFilter = (cat, activeFilter) => {
    switch (activeFilter) {
      case "due-soon":
        return cat.dueSoonCases;
      case "on-track":
        return cat.onTrackCases;
      case "unconfigured":
        return cat.unconfiguredCases;
      case "overdue":
      default:
        return cat.overdueCases;
    }
  };

  const filterLabel = useMemo(() => {
    switch (filter) {
      case "due-soon":
        return "Due Soon Cases";
      case "on-track":
        return "On Track Cases";
      case "unconfigured":
        return "SLA Not Configured";
      case "overdue":
      default:
        return "Overdue Cases";
    }
  }, [filter]);

  const filterSubtitle = useMemo(() => {
    switch (filter) {
      case "due-soon":
        return "Compare cases approaching SLA thresholds across all categories to anticipate breaches.";
      case "on-track":
        return "Compare cases currently operating safely within SLA targets across all categories.";
      case "unconfigured":
        return "Compare cases in queues with no formal SLA configured across all categories.";
      case "overdue":
      default:
        return "Compare overdue cases across all operational categories to identify breach concentrations.";
    }
  }, [filter]);

  const sortedCategories = useMemo(() => {
    return [...categoriesData].sort((a, b) => {
      const countA = getCategoryCountForFilter(a, filter);
      const countB = getCategoryCountForFilter(b, filter);
      if (countB !== countA) return countB - countA;
      return b.totalCases - a.totalCases;
    });
  }, [categoriesData, filter]);

  const maxVal = useMemo(() => {
    const counts = sortedCategories.map((c) => getCategoryCountForFilter(c, filter));
    return Math.max(...counts, 1);
  }, [sortedCategories, filter]);

  const totalFilteredCount = useMemo(
    () => sortedCategories.reduce((sum, c) => sum + getCategoryCountForFilter(c, filter), 0),
    [sortedCategories, filter]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-1.5 rounded-full bg-[#1e254d]" />
            <h3 className="text-sm sm:text-base font-bold text-slate-950">
              Overall Operations by Category — {filterLabel}
            </h3>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {filterSubtitle}
          </p>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="overall-status-filter" className="text-xs font-semibold text-slate-600">
            Status:
          </label>
          <div className="relative">
            <select
              id="overall-status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-400 focus:border-[#1e254d] focus:outline-none focus:ring-1 focus:ring-[#1e254d] transition cursor-pointer"
            >
              <option value="overdue">Overdue Cases</option>
              <option value="on-track">On Track</option>
              <option value="due-soon">Due Soon</option>
              <option value="unconfigured">SLA Not Configured</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Category Bar Graph List */}
      <div className="mt-5 space-y-3">
        {sortedCategories.map((cat, idx) => {
          const count = getCategoryCountForFilter(cat, filter);
          const barTrackWidthPercent = count > 0 ? (count / maxVal) * 100 : 0;

          return (
            <div
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              title={`${cat.label} — ${count} ${filterLabel.toLowerCase()} (${cat.totalIssues} issues). Click to jump to section.`}
              className="group relative rounded-xl p-2.5 hover:bg-slate-50/90 transition-all cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                {/* Category Rank & Title */}
                <div className="flex items-center gap-2 max-w-[72%] sm:max-w-[78%]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 group-hover:bg-[#1e254d] group-hover:text-white transition-colors">
                    {idx + 1}
                  </span>
                  <span className="truncate font-semibold text-slate-900 group-hover:text-[#1e254d] transition-colors">
                    {cat.label}
                  </span>
                  <span className="hidden md:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    {cat.totalIssues} issues
                  </span>
                </div>

                {/* Count */}
                <div className="flex items-center gap-2">
                  {count > 0 ? (
                    <span className="font-bold text-[#1e254d] text-xs sm:text-sm min-w-16 text-right">
                      {count} {count === 1 ? "case" : "cases"}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400 text-xs min-w-16 text-right">
                      0 cases
                    </span>
                  )}
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#1e254d] transition-colors" />
                </div>
              </div>

              {/* Bar Track */}
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {count > 0 ? (
                  <div
                    className="h-full rounded-full bg-[#1e254d] group-hover:bg-[#151a37] transition-all duration-300"
                    style={{ width: `${barTrackWidthPercent}%` }}
                  />
                ) : (
                  <div className="h-full rounded-full bg-slate-200/60" style={{ width: "2px" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500 font-medium">
        <span>Total {filterLabel}: <strong className="text-slate-800">{totalFilteredCount} cases</strong> across 5 categories</span>
        <span>Click any bar to jump to that category section below</span>
      </div>
    </div>
  );
}

export default function SLA_Breach() {
  const [activeTab, setActiveTab] = useState("b2c-purchases");
  const [selectedB2cIssueId, setSelectedB2cIssueId] = useState(null);
  const [selectedB2bPurchasesIssueId, setSelectedB2bPurchasesIssueId] = useState(null);
  const [selectedB2cSalesIssueId, setSelectedB2cSalesIssueId] = useState(null);
  const [selectedB2bSalesIssueId, setSelectedB2bSalesIssueId] = useState(null);
  const [selectedInventoryIssueId, setSelectedInventoryIssueId] = useState(null);

  const navTabs = [
    { id: "b2c-purchases", label: "B2C purchases" },
    { id: "b2b-purchases", label: "B2B purchases" },
    { id: "b2c-sales", label: "B2C sales" },
    { id: "b2b-sales", label: "B2B sales" },
    { id: "inventory", label: "Inventory" },
  ];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Section Data Definitions with Updated Professional Business English Wording
  const allIssuesData = useMemo(() => [
    // B2C Purchases
    {
      id: "b2c-p-1",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Delivered by Courier, Status Not Updated by DACBY",
      sla: "3 h",
      slaHours: 3,
      openCases: 7,
      overdueCount: 7,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "7",
      oldestOpen: "11.5 h",
      oldestHours: 11.5,
      status: "Overdue",
    },
    {
      id: "b2c-p-2",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Order Rejected, Return Dispatch Pending",
      sla: "72 h",
      slaHours: 72,
      openCases: 2,
      overdueCount: 2,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "2",
      oldestOpen: "98 h",
      oldestHours: 98,
      status: "Overdue",
    },
    {
      id: "b2c-p-3",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Received at Warehouse, Payment Pending (RTS / Under Repair)",
      sla: "72 h",
      slaHours: 72,
      openCases: 1,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 1,
      breached: "1",
      oldestOpen: "41 h",
      oldestHours: 41,
      status: "On Track",
    },
    {
      id: "b2c-p-4",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Pickup Pending — Free Pickup",
      sla: "72 h",
      slaHours: 72,
      openCases: 5,
      overdueCount: 5,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "5",
      oldestOpen: "120 h",
      oldestHours: 120,
      status: "Overdue",
    },
    {
      id: "b2c-p-5",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Pickup Pending — Doorstep Payment",
      sla: "72 h",
      slaHours: 72,
      openCases: 1,
      overdueCount: 0,
      dueSoonCount: 1,
      onTrackCount: 0,
      breached: "1",
      oldestOpen: "64 h",
      oldestHours: 64,
      status: "Due Soon",
    },
    {
      id: "b2c-p-6",
      category: "b2c-purchases",
      categoryLabel: "B2C Purchases",
      event: "Picked Up, Warehouse Receipt Pending",
      sla: "240 h",
      slaHours: 240,
      openCases: 3,
      overdueCount: 3,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "3",
      oldestOpen: "310 h",
      oldestHours: 310,
      status: "Overdue",
    },

    // B2B Purchases
    {
      id: "b2b-p-1",
      category: "b2b-purchases",
      categoryLabel: "B2B Purchases",
      event: "Advance Paid, Products Not Received",
      sla: "240 h",
      slaHours: 240,
      openCases: 1,
      overdueCount: 1,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "1",
      oldestOpen: "268 h",
      oldestHours: 268,
      status: "Overdue",
    },
    {
      id: "b2b-p-2",
      category: "b2b-purchases",
      categoryLabel: "B2B Purchases",
      event: "Received at Warehouse, Ledger Update Pending (RTS / Under Repair)",
      sla: "72 h",
      slaHours: 72,
      openCases: 1,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 1,
      breached: "1",
      oldestOpen: "18 h",
      oldestHours: 18,
      status: "On Track",
    },

    // B2C Sales
    {
      id: "b2c-s-1",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Order Dispatch Pending",
      sla: "72 h",
      slaHours: 72,
      openCases: 4,
      overdueCount: 4,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "4",
      oldestOpen: "96 h",
      oldestHours: 96,
      status: "Overdue",
    },
    {
      id: "b2c-s-2",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Order Dispatched, Delivery Pending",
      sla: "240 h",
      slaHours: 240,
      openCases: 6,
      overdueCount: 6,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "6",
      oldestOpen: "402 h",
      oldestHours: 402,
      status: "Overdue",
    },
    {
      id: "b2c-s-3",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "RTO Marked by Courier, Status Not Updated by DACBY",
      sla: "3 h",
      slaHours: 3,
      openCases: 2,
      overdueCount: 2,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "2",
      oldestOpen: "5.4 h",
      oldestHours: 5.4,
      status: "Overdue",
    },
    {
      id: "b2c-s-4",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Return Marked by Courier, Status Not Updated by DACBY",
      sla: "3 h",
      slaHours: 3,
      openCases: 1,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 1,
      breached: "1",
      oldestOpen: "1.2 h",
      oldestHours: 1.2,
      status: "On Track",
    },
    {
      id: "b2c-s-5",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Return Received, Replacement Dispatch Pending",
      sla: "72 h",
      slaHours: 72,
      openCases: 1,
      overdueCount: 1,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "1",
      oldestOpen: "80 h",
      oldestHours: 80,
      status: "Overdue",
    },
    {
      id: "b2c-s-6",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Return / RTO Delivered, Ledger Update Pending",
      sla: "24 h",
      slaHours: 24,
      openCases: 3,
      overdueCount: 3,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "3",
      oldestOpen: "39 h",
      oldestHours: 39,
      status: "Overdue",
    },
    {
      id: "b2c-s-7",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Fast Delivery Processing Pending",
      sla: "24 h",
      slaHours: 24,
      openCases: 1,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 1,
      breached: "1",
      oldestOpen: "9 h",
      oldestHours: 9,
      status: "On Track",
    },
    {
      id: "b2c-s-8",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Replacement in Transit, Ledger Update Pending",
      sla: "SLA Not Configured",
      slaHours: null,
      openCases: 8,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "8",
      oldestOpen: "n/a",
      oldestHours: 0,
      status: "SLA Not Configured",
    },
    {
      id: "b2c-s-9",
      category: "b2c-sales",
      categoryLabel: "B2C Sales",
      event: "Order in Transit, Ledger Update Pending",
      sla: "SLA Not Configured",
      slaHours: null,
      openCases: 14,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "14",
      oldestOpen: "n/a",
      oldestHours: 0,
      status: "SLA Not Configured",
    },

    // B2B Sales
    {
      id: "b2b-s-1",
      category: "b2b-sales",
      categoryLabel: "B2B Sales",
      event: "Dispatched, Payment Pending",
      sla: "240 h",
      slaHours: 240,
      openCases: 2,
      overdueCount: 2,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "2",
      oldestOpen: "336 h",
      oldestHours: 336,
      status: "Overdue",
    },

    // Inventory
    {
      id: "inv-1",
      category: "inventory",
      categoryLabel: "Inventory",
      event: "Stock Under Repair with Vendors",
      sla: "240 h",
      slaHours: 240,
      openCases: 5,
      overdueCount: 5,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "5",
      oldestOpen: "512 h",
      oldestHours: 512,
      status: "Overdue",
    },
    {
      id: "inv-2",
      category: "inventory",
      categoryLabel: "Inventory",
      event: "Out of Stock, Units Under Repair",
      sla: "SLA Not Configured",
      slaHours: null,
      openCases: 3,
      overdueCount: 0,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "3",
      oldestOpen: "n/a",
      oldestHours: 0,
      status: "SLA Not Configured",
    },
    {
      id: "inv-3",
      category: "inventory",
      categoryLabel: "Inventory",
      event: "Dead Stock",
      sla: "2,160 h",
      slaHours: 2160,
      openCases: 18,
      overdueCount: 18,
      dueSoonCount: 0,
      onTrackCount: 0,
      breached: "18",
      oldestOpen: "2,590 h",
      oldestHours: 2590,
      status: "Overdue",
    },
  ], []);

  // Full dataset for KPI calculations and operational display
  const filteredIssues = allIssuesData;

  // Dynamic KPI calculations from active data
  const kpiMetrics = useMemo(() => {
    const totalOpenCases = filteredIssues.reduce(
      (sum, item) => sum + (item.openCases || 0),
      0
    );

    const overdueCases = filteredIssues.reduce(
      (sum, item) => sum + (item.overdueCount || 0),
      0
    );

    const overdueIssuesCount = filteredIssues.filter(
      (item) => item.status === "Overdue"
    ).length;

    const dueSoonIssuesCount = filteredIssues.filter(
      (item) => item.status === "Due Soon"
    ).length;

    const onTrackIssuesCount = filteredIssues.filter(
      (item) => item.status === "On Track"
    ).length;

    const unconfiguredIssuesCount = filteredIssues.filter(
      (item) => item.status === "SLA Not Configured"
    ).length;

    const unconfiguredOpenCases = filteredIssues
      .filter((item) => item.status === "SLA Not Configured")
      .reduce((sum, item) => sum + (item.openCases || 0), 0);

    return {
      totalOpenCases,
      overdueCases,
      overdueIssuesCount,
      dueSoonIssuesCount,
      onTrackIssuesCount,
      unconfiguredIssuesCount,
      unconfiguredOpenCases,
      totalIssues: filteredIssues.length,
    };
  }, [filteredIssues]);

  // Grouped data for categories
  const b2cPurchasesData = useMemo(
    () => filteredIssues.filter((i) => i.category === "b2c-purchases"),
    [filteredIssues]
  );
  const b2bPurchasesData = useMemo(
    () => filteredIssues.filter((i) => i.category === "b2b-purchases"),
    [filteredIssues]
  );
  const b2cSalesData = useMemo(
    () => filteredIssues.filter((i) => i.category === "b2c-sales"),
    [filteredIssues]
  );
  const b2bSalesData = useMemo(
    () => filteredIssues.filter((i) => i.category === "b2b-sales"),
    [filteredIssues]
  );
  const inventoryData = useMemo(
    () => filteredIssues.filter((i) => i.category === "inventory"),
    [filteredIssues]
  );

  // Displayed data for tables (filtered when a chart bar is clicked in that category)
  const displayedB2cPurchasesData = useMemo(() => {
    return selectedB2cIssueId
      ? b2cPurchasesData.filter((i) => i.id === selectedB2cIssueId)
      : b2cPurchasesData;
  }, [b2cPurchasesData, selectedB2cIssueId]);

  const displayedB2bPurchasesData = useMemo(() => {
    return selectedB2bPurchasesIssueId
      ? b2bPurchasesData.filter((i) => i.id === selectedB2bPurchasesIssueId)
      : b2bPurchasesData;
  }, [b2bPurchasesData, selectedB2bPurchasesIssueId]);

  const displayedB2cSalesData = useMemo(() => {
    return selectedB2cSalesIssueId
      ? b2cSalesData.filter((i) => i.id === selectedB2cSalesIssueId)
      : b2cSalesData;
  }, [b2cSalesData, selectedB2cSalesIssueId]);

  const displayedB2bSalesData = useMemo(() => {
    return selectedB2bSalesIssueId
      ? b2bSalesData.filter((i) => i.id === selectedB2bSalesIssueId)
      : b2bSalesData;
  }, [b2bSalesData, selectedB2bSalesIssueId]);

  const displayedInventoryData = useMemo(() => {
    return selectedInventoryIssueId
      ? inventoryData.filter((i) => i.id === selectedInventoryIssueId)
      : inventoryData;
  }, [inventoryData, selectedInventoryIssueId]);

  // High-level cross-category aggregation across all SLA statuses
  const categoriesOverviewData = useMemo(() => {
    const list = [
      { id: "b2c-purchases", label: "B2C purchases", issues: b2cPurchasesData },
      { id: "b2b-purchases", label: "B2B purchases", issues: b2bPurchasesData },
      { id: "b2c-sales", label: "B2C sales", issues: b2cSalesData },
      { id: "b2b-sales", label: "B2B sales", issues: b2bSalesData },
      { id: "inventory", label: "Inventory", issues: inventoryData },
    ];

    return list.map((cat) => {
      const overdue = cat.issues.reduce((s, i) => s + (i.overdueCount || 0), 0);
      const dueSoon = cat.issues.reduce((s, i) => s + (i.dueSoonCount || 0), 0);
      const onTrack = cat.issues.reduce((s, i) => s + (i.onTrackCount || 0), 0);
      const unconfigured = cat.issues
        .filter((i) => i.status === "SLA Not Configured")
        .reduce((s, i) => s + (i.openCases || 0), 0);
      const total = cat.issues.reduce((s, i) => s + (i.openCases || 0), 0);

      return {
        id: cat.id,
        label: cat.label,
        totalIssues: cat.issues.length,
        totalCases: total,
        overdueCases: overdue,
        dueSoonCases: dueSoon,
        onTrackCases: onTrack,
        unconfiguredCases: unconfigured,
      };
    });
  }, [b2cPurchasesData, b2bPurchasesData, b2cSalesData, b2bSalesData, inventoryData]);


  // Status Badge Component
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
            Overdue
          </span>
        );
      case "Due Soon":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 border border-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Due Soon
          </span>
        );
      case "On Track":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            On Track
          </span>
        );
      case "SLA Not Configured":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            SLA Not Configured
          </span>
        );
    }
  };

  // Generic SLA Table Component
  const renderSlaTable = (rows, emptyTitle = "No issues matching filter criteria") => {
    if (rows.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
          <CheckCircle2 className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-2 text-sm font-semibold text-slate-800">{emptyTitle}</h4>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your category, status, or search filters above.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-900">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-xs font-semibold text-slate-700">
                <th className="px-5 py-3.5">Issue</th>
                <th className="px-5 py-3.5 text-center">SLA Target</th>
                <th className="px-5 py-3.5 text-center">Cases</th>
                <th className="px-5 py-3.5 text-center">Longest Pending</th>
                <th className="px-5 py-3.5 text-center">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {rows.map((row) => {
                const isOverdue = row.status === "Overdue";
                const isDueSoon = row.status === "Due Soon";

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">
                      <span>{row.event}</span>
                    </td>
                    <td
                      className={`px-5 py-3.5 text-center text-sm ${
                        row.sla === "SLA Not Configured"
                          ? "text-slate-400 font-normal"
                          : "text-slate-700 font-medium"
                      }`}
                    >
                      {row.sla}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-center text-sm ${
                        isOverdue
                          ? "font-bold text-rose-700"
                          : isDueSoon
                          ? "font-bold text-amber-700"
                          : row.status === "On Track"
                          ? "font-semibold text-emerald-700"
                          : "font-semibold text-slate-700"
                      }`}
                    >
                      {row.openCases}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-center text-sm ${
                        isOverdue
                          ? "font-semibold text-rose-700"
                          : isDueSoon
                          ? "font-semibold text-amber-700"
                          : row.oldestOpen === "n/a"
                          ? "text-slate-400 font-normal"
                          : "text-slate-700 font-medium"
                      }`}
                    >
                      {row.oldestOpen}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {renderStatusBadge(row.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-xs">
        <div className="w-full px-6 py-3.5 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title & Brand Icon */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1e254d] text-base font-bold text-white shadow-xs">
                D
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                  DACBY SLA & Operations Monitor
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Live operational issue tracking, SLA compliance metrics, and resolution timelines
                </p>
              </div>
            </div>

            {/* Live Indicator Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations Monitoring
            </div>
          </div>

          {/* Quick Sub-Navigation Tabs */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-200/80 pt-2.5">
            {navTabs.map((tab) => {
              const count = allIssuesData
                .filter((i) => i.category === tab.id)
                .reduce((sum, i) => sum + (i.openCases || 0), 0);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1e254d] text-white shadow-xs font-semibold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full px-6 pt-6 space-y-8 sm:px-10 lg:px-16 xl:px-20">


        {/* ========================================================================= */}
        {/* SECTION: KPI Summary Cards (Real Operational Totals) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Open Cases */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-slate-600">Total Open Cases</p>
              <div className="rounded-lg bg-slate-100 p-1.5 text-slate-700 group-hover:bg-[#1e254d] group-hover:text-white transition-colors">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
              {kpiMetrics.totalOpenCases} cases
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Across {kpiMetrics.totalIssues} operational issues ({kpiMetrics.unconfiguredOpenCases} unconfigured)
            </p>
          </div>

          {/* Card 2: Overdue Cases */}
          <div className="group rounded-2xl border border-rose-200/80 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-rose-800">Overdue Cases</p>
              <div className="rounded-lg bg-rose-50 p-1.5 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-rose-700">
                {kpiMetrics.overdueCases} cases
              </h3>
              <span className="text-xs font-semibold text-rose-600">
                ({kpiMetrics.overdueIssuesCount} issues breached)
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Requires immediate SLA resolution follow-up
            </p>
          </div>

          {/* Card 3: Cases Due Soon */}
          <div className="group rounded-2xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-amber-900">Cases Due Soon</p>
              <div className="rounded-lg bg-amber-50 p-1.5 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-800">
                {kpiMetrics.dueSoonIssuesCount} issue flagged
              </h3>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Within 8 hours of breach threshold (72h SLA)
            </p>
          </div>

          {/* Card 4: Cases On Track */}
          <div className="group rounded-2xl border border-emerald-200/80 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-800">Cases On Track</p>
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-800">
                {kpiMetrics.onTrackIssuesCount} issues
              </h3>
              <span className="text-xs font-semibold text-emerald-700">100% within SLA</span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Operating safely within configured limits
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OVERALL BAR GRAPH: All Categories Across All SLA Statuses */}
        {/* ========================================================================= */}
        <OverallCategoriesChart
          categoriesData={categoriesOverviewData}
          scrollToSection={scrollToSection}
        />


        {/* ========================================================================= */}
        {/* SECTION 1: B2C purchases */}
        {/* ========================================================================= */}
        <section id="b2c-purchases" className="scroll-mt-36">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                B2C purchases
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {b2cPurchasesData.length} Operational Issues
            </span>
          </div>

          <CategoryIssuesChart
            categoryTitle="B2C Purchases"
            issues={b2cPurchasesData}
            selectedIssueId={selectedB2cIssueId}
            onSelectIssueId={setSelectedB2cIssueId}
          />

          {renderSlaTable(displayedB2cPurchasesData, "No B2C purchase issues matching filter")}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: B2B purchases */}
        {/* ========================================================================= */}
        <section id="b2b-purchases" className="scroll-mt-36">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                B2B purchases
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {b2bPurchasesData.length} Operational Issues
            </span>
          </div>

          <CategoryIssuesChart
            categoryTitle="B2B Purchases"
            issues={b2bPurchasesData}
            selectedIssueId={selectedB2bPurchasesIssueId}
            onSelectIssueId={setSelectedB2bPurchasesIssueId}
          />

          {renderSlaTable(displayedB2bPurchasesData, "No B2B purchase issues matching filter")}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: B2C sales */}
        {/* ========================================================================= */}
        <section id="b2c-sales" className="scroll-mt-36">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                B2C sales
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {b2cSalesData.length} Operational Issues
            </span>
          </div>

          <CategoryIssuesChart
            categoryTitle="B2C Sales"
            issues={b2cSalesData}
            selectedIssueId={selectedB2cSalesIssueId}
            onSelectIssueId={setSelectedB2cSalesIssueId}
          />

          {renderSlaTable(displayedB2cSalesData, "No B2C sales issues matching filter")}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: B2B sales */}
        {/* ========================================================================= */}
        <section id="b2b-sales" className="scroll-mt-36">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                B2B sales
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {b2bSalesData.length} Operational Issues
            </span>
          </div>

          <CategoryIssuesChart
            categoryTitle="B2B Sales"
            issues={b2bSalesData}
            selectedIssueId={selectedB2bSalesIssueId}
            onSelectIssueId={setSelectedB2bSalesIssueId}
          />

          {renderSlaTable(displayedB2bSalesData, "No B2B sales issues matching filter")}
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: Inventory */}
        {/* ========================================================================= */}
        <section id="inventory" className="scroll-mt-36">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-[#1e254d]" />
              <h2 className="text-base sm:text-lg font-bold text-slate-950">
                Inventory
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {inventoryData.length} Operational Issues
            </span>
          </div>

          <CategoryIssuesChart
            categoryTitle="Inventory"
            issues={inventoryData}
            selectedIssueId={selectedInventoryIssueId}
            onSelectIssueId={setSelectedInventoryIssueId}
          />

          {renderSlaTable(displayedInventoryData, "No inventory issues matching filter")}
        </section>
      </div>
    </div>
  );
}
