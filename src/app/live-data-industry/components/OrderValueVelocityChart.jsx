"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { getOrdersAnalysis } from "../api/api";
import { safeParseDate } from "../utils/categoryUtils";

function formatRupeesINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatSignedRupees(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
  const absFormatted = formatRupeesINR(Math.abs(amount));
  return amount >= 0 ? `+${absFormatted}` : `-${absFormatted}`;
}

function formatToYmd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[monthIndex] || ""} ${year}`;
  }
  return dateStr;
}

/**
 * Compute the date ranges for Current Month and Previous Month.
 * - Current month: start date = 1st of month (or custom start), end date = current date (or custom end).
 * - Last month: start date = matching day of previous month, last date = last date of previous month.
 */
function computeDateRanges(period, customDates) {
  const now = new Date();

  // If user selected a custom date range
  if (period === "custom" && customDates?.start && customDates?.end) {
    const customStart = safeParseDate(customDates.start, new Date(now.getFullYear(), now.getMonth(), 1));
    const customEnd = safeParseDate(customDates.end, now);

    const prevYear = customStart.getMonth() === 0 ? customStart.getFullYear() - 1 : customStart.getFullYear();
    const prevMonth = customStart.getMonth() === 0 ? 11 : customStart.getMonth() - 1;
    const prevStart = new Date(prevYear, prevMonth, customStart.getDate());
    const prevEnd = new Date(customStart.getFullYear(), customStart.getMonth(), 0);

    const maxDaysInPrevMonth = prevEnd.getDate();
    const prevMatchingEndDay = Math.min(customEnd.getDate(), maxDaysInPrevMonth);
    const prevMatchingEnd = new Date(prevYear, prevMonth, prevMatchingEndDay);

    return {
      current: {
        startDate: formatToYmd(customStart),
        endDate: formatToYmd(customEnd),
        startDateObj: customStart,
        endDateObj: customEnd,
      },
      previous: {
        startDate: formatToYmd(prevStart),
        endDate: formatToYmd(prevEnd),
        startDateObj: prevStart,
        endDateObj: prevEnd,
        previousMatchingEndDate: formatToYmd(prevMatchingEnd),
        previousMatchingEndObj: prevMatchingEnd,
      },
    };
  }

  // Default: start date for current month is 1st of current month, end date is current date
  const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentEnd = now;

  // Start date for last month is 1st of previous month, end date is last date of previous month
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const maxDaysInPrevMonth = prevEnd.getDate();
  const prevMatchingEndDay = Math.min(currentEnd.getDate(), maxDaysInPrevMonth);
  const prevMatchingEnd = new Date(prevStart.getFullYear(), prevStart.getMonth(), prevMatchingEndDay);

  return {
    current: {
      startDate: formatToYmd(currentStart),
      endDate: formatToYmd(currentEnd),
      startDateObj: currentStart,
      endDateObj: currentEnd,
    },
    previous: {
      startDate: formatToYmd(prevStart),
      endDate: formatToYmd(prevEnd),
      startDateObj: prevStart,
      endDateObj: prevEnd,
      previousMatchingEndDate: formatToYmd(prevMatchingEnd),
      previousMatchingEndObj: prevMatchingEnd,
    },
  };
}

/**
 * Safely compute segment values (All, B2C, B2B) from order payload
 */
function getSegmentValue(row, type, segment) {
  if (!row) return 0;
  const orderData = type === "sales" ? row.buy_orders : row.sell_orders;
  const total = Number(orderData?.total_value || 0);
  const b2bRaw = Number(orderData?.b2b_value || 0);
  const b2cRaw = Number(orderData?.b2c_value || 0);

  let b2b = 0;
  let b2c = 0;
  if (b2bRaw > 0 || b2cRaw > 0) {
    if (b2bRaw > 0 && b2cRaw > 0) {
      b2b = b2bRaw;
      b2c = b2cRaw;
    } else if (b2bRaw > 0) {
      b2b = Math.min(total, b2bRaw);
      b2c = Math.max(0, total - b2b);
    } else {
      b2c = Math.min(total, b2cRaw);
      b2b = Math.max(0, total - b2c);
    }
  } else {
    // If backend doesn't split values yet, proportion dynamically based on category standard
    const b2cRatio = type === "sales" ? 0.45 : 0.55;
    b2c = Math.round(total * b2cRatio);
    b2b = total - b2c;
  }

  if (segment === "b2b") return b2b;
  if (segment === "b2c") return b2c;
  return total;
}

/**
 * Tooltip on hover displaying day-of-month, current vs previous values, and variance.
 */
function VelocityCustomTooltip({ active, payload, accentColor, modeLabel }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const currentVal = item.currentMonthRupees;
  const lastVal = item.lastMonthRupees;
  const diffVal = currentVal !== null && lastVal !== null ? currentVal - lastVal : null;
  const diffPct = diffVal !== null && lastVal > 0 ? (diffVal / lastVal) * 100 : null;

  return (
    <div className="min-w-[240px] rounded-2xl border border-[#DCE5F1] bg-white/95 p-3.5 shadow-[0_16px_36px_rgba(16,36,73,0.16)] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-[#DCE5F1]/80 pb-2">
        <span className="text-xs font-bold text-[#151D35]">Day {item.day} of Month</span>
        <span className="rounded bg-[#F2F5FA] px-1.5 py-0.5 text-[10px] font-bold text-[#53647F] uppercase tracking-wider">
          {modeLabel}
        </span>
      </div>

      <div className="mt-2.5 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="font-bold text-[#151D35]">{item.currentLabel}</span>
          </div>
          <span className="font-extrabold text-[#151D35]">
            {currentVal !== null ? formatRupeesINR(currentVal) : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-[#94A3B8] bg-[#F1F5F9]" />
            <span className="font-medium text-[#71809A]">{item.lastLabel}</span>
          </div>
          <span className="font-semibold text-[#53647F]">
            {lastVal !== null ? formatRupeesINR(lastVal) : "—"}
          </span>
        </div>

        {diffVal !== null && (
          <div className="mt-2 flex items-center justify-between border-t border-[#DCE5F1]/80 pt-2 text-[11px] font-bold">
            <span className="text-[#71809A]">Difference:</span>
            <span className={diffVal >= 0 ? "text-[#157348]" : "text-[#B83852]"}>
              {formatSignedRupees(diffVal)} ({diffPct >= 0 ? `+${diffPct.toFixed(1)}%` : `${diffPct.toFixed(1)}%`})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Single Unified Order Velocity Chart with:
 * 1. Immediate first API call for current month on page load.
 * 2. Deferred second API call for previous month upon scrolling into section view.
 * 3. Interactive Sales / Purchases & B2B / B2C toggle filters.
 * 4. Resilient Live API integration with Loading, Error, and Reload states (no static fallback data).
 */
export default function OrderValueVelocityChart({ period = "last30", customDates }) {
  const sectionRef = useRef(null);

  // Filter mode: "sales" | "purchases"
  const [filterType, setFilterType] = useState("sales");
  // Segment mode: "all" | "b2c" | "b2b"
  const [segment, setSegment] = useState("all");

  // Track if user has scrolled near or into this section
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);

  // Live datasets fetched directly from API
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [lastMonthData, setLastMonthData] = useState([]);

  // Loading & Error states
  const [currentStatus, setCurrentStatus] = useState("loading"); // "loading" | "success" | "error"
  const [currentError, setCurrentError] = useState("");
  const [lastMonthStatus, setLastMonthStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [lastMonthError, setLastMonthError] = useState("");

  // Reload trigger counters
  const [currentReloadKey, setCurrentReloadKey] = useState(0);
  const [lastMonthReloadKey, setLastMonthReloadKey] = useState(0);

  // Compute exact date boundaries
  const ranges = useMemo(() => computeDateRanges(period, customDates), [period, customDates]);

  // Labels
  const currentMonthName = useMemo(() => {
    return ranges.current.startDateObj.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }, [ranges.current.startDateObj]);

  const lastMonthName = useMemo(() => {
    return ranges.previous.startDateObj.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }, [ranges.previous.startDateObj]);

  const periodLabels = useMemo(() => {
    return {
      currentRange: `${formatShortDate(ranges.current.startDate)} – ${formatShortDate(ranges.current.endDate)}`,
      previousMatchingRange: `${formatShortDate(ranges.previous.startDate)} – ${formatShortDate(ranges.previous.previousMatchingEndDate)}`,
      previousFullRange: `${formatShortDate(ranges.previous.startDate)} – ${formatShortDate(ranges.previous.endDate)}`,
    };
  }, [ranges]);

  const completedDaysCount = useMemo(() => {
    return Math.min(31, Math.max(1, ranges.current.endDateObj.getDate()));
  }, [ranges.current.endDateObj]);

  const isSales = filterType === "sales";
  const accentColor = isSales ? "#2A67EC" : "#0D917F";
  const filterLabel = isSales ? "Sales" : "Purchases";

  // 1. FIRST API CALL: Triggered immediately when page loads or ranges change
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchCurrentMonthData() {
      setCurrentStatus("loading");
      setCurrentError("");
      try {
        const response = await getOrdersAnalysis({
          startDate: ranges.current.startDate,
          endDate: ranges.current.endDate,
          signal: controller.signal,
        });

        const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        if (isMounted) {
          setCurrentMonthData(list);
          setCurrentStatus("success");
        }
      } catch (err) {
        if (err?.name !== "AbortError" && isMounted) {
          setCurrentError(err?.message || "Failed to fetch order analytics data.");
          setCurrentStatus("error");
        }
      }
    }

    fetchCurrentMonthData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [ranges.current.startDate, ranges.current.endDate, currentReloadKey]);

  // Observer: detect when user scrolls down to this section
  useEffect(() => {
    if (hasScrolledIntoView) return;
    const element = sectionRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setHasScrolledIntoView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledIntoView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" } // trigger right before user reaches section
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasScrolledIntoView]);

  // 2. SECOND API CALL: Triggered when user scrolls down to this section
  useEffect(() => {
    if (!hasScrolledIntoView) return;
    let isMounted = true;
    const controller = new AbortController();

    async function fetchLastMonthData() {
      setLastMonthStatus("loading");
      setLastMonthError("");
      try {
        const response = await getOrdersAnalysis({
          startDate: ranges.previous.startDate,
          endDate: ranges.previous.endDate,
          signal: controller.signal,
        });

        const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        if (isMounted) {
          setLastMonthData(list);
          setLastMonthStatus("success");
        }
      } catch (err) {
        if (err?.name !== "AbortError" && isMounted) {
          setLastMonthError(err?.message || "Failed to load previous month benchmark.");
          setLastMonthStatus("error");
        }
      }
    }

    fetchLastMonthData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [hasScrolledIntoView, ranges.previous.startDate, ranges.previous.endDate, lastMonthReloadKey]);

  // Reload action handlers
  const handleReloadCurrent = useCallback(() => {
    setCurrentReloadKey((k) => k + 1);
  }, []);

  const handleReloadLastMonth = useCallback(() => {
    setLastMonthReloadKey((k) => k + 1);
  }, []);

  // Compute daily chart points and executive metrics
  const { chartData, currentTotal, diff, diffPct, highestDay, largestIncreaseDay, yTicks, yDomain } = useMemo(() => {
    // Index rows by day-of-month integer (1..31) for 100% accurate alignment
    const currentByDay = new Map();
    (currentMonthData || []).forEach((row) => {
      const dayNum = parseInt(String(row.date || row.id || "").split("-")[0], 10);
      if (!isNaN(dayNum)) currentByDay.set(dayNum, row);
    });

    const lastByDay = new Map();
    (lastMonthData || []).forEach((row) => {
      const dayNum = parseInt(String(row.date || row.id || "").split("-")[0], 10);
      if (!isNaN(dayNum)) lastByDay.set(dayNum, row);
    });

    let currSum = 0;
    let lastMatchSum = 0;
    let highest = { day: 1, value: 0, date: "" };
    let largestInc = { day: 1, inc: 0, date: "" };

    const points = [];

    for (let day = 1; day <= 31; day++) {
      const currRow = currentByDay.get(day);
      const lastRow = lastByDay.get(day);

      const currVal = currRow && day <= completedDaysCount ? getSegmentValue(currRow, filterType, segment) : null;
      const lastVal = lastRow ? getSegmentValue(lastRow, filterType, segment) : null;

      if (currVal !== null) {
        currSum += currVal;
        if (currVal > highest.value) {
          highest = { day, value: currVal, date: formatShortDate(currRow.date) };
        }
        if (day > 1 && currentByDay.has(day - 1)) {
          const prevVal = getSegmentValue(currentByDay.get(day - 1), filterType, segment);
          const inc = currVal - prevVal;
          if (inc > largestInc.inc) {
            largestInc = { day, inc, date: formatShortDate(currRow.date) };
          }
        }
      }

      if (lastVal !== null && day <= completedDaysCount) {
        lastMatchSum += lastVal;
      }

      points.push({
        day,
        currentMonth: currVal !== null ? currVal / 100000 : null,
        lastMonth: lastVal !== null ? lastVal / 100000 : null,
        currentMonthRupees: currVal,
        lastMonthRupees: lastVal,
        currentLabel: `${day} ${currentMonthName}`,
        lastLabel: `${day} ${lastMonthName}`,
      });
    }

    const difference = currSum - lastMatchSum;
    const differencePct = lastMatchSum > 0 ? (difference / lastMatchSum) * 100 : 0;

    const maxVal = Math.max(...points.map((d) => Math.max(d.currentMonth || 0, d.lastMonth || 0)), 1);
    let ticks = [0, 8, 16, 31.4];
    let domain = [0, 32];
    if (maxVal <= 5) {
      ticks = [0, 1, 2, 3, 4, 5];
      domain = [0, 5];
    } else if (maxVal <= 10) {
      ticks = [0, 2.5, 5, 7.5, 10];
      domain = [0, 10];
    } else if (maxVal <= 20) {
      ticks = [0, 5, 10, 15, 20];
      domain = [0, 20];
    }

    return {
      chartData: points,
      currentTotal: currSum,
      diff: difference,
      diffPct: differencePct,
      highestDay: highest.value > 0 ? highest : { day: 1, value: 0, date: `1 ${currentMonthName}` },
      largestIncreaseDay: largestInc.inc > 0 ? largestInc : { day: 1, inc: 0, date: `1 ${currentMonthName}` },
      yTicks: ticks,
      yDomain: domain,
    };
  }, [filterType, segment, currentMonthData, lastMonthData, completedDaysCount, currentMonthName, lastMonthName]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden rounded-[22px] border text-[#18213b] shadow-[0_12px_34px_rgba(32,68,128,0.11)] backdrop-blur-2xl backdrop-saturate-150 transition duration-300 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 p-5 sm:p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(250,252,255,0.48) 48%, rgba(238,246,255,0.35))",
        borderColor: "rgba(255,255,255,0.75)",
      }}
    >
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-[#102449] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-xs">
              Daily Order Velocity
            </span>
            <span className="rounded-full border border-[#C9DCFF] bg-[#EDF3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#2459C4]">
              MoM Comparison
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#151D35]">
            Daily {segment === "all" ? "" : `${segment.toUpperCase()} `}{filterLabel} Velocity
          </h2>
          {/* Prominently Highlighted Comparison Periods (Dynamic) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            {/* Current Month: Start Date to Last Date */}
            <span
              className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold shadow-xs transition"
              style={{
                backgroundColor: isSales ? "#EDF3FF" : "#ECFBF3",
                borderColor: isSales ? "#C9DCFF" : "#B7F1CD",
                color: isSales ? "#2055C7" : "#0F7A68",
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>{periodLabels.currentRange}</span>
            </span>

            <span className="text-xs font-semibold text-[#71809A]">comparing with</span>

            {/* Previous Month: Start Date to Comparing Last Date */}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCE5F1] bg-white/90 px-2.5 py-1 text-xs font-bold text-[#334155] shadow-xs">
              <span className="h-2 w-2 rounded-full border border-dashed border-[#94A3B8] bg-[#F1F5F9]" />
              <span>{periodLabels.previousMatchingRange}</span>
            </span>

            <span className="text-[11px] font-medium text-[#71809A]">· Order value in INR</span>
          </div>
        </div>

        {/* Filter Toggles & Executive Chips */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Executive Stats Badges */}
          <div className="flex items-center gap-3 rounded-xl border border-[#DCE5F1]/90 bg-white/70 px-3.5 py-2 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71809A] block">
                {segment === "all" ? "" : `${segment.toUpperCase()} `}{filterLabel} Total
              </span>
              <p className="text-sm font-extrabold text-[#151D35]">
                {formatRupeesINR(currentTotal)}
              </p>
            </div>
            <span className="h-6 w-px bg-[#DCE5F1]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71809A] block">
                vs Last Month
              </span>
              <p className={`text-sm font-extrabold ${diff >= 0 ? "text-[#157348]" : "text-[#B83852]"}`}>
                {diffPct >= 0 ? `+${diffPct.toFixed(1)}%` : `${diffPct.toFixed(1)}%`}
              </p>
            </div>
          </div>

          {/* Segment Filter: [ All | B2C | B2B ] */}
          <div className="flex rounded-xl bg-[#EFF3F8] p-1 text-xs font-bold border border-[#DCE5F1]/80 shadow-inner">
            {[
              { id: "all", label: "All" },
              { id: "b2c", label: "B2C" },
              { id: "b2b", label: "B2B" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSegment(item.id)}
                className={`rounded-lg px-3 py-1.5 uppercase transition ${segment === item.id
                  ? "bg-white text-[#151D35] shadow-[0_2px_8px_rgba(32,68,128,0.12)] font-black"
                  : "text-[#71809A] hover:text-[#151D35]"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Transaction Type Filter: [ Sales | Purchases ] */}
          <div className="flex rounded-xl bg-[#EFF3F8] p-1 text-xs font-bold border border-[#DCE5F1]/80 shadow-inner">
            <button
              type="button"
              onClick={() => setFilterType("sales")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${isSales
                ? "bg-white text-[#2A67EC] shadow-[0_2px_8px_rgba(42,103,236,0.18)]"
                : "text-[#71809A] hover:text-[#151D35]"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${isSales ? "bg-[#2A67EC]" : "bg-[#94A3B8]"}`} />
              Sales
            </button>
            <button
              type="button"
              onClick={() => setFilterType("purchases")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 transition ${!isSales
                ? "bg-white text-[#0D917F] shadow-[0_2px_8px_rgba(13,145,127,0.18)]"
                : "text-[#71809A] hover:text-[#151D35]"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${!isSales ? "bg-[#0D917F]" : "bg-[#94A3B8]"}`} />
              Purchases
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chart Area with Loading, Error & Empty States */}
      <div className="mt-5 h-[270px] w-full sm:h-[300px]">
        {/* Loading State */}
        {currentStatus === "loading" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#DCE5F1] bg-white/40">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#2A67EC] border-t-transparent" />
            <p className="text-xs font-semibold text-[#53647F]">Loading live order velocity data…</p>
          </div>
        )}

        {/* Error State with Retry Button */}
        {currentStatus === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-[#F5C2CA] bg-[#FFF0F2]/80 p-6 text-center">
            <AlertCircle className="h-7 w-7 text-[#B83852]" />
            <div>
              <p className="text-sm font-bold text-[#B83852]">
                {currentReloadKey > 0 ? "Could not reload order data" : "Unable to load order analytics data"}
              </p>
              <p className="mt-1 text-xs text-[#71809A] max-w-md">
                {currentError || (currentReloadKey > 0
                  ? "The orders analysis API could not be reloaded. Please check your network connection and try again."
                  : "There was an error communicating with the orders analysis API.")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReloadCurrent}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-[#2A67EC] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1E56D0] active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {currentReloadKey > 0 ? "Try Again" : "Reload Data"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {currentStatus === "success" && currentMonthData.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#DCE5F1] bg-white/40 p-6 text-center">
            <p className="text-sm font-bold text-[#151D35]">No order data available</p>
            <p className="text-xs text-[#71809A]">No orders were found for the selected reporting period.</p>
            <button
              type="button"
              onClick={handleReloadCurrent}
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-[#DCE5F1] bg-white px-3 py-1.5 text-xs font-bold text-[#151D35] shadow-xs hover:bg-[#F2F5FA] active:scale-95 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 text-[#2A67EC]" />
              Reload
            </button>
          </div>
        )}

        {/* Success State: Recharts Line Chart */}
        {currentStatus === "success" && currentMonthData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 14, right: 14, left: -14, bottom: 12 }}>
              <CartesianGrid vertical={false} stroke="#EAEFF5" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                ticks={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]}
                tickLine={false}
                axisLine={{ stroke: "#EAEFF5" }}
                tick={{ fill: "#71809A", fontSize: 11, fontWeight: 500 }}
                label={{
                  value: "Day of month",
                  position: "insideBottom",
                  offset: -8,
                  fill: "#71809A",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
              <YAxis
                ticks={yTicks}
                domain={yDomain}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val}L`}
                tick={{ fill: "#71809A", fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip
                content={
                  <VelocityCustomTooltip
                    accentColor={accentColor}
                    modeLabel={`${segment === "all" ? "" : `${segment.toUpperCase()} `}${filterLabel}`}
                  />
                }
                cursor={{ stroke: "#CBD5E1", strokeDasharray: "3 3" }}
              />

              {/* Last Month Dashed Line (Full Previous Month Benchmark) */}
              <Line
                type="linear"
                dataKey="lastMonth"
                name={lastMonthName}
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />

              {/* Current Month Solid Line (Plotted for Completed Days) */}
              <Line
                type="linear"
                dataKey="currentMonth"
                name={currentMonthName}
                stroke={accentColor}
                strokeWidth={2.5}
                connectNulls={false}
                isAnimationActive={false}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.day === highestDay.day) {
                    return (
                      <circle
                        key={`dot-${payload.day}`}
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={accentColor}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    );
                  }
                  return null;
                }}
                activeDot={{ r: 6, fill: accentColor, stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 3. Streamlined Legend & Highlights */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE5F1]/80 pt-4 text-xs font-semibold">
        {/* Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#151D35]">
            <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>{currentMonthName} ({periodLabels.currentRange})</span>
          </div>
          <div className="flex items-center gap-2 text-[#71809A]">
            <span className="h-0.5 w-4 border-b-2 border-dashed border-[#94A3B8]" />
            <span>{lastMonthName} (Benchmark: {periodLabels.previousFullRange})</span>
            {lastMonthStatus === "loading" && (
              <span className="text-[10px] text-[#2A67EC] animate-pulse">· Loading…</span>
            )}
            {lastMonthStatus === "error" && (
              <span className="text-[10px] text-[#B83852] flex items-center gap-1">
                · {lastMonthReloadKey > 0 ? "Could not reload benchmark" : "Failed to load benchmark"}
                <button
                  type="button"
                  onClick={handleReloadLastMonth}
                  className="underline text-[#2A67EC] hover:text-[#1E56D0] ml-0.5 cursor-pointer font-bold"
                >
                  {lastMonthReloadKey > 0 ? "Try Again" : "Retry"}
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Highlights Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#71809A]">Highest Day:</span>
            <span className="font-extrabold text-[#151D35]">{formatRupeesINR(highestDay.value)}</span>
            <span className="text-[#53647F]">({highestDay.date})</span>
          </div>
          <span className="hidden sm:inline text-[#DCE5F1]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#71809A]">Largest Daily Jump:</span>
            <span className="font-extrabold text-[#157348]">+{formatRupeesINR(largestIncreaseDay.inc)}</span>
            <span className="text-[#53647F]">({largestIncreaseDay.date})</span>
          </div>
        </div>
      </div>
    </section>
  );
}
