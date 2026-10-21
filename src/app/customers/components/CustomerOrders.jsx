"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import {
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
  Hash,
  Eye,
  Search,
  Smartphone,
  Globe,
  Filter,
  ArrowUpDown,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  Truck,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { fetchUserOrders } from "../api";
import {
  formatDateTime,
  formatRelativeTime,
  formatCurrencyINR,
  parseTimestamp,
} from "../customerUtils";
import OrderDetailModal from "./OrderDetailModal";

function extractOrders(ordersData) {
  if (!ordersData) return [];
  if (Array.isArray(ordersData)) return ordersData;
  if (Array.isArray(ordersData.orders)) return ordersData.orders;
  if (Array.isArray(ordersData.data)) return ordersData.data;
  if (Array.isArray(ordersData.data?.orders)) return ordersData.data.orders;
  if (Array.isArray(ordersData.userOrders)) return ordersData.userOrders;
  if (Array.isArray(ordersData.user_orders)) return ordersData.user_orders;
  if (Array.isArray(ordersData.result)) return ordersData.result;
  if (Array.isArray(ordersData.payload)) return ordersData.payload;

  const buyList = Array.isArray(ordersData.buyOrders)
    ? ordersData.buyOrders
    : Array.isArray(ordersData.buy_orders)
      ? ordersData.buy_orders
      : Array.isArray(ordersData.buy)
        ? ordersData.buy
        : [];
  const sellList = Array.isArray(ordersData.sellOrders)
    ? ordersData.sellOrders
    : Array.isArray(ordersData.sell_orders)
      ? ordersData.sell_orders
      : Array.isArray(ordersData.sell)
        ? ordersData.sell
        : [];

  if (buyList.length > 0 || sellList.length > 0) {
    const taggedBuy = buyList.map((o) => ({ ...o, _isApiBuy: true, _isApiSell: false, type: "Buy" }));
    const taggedSell = sellList.map((o) => ({ ...o, _isApiBuy: false, _isApiSell: true, type: "Sell" }));
    return [...taggedBuy, ...taggedSell];
  }

  if (
    ordersData.data &&
    typeof ordersData.data === "object" &&
    !Array.isArray(ordersData.data)
  ) {
    const vals = Object.values(ordersData.data);
    if (vals.length > 0 && typeof vals[0] === "object") {
      return vals;
    }
  }

  return [];
}

function parseOrderStatus(status) {
  if (!status) return "Placed";
  if (typeof status === "string") return status;
  if (typeof status === "object") {
    if (
      status.overall_status &&
      typeof status.overall_status === "string" &&
      status.overall_status.trim()
    ) {
      return status.overall_status;
    }
    if (
      status.final_status &&
      typeof status.final_status === "string" &&
      status.final_status.trim()
    ) {
      return status.final_status;
    }
    if (
      status.cancellation_reason &&
      typeof status.cancellation_reason === "string"
    ) {
      return `Cancelled: ${status.cancellation_reason}`;
    }
    if (status.cancelled === true) return "Cancelled";
    if (status.completed === true) return "Completed";
    if (status.return === true) return "Returned";
    if (status.rto === true) return "RTO";
    if (status.last_status_code && typeof status.last_status_code === "string") {
      return status.last_status_code;
    }
    return "In Progress";
  }
  return String(status);
}

function getOrderStatusBadge(rawStatus) {
  const statusStr = parseOrderStatus(rawStatus);
  const s = String(statusStr || "").toLowerCase().trim();

  // Cancelled / Returned / RTO / Unsuccessful (Checked FIRST to prevent "unsuccess" matching "success")
  if (
    s.includes("cancel") ||
    s.includes("reject") ||
    s.includes("fail") ||
    s.includes("return") ||
    s.includes("rto") ||
    s.includes("unsuccess")
  ) {
    return {
      label: statusStr || "Unsuccessful",
      dotClass: "bg-[#D34D5D]",
      className:
        "border-[#F5C2CA] bg-[#FFF0F2] text-[#B83852]",
    };
  }

  // Completed / Delivered
  if (
    s.includes("complete") ||
    s.includes("deliver") ||
    (s.includes("success") && !s.includes("unsuccess")) ||
    s === "done"
  ) {
    return {
      label: statusStr || "Delivered",
      dotClass: "bg-[#16B879]",
      className:
        "border-[#B7F1CD] bg-[#ECFBF3] text-[#157348]",
    };
  }

  // In Transit / Dispatched / Shipping
  if (
    s.includes("transit") ||
    s.includes("ship") ||
    s.includes("dispatch") ||
    s.includes("out for delivery")
  ) {
    return {
      label: statusStr || "In Transit",
      dotClass: "bg-[#2A67EC]",
      className:
        "border-[#C9DCFF] bg-[#EDF3FF] text-[#2459C4]",
    };
  }

  // In Progress / Evaluation / Processing
  if (
    s.includes("process") ||
    s.includes("pickup") ||
    s.includes("pending") ||
    s.includes("qc") ||
    s.includes("warehouse") ||
    s.includes("hold")
  ) {
    return {
      label: statusStr || "Processing",
      dotClass: "bg-[#C87513]",
      className:
        "border-[#F4D877] bg-[#FFF8E9] text-[#C87513]",
    };
  }

  // Default: Placed
  return {
    label: statusStr || "Order Placed",
    dotClass: "bg-[#2A67EC]",
    className:
      "border-[#C9DCFF] bg-[#EDF3FF] text-[#2459C4]",
  };
}

function extractFirstProduct(ord) {
  if (!ord) return null;
  if (ord.products && typeof ord.products === "object") {
    const vals = Array.isArray(ord.products)
      ? ord.products
      : Object.values(ord.products);
    if (vals.length > 0 && typeof vals[0] === "object") {
      return {
        title: vals[0].title || vals[0].name || "Product Item",
        imageUrl:
          vals[0].image_url ||
          vals[0].imageUrl ||
          vals[0].image ||
          "",
        qty: Number(vals[0].quantity) || 1,
        totalItems: vals.length,
      };
    }
  }
  if (Array.isArray(ord.items) && ord.items.length > 0) {
    return {
      title: ord.items[0].title || ord.items[0].name || "Product Item",
      imageUrl:
        ord.items[0].image_url ||
        ord.items[0].imageUrl ||
        "",
      qty: Number(ord.items[0].quantity) || 1,
      totalItems: ord.items.length,
    };
  }
  return null;
}

function getOrderRowDetails(ord, idx) {
  const orderId = String(
    ord.orderId || ord.id || ord.order_id || ord.docId || `ORD-${idx}`
  );
  const isSell =
    ord._isApiSell === true
      ? true
      : ord._isApiBuy === true
        ? false
        : Boolean(ord.sell) ||
        String(ord.type || ord.order_type || ord.orderType || "")
          .toLowerCase()
          .includes("sell");
  const orderType = isSell ? "Sell Order" : "Buy Order";
  const isFastDelivery = Boolean(ord.fast_delivery);
  const isSelfShip = Boolean(ord.selfship);

  // Products
  const productInfo = extractFirstProduct(ord);

  // Calculate items count
  let itemsCount = 0;
  if (ord.products && typeof ord.products === "object") {
    itemsCount = Array.isArray(ord.products)
      ? ord.products.length
      : Object.keys(ord.products).length;
  } else if (Array.isArray(ord.items)) {
    itemsCount = ord.items.length;
  }
  if (itemsCount === 0) itemsCount = 1;

  // Financials
  const finalAmount =
    typeof ord.final_amount === "number"
      ? ord.final_amount
      : typeof ord.total === "number"
        ? ord.total
        : typeof ord.amount === "number"
          ? ord.amount
          : Number(ord.final_amount || ord.total || ord.amount || ord.price || 0) ||
          0;

  const payment =
    ord.payment && typeof ord.payment === "object" ? ord.payment : {};
  const amountPaid =
    typeof payment.amount_paid === "number"
      ? payment.amount_paid
      : Number(payment.amount_paid) || 0;

  const amountLeft =
    typeof payment.amount_left === "number"
      ? payment.amount_left
      : finalAmount - amountPaid >= 0
        ? finalAmount - amountPaid
        : 0;

  const rawPaymentMethod =
    payment.method ||
    ord.payment_method ||
    (payment.cash ? "cod" : "wallet");
  const paymentMethod = String(rawPaymentMethod).toUpperCase();

  // Status
  const rawStatus = ord.status || ord.order_status || ord.orderStatus;
  const statusStr = parseOrderStatus(rawStatus);
  const statusBadge = getOrderStatusBadge(rawStatus);

  const createdAt =
    ord.created_at || ord.timestamp || ord.date || ord.ordered_at;

  // Recipient / Location
  const source = ord.source || {};
  const recipientName = source.name || "Customer";
  const recipientCity = source.address?.city || source.city || "";
  const recipientState = source.address?.state || source.state || "";
  const recipientLocation =
    [recipientCity, recipientState].filter(Boolean).join(", ") || "India";

  // Platform
  const platform = ord.platform || "Mobile";

  // Status breakdown & success check
  const sLower = String(statusStr || "").toLowerCase().trim();
  const fsLower = String(rawStatus?.final_status || "").toLowerCase().trim();
  const isFailedOrUnsuccess =
    sLower.includes("unsuccess") ||
    sLower.includes("cancel") ||
    sLower.includes("reject") ||
    sLower.includes("fail") ||
    sLower.includes("return") ||
    sLower.includes("rto") ||
    fsLower.includes("unsuccess") ||
    fsLower.includes("cancel") ||
    fsLower.includes("fail") ||
    rawStatus?.cancelled === true ||
    rawStatus?.return === true ||
    rawStatus?.rto === true;

  // Fully successful orders must be in an actual success/delivered/completed state
  // and NOT in preliminary or in-flight states like "Order Placed", "Shipment Booked", "Under QC", etc.
  const isSuccess =
    !isFailedOrUnsuccess &&
    !sLower.includes("placed") &&
    !sLower.includes("transit") &&
    !sLower.includes("process") &&
    !sLower.includes("qc") &&
    !sLower.includes("pickup") &&
    (sLower.includes("complete") ||
      sLower.includes("deliver") ||
      (sLower.includes("success") && !sLower.includes("unsuccess")) ||
      sLower === "done" ||
      sLower === "paid" ||
      (fsLower === "success" && !rawStatus?.overall_status));

  // In flight / in transit
  const isInFlight = !isSuccess && !isFailedOrUnsuccess;

  return {
    orderId,
    isSell,
    orderType,
    isFastDelivery,
    isSelfShip,
    productInfo,
    itemsCount,
    finalAmount,
    amountPaid,
    amountLeft,
    paymentMethod,
    rawStatus,
    statusStr,
    statusBadge,
    createdAt,
    recipientName,
    recipientLocation,
    platform,
    isSuccess,
    isInFlight,
  };
}

export default function CustomerOrders({ userId, initialOrders = null }) {
  // Filters & Search & Sort
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "buy" | "sell"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "completed" | "in_flight" | "cancelled"
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc"); // "date_desc" | "date_asc" | "amount_desc" | "amount_asc"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);


  // SWR: In-memory cached orders fetching
  const {
    data: swrOrdersData,
    error: swrError,
    isLoading: swrLoading,
    isValidating: isRefreshing,
    mutate: mutateOrders,
  } = useSWR(
    userId ? ["user-orders", userId] : null,
    () => fetchUserOrders({ userId }),
    {
      fallbackData: initialOrders,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );

  const ordersData = swrOrdersData || initialOrders;
  const loading = swrLoading && !ordersData;
  const error = swrError
    ? swrError.message || "Failed to load user orders"
    : null;

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rawOrders = useMemo(() => extractOrders(ordersData), [ordersData]);

  const buyOrders = useMemo(
    () => rawOrders.filter((o, idx) => !getOrderRowDetails(o, idx).isSell),
    [rawOrders]
  );

  const sellOrders = useMemo(
    () => rawOrders.filter((o, idx) => getOrderRowDetails(o, idx).isSell),
    [rawOrders]
  );

  const buySuccessCount = useMemo(() => {
    return buyOrders.filter(
      (o, idx) => getOrderRowDetails(o, idx).isSuccess
    ).length;
  }, [buyOrders]);

  const sellSuccessCount = useMemo(() => {
    return sellOrders.filter(
      (o, idx) => getOrderRowDetails(o, idx).isSuccess
    ).length;
  }, [sellOrders]);

  const totalOrders = rawOrders.length;
  const totalCompleted = buySuccessCount + sellSuccessCount;

  const totalBuyRevenue = useMemo(() => {
    return buyOrders.reduce((sum, o) => {
      return sum + (Number(o.final_amount) || 0);
    }, 0);
  }, [buyOrders]);

  const totalSellRevenue = useMemo(() => {
    return sellOrders.reduce((sum, o) => {
      return sum + (Number(o.final_amount) || 0);
    }, 0);
  }, [sellOrders]);

  const fulfilmentRate = useMemo(() => {
    if (totalOrders === 0) return 100;
    const rate = (totalCompleted / totalOrders) * 100;
    if (rate > 0 && rate < 1) return Number(rate.toFixed(1));
    return Math.round(rate);
  }, [totalOrders, totalCompleted]);

  const inFlightCount = useMemo(() => {
    return rawOrders.filter((o, idx) => getOrderRowDetails(o, idx).isInFlight)
      .length;
  }, [rawOrders]);

  const cancelledCount = useMemo(() => {
    return rawOrders.filter((o, idx) => {
      const s = String(
        parseOrderStatus(o.status || o.order_status)
      ).toLowerCase();
      return (
        s.includes("cancel") ||
        s.includes("reject") ||
        s.includes("return") ||
        s.includes("rto") ||
        s.includes("unsuccess") ||
        s.includes("fail")
      );
    }).length;
  }, [rawOrders]);

  // Filtered & Searched Orders
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((o, idx) => {
      const det = getOrderRowDetails(o, idx);

      // Type Filter
      if (typeFilter === "buy" && det.isSell) return false;
      if (typeFilter === "sell" && !det.isSell) return false;

      // Status Filter
      if (statusFilter === "completed" && !det.isSuccess) return false;
      if (statusFilter === "in_flight" && !det.isInFlight) return false;
      if (statusFilter === "cancelled") {
        const s = String(det.statusStr || "").toLowerCase();
        if (
          !s.includes("cancel") &&
          !s.includes("reject") &&
          !s.includes("return") &&
          !s.includes("rto") &&
          !s.includes("unsuccess") &&
          !s.includes("fail")
        )
          return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = det.orderId.toLowerCase().includes(q);
        const matchTitle = det.productInfo?.title?.toLowerCase().includes(q);
        const matchRecipient = det.recipientName.toLowerCase().includes(q);
        const matchLocation = det.recipientLocation.toLowerCase().includes(q);
        const matchMethod = det.paymentMethod.toLowerCase().includes(q);
        const matchPhone = String(o.source?.phone_number || "").includes(q);

        if (
          !matchId &&
          !matchTitle &&
          !matchRecipient &&
          !matchLocation &&
          !matchMethod &&
          !matchPhone
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rawOrders, typeFilter, statusFilter, searchQuery]);

  // Sorted Orders
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortBy === "amount_desc") {
        return (Number(b.final_amount) || 0) - (Number(a.final_amount) || 0);
      }
      if (sortBy === "amount_asc") {
        return (Number(a.final_amount) || 0) - (Number(b.final_amount) || 0);
      }
      if (sortBy === "date_asc") {
        const tsA =
          parseTimestamp(
            a.created_at || a.timestamp || a.date || a.ordered_at
          )?.getTime() || 0;
        const tsB =
          parseTimestamp(
            b.created_at || b.timestamp || b.date || b.ordered_at
          )?.getTime() || 0;
        return tsA - tsB;
      }
      // default: date_desc
      const tsA =
        parseTimestamp(
          a.created_at || a.timestamp || a.date || a.ordered_at
        )?.getTime() || 0;
      const tsB =
        parseTimestamp(
          b.created_at || b.timestamp || b.date || b.ordered_at
        )?.getTime() || 0;
      return tsB - tsA;
    });
  }, [filteredOrders, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedOrders.length);
  const currentOrders = sortedOrders.slice(startIndex, endIndex);

  const hasActiveFilters =
    typeFilter !== "all" || statusFilter !== "all" || Boolean(searchQuery);

  const handleResetFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (loading && !ordersData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-[#DCE5F1] bg-[#F8FAFC]"
            />
          ))}
        </div>
        <div className="h-96 rounded-2xl border border-[#DCE5F1] bg-white p-12 text-center shadow-xs flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#2A67EC]" />
          <p className="mt-3 text-xs font-bold text-[#53647F]">
            Loading real-time order history...
          </p>
        </div>
      </div>
    );
  }

  if (error && !ordersData) {
    return (
      <div className="rounded-2xl border border-[#F5C2CA] bg-[#FFF0F2] p-8 text-center shadow-xs">
        <AlertCircle className="mx-auto h-8 w-8 text-[#D34D5D]" />
        <p className="mt-2 text-sm font-bold text-[#B83852]">
          Could not load customer orders
        </p>
        <p className="mt-1 text-xs text-[#53647F]">{error}</p>
        <button
          type="button"
          onClick={() => mutateOrders()}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E57D2] transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP TAB HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE5F1]/80 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC] shadow-2xs">
            <ShoppingCart className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#151D35]">
              Customer Orders
            </h2>
            <p className="text-sm font-medium text-[#53647F]">
              Complete order lifecycle, fulfillment metrics, item inspection, and delivery statuses.
            </p>
          </div>
        </div>
      </div>

      {/* 2. TOP SAAS STATS CARDS (4-Column Layout: Buy Orders, Sell Orders, Success SLA Rate, In-Transit Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Buy Orders */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:border-[#C9DCFF]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
              Buy Orders
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EDF3FF] text-[#2A67EC]">
              <ShoppingCart className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#151D35]">
                {formatCurrencyINR(totalBuyRevenue)}
              </p>
              <span className="text-xs font-bold text-[#2A67EC] bg-[#EDF3FF] border border-[#C9DCFF] px-2 py-0.5 rounded-md">
                {buyOrders.length} Orders
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              <strong className="text-[#151D35]">{buyOrders.length} placed</strong> ·{" "}
              <span className="text-[#157348] font-bold">{buySuccessCount} completed</span>
            </p>
          </div>
        </div>

        {/* Card 2: Sell Orders */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:border-[#C9DCFF]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
              Sell Orders
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#704CF3]">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#704CF3]">
                {formatCurrencyINR(totalSellRevenue)}
              </p>
              <span className="text-xs font-bold text-[#704CF3] bg-[#F3EEFF] border border-[#DDD3FD] px-2 py-0.5 rounded-md">
                {sellOrders.length} Requests
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              <strong className="text-[#151D35]">{sellOrders.length} requests</strong> ·{" "}
              <span className="text-[#157348] font-bold">{sellSuccessCount} paid</span>
            </p>
          </div>
        </div>

        {/* Card 3: Success SLA Rate */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:border-[#C9DCFF]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
              Success SLA Rate
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFBF3] text-[#157348]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#157348]">
                {fulfilmentRate}%
              </p>
              <span className="text-xs font-bold text-[#157348] bg-[#ECFBF3] border border-[#B7F1CD] px-2 py-0.5 rounded-md">
                {totalCompleted}/{totalOrders} Done
              </span>
            </div>
            {/* Visual mini progress track */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#ECFBF3]">
              <div
                className="h-full rounded-full bg-[#16B879] transition-all duration-500"
                style={{ width: `${fulfilmentRate}%` }}
              />
            </div>
            <p className="mt-1.5 text-sm font-medium text-[#53647F]">
              Fulfilled orders against total volume
            </p>
          </div>
        </div>

        {/* Card 4: In-Transit Orders */}
        <div className="rounded-2xl border border-[#DCE5F1] bg-white p-5 shadow-xs transition hover:border-[#C9DCFF]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#53647F]">
              In-Transit Orders
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF8E9] text-[#C87513]">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#C87513]">
                {inFlightCount}
              </p>
              <span className="text-xs font-bold text-[#C87513] bg-[#FFF8E9] border border-[#FDE6B8] px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[#53647F]">
              Active in transit, dispatch, or evaluation
            </p>
          </div>
        </div>
      </div>

      {/* 2. ENTERPRISE FILTERING, SEARCH & TOOLBAR */}
      <div className="space-y-3 rounded-2xl border border-[#DCE5F1] bg-[#F8FAFC] p-3.5 sm:p-4 shadow-2xs">
        {/* Row 1: Segmented Tabs (All / Buy / Sell) & Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Type Segmented Control */}
          <div className="inline-flex rounded-xl bg-white p-1 border border-[#DCE5F1] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setTypeFilter("all");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${typeFilter === "all"
                  ? "bg-[#2A67EC] text-white shadow-xs"
                  : "text-[#53647F] hover:text-[#151D35]"
                }`}
            >
              All Orders ({totalOrders})
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter("buy");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${typeFilter === "buy"
                  ? "bg-[#2A67EC] text-white shadow-xs"
                  : "text-[#53647F] hover:text-[#151D35]"
                }`}
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Buy ({buyOrders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter("sell");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${typeFilter === "sell"
                  ? "bg-[#704CF3] text-white shadow-xs"
                  : "text-[#53647F] hover:text-[#151D35]"
                }`}
            >
              <Package className="h-3 w-3" />
              <span>Sell ({sellOrders.length})</span>
            </button>
          </div>

          {/* Quick Status Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition cursor-pointer ${statusFilter === "all"
                  ? "border-[#151D35] bg-[#151D35] text-white"
                  : "border-[#DCE5F1] bg-white text-[#53647F] hover:bg-[#EEF3FF] hover:text-[#2A67EC]"
                }`}
            >
              All Statuses
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("completed");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold border transition cursor-pointer ${statusFilter === "completed"
                  ? "border-[#16B879] bg-[#16B879] text-white"
                  : "border-[#B7F1CD] bg-[#ECFBF3] text-[#157348] hover:bg-[#DBF8E7]"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span>Success ({totalCompleted})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("in_flight");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold border transition cursor-pointer ${statusFilter === "in_flight"
                  ? "border-[#C87513] bg-[#C87513] text-white"
                  : "border-[#F4D877] bg-[#FFF8E9] text-[#C87513] hover:bg-[#FEEFCB]"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span>Active ({inFlightCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("cancelled");
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold border transition cursor-pointer ${statusFilter === "cancelled"
                  ? "border-[#B83852] bg-[#B83852] text-white"
                  : "border-[#F5C2CA] bg-[#FFF0F2] text-[#B83852] hover:bg-[#FFE3E8]"
                }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span>Cancelled ({cancelledCount})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Omni-Search Bar & Sorting Controls & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#DCE5F1]/60">
          {/* Omni Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8190A9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Order ID, Product Title, Recipient, City, or Phone..."
              className="w-full rounded-xl border border-[#DCE5F1] bg-white pl-9 pr-8 py-1.5 text-xs text-[#151D35] placeholder:text-[#8190A9] focus:outline-none focus:border-[#2A67EC] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8190A9] hover:text-[#151D35] p-0.5"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-2.5 py-1 shadow-2xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-[#8190A9]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort orders"
                className="bg-transparent text-xs font-bold text-[#53647F] focus:outline-none cursor-pointer"
              >
                <option value="date_desc">Newest Date First</option>
                <option value="date_asc">Oldest Date First</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Reset Pill Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[#53647F]">
              Showing <strong className="text-[#151D35]">{sortedOrders.length}</strong> filtered orders
              {searchQuery && (
                <span> matching &ldquo;<strong className="text-[#2A67EC]">{searchQuery}</strong>&rdquo;</span>
              )}
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-bold text-[#2A67EC] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Reset all filters</span>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. INDUSTRY-LEVEL DATA TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#DCE5F1] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] text-[#46546D] uppercase tracking-wider font-bold border-b border-[#DCE5F1]">
              <tr>
                <th className="py-3.5 px-4 font-black">Order ID & Type</th>
                <th className="py-3.5 px-4 font-black">Product Item</th>
                <th className="py-3.5 px-4 font-black">Status</th>
                <th className="py-3.5 px-4 font-black">Amount</th>
                <th className="py-3.5 px-4 font-black">Payment</th>
                <th className="py-3.5 px-4 font-black">Created Date</th>
                <th className="py-3.5 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5F1]/60 text-[#151D35]">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Package className="mx-auto h-9 w-9 text-[#8190A9]" />
                    <p className="mt-3 text-sm font-bold text-[#151D35]">
                      No orders match your filter criteria
                    </p>
                    <p className="mt-1 text-sm text-[#53647F]">
                      Try adjusting your search terms or clearing the status filter.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#2A67EC] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1E57D2] transition cursor-pointer"
                    >
                      <span>Clear All Filters</span>
                    </button>
                  </td>
                </tr>
              ) : (
                currentOrders.map((ord, idx) => {
                  const det = getOrderRowDetails(ord, startIndex + idx);

                  return (
                    <tr
                      key={det.orderId || idx}
                      className="hover:bg-[#F8FAFC] transition group"
                    >
                      {/* Order ID & Type Badge */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-[#151D35]">
                            {det.orderId}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(det.orderId, `row-${idx}`)
                            }
                            className="text-[#8190A9] hover:text-[#2A67EC] transition p-0.5 cursor-pointer"
                            title="Copy Order ID"
                          >
                            {copiedId === `row-${idx}` ? (
                              <Check className="h-3.5 w-3.5 text-[#16B879]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-sm font-bold border ${det.isSell
                                ? "bg-[#F3EEFF] text-[#704CF3] border-[#DDD0FF]"
                                : "bg-[#EDF3FF] text-[#2459C4] border-[#C9DCFF]"
                              }`}
                          >
                            {det.orderType}
                          </span>
                          {det.isFastDelivery && (
                            <span className="inline-flex items-center gap-0.5 rounded-md border border-[#F4D877] bg-[#FFF8E9] px-1.5 py-0.5 text-sm font-bold text-[#C87513]">
                              <Zap className="h-2.5 w-2.5" />
                              <span>Fast</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Preview Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 max-w-[220px]">
                          {/* Image Thumbnail */}
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[#DCE5F1] bg-[#F8FAFC]">
                            {det.productInfo?.imageUrl ? (
                              <img
                                src={det.productInfo.imageUrl}
                                alt={det.productInfo.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-full w-full items-center justify-center text-[#8190A9] ${det.productInfo?.imageUrl ? "hidden" : "flex"
                                }`}
                            >
                              <Package className="h-4 w-4" />
                            </div>
                          </div>

                          {/* Product Title + Count */}
                          <div className="min-w-0">
                            <p
                              className="font-bold text-sm text-[#151D35] truncate"
                              title={det.productInfo?.title || "Product"}
                            >
                              {det.productInfo?.title || "Product Item"}
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-[#46546D]">
                              Qty: {det.productInfo?.qty || 1}
                              {det.itemsCount > 1 && (
                                <span className="ml-1 text-[#2A67EC] font-bold">
                                  +{det.itemsCount - 1} more
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge with Dot */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-bold ${det.statusBadge.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${det.statusBadge.dotClass}`}
                          />
                          <span className="truncate max-w-[130px]">
                            {det.statusBadge.label}
                          </span>
                        </span>
                      </td>

                      {/* Final Amount */}
                      <td className="py-3.5 px-4">
                        <p className="font-black text-base text-[#151D35]">
                          {formatCurrencyINR(det.finalAmount)}
                        </p>
                      </td>

                      {/* Payment Method & Balance */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-md border border-[#DCE5F1] bg-[#F8FAFC] px-1.5 py-0.5 text-sm font-bold text-[#46546D]">
                            {det.paymentMethod}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          {det.amountLeft > 0 ? (
                            <span className="font-bold text-[#D34D5D]">
                              Due: {formatCurrencyINR(det.amountLeft)}
                            </span>
                          ) : (
                            <span className="font-semibold text-[#157348]">
                              Paid in Full
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date & Platform */}
                      <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                        <p className="font-medium text-[#151D35]">
                          {formatDateTime(det.createdAt)}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-[#46546D] flex items-center gap-1">
                          {det.platform.toLowerCase() === "mobile" ? (
                            <Smartphone className="h-3 w-3" />
                          ) : (
                            <Globe className="h-3 w-3" />
                          )}
                          <span>{det.platform}</span>
                          <span className="text-[#8190A9]">·</span>
                          <span>{formatRelativeTime(det.createdAt)}</span>
                        </p>
                      </td>

                      {/* Action: Inspect */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {}}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1.5 text-sm font-bold text-[#46546D] shadow-2xs hover:bg-[#F8FAFC] transition cursor-pointer"
                          title="Inspect Order"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION CONTROLS */}
        {sortedOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCE5F1] bg-[#F8FAFC] px-4 py-3 text-xs text-[#53647F]">
            <div className="flex items-center gap-3">
              <span>
                Showing <strong className="text-[#151D35]">{startIndex + 1}</strong>{" "}
                to <strong className="text-[#151D35]">{endIndex}</strong> of{" "}
                <strong className="text-[#151D35]">{sortedOrders.length}</strong>{" "}
                orders
              </span>

              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Rows per page"
                  className="rounded-lg border border-[#DCE5F1] bg-white px-2 py-0.5 text-xs font-bold text-[#151D35] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={validPage <= 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#53647F] disabled:hover:border-[#DCE5F1] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>

                <span className="px-2 font-bold text-[#151D35]">
                  {validPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={validPage >= totalPages}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5F1] bg-white px-3 py-1 font-bold text-[#53647F] shadow-2xs transition hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#53647F] disabled:hover:border-[#DCE5F1] cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. SINGLE-PANE ORDER DETAIL MODAL USING DATA FROM USER-ORDERS API */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          userId={userId}
        />
      )}
    </div>
  );
}
