"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
  Truck,
  Warehouse,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "motion/react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldAtlas from "world-atlas/countries-110m.json";

const trendData = [
  { day: "15 Sep", b2c: 4.6, b2b: 6.0, purchase: 6.2 },
  { day: "17 Sep", b2c: 3.5, b2b: 6.3, purchase: 7.1 },
  { day: "19 Sep", b2c: 4.1, b2b: 7.5, purchase: 8.4 },
  { day: "22 Sep", b2c: 3.7, b2b: 7.2, purchase: 7.4 },
  { day: "24 Sep", b2c: 4.4, b2b: 7.9, purchase: 7.8 },
  { day: "27 Sep", b2c: 5.1, b2b: 7.4, purchase: 6.8 },
  { day: "29 Sep", b2c: 4.8, b2b: 5.3, purchase: 5.6 },
  { day: "1 Oct", b2c: 3.8, b2b: 5.5, purchase: 6.4 },
  { day: "4 Oct", b2c: 4.3, b2b: 7.2, purchase: 6.9 },
  { day: "6 Oct", b2c: 4.0, b2b: 6.1, purchase: 6.5 },
  { day: "9 Oct", b2c: 3.4, b2b: 7.5, purchase: 5.9 },
  { day: "11 Oct", b2c: 5.0, b2b: 8.2, purchase: 8.3 },
  { day: "14 Oct", b2c: 4.8, b2b: 7.0, purchase: 7.4 },
];

const overviewTrendData = trendData.map((point, index) => ({
  day: point.day,
  salesB2C: point.b2c,
  salesB2B: point.b2b,
  purchasesB2C: point.purchase,
  purchasesB2B: [2.0, 2.0, 2.5, 2.1, 2.7, 2.8, 2.5, 2.4, 3.5, 3.2, 4.0, 4.8, 4.5][index],
}));

const b2cProducts = [
  ["iPhone 13, 128 GB", 18],
  ["Samsung S21 FE", 14],
  ["OnePlus 9R", 11],
  ["iPhone 12, 64 GB", 9],
  ["Redmi Note 11 Pro", 7],
  ["Pixel 6a", 6],
  ["Realme GT Neo 2", 5],
];
const b2cCities = [
  ["Delhi", 24],
  ["Bengaluru", 16],
  ["Mumbai", 13],
  ["Hyderabad", 10],
  ["Pune", 8],
  ["Jaipur", 6],
  ["Chandigarh", 5],
];
const b2bProducts = [
  ["iPhone 12, 64 GB", 23],
  ["iPhone 11, 64 GB", 17],
  ["Samsung A52", 12],
  ["Redmi Note 10", 9],
  ["OnePlus Nord", 8],
  ["Realme 8 Pro", 6],
  ["Vivo V21", 4],
];
const purchaseProducts = [
  ["iPhone 13, 128 GB", 20],
  ["Samsung S21 FE", 15],
  ["iPhone 12, 64 GB", 12],
  ["OnePlus 9R", 9],
  ["Redmi Note 11 Pro", 7],
  ["Pixel 6a", 6],
  ["Realme GT Neo 2", 4],
];
const purchaseCities = [
  ["Delhi", 26],
  ["Noida", 15],
  ["Gurugram", 12],
  ["Jaipur", 10],
  ["Chandigarh", 8],
  ["Lucknow", 6],
  ["Ghaziabad", 5],
];

const cityCoordinates = {
  Delhi: [77.1025, 28.7041],
  Bengaluru: [77.5946, 12.9716],
  Mumbai: [72.8777, 19.076],
  Hyderabad: [78.4867, 17.385],
  Pune: [73.8567, 18.5204],
  Jaipur: [75.7873, 26.9124],
  Chandigarh: [76.7794, 30.7333],
  Noida: [77.391, 28.5355],
  Gurugram: [77.0266, 28.4595],
  Lucknow: [80.9462, 26.8467],
  Ghaziabad: [77.4538, 28.6692],
};

function Card({ children, className = "" }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    let revealFrame;
    let barsFrame;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        revealFrame = requestAnimationFrame(() => {
          barsFrame = requestAnimationFrame(() => setBarsVisible(true));
        });
        observer.unobserve(entry.target);
      },
      { threshold: 0.12, rootMargin: "0px 0px -28px" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(revealFrame);
      cancelAnimationFrame(barsFrame);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`ios-glass-card relative isolate rounded-[22px] text-[#18213b] transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:opacity-100 [&_.text-slate-400]:text-[12px] [&_.text-slate-400]:font-medium [&_.text-slate-400]:text-[#71809a] [&_.text-slate-500]:text-[13px] [&_.text-slate-500]:text-[#5c6b85] ${isVisible ? "dashboard-card-visible animate-[cardReveal_600ms_cubic-bezier(.22,1,.36,1)_both]" : "translate-y-5 opacity-0"} ${barsVisible ? "dashboard-bars-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Sparkline({ color = "#377dff" }) {
  const data = [28, 35, 31, 39, 34, 43, 38, 47, 42, 52, 46, 56, 51, 63].map(
    (value, index) => ({ index, value }),
  );
  return (
    <div className="mt-4 h-9 w-full opacity-90">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`spark-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.24} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#spark-${color.slice(1)})`}
            isAnimationActive
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MotionBar({ percent, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      style={{ width: `${percent}%`, transformOrigin: "left center" }}
      initial={{ scaleX: 0, opacity: 0.55 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.25, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
function Title({ children, tag, id }) {
  const [salesPeriod, setSalesPeriod] = useState("Last 30 days");
  const displayTag = tag;

  useEffect(() => {
    if (id !== "overview") return undefined;

    const targets = {
      Overview: () => document.getElementById("overview"),
      "B2C sales": () =>
        [...document.querySelectorAll("h2")].filter(
          (heading) => heading.textContent === "Sales",
        )[0],
      "B2B sales": () =>
        [...document.querySelectorAll("h2")].filter(
          (heading) => heading.textContent === "Sales",
        )[1],
      "B2C purchase": () =>
        [...document.querySelectorAll("h2")].filter(
          (heading) => heading.textContent === "Purchase",
        )[0],
      "B2B purchase": () =>
        [...document.querySelectorAll("h2")].filter(
          (heading) => heading.textContent === "Purchase",
        )[1],
      Inventory: () =>
        [...document.querySelectorAll("h2")].find(
          (heading) => heading.textContent === "Inventory",
        ),
      Returns: () =>
        [...document.querySelectorAll("h2")].find(
          (heading) => heading.textContent === "Returns",
        ),
    };

    const handleTabClick = (event) => {
      const button = event.target.closest("nav button");
      const target = button && targets[button.textContent]?.();
      if (!target) return;

      event.stopPropagation();
      document.querySelectorAll("nav button").forEach((item) => {
        item.classList.remove("border-[#242b5c]", "text-[#242b5c]");
        item.classList.add("border-transparent", "text-slate-500");
      });
      button.classList.remove("border-transparent", "text-slate-500");
      button.classList.add("border-[#242b5c]", "text-[#242b5c]");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    document.addEventListener("click", handleTabClick, true);
    return () => document.removeEventListener("click", handleTabClick, true);
  }, [id]);

  return (
    <div id={id} className="flex scroll-mt-24 items-center gap-2">
      <h2 className="text-lg font-bold tracking-[-0.025em] text-[#151c34]">
        {children}
      </h2>
      {displayTag && (
        <span className="rounded-full bg-[#e8efff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#344567]">
          {displayTag}
        </span>
      )}
      {((children === "Sales" && (tag === "B2C" || tag === "B2B")) ||
        (children === "Purchase" && tag === "B2C")) && (
        <label className="relative ml-1">
          <span className="sr-only">{tag} sales period</span>
          <select
            value={salesPeriod}
            onChange={(event) => {
              const nextPeriod = event.target.value;
              setSalesPeriod(nextPeriod);
              window.dispatchEvent(
                new CustomEvent(
                  children === "Purchase"
                    ? "b2c-purchase-period"
                    : tag === "B2B"
                      ? "b2b-sales-period"
                      : "b2c-sales-period",
                  { detail: nextPeriod },
                ),
              );
            }}
            className="appearance-none rounded-lg border border-[#dbe4f1] bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-[#43527b] shadow-[0_2px_5px_rgba(30,42,75,0.04)] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100"
          >
            <option>Today</option>
            <option>Last 30 days</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#61718c]">
            ⌄
          </span>
        </label>
      )}
    </div>
  );
}
function Metric({
  label,
  value,
  suffix,
  detail,
  icon: Icon,
  accent = "blue",
  scope,
}) {
  const [b2cSalesPeriod, setB2cSalesPeriod] = useState("Last 30 days");
  const [b2bSalesPeriod, setB2bSalesPeriod] = useState("Last 30 days");
  const [b2cPurchasePeriod, setB2cPurchasePeriod] = useState("Last 30 days");
  const accents = {
    blue: "bg-[#eff2fc] text-[#242b5c]",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  const b2cMetrics = {
    "Sales-₹4.82L": {
      Today: { value: "₹4.82L", suffix: "today", detail: "186 units" },
      "Last 30 days": {
        value: "₹1.28Cr",
        suffix: "last 30 days",
        detail: "5,412 units",
      },
    },
    "Total orders-172": {
      Today: { value: "172", suffix: "today", detail: "₹4.82L" },
      "Last 30 days": {
        value: "4,980",
        suffix: "last 30 days",
        detail: "₹1.28Cr",
      },
    },
    "Cancelled orders-₹21K": {
      Today: { value: "₹21K", suffix: "today", detail: "9 units" },
      "Last 30 days": {
        value: "₹6.4L",
        suffix: "last 30 days",
        detail: "281 units",
      },
    },
  };
  const metricKey = `${label}-${value}`;
  const b2bMetrics = {
    "Sales-₹7.6L": {
      Today: { value: "₹7.6L", suffix: "today", detail: "28 units" },
      "Last 30 days": { value: "₹2.1Cr", suffix: "last 30 days", detail: "740 units" },
    },
    "Total orders-28": {
      Today: { value: "28", suffix: "today", detail: "₹7.6L" },
      "Last 30 days": { value: "740", suffix: "last 30 days", detail: "₹2.1Cr" },
    },
    "Cancelled orders-₹0": {
      Today: { value: "₹0", suffix: "today", detail: "0 units" },
      "Last 30 days": { value: "₹3.2L", suffix: "last 30 days", detail: "14 units" },
    },
  };
  const b2cPurchaseMetrics = {
    Purchase: {
      Today: { value: "₹7.6L", suffix: "today", detail: "28 units" },
      "Last 30 days": { value: "₹2.1Cr", suffix: "last 30 days", detail: "740 units" },
    },
    "Total orders": {
      Today: { value: "28", suffix: "today", detail: "₹7.6L" },
      "Last 30 days": { value: "740", suffix: "last 30 days", detail: "₹2.1Cr" },
    },
    "Payment released per day": {
      Today: { value: "₹2.7L", suffix: "today", detail: "" },
      "Last 30 days": { value: "₹74L", suffix: "last 30 days", detail: "" },
    },
    "Cancelled orders": {
      Today: { value: "₹18K", suffix: "today", detail: "7 units" },
      "Last 30 days": { value: "₹5.1L", suffix: "last 30 days", detail: "214 units" },
    },
  };
  const selectedMetric =
    scope === "b2c-purchase"
      ? b2cPurchaseMetrics[label]?.[b2cPurchasePeriod]
      : scope === "b2b-sales"
        ? b2bMetrics[metricKey]?.[b2bSalesPeriod]
        : b2cMetrics[metricKey]?.[b2cSalesPeriod];
  const activePeriod =
    scope === "b2c-purchase"
      ? b2cPurchasePeriod
      : scope === "b2b-sales"
        ? b2bSalesPeriod
        : b2cSalesPeriod;
  const dailyChanges = {
    "Sales-₹4.82L": { value: "13%", positive: true },
    "Total orders-172": { value: "4%", positive: true },
    "Cancelled orders-₹21K": { value: "18%", positive: false },
    "Sales-₹7.6L": { value: "9%", positive: true },
    "Total orders-28": { value: "7%", positive: true },
    "Cancelled orders-₹0": { value: "100%", positive: true },
    Purchase: { value: "11%", positive: true },
    "Total orders": { value: "8%", positive: true },
    "Payment released per day": { value: "6%", positive: true },
    "Cancelled orders": { value: "15%", positive: false },
  };
  const displayValue = selectedMetric?.value ?? value;
  const displaySuffix = selectedMetric?.suffix ?? suffix;
  const displayDetail = selectedMetric?.detail ?? detail;
  const dailyChange = selectedMetric ? dailyChanges[scope === "b2c-purchase" ? label : metricKey] : null;

  useEffect(() => {
    const updateB2cPeriod = (event) => setB2cSalesPeriod(event.detail);
    const updateB2bPeriod = (event) => setB2bSalesPeriod(event.detail);
    const updateB2cPurchasePeriod = (event) => setB2cPurchasePeriod(event.detail);
    window.addEventListener("b2c-sales-period", updateB2cPeriod);
    window.addEventListener("b2b-sales-period", updateB2bPeriod);
    window.addEventListener("b2c-purchase-period", updateB2cPurchasePeriod);
    return () => {
      window.removeEventListener("b2c-sales-period", updateB2cPeriod);
      window.removeEventListener("b2b-sales-period", updateB2bPeriod);
      window.removeEventListener("b2c-purchase-period", updateB2cPurchasePeriod);
    };
  }, []);

  return (
    <Card className="group min-h-[172px] overflow-hidden p-4 transition hover:shadow-xs">
      <div className="flex justify-between">
        <p className="text-sm font-semibold text-[#52627e]">{label}</p>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${accents[accent]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-[-0.03em] text-[#101a35]">
          {displayValue}
        </span>
        {displaySuffix && (
          <span className="text-base font-semibold text-[#62728f]">
            {displaySuffix}
          </span>
        )}
      </div>
      {displayDetail && (
        <p className="mt-2 text-sm font-semibold text-[#53647f]">
          {displayDetail}
        </p>
      )}
      {selectedMetric && activePeriod === "Last 30 days" && (
        <Sparkline color={accent === "rose" ? "#fb7185" : accent === "amber" ? "#e9a222" : "#377dff"} />
      )}
      {dailyChange && activePeriod === "Today" && (
        <div className={`mt-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${dailyChange.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
          <span>{dailyChange.positive ? "↑" : "↓"}</span>
          <span>{dailyChange.value} vs previous day</span>
        </div>
      )}
    </Card>
  );
}

function CalculatedMetric({ type, scope = "b2c" }) {
  const [period, setPeriod] = useState("Last 30 days");
  const b2cMetrics = {
    averageOrderValue: {
      label: "Average order value",
      icon: Activity,
      Today: {
        value: "₹2,802",
        suffix: "today",
        detail: "₹4.82L ÷ 172 orders",
        formula: "Today’s sales ÷ today’s orders",
      },
      "Last 30 days": {
        value: "₹2,570",
        suffix: "last 30 days",
        detail: "₹1.28Cr ÷ 4,980 orders",
        formula: "30-day sales ÷ 30-day orders",
      },
    },
    unitsPerDay: {
      label: "Units per day",
      icon: ShoppingBag,
      Today: {
        value: "186",
        suffix: "units today",
        detail: "103.3% of 30-day average",
        formula: "186 units sold today",
      },
      "Last 30 days": {
        value: "180",
        suffix: "units/day average",
        detail: "5,400 units ÷ 30 days",
        formula: "Average units sold each day",
      },
    },
  };
  const b2bMetrics = {
    averageOrderValue: {
      label: "Average order value",
      icon: Activity,
      Today: {
        value: "₹27.1K",
        suffix: "today",
        detail: "₹7.6L ÷ 28 orders",
        formula: "Today’s sales ÷ today’s orders",
      },
      "Last 30 days": {
        value: "₹28.4K",
        suffix: "last 30 days",
        detail: "₹2.1Cr ÷ 740 orders",
        formula: "30-day sales ÷ 30-day orders",
      },
    },
    unitsPerDay: {
      label: "Units per day",
      icon: ShoppingBag,
      Today: {
        value: "28",
        suffix: "units today",
        detail: "113.5% of 30-day average",
        formula: "28 units sold today",
      },
      "Last 30 days": {
        value: "25",
        suffix: "units/day average",
        detail: "740 units ÷ 30 days",
        formula: "Average units sold each day",
      },
    },
  };
  const metric = (scope === "b2b" ? b2bMetrics : b2cMetrics)[type];
  const data = metric[period];
  const Icon = metric.icon;

  useEffect(() => {
    const updatePeriod = (event) => setPeriod(event.detail);
    const eventName = scope === "b2b" ? "b2b-sales-period" : "b2c-sales-period";
    window.addEventListener(eventName, updatePeriod);
    return () => window.removeEventListener(eventName, updatePeriod);
  }, [scope]);

  return (
    <Card className="min-h-[172px] p-4">
      <div className="flex justify-between">
        <p className="text-sm font-semibold text-[#52627e]">{metric.label}</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff2fc] text-[#242b5c]">
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-[-0.03em] text-[#101a35]">{data.value}</span>
        <span className="text-base font-semibold text-[#62728f]">{data.suffix}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-[#53647f]">{data.detail}</p>
      <p className="mt-1 text-[11px] font-medium text-[#8190aa]">{data.formula}</p>
    </Card>
  );
}
function List({ title, rows, tone = "blue", className = "" }) {
  const m = Math.max(...rows.map((x) => x[1]));
  return (
    <Card className={`p-5 ${className}`}>
      <div className="mb-4 flex justify-between">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <span className="text-[11px] font-semibold text-slate-400">
          % of value
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map(([name, value], index) => (
          <div
            key={name}
            className="grid grid-cols-[minmax(110px,1fr)_minmax(100px,1.5fr)_42px] items-center gap-3 py-2.5"
          >
            <span className="truncate text-xs font-semibold text-slate-700">
              {name}
            </span>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <MotionBar
                percent={(value / m) * 100}
                delay={index * 0.08}
                className={`h-full rounded-full ${tone === "indigo" ? "bg-[#7e8bdd]" : "bg-[#3b82f6]"}`}
              />
            </div>
            <span className="text-right text-xs font-bold text-slate-700">
              {value}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OverviewProductMix() {
  const [channel, setChannel] = useState("B2C");
  const isB2B = channel === "B2B";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-600">What sells and what we buy</h3>
        <div className="flex rounded-lg bg-[#f1f4f9] p-0.5 text-[11px] font-bold">
          {["B2C", "B2B"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setChannel(item)}
              className={`rounded-md px-3 py-1.5 transition ${channel === item ? "bg-white text-[#2865df] shadow-sm" : "text-[#71809a] hover:text-[#43527b]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <List
          title="Top 7 products sold · 30 days"
          rows={isB2B ? b2bProducts : b2cProducts}
          tone={isB2B ? "indigo" : "blue"}
        />
        <List
          title="Top 7 products purchased · 30 days"
          rows={isB2B ? b2bProducts : purchaseProducts}
          tone={isB2B ? "indigo" : "blue"}
        />
      </div>
    </div>
  );
}

function OverviewCities() {
  const [view, setView] = useState("Sales");
  const isPurchase = view === "Purchase";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-600">Top 7 cities</h3>
        <div className="flex rounded-lg bg-[#f1f4f9] p-0.5 text-[11px] font-bold">
          {["Sales", "Purchase"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded-md px-3 py-1.5 transition ${view === item ? "bg-white text-[#2865df] shadow-sm" : "text-[#71809a] hover:text-[#43527b]"}`}
            >
              B2C {item}
            </button>
          ))}
        </div>
      </div>
      <CityMap
        title={`Top 7 cities · B2C ${isPurchase ? "purchase" : "sales"} · 30 days`}
        rows={isPurchase ? purchaseCities : b2cCities}
        compact
      />
    </div>
  );
}

function CityMap({ title, rows, tone = "blue", compact = false }) {
  const [activeCity, setActiveCity] = useState(null);
  const [isMapMounted, setIsMapMounted] = useState(false);
  const markerColor = tone === "indigo" ? "#7e8bdd" : "#377dff";
  const maxValue = Math.max(...rows.map(([, value]) => value));
  const activeRow = rows.find(([city]) => city === activeCity);

  useEffect(() => {
    setIsMapMounted(true);
  }, []);

  if (!isMapMounted) {
    return (
      <Card className="overflow-hidden p-0">
        <div className={`flex items-center justify-between ${compact ? "px-4 pb-1 pt-3" : "px-5 pb-2 pt-5"}`}>
          <h3 className={`${compact ? "text-xs" : "text-sm"} font-bold text-slate-900`}>{title}</h3>
          <span className="text-[11px] font-semibold text-slate-400">% of value</span>
        </div>
        <div className={`grid ${compact ? "min-h-[145px] lg:grid-cols-2" : "min-h-[290px] lg:grid-cols-[1.15fr_.85fr]"}`}>
          <div className={`relative ${compact ? "min-h-[130px]" : "min-h-[260px]"} overflow-hidden bg-[radial-gradient(circle_at_42%_44%,#e8f1ff,transparent_48%),linear-gradient(145deg,#f9fbff,#eef4ff)]`}>
            <div className={`absolute ${compact ? "inset-2 rounded-xl" : "inset-4 rounded-[18px]"} border border-[#dce8fb]`} />
          </div>
          <div className="divide-y divide-[#e8eef9] px-5 py-2">
            {rows.map(([city, value], index) => (
              <div key={city} className={`flex items-center gap-3 ${compact ? "py-0.5" : "py-2.5"}`}>
                <span className={`flex items-center justify-center rounded-full bg-[#edf3ff] font-bold text-[#3978ed] ${compact ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]"}`}>{index + 1}</span>
                <span className={`min-w-0 flex-1 truncate font-semibold text-[#3b4a65] ${compact ? "text-sm" : "text-xs"}`}>{city}</span>
                <span className={`${compact ? "text-xs" : "text-xs"} font-bold text-[#1d2b49]`}>{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className={`flex items-center justify-between ${compact ? "px-4 pb-1 pt-3" : "px-5 pb-2 pt-5"}`}>
        <h3 className={`${compact ? "text-xs" : "text-sm"} font-bold text-slate-900`}>{title}</h3>
        <span className="text-[11px] font-semibold text-slate-400">% of value</span>
      </div>
      <div className={`grid ${compact ? "min-h-[145px] lg:grid-cols-2" : "min-h-[290px] lg:grid-cols-[1.15fr_.85fr]"}`}>
        <div className={`relative ${compact ? "min-h-[130px]" : "min-h-[260px]"} overflow-hidden bg-[radial-gradient(circle_at_42%_44%,#e8f1ff,transparent_48%),linear-gradient(145deg,#f9fbff,#eef4ff)]`}>
          <div className={`pointer-events-none absolute ${compact ? "inset-2 rounded-xl" : "inset-4 rounded-[18px]"} border border-[#dce8fb]`} />
          <ComposableMap projection="geoMercator" projectionConfig={{ center: [82, 22], scale: 930 }} className="relative z-10 h-full w-full">
            <Geographies geography={worldAtlas}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => geo.properties.name === "India")
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#dce9ff"
                      stroke="#9bbcff"
                      strokeWidth={0.75}
                      style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                    />
                  ))
              }
            </Geographies>
            {rows.map(([city, value], index) => {
              const coordinates = cityCoordinates[city];
              if (!coordinates) return null;
              const isActive = activeCity === city;
              const radius = 4 + (value / maxValue) * 8;
              return (
                <Marker key={city} coordinates={coordinates} onMouseEnter={() => setActiveCity(city)} onMouseLeave={() => setActiveCity(null)}>
                  <motion.circle
                    r={radius + 6}
                    fill={markerColor}
                    opacity={0.14}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.08 }}
                  />
                  <motion.circle
                    r={radius}
                    fill={markerColor}
                    stroke="#fff"
                    strokeWidth={2.5}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    animate={isActive ? { scale: 1.18 } : { scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                  />
                </Marker>
              );
            })}
            {activeRow && (
              <Marker coordinates={cityCoordinates[activeRow[0]]}>
                <g transform="translate(0 -102)" pointerEvents="none">
                  <rect x="-154" y="-55" width="308" height="110" rx="24" fill="rgba(255,255,255,0.98)" stroke="#dbe6fb" strokeWidth="2" filter="drop-shadow(0 14px 24px rgba(41,72,130,.18))" />
                  <text textAnchor="middle" y="-10" fill="#17213d" fontSize="25" fontWeight="500">{activeRow[0]}</text>
                  <text textAnchor="middle" y="27" fill="#377dff" fontSize="22" fontWeight="500">Share of value · {activeRow[1]}%</text>
                </g>
              </Marker>
            )}
          </ComposableMap>
          <p className={`absolute z-20 font-semibold text-[#71809a] ${compact ? "bottom-2 left-3 text-[8px]" : "bottom-4 left-5 text-[10px]"}`}>Marker size represents share of value</p>
        </div>
        <div className="divide-y divide-[#e8eef9] px-5 py-2">
          {rows.map(([city, value], index) => (
            <button key={city} onMouseEnter={() => setActiveCity(city)} onMouseLeave={() => setActiveCity(null)} onFocus={() => setActiveCity(city)} onBlur={() => setActiveCity(null)} className={`flex w-full items-center gap-3 text-left ${compact ? "py-0.5" : "py-2.5"}`}>
              <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#edf3ff] font-bold text-[#3978ed] ${compact ? "h-5 w-5 text-[9px]" : "h-6 w-6 text-[10px]"}`}>{index + 1}</span>
              <span className={`min-w-0 flex-1 truncate font-semibold text-[#3b4a65] ${compact ? "text-sm" : "text-xs"}`}>{city}</span>
              <span className={`${compact ? "text-xs" : "text-xs"} font-bold text-[#1d2b49]`}>{value}%</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
function Donut({ value = "64%", label = "app", pct = 64 }) {
  let c = 238.76;
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="transparent"
          stroke="#eef2f7"
          strokeWidth="13"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="13"
          initial={{ strokeDasharray: `0 ${c}` }}
          whileInView={{ strokeDasharray: `${(c * pct) / 100} ${c}` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="transparent"
          stroke="#9aa7dc"
          strokeWidth="13"
          initial={{ strokeDasharray: `0 ${c}` }}
          whileInView={{ strokeDasharray: `${(c * (100 - pct)) / 100} ${c}` }}
          strokeDashoffset={(-c * pct) / 100}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <b className="text-xl text-slate-900">{value}</b>
        <p className="text-[10px] font-semibold uppercase text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}
function StatusDonut({ slices, total, label }) {
  const c = 238.76;
  let offset = 0;
  return (
    <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="transparent"
          stroke="#eef2f7"
          strokeWidth="13"
        />
        {slices.map(([percent, color], index) => {
          const currentOffset = offset;
          offset -= (c * percent) / 100;
          return (
            <motion.circle
              key={color}
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke={color}
              strokeWidth="13"
              initial={{ strokeDasharray: `0 ${c}` }}
              whileInView={{ strokeDasharray: `${(c * percent) / 100} ${c}` }}
              strokeDashoffset={currentOffset}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.05, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute text-center">
        <b className="text-xl text-slate-900">{total}</b>
        <p className="text-[10px] font-semibold text-slate-400">{label}</p>
      </div>
    </div>
  );
}
function Chart() {
  const [metric, setMetric] = useState("Sales");
  const dataSets = {
    Sales: { values: [{ name: "Sales", B2C: 1.28, B2B: 2.1 }, { name: "Purchases", B2C: 2.1, B2B: 1.6 }], format: (value) => `₹${value}Cr`, b2c: "₹1.28Cr", b2b: "₹2.1Cr", sub: "30-day value" },
    Orders: { values: [{ name: "Sales", B2C: 4980, B2B: 740 }, { name: "Purchases", B2C: 740, B2B: 520 }], format: (value) => value.toLocaleString(), b2c: "4,980", b2b: "740", sub: "orders in 30 days" },
    Units: { values: [{ name: "Sales", B2C: 5412, B2B: 740 }, { name: "Purchases", B2C: 740, B2B: 520 }], format: (value) => value.toLocaleString(), b2c: "5,412", b2b: "740", sub: "units in 30 days" },
  };
  const selected = dataSets[metric];
  return (
    <Card className="flex min-h-[500px] flex-col p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3ff] text-[#4e75c6]"><Activity className="h-4 w-4" /></span><div><h3 className="text-base font-bold text-[#17213d]">B2C vs B2B performance</h3><p className="text-xs font-medium text-[#8190aa]">Last 30 days</p></div></div>
        <div className="flex rounded-xl bg-[#f2f5fb] p-1 text-[11px] font-bold text-[#71809a]">{Object.keys(dataSets).map((item) => <button key={item} onClick={() => setMetric(item)} className={`rounded-lg px-3 py-1.5 transition ${metric === item ? "bg-white text-[#2f68dd] shadow-sm" : "hover:text-[#43527b]"}`}>{item}</button>)}</div>
      </div>
      <div className="mt-5 grid grid-cols-2 divide-x divide-[#e5ecf9] rounded-xl bg-white/45 p-3">
        <div className="pr-3"><p className="text-xs font-semibold text-[#5e7297]"><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#377dff]" />B2C</p><p className="mt-1 text-2xl font-bold tracking-[-.04em] text-[#111b37]">{selected.b2c}</p><p className="text-[11px] font-medium text-[#8190aa]">{selected.sub}</p></div>
        <div className="pl-4"><p className="text-xs font-semibold text-[#5e7297]"><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#9aa7dc]" />B2B</p><p className="mt-1 text-2xl font-bold tracking-[-.04em] text-[#111b37]">{selected.b2b}</p><p className="text-[11px] font-medium text-[#8190aa]">{selected.sub}</p></div>
      </div>
      <div className="mt-auto h-72 pt-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={selected.values} barGap={10} margin={{ top: 18, right: 2, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e5edfb" strokeDasharray="3 4" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#71809a", fontSize: 11, fontWeight: 600 }} />
            <YAxis tickCount={8} tickLine={false} axisLine={false} tick={{ fill: "#93a2bd", fontSize: 10 }} tickFormatter={selected.format} />
            <Tooltip cursor={{ fill: "rgba(55,125,255,.06)" }} formatter={(v) => [selected.format(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid #dbe6fb", boxShadow: "0 10px 24px rgba(45,73,130,.12)" }} />
            <Bar dataKey="B2C" fill="#377dff" radius={[7, 7, 0, 0]} animationDuration={850} />
            <Bar dataKey="B2B" fill="#9aa7dc" radius={[7, 7, 0, 0]} animationDuration={1050} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function TrendChart({ title = "Daily sales, last 30 days", lines = ["b2c"], label = "B2C sales" }) {
  const colors = { b2c: "#377dff", b2b: "#7e8bdd", purchase: "#377dff" };
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#17213d]">{title}</h3>
        <div className="flex flex-wrap gap-3 text-[11px] font-bold text-[#71809a]">
          {lines.map((line) => <span key={line}><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: colors[line] }} />{lines.length === 1 ? label : line === "b2c" ? "B2C sales" : "B2B sales"}</span>)}
        </div>
      </div>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>{lines.map((line) => <linearGradient key={line} id={`area-${line}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={colors[line]} stopOpacity={0.25} /><stop offset="100%" stopColor={colors[line]} stopOpacity={0.01} /></linearGradient>)}</defs>
            <CartesianGrid vertical={false} stroke="#dbe6fb" strokeDasharray="3 5" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={28} tick={{ fill: "#91a0bc", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#91a0bc", fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip formatter={(value, name) => [`₹${value}L`, name === "b2c" ? "B2C sales" : name === "b2b" ? "B2B sales" : "Purchase"]} contentStyle={{ borderRadius: 14, border: "1px solid #dbe6fb", boxShadow: "0 10px 26px rgba(45,73,130,.13)" }} />
            {lines.map((line) => <Area key={line} type="monotone" dataKey={line} stroke={colors[line]} strokeWidth={3} fill={`url(#area-${line})`} activeDot={{ r: 5 }} animationDuration={1200} />)}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function SalesPurchaseTrend() {
  const series = [
    { key: "salesB2C", label: "Sales (B2C)", color: "#377dff" },
    { key: "salesB2B", label: "Sales (B2B)", color: "#7e8bdd" },
    { key: "purchasesB2C", label: "Purchases (B2C)", color: "#fb7185" },
    { key: "purchasesB2B", label: "Purchases (B2B)", color: "#f2b84b" },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[#17213d]">Sales vs Purchase Trend</h3>
        <span className="text-[11px] font-bold text-[#71809a]">Last 30 days trend</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-[#71809a]">
        {series.map((item) => (
          <span key={item.key}>
            <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="mt-3 h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overviewTrendData} margin={{ top: 8, right: 10, left: -15, bottom: 0 }}>
            <defs>
              {series.map((item) => (
                <linearGradient key={item.key} id={`overview-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="#dbe6fb" strokeDasharray="3 5" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: "#91a0bc", fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#91a0bc", fontSize: 11 }} tickFormatter={(value) => `₹${value}L`} />
            <Tooltip
              formatter={(value, name) => [`₹${value}L`, series.find((item) => item.key === name)?.label]}
              contentStyle={{ borderRadius: 14, border: "1px solid #dbe6fb", boxShadow: "0 10px 26px rgba(45,73,130,.13)" }}
            />
            {series.map((item) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                strokeWidth={2.5}
                fill={`url(#overview-${item.key})`}
                activeDot={{ r: 4 }}
                animationDuration={1200}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
function CancellationRate() {
  const rates = [
    {
      name: "B2C sales",
      today: "2.8%",
      last30: "5.0%",
      width: "100%",
      color: "bg-[#3b82f6]",
    },
    {
      name: "B2C purchase",
      today: "1.2%",
      last30: "2.4%",
      width: "48%",
      color: "bg-[#4f7fc5]",
    },
    {
      name: "B2B sales",
      today: "0.8%",
      last30: "1.5%",
      width: "30%",
      color: "bg-[#7b89c4]",
    },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f4ff] text-[#687ab8]"><Activity className="h-4 w-4" /></span><div><h3 className="text-base font-bold text-[#17213d]">Cancellation rate</h3><p className="text-xs font-medium text-[#8190aa]">Cancelled orders ÷ total orders</p></div></div>
        <span className="rounded-lg border border-[#dbe6fb] bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-[#52627e]">Last 30 days ⌄</span>
      </div>
      <div className="divide-y divide-slate-100">
        {rates.map((rate) => (
          <div key={rate.name} className="py-3">
            <p className="text-sm font-bold text-slate-700">{rate.name}</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Today</p>
                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {rate.today}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  Last 30 days
                </p>
                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {rate.last30}
                </p>
              </div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <MotionBar
                percent={Number.parseFloat(rate.width)}
                className={`h-full rounded-full ${rate.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Snapshots() {
  const [period, setPeriod] = useState("Last 30 days");
  const cards = [
    { label: "B2C sales", color: "#377dff", last30: ["₹1.28Cr", "4,980 orders", "5.0% cancelled"], today: ["₹4.82L", "186 units", "13% vs previous day", true] },
    { label: "B2B sales", color: "#7e8bdd", last30: ["₹2.1Cr", "740 orders", "1.5% cancelled"], today: ["₹7.6L", "28 units", "9% vs previous day", true] },
    { label: "B2C purchase", color: "#377dff", last30: ["₹2.1Cr", "740 units", "2.4% cancelled"], today: ["₹7.6L", "28 units", "11% vs previous day", true] },
    { label: "B2B purchase", color: "#7e8bdd", last30: ["₹1.6Cr", "520 units", "1.2% cancelled"], today: ["₹5.2L", "28 units", "6% vs previous day", true] },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[#151c34]">Snapshots</h2>
        <label className="relative">
          <span className="sr-only">Snapshot period</span>
          <select value={period} onChange={(event) => setPeriod(event.target.value)} className="appearance-none rounded-lg border border-[#dbe6fb] bg-white/80 py-1.5 pl-3 pr-8 text-xs font-bold text-[#52627e] shadow-sm outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-100">
            <option>Today</option>
            <option>Last 30 days</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#61718c]">⌄</span>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const [value, note, badge, positive] = period === "Today" ? card.today : card.last30;
          return (
            <Card key={card.label} className="min-h-[190px] overflow-hidden p-5">
              <p className="text-sm font-semibold text-[#61718c]">{card.label}</p>
              <p className="mt-5 text-3xl font-bold tracking-[-.04em] text-[#101a35]">{value}</p>
              <p className="mt-1 text-sm font-medium text-[#71809a]">{note}</p>
              <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${period === "Today" ? positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600" : "bg-[#e8efff]"}`} style={period === "Today" ? undefined : { color: card.color }}>
                {period === "Today" && (positive ? "↑ " : "↓ ")}{badge}
              </span>
              {period === "Last 30 days" && <Sparkline color={card.color} />}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Overview() {
  const rows = [
    ["Sales", "₹4.82L", "vs ₹4.27L avg", "113%", 82, "blue"],
    ["Orders", "172", "vs 166 avg", "104%", 67, "blue"],
    ["Units sold", "186", "vs 180 avg", "103%", 64, "blue"],
    ["Dispatch", "158", "vs 171 avg", "92%", 54, "amber"],
  ];

  return (
    <>
      <Title id="overview" tag="B2C + B2B">
        Overview
      </Title>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.15fr_1.4fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3ff] text-[#3978ed]"><Activity className="h-4 w-4" /></span><div><h3 className="text-base font-bold text-[#17213d]">Sales performance</h3><p className="text-xs font-medium text-[#8190aa]">vs daily average (last 30 days)</p></div></div>
            <span className="rounded-lg border border-[#dbe6fb] bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-[#52627e]">Today ⌄</span>
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map(([name, value, sub, percentage, width, tone]) => (
              <div
                key={name}
                className="grid grid-cols-[76px_1fr] items-center gap-3 py-3.5"
              >
                <b className="text-sm text-slate-700">{name}</b>
                <div>
                  <div className="flex items-center justify-between gap-2"><div><b className="text-lg text-[#16213d]">{value}</b><p className="text-[11px] font-medium text-[#71809a]">{sub}</p></div><span className={`rounded-lg px-2 py-1 text-[11px] font-bold ${tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{tone === "amber" ? "↓" : "↑"} {percentage}</span></div>
                  <div className="relative mt-2 h-2.5 rounded-full bg-slate-100"><MotionBar percent={width} className={tone === "amber" ? "h-full rounded-full bg-amber-400" : "h-full rounded-full bg-[#3b82f6]"} /><i className="absolute right-[20%] top-[-5px] h-5 border-l-2 border-slate-400" /></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <CancellationRate />
        <Chart />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.75fr_.8fr]">
        <SalesPurchaseTrend />
        <Card className="p-5"><div className="flex items-center justify-between"><h3 className="text-base font-bold text-[#17213d]">Needs attention</h3><span className="text-xs font-semibold text-[#71809a]">5 items</span></div><div className="mt-3 divide-y divide-[#e8eef9]">{[["Dispatch at 92% of average", "158 vs 171 units today", "#f2b84b"], ["64 units pending dispatch", "₹1.9L waiting to leave the warehouse", "#f2b84b"], ["53 units awaiting payment", "Received, payment pending · ₹1.5L", "#f2b84b"], ["214 purchase units cancelled", "₹5.1L in the last 30 days", "#fb7185"], ["1,600 units under evaluation", "19% of warehouse stock", "#5c98f5"]].map(([title, detail, color]) => <div key={title} className="flex items-center gap-3 py-3"><i className="h-9 w-9 rounded-xl" style={{ background: `${color}22`, border: `1px solid ${color}22` }} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#24304c]">{title}</p><p className="truncate text-xs font-medium text-[#71809a]">{detail}</p></div><span className="text-[#91a0bc]">›</span></div>)}</div></Card>
      </div>
      <OverviewProductMix />
      <OverviewCities />
    </>
  );
}
function Sales() {
  return (
    <section className="space-y-4">
      <Title tag="B2C">Sales</Title>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Sales"
          value="₹4.82L"
          suffix="today"
          detail="30 days ₹1.28Cr · 186 units today"
          icon={CircleDollarSign}
        />
        <Metric
          label="Total orders"
          value="172"
          suffix="today"
          detail="30 days 4,980 · 5,412 units"
          icon={ShoppingBag}
        />
        <Metric
          label="Cancelled orders"
          value="₹21K"
          suffix="today"
          detail="30 days ₹6.4L · 9 orders today"
          icon={Activity}
          accent="rose"
        />
        <Card className="p-4">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-slate-500">
              App vs website sales · 30 days
            </p>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Donut />
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <p>
                <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" />
                App <b>64%</b>
              </p>
              <p>
                <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#9aa7dc]" />
                Website <b>36%</b>
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Fulfilment />
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatedMetric type="averageOrderValue" />
          <CalculatedMetric type="unitsPerDay" />
        </div>
        {/* Daily trend chart retained for future use: <TrendChart /> */}
      </div>
      <Title tag="B2B">Sales</Title>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Sales"
          value="₹7.6L"
          suffix="today"
          detail="30 days ₹2.1Cr · 28 today"
          icon={CircleDollarSign}
          scope="b2b-sales"
        />
        <Metric
          label="Total orders"
          value="28"
          suffix="today"
          detail="30 days 740 units"
          icon={ShoppingBag}
          scope="b2b-sales"
        />
        <Metric
          label="Cancelled orders"
          value="₹0"
          suffix="today"
          detail="30 days ₹3.2L · 0 today"
          icon={Activity}
          scope="b2b-sales"
        />
      </div>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <CalculatedMetric type="averageOrderValue" scope="b2b" />
          <CalculatedMetric type="unitsPerDay" scope="b2b" />
        </div>
        {/* Daily trend chart retained for future use: <TrendChart lines={["b2b"]} label="B2B sales" /> */}
      </div>
    </section>
  );
}
function Pipeline() {
  const r = [
    ["Picked up, not yet at warehouse", "₹2.8L", "38%", "#9aa7dc"],
    ["Received, payment pending", "₹1.5L", "21%", "#3b82f6"],
    [
      "Picked up, not delivered for more than 7 days",
      "₹1.5L",
      "21%",
      "#7ba9eb",
    ],
    ["Orders not picked up (logistics)", "₹1.5L", "21%", "#b6c4de"],
  ];
  return (
    <Card className="p-5">
      <div className="flex justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Value tied up in the purchase pipeline
        </h3>
        <b className="text-xs text-slate-500">₹7.3L</b>
      </div>
      <div className="mt-4 flex h-5 overflow-hidden rounded-full">
        {r.map((x) => (
          <i
            key={x[0]}
            className="border-r-2 border-white last:border-0"
            style={{ width: x[2], background: x[3] }}
          />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {r.map(([n, v, p, c]) => (
          <div key={n} className="grid grid-cols-[1fr_70px_40px] gap-3 text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <i className="h-3 w-3 rounded-sm" style={{ background: c }} />
              {n}
            </span>
            <span className="text-right text-slate-500">{v}</span>
            <b className="text-right text-slate-700">{p}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}
function Purchases() {
  return (
    <section className="space-y-4">
      <Title tag="B2C">Purchase</Title>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Purchase"
          value="₹7.6L"
          suffix="today"
          detail="30 days ₹2.1Cr · 28 today"
          icon={CircleDollarSign}
          scope="b2c-purchase"
        />
        <Metric
          label="Total orders"
          value="28"
          suffix="today"
          detail="30 days 740 units"
          icon={ShoppingBag}
          scope="b2c-purchase"
        />
        <Metric
          label="Payment released per day"
          value="₹2.7L"
          suffix="today"
          detail="30 days ₹74L"
          icon={CircleDollarSign}
          scope="b2c-purchase"
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-600">In progress</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric
            label="Picked up, not yet at warehouse"
            value="96"
            suffix="units"
            detail="₹2.8L"
            icon={Truck}
          />
          <Metric
            label="Received, payment pending"
            value="53"
            suffix="units"
            detail="₹1.5L"
            icon={Clock3}
          />
          <Metric
            label="Cancelled orders"
            value="₹18K"
            suffix="today"
            detail="30 days ₹5.1L · 7 today"
            icon={Activity}
            accent="rose"
          scope="b2c-purchase"
          />
        </div>
      </div>
      <Pipeline />
      {/* Daily trend chart retained for future use: <TrendChart title="Daily purchase value, last 30 days" lines={["purchase"]} label="B2C purchase" /> */}
      <Title tag="B2B">Purchase</Title>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Purchase"
          value="₹5.2L"
          suffix="· 28 units today"
          detail="₹1.6Cr · 740 units in last 30 days"
          icon={CircleDollarSign}
        />
        <Metric
          label="Extra amount paid to vendors"
          value="₹84K"
          detail="Requires review"
          icon={Activity}
          accent="amber"
        />
        <Metric
          label="Payment released per week"
          value="₹18L"
          suffix="this week"
          detail="₹71L in last 30 days"
          icon={CircleDollarSign}
        />
      </div>
    </section>
  );
}
function Fulfilment() {
  return (
    <section className="space-y-4">
      <Title>Fulfilment</Title>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <div className="flex justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Orders in the pipeline
            </h3>
            <b className="text-xs text-slate-500">423 units</b>
          </div>
          <div className="mt-5 flex h-5 overflow-hidden rounded-full">
            <i className="scroll-grow w-[15%] bg-amber-400" />
            <i className="scroll-grow w-[74%] bg-[#3b82f6]" />
            <i className="scroll-grow w-[11%] bg-rose-400" />
          </div>
          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Pending for dispatch", "64 units", "₹1.9L", "bg-amber-400"],
              ["In transit", "312 units", "₹9.4L", "bg-[#3b82f6]"],
              ["In return", "47 units", "₹1.6L", "bg-rose-400"],
            ].map(([n, u, v, c]) => (
              <div key={n} className="grid grid-cols-[1fr_80px_60px] gap-2">
                <span className="flex items-center gap-3 font-medium text-slate-700">
                  <i className={`h-3 w-3 rounded-sm ${c}`} />
                  {n}
                </span>
                <span className="text-right text-slate-500">{u}</span>
                <b className="text-right text-slate-700">{v}</b>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900">Dispatch per day</h3>
          {[
            ["Today", "158 units", 92, "bg-[#3b82f6]"],
            ["30-day avg", "171 units", 100, "bg-slate-400"],
          ].map(([n, u, w, c]) => (
            <div
              key={n}
              className="mt-5 grid grid-cols-[95px_1fr_76px] items-center gap-3"
            >
              <span className="text-xs font-semibold text-slate-500">{n}</span>
              <div className="h-3 rounded-full bg-slate-100">
                <i
                  className={`scroll-grow block h-full rounded-full ${c}`}
                  style={{ width: `${w}%` }}
                />
              </div>
              <b className="text-right text-xs text-slate-700">{u}</b>
            </div>
          ))}
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Value today <b className="text-slate-700">₹4.4L</b> · 30-day avg{" "}
            <b className="text-slate-700">₹4.9L</b>
          </p>
        </Card>
      </div>
    </section>
  );
}
function Inventory() {
  const [statusView, setStatusView] = useState("value");
  const statusData = {
    value: [
      ["Ready to sell", 68, "₹4.69Cr", "#4ade80"],
      ["Under evaluation", 14, "₹96L", "#60a5fa"],
      ["In repair", 12, "₹83L", "#fbbf24"],
      ["Damaged", 6, "₹41L", "#fb7185"],
    ],
    units: [
      ["Ready to sell", 58, "4,884 units", "#4ade80"],
      ["Under evaluation", 19, "1,600 units", "#60a5fa"],
      ["In repair", 15, "1,263 units", "#fbbf24"],
      ["Damaged", 8, "673 units", "#fb7185"],
    ],
  };
  const statusRows = statusData[statusView];
  return (
    <section className="space-y-4">
      <Title tag="Warehouse">Inventory</Title>
      <div className="grid gap-4 xl:grid-cols-[.65fr_1.35fr]">
        <Card className="p-5">
          <div className="flex justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Total inventory
            </p>
            <Warehouse className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            8,420 <span className="text-sm text-slate-500">units</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Stock value <b className="text-slate-700">₹6.9Cr</b>
          </p>
          <p className="mt-7 text-xs font-bold text-slate-500">
            Warehouse health{" "}
            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
              Optimal
            </span>
          </p>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <i className="scroll-grow block h-full w-[82%] rounded-full bg-emerald-400" />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">By status</h3>
            <div className="flex rounded-lg bg-[#f1f4f9] p-0.5 text-[11px] font-bold">
              {["value", "units"].map((view) => (
                <button
                  key={view}
                  onClick={() => setStatusView(view)}
                  className={`rounded-md px-3 py-1.5 capitalize transition ${
                    statusView === view
                      ? "bg-white text-[#25335c] shadow-[0_1px_3px_rgba(30,42,75,0.12)]"
                      : "text-[#71809a] hover:text-[#43527b]"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-8">
            <StatusDonut
              slices={statusRows.map(([, percentage, , color]) => [percentage, color])}
              total={statusView === "value" ? "₹6.9Cr" : "8,420"}
              label={statusView === "value" ? "total value" : "total units"}
            />
            <div className="min-w-[240px] flex-1 space-y-3">
              {statusRows.map(([n, percentage, amount, color]) => (
                <div
                  key={n}
                  className="grid grid-cols-[1fr_45px_88px] gap-2 text-sm"
                >
                  <span className="flex items-center gap-3 font-medium text-slate-700">
                    <i
                      className="h-3 w-3 rounded-sm"
                      style={{ background: color }}
                    />
                    {n}
                  </span>
                  <span className="text-right text-slate-500">{percentage}%</span>
                  <b className="text-right text-slate-700">{amount}</b>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900">Ready to sell vs not ready</h3><span className="text-xs font-semibold text-[#91a0bc]">Units</span></div>
        <div className="mt-4 flex h-5 overflow-hidden rounded-full bg-[#dbe6fb]"><i className="w-[58%] bg-[#44d481] transition-all duration-1000" /><i className="w-[42%] bg-[#b7c5e1] transition-all duration-1000" /></div>
        <div className="mt-4 divide-y divide-[#e8eef9] text-sm"><div className="flex items-center justify-between py-2"><span className="flex items-center gap-3 font-medium text-slate-700"><i className="h-3 w-3 rounded-sm bg-[#44d481]" />Ready to sell</span><span className="font-bold text-slate-700">58% · 4,884 units</span></div><div className="flex items-center justify-between py-2"><span className="flex items-center gap-3 font-medium text-slate-700"><i className="h-3 w-3 rounded-sm bg-[#b7c5e1]" />Evaluation, repair or damaged</span><span className="font-bold text-slate-700">42% · 3,536 units</span></div></div>
      </Card>
      <p className="text-xs font-medium text-[#71809a]">Days of cover = ready-to-sell units ÷ units sold per day across B2C and B2B.</p>
    </section>
  );
}
function Returns() {
  const reasons = [
    ["Defective / not working", 41, "#9aa7dc"],
    ["Not as described", 27, "#3b82f6"],
    ["Damaged in shipping", 19, "#7ba9eb"],
    ["Wrong product sent", 13, "#b6c4de"],
  ];
  const c = 238.76,
    offsets = [0, -97.89, -162.36, -207.72];
  return (
    <section className="space-y-4">
      <Title tag="Quality">Returns</Title>
      <Card className="p-5">
        <div className="flex justify-between">
          <h3 className="text-sm font-bold text-slate-900">Return reasons</h3>
          <span className="text-[11px] font-semibold text-slate-400">
            % of value
          </span>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="flex flex-col items-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#eef2f7"
                  strokeWidth="13"
                />
                {reasons.map(([name, pct, color], index) => (
                  <motion.circle
                    key={name}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="13"
                    initial={{ strokeDasharray: `0 ${c}` }}
                    whileInView={{ strokeDasharray: `${(c * pct) / 100} ${c}` }}
                    strokeDashoffset={offsets[index]}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.05, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </svg>
              <div className="absolute text-center">
                <b className="text-2xl text-slate-900">100%</b>
                <p className="text-[10px] font-semibold text-slate-400">
                  of return value
                </p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-slate-500">
              Defective items and listing mismatches make up 68% of return
              value.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {reasons.map(([name, pct, color]) => (
              <div
                key={name}
                className="grid grid-cols-[minmax(160px,1fr)_minmax(150px,2fr)_48px] items-center gap-4 py-3.5"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <i
                    className="h-3 w-3 rounded-sm"
                    style={{ background: color }}
                  />
                  {name}
                </span>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <i
                    className="scroll-grow block h-full rounded-full"
                    style={{ width: `${(pct / 41) * 100}%`, background: color }}
                  />
                </div>
                <b className="text-right text-sm text-slate-700">{pct}%</b>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
export default function Live_Data_Industry() {
  const [tab, setTab] = useState("Overview");
  const tabs = [
    "Overview",
    "B2C sales",
    "B2B sales",
    "B2C purchase",
    "B2B purchase",
    "Inventory",
    "Returns",
  ];
  const body =
    tab === "Overview" ? (
      <>
        <Overview />
        <Sales />
        <Purchases />
        <Inventory />
        <Returns />
      </>
    ) : tab.includes("sales") ? (
      <Sales />
    ) : tab.includes("purchase") ? (
      <Purchases />
    ) : tab === "Inventory" ? (
      <Inventory />
    ) : tab === "Returns" ? (
      <Returns />
    ) : (
      <Sales />
    );
  return (
    <main className="ios-glass-dashboard min-h-screen bg-[#f5f8ff] font-sans text-slate-800">
      <header className="px-5 pt-4 sm:px-7">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-blue-600">
              DACBY OPERATIONS
            </p>
            <h1 className="text-xl font-bold tracking-tight text-[#242b5c]">
              Live data industry
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
            <i className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live data
          </div>
        </div>
      </header>
      <nav className="px-5 py-3 sm:px-7">
        <div className="ios-glass-control mx-auto flex max-w-[1560px] gap-2 overflow-x-auto rounded-[26px] px-4">
          <span className="flex items-center text-sm font-bold text-[#242b5c]">
            Dacby<span className="text-slate-400">Operations</span>
          </span>
          {tabs.map((item) => (
            <button
              onClick={() => setTab(item)}
              key={item}
              className={`my-1 whitespace-nowrap rounded-xl border px-3 py-2.5 text-xs font-bold transition ${tab === item ? "border-white/85 bg-white/65 text-[#2865df] shadow-[0_4px_14px_rgba(45,73,130,.10)] backdrop-blur-xl" : "border-transparent text-slate-500 hover:bg-white/35 hover:text-slate-900"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>
      <div className="mx-auto max-w-[1560px] space-y-10 p-5 pb-12 sm:p-7 sm:pb-16">
        {tab === "Overview" && <Snapshots />}
        {body}
      </div>
    </main>
  );
}
