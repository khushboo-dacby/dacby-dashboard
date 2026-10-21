"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Download,
} from "lucide-react";
import {
  formatDateTime,
  formatRelativeTime,
  formatCurrencyINR,
  parseTimestamp,
} from "../customerUtils";

export default function CustomerB2BWallet({
  b2bWallet = null,
  b2bTransactions = [],
}) {
  const [b2bSearchQuery, setB2bSearchQuery] = useState("");
  const [b2bFilter, setB2bFilter] = useState("all"); // "all" | "recharge" | "transfer"
  const [b2bSortOption, setB2bSortOption] = useState("newest");
  const [b2bPage, setB2bPage] = useState(1);
  const [b2bPageSize, setB2bPageSize] = useState(15);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- B2B WALLET METRICS ---
  const b2bTotal = Number(b2bWallet?.total || 0);
  const b2bAvailable = Number(
    b2bWallet?.bifurcation?.current_balance?.available ?? 0
  );
  const b2bOnHold = Number(
    b2bWallet?.bifurcation?.current_balance?.on_hold ?? 0
  );

  const b2bRechargeTxns = useMemo(() => {
    return b2bTransactions.filter(
      (tx) =>
        tx.type === "Wallet Recharge" ||
        String(tx.method || "").toLowerCase() === "credit" ||
        String(tx.type || "").toLowerCase() === "credit"
    );
  }, [b2bTransactions]);

  const b2bTransferTxns = useMemo(() => {
    return b2bTransactions.filter(
      (tx) =>
        tx.type === "Transfer" ||
        String(tx.method || "").toLowerCase().includes("hold")
    );
  }, [b2bTransactions]);

  const b2bCredits = useMemo(() => {
    return b2bRechargeTxns.reduce(
      (sum, tx) => sum + (Number(tx.amount) || 0),
      0
    );
  }, [b2bRechargeTxns]);

  const b2bDebits = useMemo(() => {
    return b2bTransferTxns.reduce(
      (sum, tx) => sum + (Number(tx.amount) || 0),
      0
    );
  }, [b2bTransferTxns]);

  const filteredB2BTransactions = useMemo(() => {
    let result = b2bTransactions.filter((tx) => {
      if (b2bFilter === "recharge") {
        const isRecharge =
          tx.type === "Wallet Recharge" ||
          String(tx.method || "").toLowerCase() === "credit" ||
          String(tx.type || "").toLowerCase() === "credit";
        if (!isRecharge) return false;
      } else if (b2bFilter === "transfer") {
        const isTransfer =
          tx.type === "Transfer" ||
          String(tx.method || "").toLowerCase().includes("hold");
        if (!isTransfer) return false;
      }

      if (b2bSearchQuery.trim()) {
        const q = b2bSearchQuery.toLowerCase().trim();
        const matchId = String(tx.id || "").toLowerCase().includes(q);
        const matchOrder = String(tx.orderId || "").toLowerCase().includes(q);
        const matchUtr = String(tx.utr || "").toLowerCase().includes(q);
        const matchMethod = String(tx.method || "").toLowerCase().includes(q);
        const matchRechargedBy = String(tx.recharged_by || "")
          .toLowerCase()
          .includes(q);
        if (
          !matchId &&
          !matchOrder &&
          !matchUtr &&
          !matchMethod &&
          !matchRechargedBy
        ) {
          return false;
        }
      }

      return true;
    });

    result.sort((a, b) => {
      if (b2bSortOption === "newest") {
        const timeA = parseTimestamp(a.created_at || a.timestamp)?.getTime() || 0;
        const timeB = parseTimestamp(b.created_at || b.timestamp)?.getTime() || 0;
        return timeB - timeA;
      }
      if (b2bSortOption === "oldest") {
        const timeA = parseTimestamp(a.created_at || a.timestamp)?.getTime() || 0;
        const timeB = parseTimestamp(b.created_at || b.timestamp)?.getTime() || 0;
        return timeA - timeB;
      }
      if (b2bSortOption === "amount_desc") {
        return Number(b.amount || 0) - Number(a.amount || 0);
      }
      return 0;
    });

    return result;
  }, [b2bTransactions, b2bFilter, b2bSearchQuery, b2bSortOption]);

  const b2bTotalPages = Math.max(
    1,
    Math.ceil(filteredB2BTransactions.length / b2bPageSize)
  );
  const validB2bPage = Math.min(Math.max(b2bPage, 1), b2bTotalPages);
  const b2bStartIndex = (validB2bPage - 1) * b2bPageSize;
  const b2bEndIndex = Math.min(
    b2bStartIndex + b2bPageSize,
    filteredB2BTransactions.length
  );
  const currentB2BTransactions = filteredB2BTransactions.slice(
    b2bStartIndex,
    b2bEndIndex
  );

  // CSV Export
  const handleExportCSV = () => {
    if (filteredB2BTransactions.length === 0) return;

    const headers = [
      "B2B ID",
      "Type",
      "Amount (INR)",
      "Method",
      "Order ID",
      "UTR",
      "Recharged By",
      "Date Time",
    ];
    const rows = filteredB2BTransactions.map((tx) => [
      `"${tx.id || ""}"`,
      `"${tx.type || ""}"`,
      Number(tx.amount || 0),
      `"${(tx.method || "").replace(/"/g, '""')}"`,
      `"${tx.orderId || ""}"`,
      `"${tx.utr || ""}"`,
      `"${tx.recharged_by || ""}"`,
      `"${formatDateTime(tx.created_at || tx.timestamp)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `b2b_wallet_activity_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#704CF3] shadow-2xs">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#151D35]">
              B2B Credit Facility
            </h2>
            <p className="text-sm font-medium text-[#53647F]">
              Historical breakdown of vendor credit recharges, order holdings, and balance adjustments.
            </p>
          </div>
        </div>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance (Available Balance) */}
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
                {formatCurrencyINR(b2bAvailable)}
              </p>
              <span className="text-xs font-bold text-[#2A67EC] bg-[#EDF3FF] border border-[#C9DCFF] px-2 py-0.5 rounded-md">
                Active Balance
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              Current B2B available balance
            </p>
          </div>
        </div>

        {/* Total Credits */}
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
                +{formatCurrencyINR(b2bCredits)}
              </p>
              <span className="text-xs font-bold text-[#157348] bg-[#ECFBF3] border border-[#B7F1CD] px-2 py-0.5 rounded-md">
                {b2bRechargeTxns.length} Credits
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              Total incoming funds & recharges
            </p>
          </div>
        </div>

        {/* Total Debits */}
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
                -{formatCurrencyINR(b2bDebits || b2bOnHold)}
              </p>
              <span className="text-xs font-bold text-[#D34D5D] bg-[#FFF0F2] border border-[#F5C2CA] px-2 py-0.5 rounded-md">
                {b2bTransferTxns.length} Debits
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              Total order holds & transfers
            </p>
          </div>
        </div>

        {/* Total Transactions */}
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
                {b2bTransactions.length}
              </p>
              <span className="text-xs font-bold text-[#53647F] bg-[#F2F5FA] border border-[#DCE5F1] px-2 py-0.5 rounded-md">
                Audit Trail
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              {b2bRechargeTxns.length} recharges · {b2bTransferTxns.length} transfers
            </p>
          </div>
        </div>
      </div>

      {/* 3. B2B TABLE CONSOLE */}
      <div className="rounded-2xl border border-[#DCE5F1] bg-white shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#DCE5F1] bg-[#F8FAFC]/80 space-y-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#151D35] flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#704CF3]" />
                <span>B2B Credit Facility Activity</span>
              </h3>
              <span className="rounded-full bg-[#F3EEFF] border border-[#DDD0FF] px-2.5 py-0.5 text-xs font-bold text-[#704CF3]">
                {filteredB2BTransactions.length} of {b2bTransactions.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredB2BTransactions.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 text-xs font-bold text-[#53647F] shadow-2xs hover:bg-[#F3EEFF] hover:text-[#704CF3] hover:border-[#DDD0FF] transition cursor-pointer self-start lg:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8190A9]" />
              <input
                type="text"
                value={b2bSearchQuery}
                onChange={(e) => {
                  setB2bSearchQuery(e.target.value);
                  setB2bPage(1);
                }}
                placeholder="Search by Order ID, UTR, authorizer, method..."
                className="w-full rounded-xl border border-[#DCE5F1] bg-white pl-9 pr-8 py-1.5 text-xs text-[#151D35] placeholder:text-[#8190A9] focus:outline-none focus:border-[#704CF3] shadow-2xs"
              />
              {b2bSearchQuery && (
                <button
                  type="button"
                  onClick={() => setB2bSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8190A9] hover:text-[#151D35]"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setB2bFilter("all");
                  setB2bPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                  b2bFilter === "all"
                    ? "bg-[#704CF3] text-white"
                    : "border border-[#DCE5F1] bg-white text-[#53647F] hover:bg-[#F3EEFF] hover:text-[#704CF3]"
                }`}
              >
                All ({b2bTransactions.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setB2bFilter("recharge");
                  setB2bPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                  b2bFilter === "recharge"
                    ? "bg-[#157348] text-white"
                    : "border border-[#DCE5F1] bg-white text-[#53647F] hover:bg-[#ECFBF3] hover:text-[#157348]"
                }`}
              >
                Recharges ({b2bRechargeTxns.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setB2bFilter("transfer");
                  setB2bPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs cursor-pointer ${
                  b2bFilter === "transfer"
                    ? "bg-[#C87513] text-white"
                    : "border border-[#DCE5F1] bg-white text-[#53647F] hover:bg-[#FFF8E9] hover:text-[#C87513]"
                }`}
              >
                Hold Transfers ({b2bTransferTxns.length})
              </button>
            </div>
          </div>
        </div>

        {/* B2B Table */}
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
              {filteredB2BTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <Building2 className="mx-auto h-9 w-9 text-[#8190A9]" />
                    <p className="mt-3 text-sm font-bold text-[#151D35]">
                      No B2B transactions match your current search/filter.
                    </p>
                    <p className="mt-1 text-sm text-[#53647F]">
                      Try adjusting your search terms or clearing the filter.
                    </p>
                  </td>
                </tr>
              ) : (
                currentB2BTransactions.map((tx, idx) => {
                  const isRecharge =
                    tx.type === "Wallet Recharge" ||
                    String(tx.method || "").toLowerCase() === "credit" ||
                    String(tx.type || "").toLowerCase() === "credit";

                  const b2bItemTitle =
                    tx.type || (isRecharge ? "B2B Credit Recharge" : "Hold Balance Transfer");

                  const b2bItemSubtitle = tx.recharged_by
                    ? `Authorized by: ${tx.recharged_by}`
                    : tx.method
                    ? String(tx.method)
                    : "B2B Credit Facility movement";

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
                            title={b2bItemTitle}
                          >
                            {b2bItemTitle}
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-[#46546D] truncate max-w-[260px] sm:max-w-[340px]">
                            {b2bItemSubtitle}
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
                                onClick={() => handleCopy(tx.orderId, `b2b-ord-${idx}`)}
                                className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer"
                                title="Copy Order ID"
                              >
                                {copiedKey === `b2b-ord-${idx}` ? (
                                  <Check className="h-3 w-3 text-[#16B879]" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <span className="mt-1 inline-flex items-center rounded-md bg-[#EDF3FF] border border-[#C9DCFF] px-1.5 py-0.2 text-sm font-bold text-[#2A67EC]">
                              Order Linked
                            </span>
                          </div>
                        ) : tx.utr ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-sm text-[#46546D]">
                              <span className="font-bold">UTR: {tx.utr}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(tx.utr, `b2b-utr-${idx}`)}
                                className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer"
                                title="Copy UTR"
                              >
                                {copiedKey === `b2b-utr-${idx}` ? (
                                  <Check className="h-3 w-3 text-[#16B879]" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                            <span className="mt-1 inline-flex items-center rounded-md bg-[#FFF8E9] border border-[#F4D877] px-1.5 py-0.2 text-sm font-bold text-[#C87513]">
                              Bank UTR
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-sm font-semibold text-[#53647F]">—</span>
                            <span className="block text-sm text-[#46546D] font-sans font-medium">
                              Direct Facility
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Col 3: Movement Status with Dot */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-bold border ${
                            isRecharge
                              ? "bg-[#ECFBF3] text-[#157348] border-[#B7F1CD]"
                              : "bg-[#FFF0F2] text-[#D34D5D] border-[#F5C2CA]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isRecharge ? "bg-[#16B879]" : "bg-[#D34D5D]"
                            }`}
                          />
                          <span>
                            {isRecharge ? "Credit (Limit Inflow)" : "Transfer / Hold"}
                          </span>
                        </span>
                      </td>

                      {/* Col 4: Payment Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-sm font-bold border bg-[#F8FAFC] text-[#46546D] border-[#DCE5F1]">
                          {tx.method || (isRecharge ? "Bank Transfer" : "Hold")}
                        </span>
                      </td>

                      {/* Col 5: Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-extrabold text-sm">
                        <span
                          className={
                            isRecharge ? "text-[#157348]" : "text-[#D34D5D]"
                          }
                        >
                          {isRecharge ? "+" : ""}
                          {formatCurrencyINR(tx.amount)}
                        </span>
                      </td>

                      {/* Col 6: Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-sm text-[#151D35]">
                          {formatDateTime(tx.created_at || tx.timestamp)}
                        </p>
                        <p className="text-sm text-[#46546D] mt-0.5">
                          {formatRelativeTime(tx.created_at || tx.timestamp)}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* B2B Pagination */}
        {filteredB2BTransactions.length > 0 && b2bTotalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCE5F1] bg-[#F8FAFC] px-5 py-3.5 text-xs text-[#53647F]">
            <div>
              Showing{" "}
              <strong className="text-[#151D35]">
                {b2bStartIndex + 1}
              </strong>{" "}
              to <strong className="text-[#151D35]">{b2bEndIndex}</strong> of{" "}
              <strong className="text-[#151D35]">
                {filteredB2BTransactions.length}
              </strong>{" "}
              transactions
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setB2bPage((p) => Math.max(p - 1, 1))}
                disabled={validB2bPage <= 1}
                className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#F3EEFF] hover:text-[#704CF3] hover:border-[#DDD0FF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 font-bold text-[#151D35]">
                Page {validB2bPage} of {b2bTotalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setB2bPage((p) => Math.min(p + 1, b2bTotalPages))
                }
                disabled={validB2bPage >= b2bTotalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#F3EEFF] hover:text-[#704CF3] hover:border-[#DDD0FF] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
