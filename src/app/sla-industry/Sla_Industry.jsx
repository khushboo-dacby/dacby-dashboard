"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  ShoppingCart,
  Briefcase,
  TrendingUp,
  Building2,
  Package,
  FileText,
  ChevronDown,
  Calendar,
  Download,
  Bell,
  Search,
  Filter,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  Info,
  MoreVertical,
  Columns,
  ArrowRight,
  ArrowUpRight,
  X,
} from "lucide-react";

// =============================================================================
// Comprehensive Category Data Definition
// =============================================================================
const CATEGORIES_DATA = {
  "b2c-purchases": {
    id: "b2c-purchases",
    name: "B2C Purchases",
    label: "B2C purchases",
    description: "Track issue-level SLA performance and drill down to cases.",
    icon: ShoppingCart,
    issues: [
      {
        id: "b2c-p-1",
        issue: "Delivered by Courier, Status Not Updated by DACBY",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 7,
        overdueCases: 7,
        longestPending: "11.5 h",
        status: "Overdue",
      },
      {
        id: "b2c-p-4",
        issue: "Pickup Pending — Free Pickup",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 5,
        overdueCases: 5,
        longestPending: "120 h",
        status: "Overdue",
      },
      {
        id: "b2c-p-6",
        issue: "Picked Up, Warehouse Receipt Pending",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 3,
        overdueCases: 3,
        longestPending: "310 h",
        status: "Overdue",
      },
      {
        id: "b2c-p-2",
        issue: "Order Rejected, Return Dispatch Pending",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 2,
        overdueCases: 2,
        longestPending: "98 h",
        status: "Overdue",
      },
      {
        id: "b2c-p-3",
        issue: "Received at Warehouse, Payment Pending (RTS / Under Repair)",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 1,
        overdueCases: 0,
        longestPending: "41 h",
        status: "On Track",
      },
      {
        id: "b2c-p-5",
        issue: "Pickup Pending — Doorstep Payment",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 1,
        overdueCases: 0,
        longestPending: "64 h",
        status: "Due Soon",
      },
    ],
  },

  "b2b-purchases": {
    id: "b2b-purchases",
    name: "B2B Purchases",
    label: "B2B purchases",
    description: "Compare overdue cases across b2b purchases-related issues to identify which problems need immediate attention.",
    icon: Briefcase,
    issues: [
      {
        id: "b2b-p-1",
        issue: "Advance Paid, Products Not Received",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 1,
        overdueCases: 1,
        longestPending: "268 h",
        status: "Overdue",
      },
      {
        id: "b2b-p-2",
        issue: "Received at Warehouse, Ledger Update Pending (RTS / Under Repair)",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 1,
        overdueCases: 0,
        longestPending: "18 h",
        status: "On Track",
      },
    ],
  },

  "b2c-sales": {
    id: "b2c-sales",
    name: "B2C Sales",
    label: "B2C sales",
    description: "Compare overdue cases across b2c sales-related issues to identify which problems need immediate attention.",
    icon: TrendingUp,
    issues: [
      {
        id: "b2c-s-2",
        issue: "Order Dispatched, Delivery Pending",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 6,
        overdueCases: 6,
        longestPending: "402 h",
        status: "Overdue",
      },
      {
        id: "b2c-s-1",
        issue: "Order Dispatch Pending",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 4,
        overdueCases: 4,
        longestPending: "96 h",
        status: "Overdue",
      },
      {
        id: "b2c-s-6",
        issue: "Return / RTO Delivered, Ledger Update Pending",
        slaTarget: "24 h",
        slaHours: 24,
        openCases: 3,
        overdueCases: 3,
        longestPending: "39 h",
        status: "Overdue",
      },
      {
        id: "b2c-s-3",
        issue: "RTO Marked by Courier, Status Not Updated by DACBY",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 2,
        overdueCases: 2,
        longestPending: "5.4 h",
        status: "Overdue",
      },
      {
        id: "b2c-s-5",
        issue: "Return Received, Replacement Dispatch Pending",
        slaTarget: "72 h",
        slaHours: 72,
        openCases: 1,
        overdueCases: 1,
        longestPending: "80 h",
        status: "Overdue",
      },
      {
        id: "b2c-s-4",
        issue: "Return Marked by Courier, Status Not Updated by DACBY",
        slaTarget: "3 h",
        slaHours: 3,
        openCases: 1,
        overdueCases: 0,
        longestPending: "1.2 h",
        status: "On Track",
      },
      {
        id: "b2c-s-7",
        issue: "Fast Delivery Processing Pending",
        slaTarget: "24 h",
        slaHours: 24,
        openCases: 1,
        overdueCases: 0,
        longestPending: "9 h",
        status: "On Track",
      },
      {
        id: "b2c-s-8",
        issue: "Replacement in Transit, Ledger Update Pending",
        slaTarget: "SLA Not Configured",
        slaHours: null,
        openCases: 8,
        overdueCases: 0,
        longestPending: "n/a",
        status: "SLA Not Configured",
      },
      {
        id: "b2c-s-9",
        issue: "Order in Transit, Ledger Update Pending",
        slaTarget: "SLA Not Configured",
        slaHours: null,
        openCases: 14,
        overdueCases: 0,
        longestPending: "n/a",
        status: "SLA Not Configured",
      },
    ],
  },

  "b2b-sales": {
    id: "b2b-sales",
    name: "B2B Sales",
    label: "B2B sales",
    description: "Compare overdue cases across b2b sales-related issues to identify which problems need immediate attention.",
    icon: Building2,
    issues: [
      {
        id: "b2b-s-1",
        issue: "Dispatched, Payment Pending",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 2,
        overdueCases: 2,
        longestPending: "336 h",
        status: "Overdue",
      },
    ],
  },

  "inventory": {
    id: "inventory",
    name: "Inventory",
    label: "Inventory",
    description: "Compare overdue cases across inventory-related issues to identify which problems need immediate attention.",
    icon: Package,
    issues: [
      {
        id: "inv-3",
        issue: "Dead Stock",
        slaTarget: "2,160 h",
        slaHours: 2160,
        openCases: 18,
        overdueCases: 18,
        longestPending: "2,590 h",
        status: "Overdue",
      },
      {
        id: "inv-1",
        issue: "Stock Under Repair with Vendors",
        slaTarget: "240 h",
        slaHours: 240,
        openCases: 5,
        overdueCases: 5,
        longestPending: "512 h",
        status: "Overdue",
      },
      {
        id: "inv-2",
        issue: "Out of Stock, Units Under Repair",
        slaTarget: "SLA Not Configured",
        slaHours: null,
        openCases: 3,
        overdueCases: 0,
        longestPending: "n/a",
        status: "SLA Not Configured",
      },
    ],
  },
};

export default function Sla_Industry() {
  // Category Tab state
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("b2c-purchases");

  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [selectedIssueFilter, setSelectedIssueFilter] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Category Tabs List
  const categoryTabs = [
    { id: "all", label: "All Categories", count: 21 },
    { id: "b2c-purchases", label: "B2C Purchases", count: 6 },
    { id: "b2b-purchases", label: "B2B Purchases", count: 2 },
    { id: "b2c-sales", label: "B2C Sales", count: 9 },
    { id: "b2b-sales", label: "B2B Sales", count: 1 },
    { id: "inventory", label: "Inventory", count: 3 },
  ];

  // Active Category Data resolution
  const activeCategory = useMemo(() => {
    if (selectedCategoryTab === "all") {
      const allIssues = Object.values(CATEGORIES_DATA).flatMap((c) =>
        c.issues.map((i) => ({ ...i, categoryName: c.name, categoryId: c.id }))
      );
      return {
        id: "all",
        name: "All Categories",
        label: "All categories",
        description: "Review and manage operational issues across all purchase, sales, and inventory categories.",
        icon: Layers,
        issues: allIssues,
      };
    }
    const cat = CATEGORIES_DATA[selectedCategoryTab] || CATEGORIES_DATA["b2c-purchases"];
    return {
      ...cat,
      issues: cat.issues.map((i) => ({ ...i, categoryName: cat.name, categoryId: cat.id })),
    };
  }, [selectedCategoryTab]);

  // Helper to count issues based on chart filter
  const getIssueCountForFilter = (item, filter) => {
    switch (filter) {
      case "all":
      case "open":
        return item.openCases || 0;
      case "due-soon":
        return item.status === "Due Soon" ? item.openCases || 0 : 0;
      case "on-track":
        return item.status === "On Track" ? item.openCases || 0 : 0;
      case "unconfigured":
        return item.status === "SLA Not Configured" ? item.openCases || 0 : 0;
      case "overdue":
      default:
        return item.overdueCases || 0;
    }
  };

  // Label for active status filter
  const chartFilterLabel = useMemo(() => {
    switch (statusFilter) {
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
  }, [statusFilter]);

  // Filtered and sorted issues for the active category bar chart
  const activeCategoryIssuesForChart = useMemo(() => {
    return [...activeCategory.issues].sort((a, b) => {
      const countA = getIssueCountForFilter(a, statusFilter);
      const countB = getIssueCountForFilter(b, statusFilter);
      if (countB !== countA) return countB - countA;
      return (b.openCases || 0) - (a.openCases || 0);
    });
  }, [activeCategory.issues, statusFilter]);

  // Maximum value for the bar chart scale
  const maxChartVal = useMemo(() => {
    const counts = activeCategoryIssuesForChart.map((i) =>
      getIssueCountForFilter(i, statusFilter)
    );
    const max = Math.max(...counts, 0);
    return max > 0 ? max : 5;
  }, [activeCategoryIssuesForChart, statusFilter]);

  // SLA Target Distribution for Donut Chart in the active category
  const targetDistribution = useMemo(() => {
    const map = {};
    activeCategory.issues.forEach((i) => {
      const target = i.slaTarget || "Unconfigured";
      map[target] = (map[target] || 0) + 1;
    });

    const total = activeCategory.issues.length;
    const colors = ["#242b5c", "#3b82f6", "#60a5fa", "#94a3b8", "#cbd5e1", "#e2e8f0"];

    let accumulatedPct = 0;
    const slices = Object.entries(map).map(([target, count], idx) => {
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      const strokeLen = (pct / 100) * 238.76;
      const offset = -(accumulatedPct / 100) * 238.76;
      accumulatedPct += pct;
      return {
        target,
        count,
        pct,
        strokeLen,
        offset,
        color: colors[idx % colors.length],
      };
    });

    return { total, slices };
  }, [activeCategory.issues]);

  // Table Data filtering based on selected issue bar click and status filter
  const activeTableRows = useMemo(() => {
    let rows = activeCategory.issues;
    if (selectedIssueFilter) {
      rows = rows.filter((r) => r.id === selectedIssueFilter);
    }
    if (statusFilter && statusFilter !== "all") {
      rows = rows.filter((r) => {
        switch (statusFilter) {
          case "overdue":
            return r.status === "Overdue";
          case "due-soon":
            return r.status === "Due Soon";
          case "on-track":
            return r.status === "On Track";
          case "unconfigured":
            return r.status === "SLA Not Configured";
          default:
            return true;
        }
      });
    }
    return rows;
  }, [activeCategory.issues, selectedIssueFilter, statusFilter]);

  // Row selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(activeTableRows.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Sync category tab change
  const handleTabChange = (tabId) => {
    setSelectedCategoryTab(tabId);
    setSelectedIssueFilter(null);
    setSelectedRows([]);
  };

  // Category pill color scheme - unified Console theme
  const getCategoryBadgeClass = (catId) => {
    return "bg-[#eff2fc] text-[#242b5c] border border-[#d6e0f5] font-semibold";
  };

  // Static Data for Upper 3 Analytics Cards
  const categoryOverdueBars = [
    { category: "B2C Purchases", count: 22, max: 25 },
    { category: "B2C Sales", count: 19, max: 25 },
    { category: "Inventory", count: 12, max: 25 },
    { category: "B2B Purchases", count: 2, max: 25 },
    { category: "B2B Sales", count: 1, max: 25 },
  ];

  const topBreachedIssues = [
    {
      rank: 1,
      title: "Delivered by Courier, Status Not Updated by DACBY",
      category: "B2C Purchases",
      categoryId: "b2c-purchases",
      count: 7,
      max: 7,
    },
    {
      rank: 2,
      title: "Pickup Pending — Free Pickup",
      category: "B2C Purchases",
      categoryId: "b2c-purchases",
      count: 5,
      max: 7,
    },
    {
      rank: 3,
      title: "Picked Up, Warehouse Receipt Pending",
      category: "B2C Purchases",
      categoryId: "b2c-purchases",
      count: 4,
      max: 7,
    },
    {
      rank: 4,
      title: "Order Not Dispatched",
      category: "B2C Sales",
      categoryId: "b2c-sales",
      count: 4,
      max: 7,
    },
    {
      rank: 5,
      title: "Dead Stock",
      category: "Inventory",
      categoryId: "inventory",
      count: 3,
      max: 7,
    },
  ];

  const categorySlaDistribution = [
    { category: "B2C Purchases", overdue: 70, dueSoon: 10, onTrack: 20 },
    { category: "B2C Sales", overdue: 68, dueSoon: 12, onTrack: 20 },
    { category: "Inventory", overdue: 60, dueSoon: 15, onTrack: 25 },
    { category: "B2B Purchases", overdue: 75, dueSoon: 5, onTrack: 20 },
    { category: "B2B Sales", overdue: 50, dueSoon: 25, onTrack: 25 },
  ];

  const recentlyBreached = [
    { id: "#DAC12345", category: "B2C Purchases", issue: "Delivery status not updated", time: "4 h ago" },
    { id: "#DAC12346", category: "B2C Sales", issue: "Order not dispatched", time: "6 h ago" },
    { id: "#DAC12347", category: "Inventory", issue: "Dead Stock", time: "12 h ago" },
    { id: "#DAC12348", category: "B2B Purchases", issue: "Advance paid, not received", time: "1 day ago" },
    { id: "#DAC12349", category: "B2C Sales", issue: "Return marked, not updated", time: "1 day ago" },
  ];

  // SVG Trend Line Chart Coordinates Calculation (8 weeks: Mar 2 to Apr 20)
  const trendData = [
    { label: "Mar 2", val: 28 },
    { label: "Mar 9", val: 35 },
    { label: "Mar 16", val: 48 },
    { label: "Mar 23", val: 54 },
    { label: "Mar 30", val: 72 },
    { label: "Apr 6", val: 60 },
    { label: "Apr 13", val: 52 },
    { label: "Apr 20", val: 68 },
  ];
  const chartWidth = 340;
  const chartHeight = 110;
  const maxVal = 80;
  const trendPoints = trendData.map((d, i) => {
    const x = 30 + (i * (chartWidth - 45)) / (trendData.length - 1);
    const y = chartHeight - (d.val / maxVal) * (chartHeight - 20) - 10;
    return { ...d, x, y };
  });
  const pointsString = trendPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const ActiveIcon = activeCategory.icon || Layers;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased pb-16">
      {/* Top Header Card styled according to Console theme */}
      <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                OPERATIONS SLA
              </span>
              <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                SLA & Operations Console
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-medium">
                Track and manage operational issues across purchases, sales and inventory with SLA targets.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Ready & Active
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <div className="p-6 space-y-5">
          {/* ================================================================= */}
          {/* FILTER ROW */}
          {/* ================================================================= */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* All Categories Dropdown */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    if (e.target.value !== "all") {
                      handleTabChange(e.target.value);
                    } else {
                      handleTabChange("all");
                    }
                  }}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-7 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All categories</option>
                  <option value="b2c-purchases">B2C purchases</option>
                  <option value="b2b-purchases">B2B purchases</option>
                  <option value="b2c-sales">B2C sales</option>
                  <option value="b2b-sales">B2B sales</option>
                  <option value="inventory">Inventory</option>
                </select>
                <Layers className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* All SLA Statuses Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-7 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All SLA statuses</option>
                  <option value="overdue">Overdue</option>
                  <option value="due-soon">Due Soon</option>
                  <option value="on-track">On Track</option>
                  <option value="unconfigured">Not Configured</option>
                </select>
                <Clock className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

           
          </div>

          {/* ================================================================= */}
          {/* KPI SUMMARY CARDS ROW (5 CARDS) */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Card 1: Total Open Cases */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] text-[#242b5c]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Total Open Cases
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">84</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">Across 5 categories</p>
                </div>
              </div>
            </div>

            {/* Card 2: Overdue Cases */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] text-[#242b5c]">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Overdue Cases
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">59</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">70% of open cases</p>
                </div>
              </div>
            </div>

            {/* Card 3: Due Soon */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] text-[#242b5c]">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Due Soon
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">8</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">Within next 24 hours</p>
                </div>
              </div>
            </div>

            {/* Card 4: On Track */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] text-[#242b5c]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    On Track
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">17</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">Within SLA target</p>
                </div>
              </div>
            </div>

            {/* Card 5: SLA Not Configured */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    SLA Not Configured
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold text-slate-900">3</span>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">Issue types without SLA</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* UPPER ANALYTICS VISUALIZATIONS ROW (3 CARDS) */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Overdue Cases by Category */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">Overdue Cases by Category</h3>
                  <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                </div>
                {/* <div className="relative">
                  <select className="appearance-none rounded-md border border-slate-200 bg-white pl-2 pr-6 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer">
                    <option>Overdue Cases</option>
                    <option>All Cases</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                </div> */}
              </div>

              {/* Horizontal Bar Chart */}
              <div className="mt-4 space-y-2.5">
                {categoryOverdueBars.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 text-[11px]">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 flex-1 rounded bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded bg-[#242b5c] transition-all duration-300"
                          style={{ width: `${(item.count / item.max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800 w-5 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}

                {/* X-Axis Ticks */}
                <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                </div>
              </div>
            </div>

            {/* 2. SLA Status Distribution (Donut Chart) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">SLA Status Distribution</h3>
                  <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* Donut and Legend Grid */}
              <div className="mt-4 flex items-center justify-between gap-4">
                {/* SVG Donut */}
                <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                    {/* Dark Navy Segment (70% - 59 cases) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#242b5c"
                      strokeWidth="12"
                      strokeDasharray="167.13 238.76"
                      strokeDashoffset="0"
                    />
                    {/* Cool Slate Segment (10% - 8 cases) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#94a3b8"
                      strokeWidth="12"
                      strokeDasharray="23.88 238.76"
                      strokeDashoffset="-167.13"
                    />
                    {/* Royal Blue Segment (20% - 17 cases) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="47.75 238.76"
                      strokeDashoffset="-191.01"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">84</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">Open Cases</span>
                  </div>
                </div>

                {/* Legend Table */}
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#242b5c]" />
                      <span className="text-slate-600 font-medium text-[11px]">Overdue</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-[11px]">59</span>
                      <span className="text-slate-400 text-[10px] w-7 text-right">70%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span className="text-slate-600 font-medium text-[11px]">Due Soon</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-[11px]">8</span>
                      <span className="text-slate-400 text-[10px] w-7 text-right">10%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                      <span className="text-slate-600 font-medium text-[11px]">On Track</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-[11px]">17</span>
                      <span className="text-slate-400 text-[10px] w-7 text-right">20%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-200" />
                      <span className="text-slate-600 font-medium text-[11px]">Not Configured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-[11px]">3</span>
                      <span className="text-slate-400 text-[10px] w-7 text-right">—</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Breach Trend (Line Chart) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">Breach Trend</h3>
                  <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                </div>
                <div className="relative">
                  <select className="appearance-none rounded-md border border-slate-200 bg-white pl-2 pr-6 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer">
                    <option>Last 8 weeks</option>
                    <option>Last 4 weeks</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="mt-3 relative">
                <div className="text-[9px] text-slate-400 -rotate-90 absolute -left-4 top-10 origin-left font-medium">
                  No. of breached cases
                </div>
                <div className="ml-5">
                  <svg className="w-full h-32 overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                    {[0, 20, 40, 60, 80].map((val) => {
                      const y = chartHeight - (val / maxVal) * (chartHeight - 20) - 10;
                      return (
                        <g key={val}>
                          <line x1="25" y1={y} x2={chartWidth - 10} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="20" y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    <polyline
                      fill="none"
                      stroke="#242b5c"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={pointsString}
                    />

                    {trendPoints.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#242b5c"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="hover:scale-125 transition-transform"
                      />
                    ))}
                  </svg>

                  <div className="flex justify-between text-[9px] text-slate-400 font-medium pl-6 pr-2 pt-1">
                    {trendData.map((d) => (
                      <span key={d.label}>{d.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* CATEGORY SUB-NAVIGATION TABS (INTERACTIVE CLICK SWITCHING) */}
          {/* ================================================================= */}
          <div className="border-b border-slate-200">
            <div className="flex items-center gap-6 overflow-x-auto">
              {categoryTabs.map((tab) => {
                const isActive = selectedCategoryTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`pb-3 text-xs font-semibold whitespace-nowrap transition cursor-pointer relative ${
                      isActive
                        ? "text-[#242b5c] border-b-2 border-[#242b5c]"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`ml-1 text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-[#eff2fc] text-[#242b5c] font-bold"
                            : "text-slate-400 font-normal"
                        }`}
                      >
                        ({tab.count})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* MAIN LOWER SPLIT: LEFT (68%) DYNAMIC CATEGORY & RIGHT (32%) */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: DYNAMIC CATEGORY VISUALS & TABLE (8 of 12 cols) */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-8 space-y-4">
              {/* Card 1: Category Visual Analytics */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                {/* Header in Dark Navy Console Style */}
                <div className="bg-[#242b5c] px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3 font-semibold">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white">{activeCategory.name}</h2>
                        <span className="text-[11px] text-blue-200 font-medium">
                          ({activeCategory.issues.length} Operational Issues)
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-200/80 font-medium">
                        {activeCategory.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Filter for Bar Chart */}
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none rounded-lg border border-white/20 bg-white/10 text-white pl-2.5 pr-7 py-1 text-[11px] font-semibold hover:bg-white/20 focus:outline-none cursor-pointer transition"
                      >
                        <option value="overdue" className="text-slate-800">Overdue Cases</option>
                        <option value="all" className="text-slate-800">All Cases</option>
                        <option value="due-soon" className="text-slate-800">Due Soon</option>
                        <option value="on-track" className="text-slate-800">On Track</option>
                        <option value="unconfigured" className="text-slate-800">SLA Not Configured</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-200" />
                    </div>
                  </div>
                </div>

                <div className="p-5">

                {/* Filter Pill if an issue is selected via bar click */}
                {selectedIssueFilter && (
                  <div className="mt-2.5 flex items-center justify-between rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs text-blue-800">
                    <span className="font-medium">
                      Filtering table by:{" "}
                      <strong>
                        {activeCategory.issues.find((i) => i.id === selectedIssueFilter)?.issue}
                      </strong>
                    </span>
                    <button
                      onClick={() => setSelectedIssueFilter(null)}
                      className="flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Clear filter</span>
                    </button>
                  </div>
                )}

                {/* Split inner visual: Left Bar chart, Right Donut */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Left: Overdue Cases by Issue (approx 7 cols) */}
                  <div className="md:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        {activeCategory.name} — {chartFilterLabel} by Issue
                      </h4>
                      <span className="text-[10px] text-slate-400">Click bar to filter table</span>
                    </div>

                    <div className="space-y-2 mt-2">
                      {activeCategoryIssuesForChart.map((item, idx) => {
                        const count = getIssueCountForFilter(item, statusFilter);
                        const widthPct = maxChartVal > 0 ? (count / maxChartVal) * 100 : 0;
                        const isSelected = selectedIssueFilter === item.id;

                        return (
                          <div
                            key={item.id}
                            onClick={() =>
                              setSelectedIssueFilter(isSelected ? null : item.id)
                            }
                            className={`group space-y-0.5 p-1 rounded-md transition cursor-pointer ${
                              isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                            }`}
                            title={`Click to filter table by: ${item.issue}`}
                          >
                            <div className="flex items-center justify-between gap-1 text-[11px]">
                              <div className="flex items-center gap-1.5 truncate max-w-[85%]">
                                <span className="text-[10px] text-slate-400 font-bold w-3 shrink-0">
                                  {idx + 1}
                                </span>
                                <span
                                  className={`truncate font-medium ${
                                    isSelected
                                      ? "text-blue-700 font-semibold"
                                      : "text-slate-700 group-hover:text-blue-600"
                                  }`}
                                  title={item.issue}
                                >
                                  {item.issue}
                                </span>
                                {item.categoryName && selectedCategoryTab === "all" && (
                                  <span
                                    className={`hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold border shrink-0 ${getCategoryBadgeClass(
                                      item.categoryId
                                    )}`}
                                  >
                                    {item.categoryName}
                                  </span>
                                )}
                                <span className="hidden sm:inline-block text-[9px] text-slate-400 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                                  SLA: {item.slaTarget}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 shrink-0">
                                {count} {count === 1 ? "case" : "cases"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-3 flex-1 rounded bg-slate-100 overflow-hidden">
                                <div
                                  className={`h-full rounded transition-all duration-300 ${
                                    isSelected
                                      ? "bg-[#1e254d]"
                                      : "bg-[#2563eb] group-hover:bg-[#1d4ed8]"
                                  }`}
                                  style={{ width: `${Math.max(widthPct, count > 0 ? 3 : 0)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dynamic X-axis scale ticks */}
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                      <span>0</span>
                      <span>{Math.round(maxChartVal * 0.25)}</span>
                      <span>{Math.round(maxChartVal * 0.5)}</span>
                      <span>{Math.round(maxChartVal * 0.75)}</span>
                      <span>{maxChartVal}</span>
                    </div>
                  </div>

                  {/* Right: SLA Target Distribution (approx 5 cols) */}
                  <div className="md:col-span-5 border-l border-slate-100 pl-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900">SLA Target Distribution</h4>

                    <div className="mt-2 flex items-center gap-3">
                      {/* Donut Chart */}
                      <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                          {targetDistribution.slices.map((slice) => (
                            <circle
                              key={slice.target}
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke={slice.color}
                              strokeWidth="12"
                              strokeDasharray={`${slice.strokeLen} 238.76`}
                              strokeDashoffset={slice.offset}
                            />
                          ))}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-bold text-slate-900 leading-none">
                            {targetDistribution.total}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium mt-0.5">issues</span>
                        </div>
                      </div>

                      {/* Donut Legend */}
                      <div className="flex-1 space-y-1.5 text-xs">
                        {targetDistribution.slices.map((slice) => (
                          <div key={slice.target} className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: slice.color }}
                              />
                              <span className="text-slate-600 font-medium truncate" title={slice.target}>
                                {slice.target}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-800 text-[10px] shrink-0">
                              {slice.count} ({slice.pct}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Card 2: Category Issues Table */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="bg-[#242b5c] px-5 py-3 text-white flex items-center justify-between font-semibold">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-blue-200" />
                    <span>Operational Issues — Detailed Register</span>
                  </h3>
                  {selectedRows.length > 0 && (
                    <span className="text-[10px] font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
                      {selectedRows.length} selected
                    </span>
                  )}
                </div>
                <div className="p-4">
                  {/* Issues Table */}
                  <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-2 w-8">
                          <input
                            type="checkbox"
                            checked={
                              selectedRows.length === activeTableRows.length &&
                              activeTableRows.length > 0
                            }
                            onChange={handleSelectAll}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-2 w-8">#</th>
                        <th className="py-2.5 px-3">Issue</th>
                        <th className="py-2.5 px-3">SLA Target</th>
                        <th className="py-2.5 px-3">Cases</th>
                        <th className="py-2.5 px-3">Overdue Cases</th>
                        <th className="py-2.5 px-3">Longest Pending</th>
                        <th className="py-2.5 px-3">SLA Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTableRows.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-10 text-center text-slate-400 text-xs font-medium">
                            No {statusFilter === "all" ? "" : `${chartFilterLabel.toLowerCase()} `}found in {activeCategory.name}
                          </td>
                        </tr>
                      ) : (
                        activeTableRows.map((row, idx) => {
                          const isSelected = selectedRows.includes(row.id);
                          return (
                            <tr
                              key={row.id}
                              className={`hover:bg-slate-50/80 transition-colors ${
                                isSelected ? "bg-blue-50/40" : ""
                              }`}
                            >
                              <td className="py-3 px-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(row.id)}
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-2 font-medium text-slate-400">{idx + 1}</td>
                              <td className="py-3 px-3 font-semibold text-slate-800 max-w-xs">
                                <div>{row.issue}</div>
                                {row.categoryName && (
                                  <div className="mt-1">
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTabChange(row.categoryId);
                                      }}
                                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border cursor-pointer hover:opacity-85 transition ${getCategoryBadgeClass(
                                        row.categoryId
                                      )}`}
                                      title={`Category: ${row.categoryName} (Click to filter)`}
                                    >
                                      {row.categoryName}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">
                                {row.slaTarget === "SLA Not Configured" ? (
                                  <span className="text-slate-400 text-[11px]">SLA Not Configured</span>
                                ) : (
                                  row.slaTarget
                                )}
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-800">{row.openCases}</td>
                              <td className="py-3 px-3 font-bold">
                                {row.overdueCases > 0 ? (
                                  <span className="text-rose-600">{row.overdueCases}</span>
                                ) : (
                                  <span className="text-slate-400">0</span>
                                )}
                              </td>
                              <td className="py-3 px-3 font-semibold whitespace-nowrap">
                                {row.status === "Overdue" ? (
                                  <span className="text-rose-600">{row.longestPending}</span>
                                ) : row.longestPending === "n/a" ? (
                                  <span className="text-slate-400 font-normal">n/a</span>
                                ) : (
                                  <span className="text-slate-600">{row.longestPending}</span>
                                )}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                {row.status === "Overdue" && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                    Overdue
                                  </span>
                                )}
                                {row.status === "Due Soon" && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                                    Due Soon
                                  </span>
                                )}
                                {row.status === "On Track" && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                    On Track
                                  </span>
                                )}
                                {row.status === "SLA Not Configured" && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-200">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                    SLA Not Configured
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer">
                                  <span>View cases</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                  <span>
                    Showing {activeTableRows.length} of {activeCategory.issues.length} issues in {activeCategory.name}
                    {statusFilter !== "all" && (
                      <span className="text-[#242b5c] font-semibold ml-1">
                        ({chartFilterLabel})
                      </span>
                    )}
                  </span>
                  <span>Click any bar in the chart above to filter this table</span>
                </div>
              </div>
            </div>
          </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: TOP BREACHED, SLA BY CATEGORY, RECENT CASES (4 of 12 cols) */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-4">
              {/* Card 1: Top Breached Issues (All Categories) */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="bg-[#242b5c] px-4 py-3 text-white flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-blue-200" />
                    <span>Top Breached Issues (All Categories)</span>
                  </h3>
                  <button
                    onClick={() => {
                      handleTabChange("all");
                      setStatusFilter("overdue");
                    }}
                    className="text-[11px] font-semibold text-blue-200 hover:text-white flex items-center gap-0.5 cursor-pointer transition"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="divide-y divide-slate-100">
                    {topBreachedIssues.map((item) => (
                      <div
                        key={item.rank}
                        onClick={() => {
                          if (item.categoryId) {
                            handleTabChange(item.categoryId);
                          }
                        }}
                        className="group flex items-start gap-2.5 py-2.5 px-1 -mx-1 rounded-lg hover:bg-slate-50/80 transition cursor-pointer"
                        title={`Category: ${item.category} — Click to switch to ${item.category}`}
                      >
                        <span className="w-3 pt-0.5 text-[11px] font-bold text-slate-400 group-hover:text-[#242b5c] transition shrink-0">
                          {item.rank}
                        </span>
                        <div className="flex-1 min-w-0 pr-1">
                          <p
                            className="text-[11px] font-semibold text-slate-800 truncate group-hover:text-[#242b5c] transition"
                            title={item.title}
                          >
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold border ${getCategoryBadgeClass(
                                item.categoryId
                              )}`}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1 shrink-0">
                          <div className="w-14 h-3 bg-slate-100 rounded overflow-hidden">
                            <div
                              className="h-full bg-[#242b5c] rounded transition-all duration-300"
                              style={{ width: `${(item.count / item.max) * 100}%` }}
                            />
                          </div>
                          <span className="w-3 text-right text-[11px] font-bold text-slate-800">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: SLA Status by Category (Proportion Bars) */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="bg-[#242b5c] px-4 py-3 text-white">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5 text-blue-200" />
                    <span>SLA Status by Category</span>
                  </h3>
                </div>

                <div className="p-4">
                  <div className="space-y-2.5">
                    {categorySlaDistribution.map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-medium text-slate-600">{cat.category}</span>
                        </div>
                        {/* Segmented Bar */}
                        <div className="h-3.5 w-full flex rounded overflow-hidden bg-slate-100">
                          <div
                            className="bg-[#242b5c] text-[9px] text-white flex items-center justify-center font-bold"
                            style={{ width: `${cat.overdue}%` }}
                            title={`Overdue: ${cat.overdue}%`}
                          >
                            {cat.overdue}%
                          </div>
                          <div
                            className="bg-slate-400 text-[9px] text-white flex items-center justify-center font-bold"
                            style={{ width: `${cat.dueSoon}%` }}
                            title={`Due Soon: ${cat.dueSoon}%`}
                          >
                            {cat.dueSoon}%
                          </div>
                          <div
                            className="bg-[#3b82f6] text-[9px] text-white flex items-center justify-center font-bold"
                            style={{ width: `${cat.onTrack}%` }}
                            title={`On Track: ${cat.onTrack}%`}
                          >
                            {cat.onTrack}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#242b5c]" />
                      <span>Overdue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      <span>Due Soon</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                      <span>On Track</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Recently Breached Cases */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
                <div className="bg-[#242b5c] px-4 py-3 text-white flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-200" />
                    <span>Recently Breached Cases</span>
                  </h3>
                  <button
                    onClick={() => {
                      handleTabChange("all");
                      setStatusFilter("overdue");
                    }}
                    className="text-[11px] font-semibold text-blue-200 hover:text-white flex items-center gap-0.5 cursor-pointer transition"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                          <th className="py-1.5 pr-2">Order / Case ID</th>
                          <th className="py-1.5 px-2">Category</th>
                          <th className="py-1.5 px-2">Issue</th>
                          <th className="py-1.5 pl-2 text-right">Breach Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentlyBreached.map((item) => {
                          const catId =
                            item.category === "B2C Purchases"
                              ? "b2c-purchases"
                              : item.category === "B2C Sales"
                              ? "b2c-sales"
                              : item.category === "Inventory"
                              ? "inventory"
                              : item.category === "B2B Purchases"
                              ? "b2b-purchases"
                              : "b2b-sales";
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2 pr-2 font-semibold text-slate-900">{item.id}</td>
                              <td className="py-2 px-2 text-slate-500 font-medium">
                                <span
                                  onClick={() => handleTabChange(catId)}
                                  className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold border cursor-pointer hover:opacity-85 transition ${getCategoryBadgeClass(
                                    catId
                                  )}`}
                                  title={`Filter by ${item.category}`}
                                >
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-slate-600 truncate max-w-[100px]" title={item.issue}>
                                {item.issue}
                              </td>
                              <td className="py-2 pl-2 text-right font-bold text-rose-600 whitespace-nowrap">
                                {item.time}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
