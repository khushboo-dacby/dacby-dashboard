"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wallet,
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Download,
  Plus,
  X,
  Loader2,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  Layers,
  Sparkles,
  ShieldCheck,
  CreditCard,
  SlidersHorizontal,
} from "lucide-react";
import {
  formatDateTime,
  formatRelativeTime,
  formatCurrencyINR,
  parseTimestamp,
} from "../customerUtils";
import { addWalletMoney } from "../api";

const ADD_MONEY_REASONS = [
  "Broken Case",
  "Delay In Dispatch",
  "Order Not Fulfilled",
  "In Transit Damage",
  "YouTube Reward",
  "Reddit Reward",
  "Instagram Reward",
  "Playstore Reward",
  "Reward",
  "Compensation",
];

/**
 * Maps raw payment methods from API to clean, readable status pills.
 * Keeps the exact terminology from the API (Wallet, UPI, Card, Netbanking, Manual, Gateway).
 */
function getMethodBadge(tx) {
  const rawMethod = (tx.method || "").toLowerCase().trim();

  if (rawMethod === "wallet") {
    return {
      label: "Wallet",
      className: "bg-[#EDF3FF] text-[#2459C4] border-[#C9DCFF]",
    };
  }
  if (rawMethod === "wallet+upi") {
    return {
      label: "Wallet + UPI",
      className: "bg-[#F3EEFF] text-[#704CF3] border-[#DDD0FF]",
    };
  }
  if (rawMethod === "upi") {
    return {
      label: "UPI",
      className: "bg-[#E9FBF7] text-[#11967F] border-[#A6EBDD]",
    };
  }
  if (rawMethod === "netbanking") {
    return {
      label: "Netbanking",
      className: "bg-[#EDF5FF] text-[#1E57D2] border-[#C9DCFF]",
    };
  }
  if (rawMethod === "card") {
    return {
      label: "Card",
      className: "bg-[#F8FAFC] text-[#53647F] border-[#DCE5F1]",
    };
  }
  if (rawMethod === "manual") {
    return {
      label: "Manual",
      className: "bg-[#FFF8E9] text-[#C87513] border-[#F4D877]",
    };
  }
  if (tx.payment_id) {
    return {
      label: "Gateway",
      className: "bg-[#ECFBF3] text-[#157348] border-[#B7F1CD]",
    };
  }
  if (rawMethod) {
    return {
      label:
        rawMethod.length <= 4
          ? rawMethod.toUpperCase()
          : rawMethod.charAt(0).toUpperCase() + rawMethod.slice(1),
      className: "bg-[#F8FAFC] text-[#53647F] border-[#DCE5F1]",
    };
  }
  return {
    label: "Wallet",
    className: "bg-[#EDF3FF] text-[#2459C4] border-[#C9DCFF]",
  };
}

export default function CustomerWallet({
  userId = "",
  wallet = 0,
  transactions = [],
  onWalletUpdated,
}) {
  // Standard wallet controls
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "credit" | "debit" | "standalone"
  const [sortOption, setSortOption] = useState("newest"); // "newest" | "oldest" | "amount_desc" | "amount_asc"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [copiedKey, setCopiedKey] = useState(null);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [addMoneyError, setAddMoneyError] = useState("");
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [addMoneyResult, setAddMoneyResult] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- STANDARD WALLET METRICS ---
  const safeWalletBalance =
    typeof wallet === "number"
      ? wallet
      : typeof wallet === "object" && wallet !== null
      ? wallet.total ?? wallet.balance ?? 0
      : Number(wallet) || 0;
  const displayedWalletBalance =
    addMoneyResult?.wallet?.new_balance ?? safeWalletBalance;

  const closeAddMoney = () => {
    setIsAddMoneyOpen(false);
    setAmount("");
    setReason("");
    setAddMoneyError("");
    setAddMoneyResult(null);
  };

  const handleAddMoney = async (event) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setAddMoneyError("Enter an amount greater than ₹0.");
      return;
    }
    if (!reason) {
      setAddMoneyError("Select a reason for this credit.");
      return;
    }

    setIsAddingMoney(true);
    setAddMoneyError("");
    try {
      const result = await addWalletMoney({
        userId,
        amount: numericAmount,
        action: "credit",
        reason,
      });
      setAddMoneyResult(result);
      await onWalletUpdated?.();
    } catch (error) {
      setAddMoneyError(error?.message || "Unable to add money to the wallet.");
    } finally {
      setIsAddingMoney(false);
    }
  };

  const creditTxns = useMemo(
    () => transactions.filter((tx) => tx.action === "credit"),
    [transactions]
  );
  const debitTxns = useMemo(
    () => transactions.filter((tx) => tx.action === "debit"),
    [transactions]
  );
  const standaloneTxns = useMemo(
    () => transactions.filter((tx) => !tx.orderId),
    [transactions]
  );
  const orderTxns = useMemo(
    () => transactions.filter((tx) => Boolean(tx.orderId)),
    [transactions]
  );

  const credits = useMemo(
    () => creditTxns.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [creditTxns]
  );
  const debits = useMemo(
    () => debitTxns.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0),
    [debitTxns]
  );
  const netDelta = credits - debits;

  // Filter & Search Standard Transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      // Filter tab
      if (filter === "credit" && tx.action !== "credit") return false;
      if (filter === "debit" && tx.action !== "debit") return false;
      if (filter === "standalone" && tx.orderId) return false;

      // Search Query across real API fields
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = String(tx.id || "").toLowerCase().includes(q);
        const matchOrder = String(tx.orderId || "").toLowerCase().includes(q);
        const matchPayId = String(tx.payment_id || "").toLowerCase().includes(q);
        const matchItem = String(tx.item || "").toLowerCase().includes(q);
        const matchMethod = String(tx.method || "").toLowerCase().includes(q);
        const matchReason = String(tx.reason || "").toLowerCase().includes(q);
        if (
          !matchId &&
          !matchOrder &&
          !matchPayId &&
          !matchItem &&
          !matchMethod &&
          !matchReason
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "newest") {
        const timeA = parseTimestamp(a.timestamp || a.created_at)?.getTime() || 0;
        const timeB = parseTimestamp(b.timestamp || b.created_at)?.getTime() || 0;
        return timeB - timeA;
      }
      if (sortOption === "oldest") {
        const timeA = parseTimestamp(a.timestamp || a.created_at)?.getTime() || 0;
        const timeB = parseTimestamp(b.timestamp || b.created_at)?.getTime() || 0;
        return timeA - timeB;
      }
      if (sortOption === "amount_desc") {
        return Number(b.amount || 0) - Number(a.amount || 0);
      }
      if (sortOption === "amount_asc") {
        return Number(a.amount || 0) - Number(b.amount || 0);
      }
      return 0;
    });

    return result;
  }, [transactions, filter, searchQuery, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTransactions.length);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      "Transaction ID",
      "Action",
      "Amount (INR)",
      "Item",
      "Order ID",
      "Payment ID",
      "Method",
      "Reason",
      "Date Time",
    ];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.id || ""}"`,
      `"${tx.action || ""}"`,
      Number(tx.amount || 0),
      `"${(tx.item || "").replace(/"/g, '""')}"`,
      `"${tx.orderId || ""}"`,
      `"${tx.payment_id || ""}"`,
      `"${tx.method || ""}"`,
      `"${(tx.reason || "").replace(/"/g, '""')}"`,
      `"${formatDateTime(tx.timestamp || tx.created_at)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `wallet_activity_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & OPTIONAL WALLET SEGMENT SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-2xs">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#151D35]">
                Wallet Activity
              </h2>
              <p className="text-sm font-medium text-[#53647F]">
                Historical breakdown of credits, debits, orders, and payment settlements.
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAddMoneyOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-[#151D35] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#2A354F] sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Money
        </button>

      </div>

      <div className="space-y-6">
          {/* Executive Balance & Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Balance */}
            <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:border-[#C9DCFF]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Wallet Balance
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
                  <Wallet className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#151D35]">
                    {formatCurrencyINR(displayedWalletBalance)}
                  </p>
                  <span className="text-xs font-bold text-[#2A67EC] bg-[#EDF3FF] border border-[#C9DCFF] px-2 py-0.5 rounded-md">
                    Active Balance
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#53647F]">
                  Current in-app store balance
                </p>
              </div>
            </div>

            {/* Total Inflow (Credits) */}
            <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Total Credits
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFBF3] text-[#157348]">
                  <ArrowDownLeft className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#157348]">
                    +{formatCurrencyINR(credits)}
                  </p>
                  <span className="text-xs font-bold text-[#157348] bg-[#ECFBF3] border border-[#B7F1CD] px-2 py-0.5 rounded-md">
                    {creditTxns.length} Credits
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#53647F]">
                  Total incoming funds & refunds
                </p>
              </div>
            </div>

            {/* Total Outflow (Debits) */}
            <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Total Debits
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0F2] text-[#D34D5D]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#D34D5D]">
                    -{formatCurrencyINR(debits)}
                  </p>
                  <span className="text-xs font-bold text-[#D34D5D] bg-[#FFF0F2] border border-[#F5C2CA] px-2 py-0.5 rounded-md">
                    {debitTxns.length} Debits
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#53647F]">
                  Total store orders & payments
                </p>
              </div>
            </div>

            {/* Total Movements */}
            <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Total Transactions
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2F5FA] text-[#53647F]">
                  <RotateCcw className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#151D35]">
                    {transactions.length}
                  </p>
                  <span className="text-xs font-bold text-[#53647F] bg-[#F2F5FA] border border-[#DCE5F1] px-2 py-0.5 rounded-md">
                    Audit Trail
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-[#53647F]">
                  {standaloneTxns.length} standalone · {orderTxns.length} order-linked
                </p>
              </div>
            </div>
          </div>

          {/* Wallet activity table */}
          <div className="rounded-2xl border border-[#DCE5F1] bg-white shadow-xs overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-[#DCE5F1] bg-[#F8FAFC]/80 space-y-3.5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#151D35]">
                    Transactions
                  </h3>
                  <span className="rounded-full bg-[#EDF3FF] border border-[#C9DCFF] px-2.5 py-0.5 text-xs font-bold text-[#2A67EC]">
                    {filteredTransactions.length} of {transactions.length}
                  </span>
                </div>

                {/* CSV Export Button */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={filteredTransactions.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 text-xs font-bold text-[#53647F] shadow-2xs hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] transition cursor-pointer self-start lg:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Export filtered records to CSV"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Search & Movement Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8190A9]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by Order ID, Payment ID, item name, reason..."
                    className="w-full rounded-xl border border-[#DCE5F1] bg-white pl-9 pr-8 py-1.5 text-xs text-[#151D35] placeholder:text-[#8190A9] focus:outline-none focus:border-[#2A67EC] focus:ring-2 focus:ring-[#2A67EC]/15 transition shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8190A9] hover:text-[#151D35]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                      filter === "all"
                        ? "bg-[#2A67EC] text-white"
                        : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span>All</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-xs font-black ${
                        filter === "all"
                          ? "bg-white/20 text-white"
                          : "bg-[#EDF3FF] text-[#2A67EC]"
                      }`}
                    >
                      {transactions.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilter("credit");
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                      filter === "credit"
                        ? "bg-[#157348] text-white"
                        : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#ECFBF3] hover:text-[#157348]"
                    }`}
                  >
                    <ArrowDownLeft className="h-3 w-3" />
                    <span>Credit</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-xs font-black ${
                        filter === "credit"
                          ? "bg-white/20 text-white"
                          : "bg-[#ECFBF3] text-[#157348]"
                      }`}
                    >
                      {creditTxns.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilter("debit");
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                      filter === "debit"
                        ? "bg-[#D34D5D] text-white"
                        : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#FFF0F2] hover:text-[#D34D5D]"
                    }`}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Debit</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-xs font-black ${
                        filter === "debit"
                          ? "bg-white/20 text-white"
                          : "bg-[#FFF0F2] text-[#D34D5D]"
                      }`}
                    >
                      {debitTxns.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFilter("standalone");
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                      filter === "standalone"
                        ? "bg-[#2A67EC] text-white"
                        : "bg-white text-[#53647F] border border-[#DCE5F1] hover:bg-[#EDF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]"
                    }`}
                  >
                    <Wallet className="h-3 w-3" />
                    <span>Standalone Movements</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-xs font-black ${
                        filter === "standalone"
                          ? "bg-white/20 text-white"
                          : "bg-[#EDF3FF] text-[#2A67EC]"
                      }`}
                    >
                      {standaloneTxns.length}
                    </span>
                  </button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="rounded-xl border border-[#DCE5F1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#53647F] focus:outline-none focus:border-[#2A67EC] shadow-2xs cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_desc">Amount: High to Low</option>
                    <option value="amount_asc">Amount: Low to High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Industry-Level Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#DCE5F1] bg-[#F8FAFC] text-sm font-bold uppercase tracking-wider text-[#46546D]">
                  <tr>
                    <th className="py-3.5 px-4 font-black">Transaction Item</th>
                    <th className="py-3.5 px-4 font-black">Reference</th>
                    <th className="py-3.5 px-4 font-black">Movement</th>
                    <th className="py-3.5 px-4 font-black">Payment Method</th>
                    <th className="py-3.5 px-4 font-black text-right">Amount</th>
                    <th className="py-3.5 px-4 font-black">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5F1]/70">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center">
                        <Wallet className="mx-auto h-9 w-9 text-[#8190A9]" />
                        <p className="mt-3 text-sm font-bold text-[#151D35]">
                          No wallet transactions match your filter criteria
                        </p>
                        <p className="mt-1 text-sm text-[#53647F]">
                          Try adjusting your search terms or clearing the filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentTransactions.map((tx, idx) => {
                      const isCredit = tx.action === "credit";
                      const methodBadge = getMethodBadge(tx);
                      const isRefund =
                        tx.reason === "Refund" ||
                        (tx.item && String(tx.item).startsWith("ORD-"));
                      const isRecharge =
                        tx.item &&
                        String(tx.item).toLowerCase().includes("recharge");

                      const itemTitle =
                        isRefund && tx.item === tx.orderId
                          ? "Order Refund"
                          : tx.item || (isCredit ? "Wallet Credit" : "Store Purchase");

                      const itemSubtitle = isRefund
                        ? "Refund credited to wallet balance"
                        : isRecharge
                        ? "Direct store balance top-up"
                        : tx.reason
                        ? tx.reason
                        : isCredit
                        ? "Store credit allocation"
                        : "Purchase order settlement";

                      return (
                        <tr
                          key={tx.id || idx}
                          className="hover:bg-[#F8FAFC] transition group"
                        >
                          {/* Col 1: Transaction Item */}
                          <td className="py-3.5 px-4 min-w-[220px]">
                            <div className="min-w-0">
                              <p
                                className="font-bold text-sm text-[#151D35] truncate max-w-[260px] sm:max-w-[340px]"
                                title={itemTitle}
                              >
                                {itemTitle}
                              </p>
                              <p className="mt-0.5 text-sm font-medium text-[#46546D] truncate max-w-[260px] sm:max-w-[340px]">
                                {itemSubtitle}
                              </p>
                            </div>
                          </td>

                          {/* Col 2: Reference & Order */}
                          <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                            {tx.orderId ? (
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-sm text-[#151D35]">
                                    {tx.orderId}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(tx.orderId, `ord-${idx}`)}
                                    className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer"
                                    title="Copy Order ID"
                                  >
                                    {copiedKey === `ord-${idx}` ? (
                                      <Check className="h-3 w-3 text-[#16B879]" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-sm">
                                  {tx.reason ? (
                                    <span className="inline-flex items-center rounded-md bg-[#FFF8E9] border border-[#F4D877] px-1.5 py-0.2 text-sm font-bold text-[#C87513]">
                                      {tx.reason}
                                    </span>
                                  ) : (
                                    <span className="text-[#71809A] font-sans font-medium">
                                      Order Linked
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : tx.payment_id ? (
                              <div>
                                <div className="flex items-center gap-1.5 text-sm text-[#46546D]">
                                  <span className="font-bold">{tx.payment_id}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(tx.payment_id, `pay-${idx}`)}
                                    className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer"
                                    title="Copy Payment ID"
                                  >
                                    {copiedKey === `pay-${idx}` ? (
                                      <Check className="h-3 w-3 text-[#16B879]" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                                <span className="mt-1 inline-flex items-center rounded-md bg-[#EDF3FF] border border-[#C9DCFF] px-1.5 py-0.2 text-sm font-bold text-[#2A67EC]">
                                  Payment ID
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-sm font-semibold text-[#53647F]">—</span>
                                <span className="block text-sm text-[#46546D] font-sans font-medium">
                                  Standalone Movement
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Col 3: Movement Status with Dot */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-bold border ${
                                isCredit
                                  ? "bg-[#ECFBF3] text-[#157348] border-[#B7F1CD]"
                                  : "bg-[#FFF0F2] text-[#D34D5D] border-[#F5C2CA]"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isCredit ? "bg-[#16B879]" : "bg-[#D34D5D]"
                                }`}
                              />
                              <span>{isCredit ? "Credit (Inflow)" : "Debit (Outflow)"}</span>
                            </span>
                          </td>

                          {/* Col 4: Payment Method */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className="inline-flex items-center rounded-md border border-[#DCE5F1] bg-[#F8FAFC] px-2 py-0.5 text-sm font-bold text-[#46546D]"
                            >
                              {methodBadge.label}
                            </span>
                          </td>

                          {/* Col 5: Amount */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-extrabold text-sm">
                            <span
                              className={
                                isCredit ? "text-[#157348]" : "text-[#D34D5D]"
                              }
                            >
                              {isCredit ? "+" : "-"}
                              {formatCurrencyINR(tx.amount)}
                            </span>
                          </td>

                          {/* Col 6: Date & Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <p className="font-semibold text-sm text-[#151D35]">
                              {formatDateTime(tx.timestamp || tx.created_at)}
                            </p>
                            <p className="text-sm text-[#46546D] mt-0.5">
                              {formatRelativeTime(tx.timestamp || tx.created_at)}
                            </p>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredTransactions.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCE5F1] bg-[#F8FAFC] px-5 py-3.5 text-xs text-[#53647F]">
                <div className="flex items-center gap-2">
                  <span>
                    Showing{" "}
                    <strong className="text-[#151D35]">{startIndex + 1}</strong>{" "}
                    to <strong className="text-[#151D35]">{endIndex}</strong> of{" "}
                    <strong className="text-[#151D35]">
                      {filteredTransactions.length}
                    </strong>{" "}
                    transactions
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-2 rounded-lg border border-[#DCE5F1] bg-white px-2 py-1 text-xs font-semibold text-[#151D35] shadow-2xs cursor-pointer"
                  >
                    <option value={15}>15 per page</option>
                    <option value={30}>30 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={validPage <= 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <span className="px-2 font-bold text-[#151D35]">
                    Page {validPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={validPage >= totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      {isAddMoneyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#151D35]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-money-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="add-money-title" className="text-2xl font-bold tracking-tight text-[#151D35]">
                  Add Money to Wallet
                </h2>
                <p className="mt-1 text-sm text-[#53647F]">
                  Credit the customer&apos;s standard wallet with a recorded reason.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddMoney}
                disabled={isAddingMoney}
                className="rounded-lg p-1.5 text-[#71809A] transition hover:bg-[#F2F5FA] hover:text-[#151D35] disabled:opacity-50"
                aria-label="Close add money dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addMoneyResult ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-[#B7F1CD] bg-[#F7FDF9] p-5 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-[#157348]" />
                  <p className="mt-3 text-base font-bold text-[#157348]">
                    {addMoneyResult.message || "Money added to wallet successfully"}
                  </p>
                  <p className="mt-1 text-sm text-[#53647F]">
                    Reason: <span className="font-semibold text-[#151D35]">{addMoneyResult.transaction?.reason || reason}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F8FAFC] p-4 text-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#53647F]">Added</p>
                    <p className="mt-1 text-lg font-extrabold text-[#157348]">+{formatCurrencyINR(addMoneyResult.wallet?.amount_added)}</p>
                  </div>
                  <div className="border-l border-[#DCE5F1]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#53647F]">New balance</p>
                    <p className="mt-1 text-lg font-extrabold text-[#151D35]">{formatCurrencyINR(addMoneyResult.wallet?.new_balance)}</p>
                  </div>
                </div>
                <button type="button" onClick={closeAddMoney} className="w-full rounded-xl bg-[#151D35] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#2A354F]">
                  Done
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleAddMoney}>
                <div className="rounded-2xl bg-[#F8FAFC] p-5 text-center">
                  <p className="text-sm font-medium text-[#53647F]">Current balance</p>
                  <p className="mt-1 text-3xl font-extrabold text-[#151D35]">{formatCurrencyINR(displayedWalletBalance)}</p>
                </div>
                <label className="block">
                  <span className="text-sm font-bold text-[#151D35]">Amount (₹)</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter amount"
                    className="mt-2 w-full rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] px-4 py-3 text-base font-semibold text-[#151D35] outline-none transition placeholder:text-[#8190A9] focus:border-[#2A67EC] focus:bg-white"
                    disabled={isAddingMoney}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-[#151D35]">Reason</span>
                  <select
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#DCE5F1] bg-white px-4 py-3 text-base font-semibold text-[#151D35] outline-none transition focus:border-[#2A67EC]"
                    disabled={isAddingMoney}
                  >
                    <option value="">Select reason</option>
                    {ADD_MONEY_REASONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                {addMoneyError && <p className="rounded-xl border border-[#F5C2CA] bg-[#FFF0F2] px-3 py-2 text-sm font-semibold text-[#B83852]">{addMoneyError}</p>}
                <button
                  type="submit"
                  disabled={isAddingMoney || !amount || !reason}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#151D35] px-4 py-3 text-base font-bold text-white transition hover:bg-[#2A354F] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isAddingMoney ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {isAddingMoney ? "Adding money..." : "Add Money to Wallet"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
