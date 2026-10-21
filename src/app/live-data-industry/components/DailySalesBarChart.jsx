"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  Tag,
} from "lucide-react";
import {
  categories,
  getCategoryByCode,
  formatRupeesINR,
  generateDailySalesData,
} from "../utils/categoryUtils";

/**
 * Premium custom tooltip following DACBY color specifications
 */
function DailySalesCustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-2xl border border-[#DCE5F1] bg-white/95 p-4 shadow-[0_16px_36px_rgba(16,36,73,0.14)] backdrop-blur-md min-w-[260px]">
      {/* Header with Date, Category Badge & Units pill */}
      <div className="flex items-start justify-between border-b border-[#DCE5F1]/80 pb-2.5">
        <div>
          <span className="text-xs font-bold text-[#53647F] block">
            {item.fullDate}
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="inline-block text-[10px] font-bold text-[#151D35] bg-[#F2F5FA] border border-[#DCE5F1] px-1.5 py-0.5 rounded">
              {item.categoryName}
            </span>
            {item.categoryCode !== "ALL" && (
              <span className="inline-block text-[10px] font-black font-mono text-[#2A67EC] bg-[#EDF3FF] border border-[#C9DCFF] px-1.5 py-0.5 rounded">
                {item.categoryCode}
              </span>
            )}
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-[#EDF3FF] px-2 py-0.5 text-[11px] font-extrabold text-[#2A67EC] border border-[#C9DCFF]">
          <Layers className="h-3 w-3" />
          {item.units} Units
        </span>
      </div>

      {/* Main KPI: Total Sales in Rupee */}
      <div className="mt-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-[#71809A]">
          {item.categoryName} Turnover
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-black tracking-tight text-[#151D35]">
            ₹{item.totalSales.toFixed(2)}L
          </p>
          <span className="text-xs font-semibold text-[#53647F]">
            ({formatRupeesINR(item.totalSalesRupees)})
          </span>
        </div>
      </div>

      {/* Breakdown: B2C vs B2B */}
      <div className="mt-3.5 space-y-2 border-t border-[#DCE5F1]/80 pt-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-[#53647F]">
            <span className="h-2 w-2 rounded-full bg-[#2A67EC]" />
            B2C Sales
          </span>
          <div className="text-right">
            <span className="font-extrabold text-[#151D35]">
              ₹{item.b2cSales.toFixed(2)}L
            </span>
            <span className="ml-1 text-[11px] font-medium text-[#71809A]">
              ({item.b2cUnits} units)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-[#53647F]">
            <span className="h-2 w-2 rounded-full bg-[#13B89B]" />
            B2B Sales
          </span>
          <div className="text-right">
            <span className="font-extrabold text-[#151D35]">
              ₹{item.b2bSales.toFixed(2)}L
            </span>
            <span className="ml-1 text-[11px] font-medium text-[#71809A]">
              ({item.b2bUnits} units)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailySalesBarChart({ period = "last30", customDates }) {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("ALL");
  const [viewMode, setViewMode] = useState("total"); // "total" | "stacked" | "b2c" | "b2b"

  // Process daily series based on period and selected category code
  const data = useMemo(() => {
    return generateDailySalesData(period, customDates, selectedCategoryCode);
  }, [period, customDates, selectedCategoryCode]);

  const activeCategory = useMemo(() => {
    return getCategoryByCode(selectedCategoryCode);
  }, [selectedCategoryCode]);

  // Aggregate executive statistics
  const summary = useMemo(() => {
    const totalSalesLakhs = data.reduce((acc, cur) => acc + cur.totalSales, 0);
    const totalUnits = data.reduce((acc, cur) => acc + cur.units, 0);
    const avgDailySalesLakhs = data.length > 0 ? totalSalesLakhs / data.length : 0;
    const peakDay = data.reduce(
      (max, cur) => (cur.totalSales > (max?.totalSales || 0) ? cur : max),
      data[0] || null
    );

    return {
      totalSalesLakhs,
      totalSalesCr: (totalSalesLakhs / 100).toFixed(2),
      totalSalesFormatted:
        totalSalesLakhs >= 100
          ? `₹${(totalSalesLakhs / 100).toFixed(2)} Cr`
          : `₹${totalSalesLakhs.toFixed(2)} Lakh`,
      totalUnits,
      avgDailySalesLakhs: avgDailySalesLakhs.toFixed(2),
      peakDay,
    };
  }, [data]);

  // Date range label
  const rangeLabel = useMemo(() => {
    if (period === "today") return "Today";
    if (period === "last30") return "Last 30 Days";
    if (customDates?.start && customDates?.end) {
      return `${customDates.start} to ${customDates.end}`;
    }
    return "Custom Date Range";
  }, [period, customDates]);

  // Determine Y-axis domain & ticks
  const { yDomain, yTicks } = useMemo(() => {
    const maxVal = Math.max(...data.map((d) => d.totalSales), 1);
    if (selectedCategoryCode === "ALL" || maxVal > 35) {
      return {
        yDomain: [0, 50],
        yTicks: [0, 10, 20, 30, 40, 50],
      };
    }
    if (maxVal > 20) {
      return {
        yDomain: [0, 30],
        yTicks: [0, 10, 20, 30],
      };
    }
    if (maxVal > 10) {
      return {
        yDomain: [0, 20],
        yTicks: [0, 5, 10, 15, 20],
      };
    }
    if (maxVal > 5) {
      return {
        yDomain: [0, 10],
        yTicks: [0, 2, 4, 6, 8, 10],
      };
    }
    return {
      yDomain: [0, 5],
      yTicks: [0, 1, 2, 3, 4, 5],
    };
  }, [data, selectedCategoryCode]);

  return (
    <section
      className="relative isolate overflow-hidden rounded-[22px] border text-[#18213b] shadow-[0_12px_34px_rgba(32,68,128,0.11)] backdrop-blur-2xl backdrop-saturate-150 transition duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 p-5 sm:p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.68), rgba(250,252,255,0.42) 48%, rgba(238,246,255,0.30))",
        borderColor: "rgba(255,255,255,0.72)",
      }}
    >
      {/* 1. CHART HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-[#102449] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-xs">
              Daily Revenue Velocity
            </span>
            <span className="rounded-full border border-[#C9DCFF] bg-[#EDF3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#2459C4]">
              {rangeLabel}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#151D35]">
            Sales Velocity by Day
          </h2>
          <p className="mt-1 text-xs font-medium text-[#53647F]">
            Daily turnover in ₹ Lakhs for{" "}
            <strong className="text-[#151D35]">{activeCategory?.name || "All Categories"}</strong>{" "}
            {activeCategory?.code && activeCategory.code !== "ALL" && (
              <span className="font-mono text-[#2A67EC]">({activeCategory.code})</span>
            )}{" "}
            with volume units. Sliced by DACBY category codes.
          </p>
        </div>

        {/* View Mode Controls, Category Dropdown & Summary Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Executive Stats Badges */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#DCE5F1]/90 bg-white/70 px-3 py-1.5 shadow-2xs">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71809A]">
                Turnover
              </span>
              <p className="text-sm font-extrabold text-[#151D35]">
                {summary.totalSalesFormatted}
              </p>
            </div>
            <span className="h-6 w-px bg-[#DCE5F1]" />
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71809A]">
                Daily Avg
              </span>
              <p className="text-sm font-extrabold text-[#2A67EC]">
                ₹{summary.avgDailySalesLakhs}L
              </p>
            </div>
            <span className="h-6 w-px bg-[#DCE5F1]" />
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71809A]">
                Units
              </span>
              <p className="text-sm font-extrabold text-[#157348]">
                {summary.totalUnits.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Category Dropdown with Code */}
          <div className="flex items-center gap-1.5">
            <div className="relative inline-flex items-center">
              <select
                aria-label="Filter sales by category and code"
                value={selectedCategoryCode}
                onChange={(e) => setSelectedCategoryCode(e.target.value)}
                className="appearance-none rounded-xl border border-[#DCE5F1] bg-white pl-3.5 pr-8 py-1.5 text-xs font-bold text-[#151D35] shadow-2xs hover:border-[#C9DCFF] hover:bg-[#F8FAFC] focus:border-[#2A67EC] focus:outline-none transition cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.name} {cat.code !== "ALL" ? `(${cat.code})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-[#53647F]" />
            </div>
          </div>

          {/* Segment Filter Toggle */}
          <div className="inline-flex rounded-xl bg-[#EFF3F8] p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("total")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${viewMode === "total"
                  ? "bg-white text-[#2A67EC] shadow-[0_2px_8px_rgba(32,68,128,0.12)] font-black"
                  : "text-[#71809A] hover:text-[#53647F]"
                }`}
            >
              Total Sales
            </button>
            <button
              type="button"
              onClick={() => setViewMode("stacked")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${viewMode === "stacked"
                  ? "bg-white text-[#2A67EC] shadow-[0_2px_8px_rgba(32,68,128,0.12)] font-black"
                  : "text-[#71809A] hover:text-[#53647F]"
                }`}
            >
              Stacked (B2C + B2B)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("b2c")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${viewMode === "b2c"
                  ? "bg-white text-[#2A67EC] shadow-[0_2px_8px_rgba(32,68,128,0.12)] font-black"
                  : "text-[#71809A] hover:text-[#53647F]"
                }`}
            >
              B2C Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode("b2b")}
              className={`rounded-lg px-3 py-1.5 transition cursor-pointer ${viewMode === "b2b"
                  ? "bg-white text-[#13B89B] shadow-[0_2px_8px_rgba(19,184,155,0.22)] font-black"
                  : "text-[#71809A] hover:text-[#53647F]"
                }`}
            >
              B2B Only
            </button>
          </div>
        </div>
      </div>

      {/* 2. BAR GRAPH */}
      <div className="mt-6">
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 16, right: 12, left: -4, bottom: 8 }}
              barGap={2}
            >
              {/* Gradients */}
              <defs>
                {/* Total Sales Gradient */}
                <linearGradient id="dacbyBlueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A67EC" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#3D55D9" stopOpacity={0.78} />
                </linearGradient>

                {/* B2C Sales Gradient */}
                <linearGradient id="dacbyB2CGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2A67EC" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#4D7EE8" stopOpacity={0.75} />
                </linearGradient>

                {/* B2B Sales Gradient (Teal/Cyan) */}
                <linearGradient id="dacbyB2BGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#13B89B" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#0D917F" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <CartesianGrid
                vertical={false}
                stroke="#DCE5F1"
                strokeDasharray="3 4"
                opacity={0.8}
              />

              {/* X Axis: Days */}
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: "#DCE5F1" }}
                minTickGap={18}
                interval={Math.max(0, Math.floor(data.length / 14))}
                tick={{ fill: "#53647F", fontSize: 11, fontWeight: 600 }}
              />

              {/* Y Axis: Rupee scale */}
              <YAxis
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={(val) => (val === 0 ? "₹0" : `₹${val}L`)}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#53647F", fontSize: 11, fontWeight: 700 }}
              />

              {/* Tooltip on hover */}
              <Tooltip
                cursor={{ fill: "rgba(42, 103, 236, 0.05)", radius: 6 }}
                content={<DailySalesCustomTooltip />}
              />

              {/* Bars rendering depending on view mode */}
              {viewMode === "total" && (
                <Bar
                  dataKey="totalSales"
                  name="Total Sales"
                  fill="url(#dacbyBlueGrad)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={28}
                />
              )}

              {viewMode === "stacked" && (
                <>
                  <Bar
                    dataKey="b2cSales"
                    name="B2C Sales"
                    stackId="salesStack"
                    fill="url(#dacbyB2CGrad)"
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="b2bSales"
                    name="B2B Sales"
                    stackId="salesStack"
                    fill="url(#dacbyB2BGrad)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                </>
              )}

              {viewMode === "b2c" && (
                <Bar
                  dataKey="b2cSales"
                  name="B2C Sales"
                  fill="url(#dacbyB2CGrad)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={28}
                />
              )}

              {viewMode === "b2b" && (
                <Bar
                  dataKey="b2bSales"
                  name="B2B Sales"
                  fill="url(#dacbyB2BGrad)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={28}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. CHART FOOTER / LEGEND & PEAK NOTIFICATION */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCE5F1]/80 pt-3 text-xs">
          {/* Legend Items */}
          <div className="flex items-center gap-5">
            {viewMode === "stacked" ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#2A67EC]" />
                  <span className="font-bold text-[#53647F]">
                    {activeCategory.name} (B2C)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#13B89B]" />
                  <span className="font-bold text-[#53647F]">
                    {activeCategory.name} (B2B)
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-sm ${viewMode === "b2b" ? "bg-[#13B89B]" : "bg-[#2A67EC]"
                    }`}
                />
                <span className="font-bold text-[#53647F]">
                  {activeCategory.name}{" "}
                  {activeCategory.code !== "ALL" ? `(${activeCategory.code})` : ""} ·{" "}
                  {viewMode === "b2b"
                    ? "B2B Turnover (₹ Lakh)"
                    : viewMode === "b2c"
                      ? "B2C Turnover (₹ Lakh)"
                      : "Gross Daily Turnover (₹ Lakh)"}
                </span>
              </div>
            )}
          </div>

          {/* Peak day indicator */}
          {summary.peakDay && (
            <div className="flex items-center gap-1.5 text-xs text-[#53647F]">
              <Sparkles className="h-3.5 w-3.5 text-[#2A67EC]" />
              <span>
                Peak Record Day:{" "}
                <strong className="text-[#151D35]">
                  {summary.peakDay.day}
                </strong>{" "}
                at{" "}
                <strong className="text-[#157348]">
                  ₹{summary.peakDay.totalSales.toFixed(2)}L
                </strong>{" "}
                ({summary.peakDay.units} units)
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
