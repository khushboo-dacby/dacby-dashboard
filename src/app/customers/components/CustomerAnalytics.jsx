"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  Activity,
  Calendar,
  CreditCard,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Filter,
  Layers,
  Tag,
  Truck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { fetchUserOrders } from "../api";
import {
  formatCurrencyINR,
  formatDateTime,
  parseTimestamp,
} from "../customerUtils";

function extractOrders(ordersData) {
  if (!ordersData) return [];
  if (Array.isArray(ordersData)) return ordersData;
  if (Array.isArray(ordersData.orders)) return ordersData.orders;
  if (Array.isArray(ordersData.data)) return ordersData.data;
  if (Array.isArray(ordersData.data?.orders)) return ordersData.data.orders;
  if (Array.isArray(ordersData.userOrders)) return ordersData.userOrders;
  if (Array.isArray(ordersData.user_orders)) return ordersData.user_orders;
  if (Array.isArray(ordersData.result)) return ordersData.result;
  if (Array.isArray(ordersData.payload)) return ordersData.payload;

  const buyList = Array.isArray(ordersData.buyOrders)
    ? ordersData.buyOrders
    : Array.isArray(ordersData.buy_orders)
    ? ordersData.buy_orders
    : Array.isArray(ordersData.buy)
    ? ordersData.buy
    : [];
  const sellList = Array.isArray(ordersData.sellOrders)
    ? ordersData.sellOrders
    : Array.isArray(ordersData.sell_orders)
    ? ordersData.sell_orders
    : Array.isArray(ordersData.sell)
    ? ordersData.sell
    : [];

  if (buyList.length > 0 || sellList.length > 0) {
    const taggedBuy = buyList.map((o) => ({ ...o, type: o.type || "Buy" }));
    const taggedSell = sellList.map((o) => ({ ...o, type: o.type || "Sell" }));
    return [...taggedBuy, ...taggedSell];
  }

  if (
    ordersData.data &&
    typeof ordersData.data === "object" &&
    !Array.isArray(ordersData.data)
  ) {
    const vals = Object.values(ordersData.data);
    if (vals.length > 0 && typeof vals[0] === "object") {
      return vals;
    }
  }

  return [];
}

const PIE_COLORS = [
  "#2A67EC",
  "#13B89B",
  "#704CF3",
  "#55A7F7",
  "#E8AD37",
  "#1656C2",
  "#0D917F",
  "#E06475",
];

export default function CustomerAnalytics({
  userData = {},
  subcollections = {},
  userId = "",
  initialOrders = null,
}) {
  const [ordersData, setOrdersData] = useState(initialOrders);
  const [loading, setLoading] = useState(!initialOrders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Filter & View State
  const [timeframe, setTimeframe] = useState("all"); // "all" | "2026" | "2025"
  const [trendMetric, setTrendMetric] = useState("amount"); // "amount" | "count"

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOrders = useCallback(
    async (isManual = false) => {
      if (!userId) {
        setLoading(false);
        return;
      }
      if (isManual) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await fetchUserOrders({ userId });
        setOrdersData(data);
      } catch (err) {
        setError(err.message || "Failed to load customer orders for analytics");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (initialOrders) {
      setOrdersData(initialOrders);
      setLoading(false);
    } else {
      loadOrders(false);
    }
  }, [loadOrders, initialOrders]);

  // Extract raw orders
  const allOrders = useMemo(() => extractOrders(ordersData), [ordersData]);

  // Separate Buy and Sell
  const rawBuyOrders = useMemo(
    () =>
      allOrders.filter(
        (o) =>
          !String(o.type || o.order_type || "").toLowerCase().includes("sell") &&
          !String(o.orderId || o.id || "").endsWith("S") &&
          !o.sell
      ),
    [allOrders]
  );

  const rawSellOrders = useMemo(
    () =>
      allOrders.filter(
        (o) =>
          String(o.type || o.order_type || "").toLowerCase().includes("sell") ||
          String(o.orderId || o.id || "").endsWith("S") ||
          Boolean(o.sell)
      ),
    [allOrders]
  );

  // Available unique years dynamically extracted from customer orders
  const availableYears = useMemo(() => {
    const years = new Set();
    allOrders.forEach((o) => {
      const d = parseTimestamp(
        o.created_at || o.timestamp || o.date || o.ordered_at
      );
      if (d) years.add(d.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allOrders]);

  // Time-filtered Orders
  const filterByTimeframe = useCallback(
    (orderList) => {
      if (timeframe === "all") return orderList;
      return orderList.filter((o) => {
        const d = parseTimestamp(
          o.created_at || o.timestamp || o.date || o.ordered_at
        );
        if (!d) return false;
        return String(d.getFullYear()) === String(timeframe);
      });
    },
    [timeframe]
  );

  const buyOrders = useMemo(
    () => filterByTimeframe(rawBuyOrders),
    [rawBuyOrders, filterByTimeframe]
  );
  const sellOrders = useMemo(
    () => filterByTimeframe(rawSellOrders),
    [rawSellOrders, filterByTimeframe]
  );

  // --- STATS COMPUTATION ---
  const buyStats = useMemo(() => {
    let totalVal = 0;
    let completedVal = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let inProcessCount = 0;
    let fastDeliveryCount = 0;
    let latestTs = 0;
    let latestOrderDate = null;

    const monthlyCounts = {};
    const quarterlyCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    const halfYearlyCounts = { H1: 0, H2: 0 };
    const yearlyCounts = {};

    buyOrders.forEach((o) => {
      const amt = Number(o.final_amount ?? o.total ?? o.amount ?? 0);
      totalVal += amt;

      const d = parseTimestamp(
        o.created_at || o.timestamp || o.date || o.ordered_at
      );
      if (d) {
        const time = d.getTime();
        if (time > latestTs) {
          latestTs = time;
          latestOrderDate = d;
        }

        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyCounts[ym] = (monthlyCounts[ym] || 0) + 1;

        const month = d.getMonth() + 1;
        if (month <= 3) quarterlyCounts.Q1++;
        else if (month <= 6) quarterlyCounts.Q2++;
        else if (month <= 9) quarterlyCounts.Q3++;
        else quarterlyCounts.Q4++;

        if (month <= 6) halfYearlyCounts.H1++;
        else halfYearlyCounts.H2++;

        const yr = String(d.getFullYear());
        yearlyCounts[yr] = (yearlyCounts[yr] || 0) + 1;
      }

      const s = String(
        o.status?.overall_status ||
          o.status?.final_status ||
          (typeof o.status === "string" ? o.status : "")
      ).toLowerCase();

      if (
        o.status?.completed === true ||
        o.status?.final_status === "success" ||
        s.includes("complete") ||
        s.includes("deliver") ||
        s === "success"
      ) {
        completedCount++;
        completedVal += amt;
      } else if (
        o.status?.cancelled === true ||
        s.includes("cancel") ||
        s === "unsuccess"
      ) {
        cancelledCount++;
      } else {
        inProcessCount++;
      }

      if (o.fast_delivery) fastDeliveryCount++;
    });

    const monthsActive = Math.max(1, Object.keys(monthlyCounts).length);
    const monthlyAvg = Math.round(buyOrders.length / monthsActive);
    const quarterlyAvg = Math.round(buyOrders.length / Math.max(1, monthsActive / 3));

    const aov = buyOrders.length > 0 ? Math.round(totalVal / buyOrders.length) : 0;
    const completedAov =
      completedCount > 0 ? Math.round(completedVal / completedCount) : 0;

    const activeYears = Object.keys(yearlyCounts).sort((a, b) => b.localeCompare(a));
    const yearlySummary =
      activeYears.length > 0
        ? activeYears.map((yr) => `${yr}: ${yearlyCounts[yr]}`).join(" · ")
        : "0";

    const nonZeroQuarters = Object.entries(quarterlyCounts).filter(
      ([, count]) => count > 0
    );
    const quarterlySummary =
      nonZeroQuarters.length > 0
        ? nonZeroQuarters.map(([q, count]) => `${q}: ${count}`).join(" · ")
        : "—";

    return {
      totalVal,
      completedVal,
      totalCount: buyOrders.length,
      completedCount,
      cancelledCount,
      inProcessCount,
      fastDeliveryCount,
      aov,
      completedAov,
      latestOrderDate,
      monthlyAvg,
      quarterlyAvg,
      quarterlyCounts,
      halfYearlyCounts,
      yearlyCounts,
      yearlySummary,
      quarterlySummary,
      completionRate:
        buyOrders.length > 0
          ? Math.round((completedCount / buyOrders.length) * 100)
          : 0,
    };
  }, [buyOrders]);

  const sellStats = useMemo(() => {
    let totalVal = 0;
    let completedVal = 0;
    let completedCount = 0;
    let inProcessCount = 0;
    let latestTs = 0;
    let latestOrderDate = null;

    const monthlyCounts = {};
    const quarterlyCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    const halfYearlyCounts = { H1: 0, H2: 0 };
    const yearlyCounts = {};

    sellOrders.forEach((o) => {
      const amt = Number(o.final_amount ?? o.total ?? o.amount ?? 0);
      totalVal += amt;

      const d = parseTimestamp(
        o.created_at || o.timestamp || o.date || o.ordered_at
      );
      if (d) {
        const time = d.getTime();
        if (time > latestTs) {
          latestTs = time;
          latestOrderDate = d;
        }

        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyCounts[ym] = (monthlyCounts[ym] || 0) + 1;

        const month = d.getMonth() + 1;
        if (month <= 3) quarterlyCounts.Q1++;
        else if (month <= 6) quarterlyCounts.Q2++;
        else if (month <= 9) quarterlyCounts.Q3++;
        else quarterlyCounts.Q4++;

        if (month <= 6) halfYearlyCounts.H1++;
        else halfYearlyCounts.H2++;

        const yr = String(d.getFullYear());
        yearlyCounts[yr] = (yearlyCounts[yr] || 0) + 1;
      }

      const s = String(
        o.status?.overall_status ||
          o.status?.final_status ||
          (typeof o.status === "string" ? o.status : "")
      ).toLowerCase();

      if (
        o.status?.completed === true ||
        o.status?.final_status === "success" ||
        s.includes("complete") ||
        s.includes("deliver")
      ) {
        completedCount++;
        completedVal += amt;
      } else {
        inProcessCount++;
      }
    });

    const monthsActive = Math.max(1, Object.keys(monthlyCounts).length);
    const monthlyAvg =
      sellOrders.length > 0
        ? (sellOrders.length / monthsActive >= 1
            ? Math.round(sellOrders.length / monthsActive)
            : (sellOrders.length / monthsActive).toFixed(1))
        : 0;
    const quarterlyAvg =
      sellOrders.length > 0
        ? Math.round(sellOrders.length / Math.max(1, monthsActive / 3))
        : 0;

    const aov = sellOrders.length > 0 ? Math.round(totalVal / sellOrders.length) : 0;

    const activeYears = Object.keys(yearlyCounts).sort((a, b) => b.localeCompare(a));
    const yearlySummary =
      activeYears.length > 0
        ? activeYears.map((yr) => `${yr}: ${yearlyCounts[yr]}`).join(" · ")
        : "0";

    const nonZeroQuarters = Object.entries(quarterlyCounts).filter(
      ([, count]) => count > 0
    );
    const quarterlySummary =
      nonZeroQuarters.length > 0
        ? nonZeroQuarters.map(([q, count]) => `${q}: ${count}`).join(" · ")
        : "—";

    return {
      totalVal,
      completedVal,
      totalCount: sellOrders.length,
      completedCount,
      inProcessCount,
      aov,
      latestOrderDate,
      monthlyAvg,
      quarterlyAvg,
      quarterlyCounts,
      halfYearlyCounts,
      yearlyCounts,
      yearlySummary,
      quarterlySummary,
    };
  }, [sellOrders]);

  // Combined Totals
  const totalVolume = buyStats.totalVal + sellStats.totalVal;
  const totalOrdersCount = buyStats.totalCount + sellStats.totalCount;
  const totalCompletedCount = buyStats.completedCount + sellStats.completedCount;
  const overallAOV =
    totalOrdersCount > 0 ? Math.round(totalVolume / totalOrdersCount) : 0;

  // --- TIME-SERIES CHART DATA (Monthly Breakdown) ---
  const monthlyTimelineData = useMemo(() => {
    const map = {};

    buyOrders.forEach((o) => {
      const d = parseTimestamp(
        o.created_at || o.timestamp || o.date || o.ordered_at
      );
      if (!d) return;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[ym]) {
        const label = d.toLocaleString("en-US", {
          month: "short",
          year: "2-digit",
        });
        map[ym] = { monthKey: ym, label, amount: 0, count: 0 };
      }
      map[ym].amount += Number(o.final_amount ?? o.total ?? o.amount ?? 0);
      map[ym].count += 1;
    });

    return Object.values(map).sort((a, b) =>
      a.monthKey.localeCompare(b.monthKey)
    );
  }, [buyOrders]);

  // --- CATEGORIES AGGREGATION ---
  const topCategories = useMemo(() => {
    const catMap = {};
    buyOrders.forEach((o) => {
      const prods =
        o.products && typeof o.products === "object"
          ? Array.isArray(o.products)
            ? o.products
            : Object.values(o.products)
          : Array.isArray(o.items)
          ? o.items
          : [];

      prods.forEach((p) => {
        if (!p) return;
        const rawCat = p.category?.name || p.category || p.title || "General";
        let cleanCat = String(rawCat).trim();
        if (cleanCat.toLowerCase().includes("controller")) {
          cleanCat = "Controllers";
        } else if (cleanCat.toLowerCase().includes("ps4 cd")) {
          cleanCat = "PS4 Games / CDs";
        } else if (cleanCat.toLowerCase().includes("ps5 cd")) {
          cleanCat = "PS5 Games / CDs";
        } else if (cleanCat.toLowerCase().includes("console")) {
          cleanCat = "Consoles";
        } else if (cleanCat.toLowerCase().includes("camera")) {
          cleanCat = "Cameras & Optics";
        }
        catMap[cleanCat] = (catMap[cleanCat] || 0) + (Number(p.quantity) || 1);
      });
    });

    const list = Object.entries(catMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const totalProducts = list.reduce((s, c) => s + c.count, 0) || 1;
    return list.slice(0, 6).map((item) => ({
      ...item,
      percentage: Math.round((item.count / totalProducts) * 100),
    }));
  }, [buyOrders]);

  // --- PAYMENT METHODS DISTRIBUTION ---
  const paymentDistribution = useMemo(() => {
    const payMap = {};
    buyOrders.forEach((o) => {
      const pm = String(
        o.payment?.method || (o.payment?.cash ? "COD" : "Online")
      )
        .toUpperCase()
        .trim();

      let group = "OTHER";
      if (pm.includes("WALLET")) group = "Wallet";
      else if (pm.includes("UPI")) group = "UPI";
      else if (pm.includes("PAYOUT")) group = "Bank Payouts";
      else if (pm.includes("COD") || pm.includes("CASH")) group = "Cash on Delivery";
      else if (pm.includes("NETBANKING")) group = "Netbanking";
      else group = "Cards / Other";

      payMap[group] = (payMap[group] || 0) + 1;
    });

    return Object.entries(payMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [buyOrders]);

  if (loading && !ordersData) {
    return (
      <div className="rounded-2xl border border-[#DCE5F1] bg-white p-12 text-center shadow-xs">
        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#2A67EC]" />
        <p className="mt-3 text-xs font-semibold text-[#53647F]">
          Synthesizing customer order intelligence & analytics...
        </p>
      </div>
    );
  }

  if (error && !ordersData) {
    return (
      <div className="rounded-2xl border border-[#F5C2CA] bg-[#FFF0F2] p-8 text-center shadow-xs">
        <AlertCircle className="mx-auto h-8 w-8 text-[#D34D5D]" />
        <p className="mt-2 text-sm font-bold text-[#B83852]">
          Could not load analytics
        </p>
        <p className="mt-1 text-xs text-[#53647F]">{error}</p>
        <button
          type="button"
          onClick={() => loadOrders(false)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E57D2] transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE5F1]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#151D35]">
              Customer Transaction Intelligence
            </h2>
            {Boolean(userData?.vendor) ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF3FF] border border-[#C9DCFF] px-2.5 py-0.5 text-[11px] font-bold text-[#2A67EC]">
                <Sparkles className="h-3 w-3" />
                Verified Vendor
              </span>
            ) : totalVolume >= 500000 || totalOrdersCount >= 20 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF3FF] border border-[#C9DCFF] px-2.5 py-0.5 text-[11px] font-bold text-[#2A67EC]">
                <Sparkles className="h-3 w-3" />
                High Volume Customer
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F5FA] border border-[#DCE5F1] px-2.5 py-0.5 text-[11px] font-bold text-[#53647F]">
                Active Customer
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#71809A]">
            Comprehensive transactional metrics, spending frequency, and category affinity.
          </p>
        </div>

        {/* Controls: Timeframe Filter + Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              aria-label="Filter analytics by timeframe"
              className="rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 text-xs font-bold text-[#53647F] shadow-xs focus:outline-none focus:border-[#2A67EC] cursor-pointer"
            >
              <option value="all">
                All Time {monthlyTimelineData.length > 0 ? `(${monthlyTimelineData.length} Months)` : ""}
              </option>
              {availableYears.map((yr) => (
                <option key={yr} value={String(yr)}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-3.5 py-1.5 text-xs font-bold text-[#53647F] shadow-xs hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-[#2A67EC] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* 2. TOP LIFETIME KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center gap-2.5 text-[#53647F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Volume (GMV)
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#151D35]">
              {formatCurrencyINR(totalVolume)}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#157348] flex items-center gap-1">
              <span>Completed: {formatCurrencyINR(buyStats.completedVal)}</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center gap-2.5 text-[#53647F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#704CF3]">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Orders Placed
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#151D35]">
              {totalOrdersCount}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#157348] flex items-center gap-1">
              <span>{totalCompletedCount} delivered</span>
              <span className="text-[#71809A]">
                ({buyStats.completionRate}% rate)
              </span>
            </p>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center gap-2.5 text-[#53647F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFBF3] text-[#16B879]">
              <Activity className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Avg Order Value (AOV)
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#151D35]">
              {formatCurrencyINR(overallAOV)}
            </p>
            <p className="mt-1 text-xs text-[#71809A]">
              Completed AOV:{" "}
              <strong className="text-[#151D35]">
                {formatCurrencyINR(buyStats.completedAov)}
              </strong>
            </p>
          </div>
        </div>

        {/* Active Frequency */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center gap-2.5 text-[#53647F]">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF8E9] text-[#C87513]">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Order Velocity
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#151D35]">
              ~{buyStats.monthlyAvg} <span className="text-sm font-semibold text-[#71809A]">/ mo</span>
            </p>
            <p className="mt-1 text-xs text-[#71809A]">
              Quarterly run-rate:{" "}
              <strong className="text-[#151D35]">
                ~{buyStats.quarterlyAvg} orders
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* 3. BUY ANALYTICS & SELL ANALYTICS CARDS (ENHANCED EXACT MATCH FROM SCREENSHOT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* BUY ANALYTICS CARD */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
                <ShoppingCart className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#151D35]">
                  Buy Analytics
                </h3>
                <p className="text-[11px] text-[#71809A]">
                  Gross: {formatCurrencyINR(buyStats.totalVal)}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#EDF3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#2A67EC] border border-[#C9DCFF]">
              {buyStats.totalCount} Orders
            </span>
          </div>

          {/* 2x2 Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Orders Placed
              </p>
              <p className="mt-1 text-2xl font-black text-[#151D35]">
                {buyStats.totalCount}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Total purchase requests
              </p>
            </div>

            <div className="rounded-xl bg-[#ECFBF3] border border-[#B7F1CD]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#157348]">
                Orders Completed
              </p>
              <p className="mt-1 text-2xl font-black text-[#157348]">
                {buyStats.completedCount}
              </p>
              <p className="mt-0.5 text-[10px] text-[#157348] font-semibold">
                {buyStats.completionRate}% fulfillment success
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Avg Order Value
              </p>
              <p className="mt-1 text-2xl font-black text-[#151D35]">
                {formatCurrencyINR(buyStats.aov)}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Completed AOV: {formatCurrencyINR(buyStats.completedAov)}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Last Order
              </p>
              <p className="mt-1 text-sm font-bold text-[#151D35] truncate">
                {buyStats.latestOrderDate
                  ? formatDateTime(buyStats.latestOrderDate)
                  : "N/A"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Most recent purchase
              </p>
            </div>
          </div>

          {/* Real Order Frequency Section */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#71809A] mb-2">
              Order Frequency
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Monthly Avg</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  ~{buyStats.monthlyAvg}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Quarterly Avg</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  ~{buyStats.quarterlyAvg}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Half Yearly</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  H1: {buyStats.halfYearlyCounts.H1} · H2: {buyStats.halfYearlyCounts.H2}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Yearly</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  {buyStats.yearlySummary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SELL ANALYTICS CARD */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#704CF3]">
                <Package className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#151D35]">
                  Sell Analytics
                </h3>
                <p className="text-[11px] text-[#71809A]">
                  Payouts: {formatCurrencyINR(sellStats.totalVal)}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#F3EEFF] px-2.5 py-0.5 text-[11px] font-bold text-[#704CF3] border border-[#DDD0FF]">
              {sellStats.totalCount} Orders
            </span>
          </div>

          {/* 2x2 Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Orders Placed
              </p>
              <p className="mt-1 text-2xl font-black text-[#151D35]">
                {sellStats.totalCount}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Sell/trade-in requests
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Orders Completed
              </p>
              <p className="mt-1 text-2xl font-black text-[#151D35]">
                {sellStats.completedCount}
              </p>
              <p className="mt-0.5 text-[10px] text-[#C87513] font-semibold">
                {sellStats.inProcessCount} pending inspection/pickup
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Avg Order Value
              </p>
              <p className="mt-1 text-2xl font-black text-[#151D35]">
                {formatCurrencyINR(sellStats.aov)}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Average sell payout
              </p>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#DCE5F1]/80 p-3.5">
              <p className="text-[11px] font-semibold text-[#8190A9]">
                Last Order
              </p>
              <p className="mt-1 text-sm font-bold text-[#151D35] truncate">
                {sellStats.latestOrderDate
                  ? formatDateTime(sellStats.latestOrderDate)
                  : "N/A"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#71809A]">
                Most recent sell trade
              </p>
            </div>
          </div>

          {/* Real Order Frequency Section */}
          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#71809A] mb-2">
              Order Frequency
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Monthly Avg</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  {sellStats.totalCount > 0 ? `~${sellStats.monthlyAvg}` : "0"}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Quarterly</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  {sellStats.quarterlySummary}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Half Yearly</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  H1: {sellStats.halfYearlyCounts.H1} · H2: {sellStats.halfYearlyCounts.H2}
                </p>
              </div>
              <div className="rounded-lg bg-[#F2F5FA] border border-[#DCE5F1] p-2 text-center">
                <p className="text-[10px] text-[#8190A9]">Yearly</p>
                <p className="mt-0.5 font-bold text-[#151D35]">
                  {sellStats.yearlySummary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE HISTORICAL REVENUE & VOLUME CHART */}
      <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE5F1]/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#151D35] flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-[#2A67EC]" />
              <span>
                Spend & Order Volume Velocity{" "}
                {monthlyTimelineData.length > 0
                  ? `(${monthlyTimelineData.length}-Month Timeline)`
                  : ""}
              </span>
            </h3>
            <p className="text-xs text-[#71809A]">
              Historical breakdown of gross merchandise value and purchase orders placed.
            </p>
          </div>

          {/* Metric Selector Toggle */}
          <div className="flex items-center rounded-xl bg-[#EFF3F8] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTrendMetric("amount")}
              className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                trendMetric === "amount"
                  ? "bg-white text-[#2A67EC] font-bold shadow-xs"
                  : "text-[#53647F] hover:text-[#151D35]"
              }`}
            >
              Gross Spend (₹)
            </button>
            <button
              type="button"
              onClick={() => setTrendMetric("count")}
              className={`rounded-lg px-3 py-1 transition cursor-pointer ${
                trendMetric === "count"
                  ? "bg-white text-[#2A67EC] font-bold shadow-xs"
                  : "text-[#53647F] hover:text-[#151D35]"
              }`}
            >
              Order Count
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        {isMounted && monthlyTimelineData.length > 0 ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTimelineData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A67EC" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2A67EC" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#704CF3" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#704CF3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" stroke="#DCE5F1" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#8190A9" }}
                  tickLine={false}
                  axisLine={{ stroke: "#DCE5F1" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#8190A9" }}
                  tickLine={false}
                  axisLine={{ stroke: "#DCE5F1" }}
                  tickFormatter={(val) =>
                    trendMetric === "amount"
                      ? val >= 100000
                        ? `₹${(val / 100000).toFixed(1)}L`
                        : `₹${(val / 1000).toFixed(0)}k`
                      : val
                  }
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-[#DCE5F1] bg-white p-3 shadow-lg text-xs">
                          <p className="font-bold text-[#151D35]">{data.label}</p>
                          <p className="mt-1 text-[#2A67EC] font-extrabold">
                            Spend: {formatCurrencyINR(data.amount)}
                          </p>
                          <p className="mt-0.5 text-[#53647F] font-semibold">
                            Orders: {data.count}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={trendMetric === "amount" ? "amount" : "count"}
                  stroke={trendMetric === "amount" ? "#2A67EC" : "#704CF3"}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={
                    trendMetric === "amount"
                      ? "url(#colorSpend)"
                      : "url(#colorCount)"
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-[#8190A9]">
            Loading chart visualization...
          </div>
        )}
      </div>

      {/* 5. TWO-COLUMN DEEP DIVE: CATEGORIES & PAYMENT PREFERENCES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* TOP PURCHASED CATEGORIES */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDF3FF] text-[#2A67EC]">
                <Tag className="h-3.5 w-3.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#151D35]">
                  Product Category Affinity
                </h3>
                <p className="text-[11px] text-[#71809A]">
                  Ranked by total items purchased across orders
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#53647F]">
              Top 6 Categories
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {topCategories.map((cat, idx) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F2F5FA] text-[10px] font-bold text-[#53647F]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#151D35]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <strong className="text-[#151D35]">{cat.count} items</strong>
                    <span className="text-[#8190A9]">({cat.percentage}%)</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-[#EFF3F8] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#2A67EC] transition-all duration-500"
                    style={{ width: `${Math.min(cat.percentage * 2, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT METHOD PREFERENCES (DONUT / PIE) */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ECFBF3] text-[#16B879]">
                <CreditCard className="h-3.5 w-3.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#151D35]">
                  Payment Method Distribution
                </h3>
                <p className="text-[11px] text-[#71809A]">
                  Preferred payment gateways and settlement channels
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#53647F]">
              {buyOrders.length} Orders
            </span>
          </div>

          {isMounted && paymentDistribution.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              {/* Donut Chart */}
              <div className="h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {paymentDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} orders`, name]}
                      contentStyle={{
                        borderRadius: "12px",
                        fontSize: "11px",
                        border: "1px solid #DCE5F1",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="flex-1 w-full space-y-2">
                {paymentDistribution.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs rounded-lg p-1.5 hover:bg-[#F8FAFC] transition"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            PIE_COLORS[idx % PIE_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-[#151D35]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-[#151D35] font-mono">
                      {item.value} ({Math.round((item.value / buyOrders.length) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-[#8190A9]">
              Loading payment visualization...
            </div>
          )}
        </div>
      </div>

      {/* 6. ORDER FULFILLMENT & LIFECYCLE HEALTH */}
      <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDF3FF] text-[#2A67EC]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#151D35]">
                Order Health & Fulfillment Distribution
              </h3>
              <p className="text-[11px] text-[#71809A]">
                Fulfillment delivery success, cancellations, and logistics speed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-[#B7F1CD] bg-[#ECFBF3] p-4">
            <div className="flex items-center gap-1.5 text-[#157348] font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Delivered / Completed</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#157348]">
              {buyStats.completedCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#157348] font-semibold">
              {buyStats.completionRate}% fulfillment success
            </p>
          </div>

          <div className="rounded-xl border border-[#F5C2CA] bg-[#FFF0F2] p-4">
            <div className="flex items-center gap-1.5 text-[#B83852] font-bold">
              <XCircle className="h-4 w-4" />
              <span>Cancelled / Unsuccess</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#B83852]">
              {buyStats.cancelledCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#B83852] font-semibold">
              {Math.round((buyStats.cancelledCount / (buyStats.totalCount || 1)) * 100)}% cancel rate
            </p>
          </div>

          <div className="rounded-xl border border-[#F4D877] bg-[#FFF8E9] p-4">
            <div className="flex items-center gap-1.5 text-[#C87513] font-bold">
              <Clock className="h-4 w-4" />
              <span>In Process / Transit</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#C87513]">
              {buyStats.inProcessCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#C87513] font-semibold">
              Active open pipeline
            </p>
          </div>

          <div className="rounded-xl border border-[#C9DCFF] bg-[#EDF3FF] p-4">
            <div className="flex items-center gap-1.5 text-[#2459C4] font-bold">
              <Truck className="h-4 w-4" />
              <span>Fast Delivery Orders</span>
            </div>
            <p className="mt-2 text-2xl font-black text-[#2459C4]">
              {buyStats.fastDeliveryCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#2459C4] font-semibold">
              Express fulfillment opted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
