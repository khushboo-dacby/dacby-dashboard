"use client";

import React, { useMemo, useState } from "react";
import {
  ShoppingCart,
  Package,
  Smartphone,
  Globe,
  Building2,
  Users,
  XCircle,
  Store,
  Clock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  ArrowRight,
} from "lucide-react";

/* -----------------------------------------------------------------------
 * MOCK FIREBASE RESPONSE
 * In production this would come from a Firestore/RTDB read, e.g.:
 *   const snap = await getDoc(doc(db, "dashboard_daily", today));
 *   const firebaseResponse = snap.data();
 * ---------------------------------------------------------------------*/
const firebaseResponse = {
  success: true,
  data: {
    date: "13-07-2026",
    buy_orders: {
      b2b_count: 0,
      b2b_value: 0,
      b2c_count: 0,
      b2c_value: 0,
      website_count: 2,
      website_value: 3924,
      total_value: 119169,
      total_count: 7,
      app_value: 115245,
      app_count: 5,
      cancelled_value: 128115,
      cancelled_orders: 5,
    },
    sell_orders: {
      olx_count: 2,
      olx_value: 60000,
      b2c_count: 1,
      b2c_value: 10000,
      cancelled_value: 145600,
      cancelled_orders: 7,
      b2b_count: 7,
      b2b_value: 400500,
      app_value: 299909,
      app_count: 29,
      website_count: 26,
      total_value: 1371790,
      total_count: 65,
      website_value: 601381,
    },
  },
};

/* -------------------- helpers -------------------- */
const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (ddmmyyyy) => {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${dd} ${months[Number(mm) - 1]} ${yyyy}`;
};

// Converts <input type="date"> value (yyyy-mm-dd) into the API's dd-mm-yyyy format
const toApiDate = (isoDate) => {
  const [yyyy, mm, dd] = isoDate.split("-");
  return `${dd}-${mm}-${yyyy}`;
};

/* -------------------- small building blocks -------------------- */

function IconBadge({ icon: Icon, className }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${className}`}
    >
      <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
    </div>
  );
}

function SummaryCard({ icon, iconBg, label, labelColor, count, value, gradient }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/5 p-6 shadow-sm ${gradient}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <IconBadge icon={icon} className={iconBg} />
        <h3 className={`text-lg font-bold ${labelColor}`}>{label}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-extrabold text-slate-800">{count}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Total Orders</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold text-slate-800">{formatINR(value)}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">Total Value</p>
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ icon, iconBg, label, labelColor, count, value, valueColor, bg }) {
  return (
    <div className={`rounded-2xl border border-black/5 p-5 shadow-sm ${bg}`}>
      <div className="mb-5 flex items-center gap-2.5">
        <IconBadge icon={icon} className={iconBg} />
        <span className={`font-semibold ${labelColor}`}>{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-slate-800">{count}</p>
      <p className={`mt-1 text-sm font-semibold ${valueColor}`}>{formatINR(value)}</p>
    </div>
  );
}

function BreakdownSection({ title, icon: Icon, iconColor, cards }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2.5} />
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((c) => (
          <BreakdownCard key={c.label} {...c} />
        ))}
      </div>
    </section>
  );
}

function WeeklyStatCard({ icon, iconBg, label, value, trend, trendLabel }) {
  const isUp = trend >= 0;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <IconBadge icon={icon} className={iconBg} />
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <div
        className={`mt-2 flex items-center gap-1 text-sm font-semibold ${
          isUp ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isUp ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        <span>
          {isUp ? "+" : ""}
          {trend}% {trendLabel}
        </span>
      </div>
    </div>
  );
}

/* -------------------- main dashboard -------------------- */

export default function OrdersDashboard() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-07-13"); // yyyy-mm-dd for <input type="date">

  // NOTE: In production, changing `selectedDate` should trigger a fresh
  // Firestore read for that day, e.g.:
  //   useEffect(() => {
  //     getDoc(doc(db, "dashboard_daily", toApiDate(selectedDate))).then(...)
  //   }, [selectedDate]);
  // The dashboard currently renders the single mocked payload below.
  const { data } = firebaseResponse;
  const { buy_orders: buy, sell_orders: sell } = data;

  const buyBreakdown = useMemo(
    () => [
      {
        icon: Smartphone,
        iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
        label: "App",
        labelColor: "text-purple-700",
        count: buy.app_count,
        value: buy.app_value,
        valueColor: "text-purple-600",
        bg: "bg-purple-50/70",
      },
      {
        icon: Globe,
        iconBg: "bg-gradient-to-br from-blue-500 to-sky-600",
        label: "Website",
        labelColor: "text-blue-700",
        count: buy.website_count,
        value: buy.website_value,
        valueColor: "text-blue-600",
        bg: "bg-blue-50/70",
      },
      {
        icon: Building2,
        iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
        label: "B2B",
        labelColor: "text-orange-700",
        count: buy.b2b_count,
        value: buy.b2b_value,
        valueColor: "text-orange-600",
        bg: "bg-orange-50/70",
      },
      {
        icon: Users,
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        label: "B2C",
        labelColor: "text-emerald-700",
        count: buy.b2c_count,
        value: buy.b2c_value,
        valueColor: "text-emerald-600",
        bg: "bg-emerald-50/70",
      },
      {
        icon: XCircle,
        iconBg: "bg-gradient-to-br from-rose-500 to-red-600",
        label: "Cancelled",
        labelColor: "text-red-700",
        count: buy.cancelled_orders,
        value: buy.cancelled_value,
        valueColor: "text-red-600",
        bg: "bg-red-50/70",
      },
    ],
    [buy]
  );

  const sellBreakdown = useMemo(
    () => [
      {
        icon: Smartphone,
        iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
        label: "App",
        labelColor: "text-purple-700",
        count: sell.app_count,
        value: sell.app_value,
        valueColor: "text-purple-600",
        bg: "bg-purple-50/70",
      },
      {
        icon: Globe,
        iconBg: "bg-gradient-to-br from-blue-500 to-sky-600",
        label: "Website",
        labelColor: "text-blue-700",
        count: sell.website_count,
        value: sell.website_value,
        valueColor: "text-blue-600",
        bg: "bg-blue-50/70",
      },
      {
        icon: Building2,
        iconBg: "bg-gradient-to-br from-orange-500 to-amber-600",
        label: "B2B",
        labelColor: "text-orange-700",
        count: sell.b2b_count,
        value: sell.b2b_value,
        valueColor: "text-orange-600",
        bg: "bg-orange-50/70",
      },
      {
        icon: Users,
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        label: "B2C",
        labelColor: "text-emerald-700",
        count: sell.b2c_count,
        value: sell.b2c_value,
        valueColor: "text-emerald-600",
        bg: "bg-emerald-50/70",
      },
      {
        icon: Store,
        iconBg: "bg-gradient-to-br from-amber-500 to-yellow-600",
        label: "OLX",
        labelColor: "text-amber-700",
        count: sell.olx_count,
        value: sell.olx_value,
        valueColor: "text-amber-600",
        bg: "bg-amber-50/70",
      },
      {
        icon: XCircle,
        iconBg: "bg-gradient-to-br from-rose-500 to-red-600",
        label: "Cancelled",
        labelColor: "text-red-700",
        count: sell.cancelled_orders,
        value: sell.cancelled_value,
        valueColor: "text-red-600",
        bg: "bg-red-50/70",
      },
    ],
    [sell]
  );

  // Derived weekly-performance figures — computed from the same Firebase
  // payload since the API only exposes daily buy/sell breakdowns.
  const weeklyStats = useMemo(() => {
    const totalBuy = buy.total_count;
    const totalSell = sell.total_count;
    const delivered =
      totalBuy - buy.cancelled_orders + (totalSell - sell.cancelled_orders);
    const pending = buy.cancelled_orders + sell.cancelled_orders; // awaiting action
    const totalRevenue = sell.total_value;

    return [
      {
        icon: ShoppingCart,
        iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        label: "Total Buy Orders",
        value: totalBuy.toLocaleString("en-IN"),
        trend: 12,
        trendLabel: "from last week",
      },
      {
        icon: Package,
        iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
        label: "Total Sell Orders",
        value: totalSell.toLocaleString("en-IN"),
        trend: 8,
        trendLabel: "from last week",
      },
      {
        icon: Clock,
        iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
        label: "Pending Fulfillment",
        value: pending.toLocaleString("en-IN"),
        trend: 4,
        trendLabel: "from last week",
      },
      {
        icon: CheckCircle2,
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        label: "Orders Delivered",
        value: delivered.toLocaleString("en-IN"),
        trend: 24,
        trendLabel: "from last week",
      },
      {
        icon: IndianRupee,
        iconBg: "bg-gradient-to-br from-violet-500 to-indigo-600",
        label: "Total Revenue",
        value: formatINR(totalRevenue),
        trend: 18,
        trendLabel: "from last month",
      },
    ];
  }, [buy, sell]);

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none ring-blue-500/30 placeholder:text-slate-400 focus:ring-2"
            />
          </div>

          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none ring-blue-500/30 focus:ring-2 sm:w-auto"
            />
          </div>
        </div>

        {/* Date row */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(toApiDate(selectedDate))}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Updated 04:40 pm
          </span>
        </div>

        {/* Buy / Sell summary cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SummaryCard
            icon={ShoppingCart}
            iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
            label="Buy Orders"
            labelColor="text-blue-700"
            count={buy.total_count}
            value={buy.total_value}
            gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
          />
          <SummaryCard
            icon={Package}
            iconBg="bg-gradient-to-br from-emerald-500 to-green-700"
            label="Sell Orders"
            labelColor="text-emerald-700"
            count={sell.total_count}
            value={sell.total_value}
            gradient="bg-gradient-to-br from-emerald-50 to-green-50"
          />
        </div>

        {/* Buy Orders Breakdown */}
        <BreakdownSection
          title="Buy Orders Breakdown"
          icon={TrendingDown}
          iconColor="text-blue-500"
          cards={buyBreakdown}
        />

        {/* Sell Orders Breakdown */}
        <BreakdownSection
          title="Sell Orders Breakdown"
          icon={TrendingUp}
          iconColor="text-emerald-500"
          cards={sellBreakdown}
        />

        {/* Weekly Performance */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Weekly Performance</h2>
            {/* <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View report <ArrowRight className="h-4 w-4" />
            </button> */}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {weeklyStats.map((s) => (
              <WeeklyStatCard key={s.label} {...s} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}