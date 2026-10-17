"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsPalette } from "./AnalyticsPaletteContext";

const PERIODS = [
  { id: "today", label: "Today" },
  { id: "last30", label: "Last 30 Days" },
  { id: "custom", label: "Custom Range" },
];
const byPeriod = (today, last30, custom) => ({ today, last30, custom });

// Static until the reporting API is intentionally reintroduced. A value changes
// only for the date filters marked green in the source sheet.
const metrics = {
  b2cSales: { label: "B2C Sales", values: byPeriod(["₹4.82L", "186 units"], ["₹1.28Cr", "5,412 units"], ["₹58.6L", "2,244 units"]) },
  b2bSales: { label: "B2B Sales", values: byPeriod(["₹7.6L", "28 units"], ["₹2.1Cr", "740 units"], ["₹92.4L", "318 units"]) },
  b2cPurchase: { label: "B2C Purchase", values: byPeriod(["₹7.6L", "28 units"], ["₹2.1Cr", "740 units"], ["₹88.2L", "312 units"]) },
  b2bPurchase: { label: "B2B Purchase", values: byPeriod(["₹5.2L", "28 units"], ["₹1.6Cr", "520 units"], ["₹71.8L", "246 units"]) },
  b2cSalesOrders: { label: "B2C Sales Total Orders", values: byPeriod(["172", "orders"], ["4,980", "orders"], ["2,192", "orders"]) },
  b2bSalesOrders: { label: "B2B Sales Total Orders", values: byPeriod(["28", "orders"], ["740", "orders"], ["318", "orders"]) },
  b2cPurchaseOrders: { label: "B2C Purchase Total Orders", values: byPeriod(["28", "orders"], ["740", "orders"], ["312", "orders"]) },
  b2bPurchaseOrders: { label: "B2B Purchase Total Orders", values: byPeriod(["18", "orders"], ["520", "orders"], ["246", "orders"]) },
  b2cSalesCancelled: { label: "Cancelled B2C Sales Orders", values: byPeriod(["₹21K", "9 units"], ["₹6.4L", "281 units"], ["₹2.8L", "116 units"]) },
  b2bSalesCancelled: { label: "Cancelled B2B Sales Orders", values: byPeriod(["₹0", "0 units"], ["₹3.2L", "14 units"], ["₹1.4L", "6 units"]) },
  b2cPurchaseCancelled: { label: "Cancelled B2C Purchase Orders", values: byPeriod(["₹18K", "7 units"], ["₹5.1L", "214 units"], ["₹2.2L", "94 units"]) },
  olxOrders: { label: "OLX Orders", values: byPeriod(["₹7.6L", "37 units"], ["₹1.45Cr", "648 units"], ["₹63.4L", "287 units"]) },
  olxTotalOrders: { label: "OLX Total Orders", values: byPeriod(["32", "orders"], ["510", "orders"], ["224", "orders"]) },
  dispatchVolume: { label: "Daily Dispatch Volume", values: byPeriod(null, ["171 units", "₹4.9L / day"], ["164 units", "₹4.5L / day"]) },
  paymentReleasedPerDay: { label: "Daily Payments Released", values: byPeriod(["₹2.7L", "today"], ["₹74L", "last 30 days"], ["₹31.6L", "selected range"]) },
  b2bPaymentReleased: { label: "B2B Payment Released", values: byPeriod(["₹18L", "today"], null, ["₹47.5L", "selected range"]) },
};

const liveMetrics = {
  pendingDispatch: { label: "Pending Dispatch", value: "64 units", detail: "₹1.9L" },
  inTransit: { label: "Orders In Transit", value: "312 units", detail: "₹9.4L" },
  inReturn: { label: "Orders In Return", value: "47 units", detail: "₹1.6L" },
  pickedUp: { label: "Picked Up, Not Yet Received At Warehouse", value: "96 units", detail: "₹2.8L" },
  paymentPending: { label: "Payment Pending", value: "53 units", detail: "₹1.5L" },
  delayedDelivery: { label: "Overdue Deliveries (7+ Days)", value: "27", detail: "orders" },
  logisticsUnpicked: { label: "Awaiting Logistics Pickup", value: "18", detail: "orders" },
  vendorOverpayment: { label: "Vendor Payment Variance (Extra Amount Paid)", value: "₹84K", detail: "requires review" },
};

const demandRankings = {
  b2c: {
    sales: {
      products: [["iPhone 13, 128 GB", 18], ["Samsung S21 FE", 14], ["OnePlus 9R", 11], ["iPhone 12, 64 GB", 9], ["Redmi Note 11 Pro", 7], ["Pixel 6a", 6], ["Realme GT Neo 2", 5]],
      cities: [["Delhi", 24], ["Bengaluru", 16], ["Mumbai", 13], ["Hyderabad", 10], ["Pune", 8], ["Jaipur", 6], ["Chandigarh", 5]],
    },
    purchase: {
      products: [["iPhone 13, 128 GB", 20], ["Samsung S21 FE", 15], ["iPhone 12, 64 GB", 12], ["OnePlus 9R", 9], ["Redmi Note 11 Pro", 7], ["Pixel 6a", 6], ["Realme GT Neo 2", 4]],
      cities: [["Delhi", 26], ["Noida", 15], ["Gurugram", 12], ["Jaipur", 10], ["Chandigarh", 8], ["Lucknow", 6], ["Ghaziabad", 5]],
    },
  },
  b2b: {
    sales: {
      products: [["iPhone 12, 64 GB", 23], ["iPhone 11, 64 GB", 17], ["Samsung A52", 12], ["Redmi Note 10", 9], ["OnePlus Nord", 8], ["Realme 8 Pro", 6], ["Vivo V21", 4]],
      cities: [["Delhi", 28], ["Mumbai", 19], ["Bengaluru", 14], ["Pune", 9], ["Ahmedabad", 7], ["Chennai", 6], ["Hyderabad", 5]],
    },
    purchase: {
      products: [["Samsung A52", 19], ["iPhone 12, 64 GB", 16], ["Redmi Note 10", 13], ["OnePlus Nord", 10], ["iPhone 11, 64 GB", 8], ["Realme 8 Pro", 6], ["Vivo V21", 5]],
      cities: [["Delhi", 25], ["Mumbai", 18], ["Bengaluru", 15], ["Ahmedabad", 10], ["Pune", 8], ["Chennai", 7], ["Hyderabad", 5]],
    },
  },
};
const inventoryStatus = [
  ["Ready to Ship (RTS)", 42, "₹2.90Cr", "#13B89B"], ["Under Evaluation", 19, "₹1.31Cr", "#2A67EC"], ["Under Repair", 14, "₹96L", "#4D7EE8"], ["Product Attached", 10, "₹69L", "#74A7F5"], ["Ledger Out Done", 7, "₹48L", "#62BFAF"], ["Discarded", 5, "₹35L", "#D84F63"], ["Minor Scratch", 3, "₹21L", "#E98794"],
].map(([name, value, amount, color]) => ({ name, value, amount, color }));
const returnReasons = [["Defective / Not Working", 41, "#2A67EC"], ["Not As Described", 27, "#4D7EE8"], ["Damaged In Shipping", 19, "#13B89B"], ["Wrong Product Sent", 13, "#D84F63"]].map(([name, value, color]) => ({ name, value, color }));

const dailyTrendSeries = [
  { key: "b2cSales", title: "B2C Sales", color: "#2A67EC", values: [3.2, 4.1, 3.7, 5.2, 4.5, 5.7, 4.8, 5.1, 4.6, 5.9] },
  { key: "b2bSales", title: "B2B Sales", color: "#1656C2", values: [5.8, 6.4, 6.1, 7.2, 6.8, 7.9, 7.1, 6.7, 7.5, 8.2] },
  { key: "b2cPurchase", title: "B2C Purchase", color: "#13B89B", values: [4.3, 5.0, 4.6, 5.8, 5.2, 6.1, 5.5, 6.4, 5.9, 6.8] },
  { key: "b2bPurchase", title: "B2B Purchase", color: "#0D917F", values: [3.4, 4.0, 3.6, 4.7, 4.3, 5.1, 4.4, 5.3, 4.8, 5.6] },
];
const cancellationTrendSeries = [
  { key: "b2bSalesCancelled", title: "B2B Sales Orders", color: "#B83852", values: [0.08, 0.12, 0.06, 0.18, 0.13, 0.21, 0.1, 0.16, 0.19, 0.24] },
  { key: "b2cSalesCancelled", title: "B2C Sales Orders", color: "#D84F63", values: [0.16, 0.22, 0.12, 0.31, 0.19, 0.27, 0.21, 0.35, 0.28, 0.42] },
  { key: "b2cPurchaseCancelled", title: "B2C Purchase Orders", color: "#E46A78", values: [0.14, 0.19, 0.11, 0.25, 0.18, 0.29, 0.22, 0.17, 0.31, 0.26] },
];
const channelTrendSeries = [
  { key: "b2cAppSales", title: "App Sales", color: "#2A67EC", values: [1.9, 2.5, 2.2, 3.1, 2.8, 3.4, 3.0, 3.2, 2.9, 3.7] },
  { key: "b2cWebsiteSales", title: "Website Sales", color: "#13B89B", values: [1.3, 1.6, 1.5, 2.1, 1.7, 2.3, 1.8, 1.9, 1.7, 2.2] },
  { key: "b2cAppPurchase", title: "App Purchase", color: "#2A67EC", values: [1.8, 2.2, 2.0, 2.7, 2.4, 2.9, 2.5, 3.1, 2.7, 3.3] },
  { key: "b2cWebsitePurchase", title: "Website Purchase", color: "#13B89B", values: [2.5, 2.8, 2.6, 3.1, 2.8, 3.2, 3.0, 3.3, 3.2, 3.5] },
  { key: "b2bAppSales", title: "App Sales", color: "#2A67EC", values: [1.4, 1.8, 1.7, 2.2, 2.0, 2.5, 2.1, 2.4, 2.3, 2.7] },
  { key: "b2bWebsiteSales", title: "Website Sales", color: "#13B89B", values: [4.4, 4.6, 4.4, 5.0, 4.8, 5.4, 5.0, 4.3, 5.2, 5.5] },
  { key: "b2bAppPurchase", title: "App Purchase", color: "#1656C2", values: [0.9, 1.2, 1.1, 1.5, 1.3, 1.6, 1.4, 1.7, 1.5, 1.8] },
  { key: "b2bWebsitePurchase", title: "Website Purchase", color: "#0D917F", values: [2.5, 2.8, 2.5, 3.2, 3.0, 3.5, 3.0, 3.6, 3.3, 3.8] },
];

function Card({ children, className = "" }) {
  return <section className={`relative isolate overflow-hidden rounded-[22px] border text-[#18213b] shadow-[0_12px_34px_rgba(32,68,128,0.11)] backdrop-blur-2xl backdrop-saturate-150 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(32,68,128,0.14)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/70 [&>*]:relative [&>*]:z-10 ${className}`} style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.60), rgba(250,252,255,0.36) 48%, rgba(238,246,255,0.26))", borderColor: "rgba(255,255,255,0.66)" }}>{children}</section>;
}

function SectionHeading({ badge, title, description, live = false }) {
  return <div className="flex flex-wrap items-end justify-between gap-3"><div><span className="inline-flex rounded-full bg-[#102449] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-sm">{badge}</span><h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#151D35]">{title}</h2><p className="mt-1 text-sm font-medium text-[#53647F]">{description}</p></div><span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${live ? "border-[#B7F1CD] bg-[#ECFBF3] text-[#157348]" : "border-[#C9DCFF] bg-[#EDF3FF] text-[#2459C4]"}`}><i className={`h-1.5 w-1.5 rounded-full ${live ? "bg-[#16B879]" : "bg-[#2A67EC]"}`} />{live ? "Live Operational Data" : "Date-Range Data"}</span></div>;
}

function MetricCard({ metric, period, icon: Icon = CircleDollarSign, tone = "blue", orderMetric }) {
  const value = metric.values[period];
  const orders = orderMetric?.values[period];
  const accents = { blue: "bg-[#EDF3FF] text-[#2A67EC]", teal: "bg-[#E9FBF7] text-[#11967F]", violet: "bg-[#EDF3FF] text-[#1656C2]", amber: "bg-[#E9FBF7] text-[#0D917F]", rose: "bg-[#FFF0F2] text-[#D34D5D]" };
  const isCancelledOrder = tone === "rose";
  return <Card className="min-h-[168px] p-5"><div className="flex items-start justify-between gap-3"><p className="whitespace-nowrap text-base font-bold leading-5 tracking-[-0.02em] text-[#53647F] capitalize">{metric.label}</p><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accents[tone]}`}><Icon className="h-4 w-4" /></span></div>{value ? <div className="mt-6"><p className={`text-3xl font-bold tracking-[-0.04em] ${isCancelledOrder ? "text-[#B83852]" : "text-[#151D35]"}`}>{value[0]}</p><p className={`mt-1 text-sm font-semibold capitalize ${isCancelledOrder ? "text-[#C85E6B]" : "text-[#71809A]"}`}>{value[1]}</p>{orders && <div className="mt-2 flex items-center justify-between border-t border-[#DCE5F1]/90 pt-2"><span className="text-xs font-bold text-[#53647F]">Total Orders</span><span className="rounded-md bg-[#EDF3FF] px-2.5 py-1 text-sm font-black text-[#2459C4]">{orders[0]} <span className="text-[11px] font-bold">Orders</span></span></div>}</div> : <p className="mt-7 text-sm font-semibold text-[#8190A9]">Not available for the selected period</p>}</Card>;
}

function LiveKpiCard({ metric, icon: Icon = Activity, tone = "teal" }) {
  const accents = { amber: "bg-[#E9FBF7] text-[#0D917F]", teal: "bg-[#E9FBF7] text-[#11967F]", rose: "bg-[#FFF0F2] text-[#D34D5D]", violet: "bg-[#EDF3FF] text-[#1656C2]" };
  const isNegative = tone === "rose";
  return <Card className="min-h-[168px] p-5"><div className="flex items-start justify-between gap-3"><p className="whitespace-nowrap text-base font-bold leading-5 tracking-[-0.02em] text-[#53647F] capitalize">{metric.label}</p><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accents[tone]}`}><Icon className="h-4 w-4" /></span></div><div className="mt-6"><p className={`text-3xl font-bold tracking-[-0.04em] ${isNegative ? "text-[#B83852]" : "text-[#151D35]"}`}>{metric.value}</p><p className={`mt-1 text-sm font-semibold capitalize ${isNegative ? "text-[#C85E6B]" : "text-[#71809A]"}`}>{metric.detail}</p></div></Card>;
}

function formatReportingDate(date) {
  if (!date) return "date not selected";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function DateFilters({ period, onChange, customDates, onDateChange }) {
  const selectedRange = period === "today"
    ? "Selected reporting period: Today"
    : period === "last30"
      ? "Selected reporting period: Last 30 Days"
      : `Selected reporting period: ${formatReportingDate(customDates.start)} – ${formatReportingDate(customDates.end)}`;

  return <Card className="p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#2A67EC]">Analytics Controls</p><h2 className="mt-1 text-lg font-bold text-[#151D35]">Reporting Period</h2></div><div className="flex flex-wrap items-end justify-end gap-3"><div className="flex rounded-xl bg-[#EFF3F8] p-1 text-xs font-bold">{PERIODS.map((item) => <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`rounded-lg px-3 py-2 transition ${period === item.id ? "bg-white text-[#2A67EC] shadow-[0_2px_8px_rgba(32,68,128,0.12)]" : "text-[#71809A] hover:text-[#53647F]"}`}>{item.label}</button>)}</div>{period === "custom" && <div className="flex flex-wrap items-end gap-2 rounded-xl border border-[#DCE5F1]/90 bg-white/45 p-2"><label className="text-[11px] font-bold text-[#71809A]">Start<input type="date" value={customDates.start} onChange={(event) => onDateChange("start", event.target.value)} className="mt-1 block w-[140px] rounded-lg border border-[#DCE5F1] bg-white/80 px-2 py-1.5 text-xs text-[#53647F] outline-none focus:border-[#2A67EC]" /></label><label className="text-[11px] font-bold text-[#71809A]">End<input type="date" value={customDates.end} onChange={(event) => onDateChange("end", event.target.value)} className="mt-1 block w-[140px] rounded-lg border border-[#DCE5F1] bg-white/80 px-2 py-1.5 text-xs text-[#53647F] outline-none focus:border-[#2A67EC]" /></label></div>}</div></div><p className="mt-4 border-t border-[#DCE5F1]/80 pt-4 text-sm font-bold text-[#2459C4]">{selectedRange}<span className="ml-2 font-medium text-[#71809A]">· Live operational cards reflect current status.</span></p></Card>;
}

function BarPanel({ title, description, data, color, controls }) {
  return <Card className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-base font-bold text-[#151D35]">{title}</h3><p className="mt-1 text-xs font-medium text-[#71809A]">{description}</p></div>{controls}</div><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 18, bottom: 0 }}><CartesianGrid horizontal={false} stroke={analyticsPalette.chart.grid} strokeDasharray="3 4" /><XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: analyticsPalette.chart.axis, fontSize: 11 }} tickFormatter={(value) => `${value}%`} /><YAxis type="category" dataKey="name" width={110} tickLine={false} axisLine={false} tick={{ fill: analyticsPalette.text.secondary, fontSize: 11, fontWeight: 600 }} /><Tooltip cursor={{ fill: "rgba(42,103,236,.06)" }} formatter={(value) => [`${value}%`, "% of value"]} contentStyle={{ borderRadius: 12, border: `1px solid ${analyticsPalette.surface.border}`, boxShadow: "0 10px 24px rgba(32,68,128,.12)" }} /><Bar dataKey="value" fill={color} radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer></div></Card>;
}

function ChannelMix({ period, segment }) {
  const visible = period !== "today";
  const segmentLabel = segment === "all" ? "" : `${segment.toUpperCase()} `;
  const channelMix = {
    all: { sales: [64, 36], purchase: [46, 54] },
    b2c: { sales: [64, 36], purchase: [46, 54] },
    b2b: { sales: [31, 69], purchase: [22, 78] },
  }[segment];
  const salesMix = [{ name: "App", value: channelMix.sales[0], color: "#2A67EC" }, { name: "Web", value: channelMix.sales[1], color: "#13B89B" }];
  const purchaseMix = [{ name: "App", value: channelMix.purchase[0], color: "#2A67EC" }, { name: "Web", value: channelMix.purchase[1], color: "#13B89B" }];
  const donut = (title, data) => <Card className="p-5"><h3 className="text-base font-bold text-[#151D35]">{title}</h3><p className="mt-1 text-xs font-medium text-[#71809A]">% of Value</p>{visible ? <div className="mt-4 flex items-center gap-5"><div className="h-32 w-32 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={38} outerRadius={58} paddingAngle={3} stroke="none">{data.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-3">{data.map((item) => <p key={item.name} className="flex items-center gap-2 text-sm font-bold text-[#53647F]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.name} <span className="text-[#151D35]">{item.value}%</span></p>)}</div></div> : <p className="mt-7 text-sm font-semibold text-[#8190A9]">Available for Last 30 Days and Custom Ranges.</p>}</Card>;
  return <div className="grid gap-4 md:grid-cols-2">{donut(`${segmentLabel}Sales by Channel`, salesMix)}{donut(`${segmentLabel}Purchases by Channel`, purchaseMix)}</div>;
}

function buildTrendDates(period, customDates, count) {
  const start = new Date(`${period === "custom" ? customDates.start : "2026-09-18"}T00:00:00`);
  const end = new Date(`${period === "custom" ? customDates.end : "2026-10-17"}T00:00:00`);
  const step = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000 / (count - 1)));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index * step);
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(date);
  });
}

function DailyTrendCard({ trend, period, customDates, bar = false, cancellation = false }) {
  const labels = buildTrendDates(period, customDates, trend.values.length);
  const data = trend.values.map((value, index) => ({ day: labels[index], value }));
  const gradientId = `trend-${trend.key}`;
  const axes = <><CartesianGrid vertical={false} stroke={analyticsPalette.chart.grid} strokeDasharray="3 5" /><XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: analyticsPalette.chart.axis, fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: analyticsPalette.chart.axis, fontSize: 10 }} tickFormatter={(value) => `₹${value}L`} /><Tooltip formatter={(value) => [`₹${value}L`, trend.title]} contentStyle={{ borderRadius: 12, border: `1px solid ${analyticsPalette.surface.border}`, boxShadow: "0 10px 24px rgba(32,68,128,.12)" }} /></>;
  return <Card className={`p-5 ${cancellation ? "border-white/80 shadow-[0_10px_28px_rgba(125,44,62,0.08)]" : ""}`}><div className="flex items-start justify-between gap-3"><div>{cancellation && <span className="inline-flex rounded-full bg-[#FFF0F2] px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#B83852]">Cancelled Orders</span>}<h3 className={`${cancellation ? "mt-2" : ""} text-base font-bold text-[#151D35]`}>{trend.title}</h3><p className="mt-1 text-xs font-medium text-[#71809A]">{cancellation ? "Cancelled-Order Value by Day · ₹ Lakh" : "Sales or Purchase Value by Day · ₹ Lakh"}</p></div><i className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: trend.color }} /></div><div className={`${cancellation ? "mt-4 h-48" : "mt-5 h-52"}`}><ResponsiveContainer width="100%" height="100%">{bar ? <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barSize={14}>{axes}<Bar dataKey="value" fill={trend.color} radius={[4, 4, 0, 0]} /></BarChart> : <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={trend.color} stopOpacity={0.24} /><stop offset="100%" stopColor={trend.color} stopOpacity={0} /></linearGradient></defs>{axes}<Area type="monotone" dataKey="value" stroke={trend.color} strokeWidth={2.5} fill={`url(#${gradientId})`} activeDot={{ r: 4 }} /></AreaChart>}</ResponsiveContainer></div></Card>;
}

function DailyTrends({ period, customDates, segment }) {
  const trendPeriodLabel = period === "last30" ? "Last 30 Days" : period === "custom" ? "Custom Range" : "Select a Date Range";
  const visibleTrends = segment === "all" ? dailyTrendSeries : dailyTrendSeries.filter((trend) => trend.key.startsWith(segment));
  const visibleCancellations = segment === "all" ? cancellationTrendSeries : cancellationTrendSeries.filter((trend) => trend.key.startsWith(segment));
  return <div className="mt-7"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-base font-bold text-[#151D35]">Sales and Purchase Activity by Day</h3><p className="mt-1 text-xs font-medium text-[#71809A]">Track daily sales and purchase value across B2C and B2B for the selected reporting period.</p></div><span className="rounded-full border border-[#C9DCFF] bg-[#EDF3FF] px-3 py-1 text-[11px] font-bold text-[#2459C4]">{trendPeriodLabel}</span></div>{period === "today" ? <Card className="p-5 text-sm font-semibold text-[#71809A]">Daily sales and purchase performance is available for Last 30 days and Custom range.</Card> : <><div className="grid gap-4 md:grid-cols-2">{visibleTrends.map((trend) => <DailyTrendCard key={trend.key} trend={trend} period={period} customDates={customDates} />)}</div><div className="mt-8 rounded-[24px] border border-white/85 bg-white/30 p-4 shadow-[0_14px_34px_rgba(125,44,62,0.05)] sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="inline-flex rounded-full bg-[#FFF0F2] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#B83852]">Exceptions</span><h3 className="mt-2 text-base font-bold text-[#151D35]">Cancelled Orders by Day</h3><p className="mt-1 text-xs font-medium text-[#71809A]">Review the value associated with cancelled sales and purchase orders.</p></div><span className="rounded-full border border-[#F5C7CE] bg-white/70 px-3 py-1 text-[11px] font-bold text-[#B83852]">₹ lakh</span></div><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleCancellations.map((trend) => <DailyTrendCard key={trend.key} trend={trend} period={period} customDates={customDates} bar cancellation />)}</div></div></>}</div>;
}

function ChannelComparisonCard({ title, appValues, websiteValues, period, customDates }) {
  const labels = buildTrendDates(period, customDates, appValues.length);
  const data = appValues.map((app, index) => ({ day: labels[index], App: app, Website: websiteValues[index] }));
  return <Card className="p-5"><div><h3 className="text-base font-bold text-[#151D35]">{title}</h3><p className="mt-1 text-xs font-medium text-[#71809A]">Daily Value by Channel · ₹ Lakh</p></div><div className="mt-5 h-56"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke={analyticsPalette.chart.grid} strokeDasharray="3 5" /><XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tick={{ fill: analyticsPalette.chart.axis, fontSize: 10 }} /><YAxis tickLine={false} axisLine={false} tick={{ fill: analyticsPalette.chart.axis, fontSize: 10 }} tickFormatter={(value) => `₹${value}L`} /><Tooltip formatter={(value, name) => [`₹${value}L`, name]} contentStyle={{ borderRadius: 12, border: `1px solid ${analyticsPalette.surface.border}`, boxShadow: "0 10px 24px rgba(32,68,128,.12)" }} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }} /><Line type="monotone" dataKey="App" stroke="#2A67EC" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} /><Line type="monotone" dataKey="Website" stroke="#13B89B" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></Card>;
}

function ChannelDailyTrends({ period, customDates, segment }) {
  const getTrend = (key) => channelTrendSeries.find((trend) => trend.key === key).values;
  const aggregate = (metric) => getTrend(`b2c${metric}`).map((value, index) => value + getTrend(`b2b${metric}`)[index]);
  const valuesFor = (metric) => segment === "all" ? aggregate(metric) : getTrend(`${segment}${metric}`);
  const segmentLabel = segment === "all" ? "" : segment.toUpperCase();

  return <div className="mt-7"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-base font-bold text-[#151D35]">App and Website Performance by Day</h3><p className="mt-1 text-xs font-medium text-[#71809A]">Compare daily sales and purchase value across the App and Website.</p></div></div>{period === "today" ? <Card className="p-5 text-sm font-semibold text-[#71809A]">Channel performance is available for Last 30 days and Custom range.</Card> : <div className="grid gap-4 md:grid-cols-2"><ChannelComparisonCard title={segmentLabel ? `${segmentLabel} Sales by Channel` : "Sales by Channel"} appValues={valuesFor("AppSales")} websiteValues={valuesFor("WebsiteSales")} period={period} customDates={customDates} /><ChannelComparisonCard title={segmentLabel ? `${segmentLabel} Purchases by Channel` : "Purchases by Channel"} appValues={valuesFor("AppPurchase")} websiteValues={valuesFor("WebsitePurchase")} period={period} customDates={customDates} /></div>}</div>;
}

function CommercialPerformance({ period, segment, customDates }) {
  const cards = [
    { segment: "b2c", metric: metrics.b2cSales, icon: CircleDollarSign, tone: "blue", orderMetric: metrics.b2cSalesOrders },
    { segment: "b2b", metric: metrics.b2bSales, icon: CircleDollarSign, tone: "violet", orderMetric: metrics.b2bSalesOrders },
    { segment: "b2c", metric: metrics.b2cPurchase, icon: ShoppingBag, tone: "teal", orderMetric: metrics.b2cPurchaseOrders },
    { segment: "b2b", metric: metrics.b2bPurchase, icon: ShoppingBag, tone: "amber", orderMetric: metrics.b2bPurchaseOrders },
    { segment: "all", row: "cancellation", metric: metrics.olxOrders, orderMetric: metrics.olxTotalOrders, icon: ShoppingBag, tone: "blue" },
    { segment: "b2b", metric: metrics.b2bSalesCancelled, icon: ArrowDownRight, tone: "rose" },
    { segment: "b2c", metric: metrics.b2cSalesCancelled, icon: ArrowDownRight, tone: "rose" },
    { segment: "b2c", metric: metrics.b2cPurchaseCancelled, icon: ArrowDownRight, tone: "rose" },
  ];
  const visibleCards = segment === "all" ? cards : cards.filter((card) => card.segment === segment);
  const primaryCards = visibleCards.filter((card) => card.row !== "cancellation" && card.tone !== "rose");
  const cancellationCards = visibleCards.filter((card) => card.row === "cancellation" || card.tone === "rose");
  const title = segment === "all" ? "B2C / B2B Commercial Performance" : `${segment.toUpperCase()} Commercial Performance`;

  return <section className="space-y-5"><SectionHeading badge="Sales & Purchase" title={title} description="Sales, purchase value, units, orders, and cancellations." /><div className={`grid gap-4 md:grid-cols-2 ${primaryCards.length > 4 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>{primaryCards.map((card) => <MetricCard key={card.metric.label} metric={card.metric} period={period} icon={card.icon} tone={card.tone} orderMetric={card.orderMetric} />)}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cancellationCards.map((card) => <MetricCard key={card.metric.label} metric={card.metric} period={period} icon={card.icon} tone={card.tone} orderMetric={card.orderMetric} />)}</div><ChannelMix period={period} segment={segment} /><ChannelDailyTrends period={period} customDates={customDates} segment={segment} /><DailyTrends period={period} customDates={customDates} segment={segment} /></section>;
}

function DemandInsights({ period }) {
  const [productBusinessType, setProductBusinessType] = useState("b2c");
  const [productTransactionType, setProductTransactionType] = useState("sales");
  const [cityTransactionType, setCityTransactionType] = useState("sales");
  const productRanking = demandRankings[productBusinessType][productTransactionType].products;
  const cityRanking = demandRankings.b2c[cityTransactionType].cities;
  const productSelectionLabel = `${productBusinessType.toUpperCase()} ${productTransactionType === "sales" ? "Sales" : "Purchase"}`;
  const citySelectionLabel = `B2C ${cityTransactionType === "sales" ? "Sales" : "Purchase"}`;
  const controls = (label, value, onChange, options) => <div className="flex items-center gap-2"><span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#71809A]">{label}</span><div className="flex rounded-lg bg-[#EFF3F8] p-1 text-xs font-bold">{options.map((option) => <button key={option.id} type="button" onClick={() => onChange(option.id)} className={`rounded-md px-3 py-1.5 transition ${value === option.id ? "bg-white text-[#2A67EC] shadow-sm" : "text-[#71809A] hover:text-[#53647F]"}`}>{option.label}</button>)}</div></div>;

  return <section className="space-y-5"><SectionHeading badge="Top Products & Cities" title="Demand Distribution" description="Product rankings support B2C and B2B. City rankings cover B2C sales and purchase activity." />{period === "today" ? <Card className="p-6 text-sm font-semibold text-[#71809A]">Product and city insights are available for Last 30 days and custom date ranges.</Card> : <div className="grid gap-4 xl:grid-cols-2"><BarPanel title="Top 7 Products" description={`${productSelectionLabel} · Share of Value`} data={productRanking.map(([name, value]) => ({ name, value }))} color={analyticsPalette.chart.primary} controls={<div className="flex flex-wrap gap-3">{controls("Business", productBusinessType, setProductBusinessType, [{ id: "b2c", label: "B2C" }, { id: "b2b", label: "B2B" }])}{controls("Type", productTransactionType, setProductTransactionType, [{ id: "sales", label: "Sales" }, { id: "purchase", label: "Purchase" }])}</div>} /><BarPanel title="Top 7 Cities" description={`${citySelectionLabel} · Share of Value`} data={cityRanking.map(([name, value]) => ({ name, value }))} color={analyticsPalette.chart.secondary} controls={controls("Type", cityTransactionType, setCityTransactionType, [{ id: "sales", label: "Sales" }, { id: "purchase", label: "Purchase" }])} /></div>}</section>;
}

function InventoryStatus() {
  return <Card className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-base font-bold text-[#151D35]">Inventory Status Mix</h3><p className="mt-1 text-xs font-medium text-[#71809A]">% of Inventory Value · Live Snapshot</p></div><div className="text-right"><p className="text-2xl font-bold text-[#151D35]">₹6.90Cr</p><p className="text-xs font-semibold text-[#71809A]">8,420 Units Total</p></div></div><div className="mt-5 grid gap-6 lg:grid-cols-[220px_1fr]"><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={inventoryStatus} dataKey="value" innerRadius={56} outerRadius={88} paddingAngle={2} stroke="none">{inventoryStatus.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="grid content-center gap-3 sm:grid-cols-2">{inventoryStatus.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 font-semibold text-[#53647F]"><i className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.name}</span><span className="shrink-0 font-bold text-[#151D35]">{item.value}% · {item.amount}</span></div>)}</div></div></Card>;
}

function ReturnsPanel() {
  return <Card className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-base font-bold text-[#151D35]">Return Reasons</h3><p className="mt-1 text-xs font-medium text-[#71809A]">% of Return Value · Live Snapshot</p></div><RotateCcw className="h-5 w-5 text-[#2A67EC]" /></div><div className="mt-5 grid gap-6 lg:grid-cols-[220px_1fr]"><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={returnReasons} dataKey="value" innerRadius={56} outerRadius={88} paddingAngle={2} stroke="none">{returnReasons.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-4 self-center">{returnReasons.map((item) => <div key={item.name}><div className="flex justify-between gap-4 text-sm"><span className="font-semibold text-[#53647F]">{item.name}</span><span className="font-bold text-[#151D35]">{item.value}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EAF0F7]"><i className="block h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} /></div></div>)}</div></div></Card>;
}

export default function Live_Data_Industry() {
  const [period, setPeriod] = useState("last30");
  const segment = "all";
  const [customDates, setCustomDates] = useState({ start: "2026-09-18", end: "2026-10-17" });
  const updateDate = (field, value) => setCustomDates((current) => ({ ...current, [field]: value }));
  return <main className="glass-image-page font-sans text-slate-800"><header className="relative z-10 px-5 pt-4 sm:px-7"><div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/45 px-4 py-3 shadow-[0_8px_26px_rgba(32,68,128,.06)] backdrop-blur-xl sm:px-5"><div><p className="text-[11px] font-black uppercase tracking-[.16em] text-[#2A67EC]">DACBY OPERATIONS</p><h1 className="text-xl font-bold tracking-tight text-[#151D35]">Live Data</h1></div><div className="flex items-center gap-2 rounded-full border border-[#B7F1CD] bg-[#ECFBF3]/85 px-3 py-1.5 text-xs font-bold text-[#157348]"><i className="h-2 w-2 rounded-full bg-[#16B879]" />Live Operations</div></div></header><div className="relative z-10 mx-auto max-w-[1560px] space-y-12 p-5 pb-16 sm:p-7"><DateFilters period={period} onChange={setPeriod} customDates={customDates} onDateChange={updateDate} />

    <CommercialPerformance period={period} segment={segment} customDates={customDates} />

    <DemandInsights period={period} />

    {(segment === "all" || segment === "b2c") && <section className="space-y-5"><SectionHeading badge="B2C Sales Volume" title="Fulfilment" description="Live order queues plus filtered dispatch throughput. KPI cards only." live /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><LiveKpiCard metric={liveMetrics.pendingDispatch} icon={Truck} /><LiveKpiCard metric={liveMetrics.inTransit} icon={Truck} tone="teal" /><LiveKpiCard metric={liveMetrics.inReturn} icon={RotateCcw} tone="rose" /><MetricCard metric={metrics.dispatchVolume} period={period} icon={Activity} tone="violet" /></div></section>}

    {(segment === "all" || segment === "b2c") && <section className="space-y-5"><SectionHeading badge="B2C Purchase" title="Purchase Operations" description="Payment release is range-aware; receiving and logistics exceptions are live." live /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><MetricCard metric={metrics.paymentReleasedPerDay} period={period} icon={CircleDollarSign} tone="teal" /><LiveKpiCard metric={liveMetrics.pickedUp} icon={Truck} /><LiveKpiCard metric={liveMetrics.paymentPending} icon={Clock3} tone="amber" /><LiveKpiCard metric={liveMetrics.delayedDelivery} icon={Clock3} tone="rose" /><LiveKpiCard metric={liveMetrics.logisticsUnpicked} icon={Activity} tone="violet" /></div></section>}

    {(segment === "all" || segment === "b2b") && <section className="space-y-5"><SectionHeading badge="B2B Purchase" title="Vendor Payments" description="Vendor overpayment is live; payment released follows the applicable date filter." live /><div className="grid gap-4 md:grid-cols-2"><LiveKpiCard metric={liveMetrics.vendorOverpayment} icon={ArrowUpRight} tone="rose" /><MetricCard metric={metrics.b2bPaymentReleased} period={period} icon={CircleDollarSign} tone="teal" /></div></section>}

    <section className="space-y-5"><SectionHeading badge="Inventory Data" title="Warehouse Inventory" description="All inventory fields are live snapshots and do not respond to the date filter." live /><InventoryStatus /></section>
    <section className="space-y-5"><SectionHeading badge="Return" title="Return Quality" description="Return-reason percentages are live and independent of the reporting period." live /><ReturnsPanel /></section>
  </div></main>;
}
