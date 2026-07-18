"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building2,
  Globe,
  Smartphone,
  ShoppingBag,
  UserRound,
  XCircle,
  Scale,
} from "lucide-react";

const API_URL =
  "https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi/api/analytics/orders-analysis";

// ---------- helpers ----------

const toDDMMYYYY = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
};

const toISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatNumber = (value) => String(Math.round(Number(value ?? 0)));

const BUY_CHANNELS = [
  { key: "website", label: "Website", Icon: Globe },
  { key: "app", label: "App", Icon: Smartphone },
  { key: "b2b", label: "B2B", Icon: Building2 },
  { key: "b2c", label: "B2C", Icon: UserRound },
];

const SELL_CHANNELS = [
  { key: "olx", label: "OLX", Icon: ShoppingBag },
  { key: "b2b", label: "B2B", Icon: Building2 },
  { key: "b2c", label: "B2C", Icon: UserRound },
  { key: "website", label: "Website", Icon: Globe },
  { key: "app", label: "App", Icon: Smartphone },
];

// ---------- presentational pieces ----------

function ChannelRow({ Icon, label, count, value }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 -mx-2 py-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
          <span className="inline-block mt-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
            {count} {count === 1 ? "order" : "orders"}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-sm font-bold text-green-600 tabular-nums">
        {formatNumber(value)}
      </span>
    </div>
  );
}

function MetricTile({ label, value, tone = "indigo" }) {
  const toneClass =
    tone === "red" ? "text-red-600" : tone === "green" ? "text-green-600" : "text-indigo-900";
  return (
    <div className="flex-1 rounded-xl bg-gray-50 px-4 py-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}

function SideCard({ side, orders, channels }) {
  const isBuy = side === "buy";
  const Icon = isBuy ? ArrowDownToLine : ArrowUpFromLine;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* gradient header, matches the product banner in the dashboard */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-lg font-extrabold text-white leading-tight">
              {isBuy ? "Buy Orders" : "Sell Orders"}
            </p>
            <p className="text-xs text-indigo-200">
              {channels.length} channels tracked
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          {orders?.total_count ?? 0} orders
        </span>
      </div>

      <div className="p-6">
        {/* metric tiles, mirrors MRP / PRICE / SELL STATUS layout */}
        <div className="flex flex-wrap gap-3 mb-5">
          <MetricTile label="Total value" value={formatNumber(orders?.total_value)} tone="indigo" />
          <MetricTile label="Total orders" value={orders?.total_count ?? 0} tone="indigo" />
          <MetricTile
            label="Cancelled"
            value={formatNumber(orders?.cancelled_value)}
            tone="red"
          />
        </div>

        {/* tab-style divider label, matches Combinations/Description/Questions bar */}
        <div className="border-b border-gray-200 mb-1">
          <span className="inline-block border-b-2 border-indigo-900 pb-2 text-sm font-bold text-indigo-900">
            Channels
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {channels.map((c) => (
            <ChannelRow
              key={c.key}
              Icon={c.Icon}
              label={c.label}
              count={orders?.[`${c.key}_count`] ?? 0}
              value={orders?.[`${c.key}_value`] ?? 0}
            />
          ))}
        </div>

        {/* cancelled strip, echoes the red "Remove" styling */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" strokeWidth={1.75} />
            <span className="text-sm font-semibold text-red-600">
              {orders?.cancelled_orders ?? 0} cancelled orders
            </span>
          </div>
          <span className="text-sm font-bold text-red-600 tabular-nums">
            {formatNumber(orders?.cancelled_value)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, Icon, tone }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
  };
  const valueTone =
    tone === "green" ? "text-green-600" : tone === "red" ? "text-red-600" : "text-indigo-900";
  return (
    <div className="flex-1 min-w-[160px] rounded-2xl border border-gray-200 bg-white shadow-sm px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${tones[tone]}`}>
          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>
      <p className={`text-2xl font-extrabold tabular-nums ${valueTone}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ---------- main component ----------

export default function OrdersLedgerDashboard() {
  const today = useMemo(() => new Date(), []);
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const [startInput, setStartInput] = useState(toISODate(weekAgo));
  const [endInput, setEndInput] = useState(toISODate(today));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (startISO, endISO) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        start_date: toDDMMYYYY(startISO),
        end_date: toDDMMYYYY(endISO),
      });
      const response = await fetch(`${API_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const json = await response.json();

      if (json?.success) {
        setData(json.data);
      } else {
        setError(json?.message || "The server did not return a successful response.");
      }
    } catch (err) {
      setError(err?.message || "Couldn't reach the orders analytics service.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  if (!startInput || !endInput) return;

  const loadData = async () => {
    await fetchData(startInput, endInput);
  };

  loadData();
}, [fetchData, startInput, endInput]);

  const handleApply = () => fetchData(startInput, endInput);

  const buy = data?.buy_orders;
  const sell = data?.sell_orders;
  const netValue = data ? (sell?.total_value ?? 0) - (buy?.total_value ?? 0) : 0;

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ---------- Header ---------- */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-1">
                Dacby · Analytics
              </p>
              <h1 className="text-3xl font-extrabold text-gray-900">Orders Overview</h1>
              <p className="text-sm text-gray-500 mt-1">
                Buy-side and sell-side order performance by channel
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">Start date</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600">
                  <Calendar className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
                  <input
                    type="date"
                    value={startInput}
                    max={endInput}
                    onChange={(e) => setStartInput(e.target.value)}
                    className="text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-500">End date</span>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-600/30 focus-within:border-indigo-600">
                  <Calendar className="h-4 w-4 text-gray-400" strokeWidth={1.75} />
                  <input
                    type="date"
                    value={endInput}
                    min={startInput}
                    onChange={(e) => setEndInput(e.target.value)}
                    className="text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </label>
              {/* <button
                onClick={handleApply}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-indigo-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                ) : (
                  <RefreshCw className="h-4 w-4" strokeWidth={2.25} />
                )}
                Apply
              </button> */}
            </div>
          </div>
        </div>

        {/* ---------- Error state ---------- */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" strokeWidth={1.75} />
            <div>
              <p className="text-sm text-red-700 font-bold">Couldn&apos;t load orders data</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleApply}
              className="ml-auto text-xs font-bold text-red-700 underline underline-offset-2 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* ---------- Loading skeleton ---------- */}
        {loading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white h-96" />
            ))}
          </div>
        )}

        {/* ---------- Content ---------- */}
        {data && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm">
                {toDDMMYYYY(startInput)} → {toDDMMYYYY(endInput)}
              </span>
              <span className="text-xs text-gray-400">
                Report date from API: <span className="font-semibold text-gray-600">{data.date}</span>
              </span>
            </div>

            {/* stat cards */}
            <div className="flex flex-wrap gap-3 mb-6">
              <StatCard
                label="Buy value"
                value={formatNumber(buy?.total_value)}
                sub={`${buy?.total_count ?? 0} orders`}
                Icon={ArrowDownToLine}
                tone="indigo"
              />
              <StatCard
                label="Sell value"
                value={formatNumber(sell?.total_value)}
                sub={`${sell?.total_count ?? 0} orders`}
                Icon={ArrowUpFromLine}
                tone="green"
              />
              <StatCard
                label="Net position"
                value={`${netValue >= 0 ? "+" : "−"}${formatNumber(Math.abs(netValue))}`}
                sub="Sell value minus buy value"
                Icon={Scale}
                tone={netValue >= 0 ? "green" : "red"}
              />
              <StatCard
                label="Cancelled value"
                value={formatNumber((buy?.cancelled_value ?? 0) + (sell?.cancelled_value ?? 0))}
                sub={`${(buy?.cancelled_orders ?? 0) + (sell?.cancelled_orders ?? 0)} orders combined`}
                Icon={XCircle}
                tone="red"
              />
            </div>

            {/* side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SideCard side="buy" orders={buy} channels={BUY_CHANNELS} />
              <SideCard side="sell" orders={sell} channels={SELL_CHANNELS} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
