"use client";

import { useState } from "react";
import { CreditCard, Building2, Copy, Check } from "lucide-react";
import { formatDateTime, parseTimestamp } from "../customerUtils";

export default function CustomerPayments({ payments = [], paymentDetails = null }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasPrimaryUpi = Boolean(paymentDetails?.upi?.upi_id);
  const hasPrimaryNetbanking = Boolean(paymentDetails?.netbanking?.account_no);
  const hasRawPayments = Boolean(payments && payments.length > 0);

  if (!hasRawPayments && !hasPrimaryUpi && !hasPrimaryNetbanking) {
    return (
      <div className="rounded-2xl border border-[#DCE5F1] bg-white p-12 text-center shadow-xs">
        <CreditCard className="mx-auto h-10 w-10 text-[#8190A9]" />
        <h3 className="mt-3 text-base font-bold text-[#151D35]">
          No Payment Methods Found
        </h3>
        <p className="mt-1 text-xs text-[#71809A]">
          This customer has no saved bank accounts or UPI identifiers.
        </p>
      </div>
    );
  }

  // Sort all payments by timestamp/created_at descending (newest first)
  const sortedPayments = [...(payments || [])].sort((a, b) => {
    const tsA = parseTimestamp(a.created_at || a.timestamp)?.getTime() || 0;
    const tsB = parseTimestamp(b.created_at || b.timestamp)?.getTime() || 0;
    return tsB - tsA;
  });

  // Deduplicate UPI IDs, placing primary UPI at the very front
  const seenUpi = new Set();
  const upiPayments = [];

  if (hasPrimaryUpi) {
    const key = paymentDetails.upi.upi_id.toLowerCase().trim();
    seenUpi.add(key);
    upiPayments.push({
      id: "primary-payout-upi",
      method: "upi",
      upi_id: paymentDetails.upi.upi_id,
      created_at: paymentDetails.lastUpdated,
      isPrimary: true,
    });
  }

  sortedPayments.forEach((p) => {
    const isUpi = p.method === "upi" || Boolean(p.upi_id);
    if (isUpi && p.upi_id) {
      const key = p.upi_id.toLowerCase().trim();
      if (!seenUpi.has(key)) {
        seenUpi.add(key);
        upiPayments.push(p);
      }
    }
  });

  // Deduplicate Netbanking Accounts, placing primary Netbanking at the very front
  const seenNetbanking = new Set();
  const netbankingPayments = [];

  if (hasPrimaryNetbanking) {
    const nb = paymentDetails.netbanking;
    const key = `${nb.account_no}_${nb.ifsc || ""}`.toLowerCase().trim();
    seenNetbanking.add(key);
    netbankingPayments.push({
      id: "primary-payout-netbanking",
      method: "netbanking",
      bank_name: nb.bank_name,
      account_holder_name: nb.account_holder_name,
      account_no: nb.account_no,
      ifsc: nb.ifsc,
      created_at: paymentDetails.lastUpdated,
      isPrimary: true,
    });
  }

  sortedPayments.forEach((p) => {
    const isNetbanking = p.method === "netbanking" || Boolean(p.account_no);
    if (isNetbanking && p.account_no) {
      const key = `${p.account_no}_${p.ifsc || ""}`.toLowerCase().trim();
      if (!seenNetbanking.has(key)) {
        seenNetbanking.add(key);
        netbankingPayments.push(p);
      }
    }
  });

  const uniqueCount = upiPayments.length + netbankingPayments.length;

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-2xs">
            <CreditCard className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#151D35]">
                Payment Methods
              </h2>
              <span className="rounded-full bg-[#EDF3FF] border border-[#C9DCFF] px-2.5 py-0.5 text-xs font-bold text-[#2A67EC]">
                {uniqueCount} Unique
              </span>
            </div>
            <p className="text-sm font-medium text-[#53647F]">
              Saved UPI handles, verified netbanking bank accounts, and payout methods.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E57D2] transition cursor-pointer self-start sm:self-auto"
        >
          <CreditCard className="h-4 w-4" />
          <span>Add / Update Payment</span>
        </button>
      </div>

      {/* UPI Section */}
      {upiPayments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#151D35]">
            UPI Accounts ({upiPayments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upiPayments.map((pm, idx) => (
              <div
                key={pm.id || idx}
                className={`flex items-center gap-3.5 rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition ${
                  pm.isPrimary ? "border-[#C9DCFF] ring-1 ring-[#C9DCFF]/50 bg-[#F7FAFF]" : "border-[#DCE5F1] hover:border-[#C7D5E8]"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF3FF] text-[#2A67EC] text-base font-bold">
                  ₹
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-[#151D35] truncate">
                      {pm.upi_id}
                    </span>
                    {pm.isPrimary && (
                      <span className="rounded-md border border-[#C9DCFF] bg-[#EDF3FF] px-2.5 py-0.5 text-xs font-bold text-[#2459C4]">
                        Default Payout UPI
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(pm.upi_id, `upi-${pm.id || idx}`)
                      }
                      className="text-[#8190A9] hover:text-[#2A67EC] transition shrink-0 p-0.5 cursor-pointer ml-auto"
                      title="Copy UPI ID"
                    >
                      {copiedId === `upi-${pm.id || idx}` ? (
                        <Check className="h-4 w-4 text-[#16B879]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-[#53647F]">
                    {pm.isPrimary ? `Configured in User Profile · ${formatDateTime(pm.created_at)}` : formatDateTime(pm.created_at || pm.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Netbanking Section */}
      {netbankingPayments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#151D35]">
            Netbanking Accounts ({netbankingPayments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {netbankingPayments.map((pm, idx) => (
              <div
                key={pm.id || idx}
                className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition ${
                  pm.isPrimary ? "border-[#B7F1CD] ring-1 ring-[#B7F1CD]/50 bg-[#F7FCF9]" : "border-[#DCE5F1] hover:border-[#C7D5E8]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFBF3] text-[#16B879]">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#151D35]">
                        {pm.account_holder_name || "Account Holder"}
                      </h4>
                      {pm.isPrimary && (
                        <span className="rounded-md border border-[#B7F1CD] bg-[#ECFBF3] px-2.5 py-0.5 text-xs font-bold text-[#157348]">
                          Primary Settlement Bank
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#53647F]">
                      {pm.bank_name || "Bank Account"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-medium text-[#53647F]">
                    <span>Account:</span>
                    <span className="font-mono font-bold text-[#151D35]">
                      {pm.account_no}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(pm.account_no, `acc-${pm.id || idx}`)
                      }
                      className="text-[#8190A9] hover:text-[#2A67EC] transition p-0.5 cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedId === `acc-${pm.id || idx}` ? (
                        <Check className="h-3.5 w-3.5 text-[#16B879]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {pm.ifsc && (
                    <div className="flex items-center gap-1.5 font-medium text-[#53647F]">
                      <span>IFSC:</span>
                      <span className="font-mono font-bold text-[#151D35]">
                        {pm.ifsc}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(pm.ifsc, `ifsc-${pm.id || idx}`)
                        }
                        className="text-[#8190A9] hover:text-[#2A67EC] transition p-0.5 cursor-pointer"
                        title="Copy IFSC Code"
                      >
                        {copiedId === `ifsc-${pm.id || idx}` ? (
                          <Check className="h-3.5 w-3.5 text-[#16B879]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm font-medium text-[#53647F]">
                  {formatDateTime(pm.created_at || pm.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
