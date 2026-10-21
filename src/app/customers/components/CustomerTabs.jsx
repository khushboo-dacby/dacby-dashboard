"use client";

import {
  User,
  MapPin,
  Wallet,
  CreditCard,
  ShoppingCart,
  Building2,
} from "lucide-react";

export default function CustomerTabs({
  activeTab,
  onTabChange,
  counts = {},
  isVendor = false,
  hasB2BWallet = false,
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      count: counts.orders ?? 0,
    },
    { id: "wallet", label: "Wallet", icon: Wallet },
    ...(hasB2BWallet
      ? [
          {
            id: "b2b_wallet",
            label: "B2B Wallet",
            icon: Building2,
            count: counts.b2bTransactions ?? counts.b2b_wallet ?? 0,
          },
        ]
      : []),
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      count: counts.addresses ?? 0,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      count: counts.payments ?? 0,
    },
  ];

  return (
    <div className="border-b border-[#DCE5F1] bg-white px-4 sm:px-6 py-2">
      {/* Tab Navigation (Matches Screenshot: Overview, Orders, Wallet, Addresses, Payments) */}
      <nav
        className="-mb-[9px] flex space-x-1 sm:space-x-6 overflow-x-auto scrollbar-none"
        aria-label="Customer Navigation Tabs"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center gap-2 border-b-2 py-3.5 px-1 text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "border-[#151D35] text-[#151D35]"
                  : "border-transparent text-[#53647F] hover:border-[#DCE5F1] hover:text-[#151D35]"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition ${
                  isActive
                    ? "text-[#151D35]"
                    : "text-[#53647F] group-hover:text-[#151D35]"
                }`}
              />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-[#151D35] text-white"
                      : "bg-[#F2F5FA] text-[#53647F]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}
