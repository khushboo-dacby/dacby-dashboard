"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Globe2,
  MapPin,
  Phone,
} from "lucide-react";
import {
  formatCurrencyINR,
  formatDateTime,
  formatRelativeTime,
  parseTimestamp,
} from "../customerUtils";

function getWalletAmount(wallet) {
  if (typeof wallet === "number") return wallet;
  if (wallet && typeof wallet === "object") {
    return Number(wallet.total ?? wallet.balance ?? 0);
  }
  return Number(wallet) || 0;
}

function getB2BWalletState(wallet) {
  const currentBalance = wallet?.bifurcation?.current_balance || {};
  return {
    total: getWalletAmount(wallet),
    available: Number(currentBalance.available) || 0,
    onHold: Number(currentBalance.on_hold) || 0,
  };
}

function isCreditTransaction(transaction) {
  const type = String(transaction?.type || transaction?.action || "").toLowerCase();
  const method = String(transaction?.method || "").toLowerCase();
  return (
    type === "credit" ||
    type.includes("recharge") ||
    method.includes("due to cancellation")
  );
}

function getOrderCount(value, fallback) {
  if (value !== undefined && value !== null && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return fallback;
}

export default function CustomerOverview({
  userData = {},
  subcollections = {},
  ordersData = null,
  onNavigateTab,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activityLimit, setActivityLimit] = useState(5);

  const paymentDetails = userData?.payment_details || {};
  const upi = paymentDetails?.upi;
  const netbanking = paymentDetails?.netbanking;
  const isVendor = Boolean(
    userData?.vendor === true ||
      userData?.vendor === "true" ||
      userData?.role === "vendor"
  );
  const walletBalance = getWalletAmount(userData?.wallet);
  const b2bWallet = getB2BWalletState(userData?.b2b_wallet);

  // Orders overview counts
  const orderOverview = useMemo(() => {
    const buyOrders = Array.isArray(ordersData?.buy_orders)
      ? ordersData.buy_orders
      : [];
    const sellOrders = Array.isArray(ordersData?.sell_orders)
      ? ordersData.sell_orders
      : [];
    const buy = getOrderCount(ordersData?.buy_orders_count, buyOrders.length);
    const sell = getOrderCount(ordersData?.sell_orders_count, sellOrders.length);
    return { buy, sell, total: buy + sell };
  }, [ordersData]);

  // Wallet transactions activity
  const walletTransactions = Array.isArray(subcollections?.Wallet)
    ? subcollections.Wallet
    : [];
  const b2bTransactions = Array.isArray(subcollections?.B2b_Wallet)
    ? subcollections.B2b_Wallet
    : Array.isArray(subcollections?.B2B_Wallet)
    ? subcollections.B2B_Wallet
    : [];

  const hasB2BWallet = Boolean(
    isVendor ||
    (b2bTransactions && b2bTransactions.length > 0) ||
    b2bWallet.total > 0 ||
    b2bWallet.available > 0
  );

  const activity = useMemo(() => {
    const standardEntries = walletTransactions.map((transaction) => ({
      wallet: "Store Wallet",
      transaction,
      timestamp: parseTimestamp(
        transaction?.created_at || transaction?.timestamp
      ),
    }));
    const b2bEntries = isVendor
      ? b2bTransactions.map((transaction) => ({
          wallet: "B2B Credit Wallet",
          transaction,
          timestamp: parseTimestamp(
            transaction?.created_at || transaction?.timestamp
          ),
        }))
      : [];

    return [...standardEntries, ...b2bEntries].sort(
      (a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
    );
  }, [b2bTransactions, isVendor, walletTransactions]);

  // Primary delivery address resolution
  const primaryAddress = useMemo(() => {
    const rawList = subcollections?.Address || subcollections?.Addresses || [];
    const addressList = Array.isArray(rawList)
      ? rawList
      : rawList && typeof rawList === "object"
      ? Object.values(rawList)
      : [];
    const primaryId = userData?.address?.addressId;

    if (primaryId && addressList.length > 0) {
      const match = addressList.find(
        (a) => a.id === primaryId || a.addressId === primaryId
      );
      if (match) return match;
    }

    if (addressList.length > 0) {
      return addressList[0];
    }

    if (
      userData?.address &&
      (userData.address.street ||
        userData.address.city ||
        userData.address.state ||
        userData.address.pincode)
    ) {
      return userData.address;
    }

    return null;
  }, [subcollections, userData]);

  const fullAddressString = useMemo(() => {
    if (!primaryAddress) return "";
    const parts = [
      primaryAddress.name || userData?.name,
      primaryAddress.street,
      [primaryAddress.city, primaryAddress.state].filter(Boolean).join(", "),
      primaryAddress.pincode ? `PIN: ${primaryAddress.pincode}` : "",
      (primaryAddress.phone_number || primaryAddress.phone || userData?.phone)
        ? `Phone: ${primaryAddress.phone_number || primaryAddress.phone || userData?.phone}`
        : "",
    ].filter(Boolean);
    return parts.join("\n");
  }, [primaryAddress, userData]);

  const handleCopy = (value, key) => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 text-[#151D35]">
      {/* 1. TOP TAB HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-2xs">
            <User className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#151D35]">
              Customer Overview
            </h2>
            <p className="text-sm font-medium text-[#53647F]">
              Consolidated profile summary, order snapshot, wallet balances, and account credentials.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Orders Card */}
          <article
            onClick={() => onNavigateTab?.("orders")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigateTab?.("orders");
            }}
            className="cursor-pointer rounded-2xl border border-[#DCE5F1] bg-white p-4.5 shadow-2xs transition hover:border-[#2A67EC]/40 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                Total Orders
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
                <ShoppingCart className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-[#151D35]">
                {orderOverview.total}
              </p>
              <p className="mt-1 text-sm font-medium text-[#53647F]">
                All lifetime orders
              </p>
            </div>
          </article>

          {/* Buy Orders Card */}
          <article
            onClick={() => onNavigateTab?.("orders")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigateTab?.("orders");
            }}
            className="cursor-pointer rounded-2xl border border-[#DCE5F1] bg-white p-4.5 shadow-2xs transition hover:border-[#2A67EC]/40 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                Buy Orders
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
                <ShoppingBag className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-[#151D35]">
                {orderOverview.buy}
              </p>
              <p className="mt-1 text-sm font-medium text-[#53647F]">
                Customer purchases
              </p>
            </div>
          </article>

          {/* Sell Orders Card */}
          <article
            onClick={() => onNavigateTab?.("orders")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onNavigateTab?.("orders");
            }}
            className="cursor-pointer rounded-2xl border border-[#DCE5F1] bg-white p-4.5 shadow-2xs transition hover:border-[#704CF3]/40 hover:shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                Sell Orders
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#704CF3]">
                <Package className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-extrabold tracking-tight text-[#151D35]">
                {orderOverview.sell}
              </p>
              <p className="mt-1 text-sm font-medium text-[#53647F]">
                Trade-in requests
              </p>
            </div>
          </article>
        </div>
        <div className={`grid gap-4 ${hasB2BWallet ? "sm:grid-cols-2" : "max-w-md"}`}>
          <article
            onClick={() => onNavigateTab?.("wallet")}
            className="rounded-2xl border border-[#B7F1CD] bg-[#F7FDF9] p-4 cursor-pointer hover:border-[#16B879]/50 transition"
          >
            <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#157348]">Store Wallet</span><Wallet className="h-4.5 w-4.5 text-[#157348]" /></div>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#151D35]">{formatCurrencyINR(walletBalance)}</p>
            <p className="mt-1 text-sm font-medium text-[#53647F]">Available balance</p>
          </article>
          {hasB2BWallet && (
            <article
              onClick={() => onNavigateTab?.("b2b_wallet")}
              className="rounded-2xl border border-[#C9DCFF] bg-[#F7FAFF] p-4 cursor-pointer hover:border-[#2A67EC]/50 transition"
            >
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#2459C4]">B2B Credit Wallet</span><Building2 className="h-4.5 w-4.5 text-[#2A67EC]" /></div>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#151D35]">{formatCurrencyINR(b2bWallet.available)}</p>
              <p className="mt-1 text-sm font-medium text-[#53647F]">Available balance</p>
            </article>
          )}
        </div>
      </section>

      {/* 2. ACCOUNT INFORMATION IN TWO CLEAR ROWS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="contents">
          <div className="order-4 h-full rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE5F1] pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-[#2A67EC]" />
                <h3 className="text-base font-bold text-[#151D35]">
                  Wallet Activity
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab?.("wallet")}
                className="inline-flex items-center gap-1 text-sm font-bold text-[#2A67EC] hover:underline cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {activity.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#71809A]">
                No wallet transactions recorded for this customer.
              </p>
            ) : (
              <div className="divide-y divide-[#DCE5F1]/70">
                {activity
                  .slice(0, activityLimit)
                  .map(({ wallet, transaction, timestamp }, index) => {
                    const credit = isCreditTransaction(transaction);
                    const descriptor =
                      transaction?.reason ||
                      transaction?.method ||
                      transaction?.type ||
                      "Transaction";

                    return (
                      <div
                        key={transaction?.id || `${wallet}-${index}`}
                        className="py-3 flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              credit
                                ? "bg-[#ECFBF3] text-[#157348]"
                                : "bg-[#F2F5FA] text-[#53647F]"
                            }`}
                          >
                            {credit ? (
                              <ArrowDownLeft className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="font-bold text-[#151D35] truncate text-sm">
                              {descriptor}
                            </p>
                            <p className="text-xs text-[#53647F]">
                              {timestamp
                                ? formatDateTime(timestamp)
                                : "Date unavailable"}{" "}
                              · <span className="font-medium">{wallet}</span>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-sm font-black shrink-0 ${
                            credit ? "text-[#157348]" : "text-[#151D35]"
                          }`}
                        >
                          {credit ? "+" : "-"}
                          {formatCurrencyINR(transaction?.amount)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="contents">
          {/* ACCOUNT DETAILS: information previously shown in the profile panel */}
          <div className="order-1 h-full rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#DCE5F1] pb-3">
              <Globe2 className="h-5 w-5 text-[#2A67EC]" />
              <h3 className="text-base font-bold text-[#151D35]">
                Account details
              </h3>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Channel source
                </dt>
                <dd className="mt-1 font-bold text-[#151D35]">
                  {userData?.source || "Not specified"}
                </dd>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <dt className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  Last active
                </dt>
                <dd className="mt-1 font-semibold text-[#151D35]">
                  {formatDateTime(userData?.lastLoggedIn)}
                  <span className="block pt-0.5 text-xs font-medium text-[#53647F]">
                    {formatRelativeTime(userData?.lastLoggedIn)}
                  </span>
                </dd>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-3">
                <dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#53647F]">
                  <CalendarDays className="h-3 w-3" /> Registered
                </dt>
                <dd className="mt-1 font-semibold text-[#151D35]">
                  {formatDateTime(userData?.created_at)}
                </dd>
              </div>
            </dl>
          </div>

          {/* CARD 1: PRIMARY ADDRESS */}
          <div className="order-2 h-full rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#DCE5F1] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#2A67EC]" />
                <h3 className="text-base font-bold text-[#151D35]">
                  Primary Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.("addresses")}
                className="text-sm font-bold text-[#2A67EC] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {primaryAddress ? (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3.5 text-sm space-y-2">
                <div className="flex items-center justify-between text-[#53647F]">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#151D35]">
                    {primaryAddress.name || userData?.name || "Recipient"}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#157348] bg-[#ECFBF3] border border-[#B7F1CD] rounded-full px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16B879]" />
                    Default
                  </span>
                </div>

                {primaryAddress.street && (
                  <p className="font-semibold text-sm text-[#151D35] leading-snug">
                    {primaryAddress.street}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-[#53647F]">
                  <p className="font-medium">
                    {[primaryAddress.city, primaryAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                    {primaryAddress.pincode ? ` · ${primaryAddress.pincode}` : ""}
                  </p>
                  {fullAddressString && (
                    <button
                      type="button"
                      onClick={() => handleCopy(fullAddressString, "addr-copy")}
                      className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer p-1"
                      title="Copy full address"
                    >
                      {copiedKey === "addr-copy" ? (
                        <Check className="h-4 w-4 text-[#16B879]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {(primaryAddress.phone_number || primaryAddress.phone || userData?.phone) && (
                  <div className="pt-1.5 border-t border-[#DCE5F1]/70 flex items-center gap-1.5 text-xs text-[#53647F]">
                    <Phone className="h-3.5 w-3.5 text-[#53647F]" />
                    <span className="font-mono font-medium">
                      {primaryAddress.phone_number || primaryAddress.phone || userData?.phone}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-4 text-center text-xs text-[#71809A]">
                No primary address on file.
              </div>
            )}
          </div>

          {/* CARD 2: PAYMENT DETAILS */}
          <div className="order-3 h-full rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE5F1] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#16B879]" />
                <h3 className="text-base font-bold text-[#151D35]">
                  Payment Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab?.("payments")}
                className="text-sm font-bold text-[#2A67EC] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            {/* UPI ID */}
            {upi?.upi_id ? (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3.5 text-sm">
                <div className="flex items-center justify-between text-[#53647F]">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    UPI ID
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#157348]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between font-mono font-bold text-sm text-[#151D35]">
                  <span className="truncate">{upi.upi_id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(upi.upi_id, "upi")}
                    className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer p-1"
                    title="Copy UPI"
                  >
                    {copiedKey === "upi" ? (
                      <Check className="h-4 w-4 text-[#16B879]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3 text-xs text-[#71809A]">
                No UPI ID on record.
              </div>
            )}

            {/* Bank Account */}
            {netbanking?.account_no ? (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3.5 text-sm space-y-2">
                <div className="flex items-center justify-between text-[#53647F]">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    Bank Account {netbanking.bank_name ? `(${netbanking.bank_name})` : ""}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#157348]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between font-mono font-bold text-sm text-[#151D35]">
                  <span>A/C: {netbanking.account_no}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(netbanking.account_no, "bank-ac")}
                    className="text-[#8190A9] hover:text-[#2A67EC] cursor-pointer p-1"
                    title="Copy Bank A/C"
                  >
                    {copiedKey === "bank-ac" ? (
                      <Check className="h-4 w-4 text-[#16B879]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {netbanking.ifsc && (
                  <p className="text-xs font-mono font-semibold text-[#53647F]">
                    IFSC: {netbanking.ifsc}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[#DCE5F1] bg-[#F8FAFC] p-3 text-xs text-[#71809A]">
                No Bank Account on record.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
