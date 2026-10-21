"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import useSWR from "swr";
import { AlertCircle, RefreshCw } from "lucide-react";
import { getUserDetails, fetchUserOrders } from "./api";
import CustomerTopNav from "./components/CustomerTopNav";
import CustomerProfileSidebar from "./components/CustomerProfileSidebar";
import CustomerTabs from "./components/CustomerTabs";
import CustomerOverview from "./components/CustomerOverview";
import CustomerAddresses from "./components/CustomerAddresses";
import CustomerWallet from "./components/CustomerWallet";
import CustomerB2BWallet from "./components/CustomerB2BWallet";
import CustomerPayments from "./components/CustomerPayments";
import CustomerOrders from "./components/CustomerOrders";

export default function Customer({ initialUserId = "o7c3upYdXDVnqclgLxQs" }) {
    const [userId, setUserId] = useState(initialUserId);
    const [activeTab, setActiveTab] = useState("overview");

    // SWR: Fetch customer details with global in-memory caching
    const {
        data: customerData,
        error: customerError,
        isLoading: customerLoading,
        isValidating: customerValidating,
        mutate: mutateCustomer,
    } = useSWR(
        userId ? ["customer-details", userId] : null,
        () => getUserDetails(userId),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes cache
        }
    );

    // SWR: Fetch user orders with global in-memory caching
    const {
        data: ordersData,
        error: ordersError,
        isLoading: ordersLoading,
        isValidating: ordersValidating,
        mutate: mutateOrders,
    } = useSWR(
        userId ? ["user-orders", userId] : null,
        () =>
            fetchUserOrders(userId).catch((err) => {
                console.warn("fetchUserOrders failed in SWR:", err);
                return null;
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes cache
        }
    );

    const loading = (customerLoading || ordersLoading) && !customerData;
    const isRefreshing = customerValidating || ordersValidating;
    const error = customerError
        ? customerError.message || "Failed to load customer profile"
        : null;

    const handleRefresh = useCallback(async () => {
        await Promise.all([mutateCustomer(), mutateOrders()]);
    }, [mutateCustomer, mutateOrders]);

    const userData = customerData?.userData || {};
    const subcollections = customerData?.subcollections || {};
    const docId = customerData?.docId || userId;

    const addressCount = subcollections?.Address?.length || 0;
    const paymentCount = useMemo(() => {
        let count = subcollections?.PaymentMethod?.length || 0;
        if (userData?.payment_details?.upi?.upi_id) count += 1;
        if (userData?.payment_details?.netbanking?.account_no) count += 1;
        return count;
    }, [subcollections, userData]);

    const orderCount = useMemo(() => {
        if (!ordersData) return 0;
        if (
            Array.isArray(ordersData.buy_orders) ||
            Array.isArray(ordersData.sell_orders)
        ) {
            return (
                (ordersData.buy_orders?.length || 0) +
                (ordersData.sell_orders?.length || 0)
            );
        }
        if (Array.isArray(ordersData.orders)) return ordersData.orders.length;
        if (Array.isArray(ordersData)) return ordersData.length;
        return 0;
    }, [ordersData]);

    const b2bTransactions = useMemo(() => {
        return (
            subcollections?.B2b_Wallet ||
            subcollections?.B2B_Wallet ||
            subcollections?.b2b_wallet ||
            []
        );
    }, [subcollections]);

    const isVendor = Boolean(
        userData?.vendor === true ||
        userData?.vendor === "true" ||
        userData?.role === "vendor"
    );

    const hasB2BWallet = useMemo(() => {
        const b2bObj = userData?.b2b_wallet;
        const hasBalance =
            b2bObj &&
            typeof b2bObj === "object" &&
            (Number(b2bObj.total || 0) > 0 ||
                Number(b2bObj.bifurcation?.current_balance?.available || 0) > 0 ||
                Number(b2bObj.bifurcation?.current_balance?.on_hold || 0) > 0);

        return Boolean(
            isVendor ||
            (b2bTransactions && b2bTransactions.length > 0) ||
            hasBalance
        );
    }, [isVendor, b2bTransactions, userData]);

    useEffect(() => {
        if (!hasB2BWallet && activeTab === "b2b_wallet") {
            setActiveTab("wallet");
        }
    }, [hasB2BWallet, activeTab]);

    return (
        <main className="min-h-screen bg-[#F6F8FC] text-[#151D35] antialiased">
            {/* 1. Top Navigation Bar (Matching Screenshot Header) */}
            <CustomerTopNav
                userData={userData}
                docId={docId}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                onSearchUser={(newId) => setUserId(newId)}
            />

            <div className="mx-auto max-w-[1760px] px-3 sm:px-6 py-5">
                {/* Loading Skeleton */}
                {loading && !customerData && (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-28 rounded-2xl bg-white border border-[#DCE5F1]" />
                        <div className="h-14 rounded-2xl bg-white border border-[#DCE5F1]" />
                        <div className="h-72 rounded-2xl bg-white border border-[#DCE5F1]" />
                    </div>
                )}

                {/* Error State */}
                {error && !customerData && (
                    <div className="rounded-2xl border border-[#F5C2CA] bg-[#FFF0F2] p-8 text-center shadow-xs">
                        <AlertCircle className="mx-auto h-10 w-10 text-[#D34D5D]" />
                        <h2 className="mt-3 text-base font-bold text-[#B83852]">
                            Failed to load customer profile
                        </h2>
                        <p className="mt-1 text-xs text-[#53647F]">{error}</p>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2A67EC] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E57D2] transition cursor-pointer"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Retry Load</span>
                        </button>
                    </div>
                )}

                {/* Customer profile header with full-width workspace. */}
                {customerData && (
                    <div className="space-y-5">
                        <CustomerProfileSidebar
                            userData={userData}
                            docId={docId}
                        />

                        <section className="min-w-0 w-full rounded-2xl border border-[#DCE5F1] bg-white shadow-xs overflow-hidden">
                            <CustomerTabs
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                                isVendor={isVendor}
                                hasB2BWallet={hasB2BWallet}
                                counts={{
                                    addresses: addressCount,
                                    payments: paymentCount,
                                    orders: orderCount,
                                    b2bTransactions: b2bTransactions.length,
                                }}
                            />

                            {/* Tab Content Views */}
                            <div className="p-5 sm:p-6">
                                {activeTab === "overview" && (
                                    <CustomerOverview
                                        userData={userData}
                                        subcollections={subcollections}
                                        ordersData={ordersData}
                                        onNavigateTab={setActiveTab}
                                    />
                                )}

                                {activeTab === "orders" && (
                                    <CustomerOrders
                                        userId={docId}
                                        initialOrders={ordersData}
                                    />
                                )}

                                {activeTab === "wallet" && (
                                    <CustomerWallet
                                        userId={docId}
                                        wallet={userData?.wallet}
                                        transactions={subcollections?.Wallet}
                                        onWalletUpdated={mutateCustomer}
                                    />
                                )}

                                {activeTab === "b2b_wallet" && hasB2BWallet && (
                                    <CustomerB2BWallet
                                        b2bWallet={userData?.b2b_wallet}
                                        b2bTransactions={b2bTransactions}
                                    />
                                )}

                                {activeTab === "addresses" && (
                                    <CustomerAddresses
                                        addresses={subcollections?.Address}
                                        primaryAddressId={userData?.address?.addressId}
                                    />
                                )}

                                {activeTab === "payments" && (
                                    <CustomerPayments
                                        payments={subcollections?.PaymentMethod}
                                        paymentDetails={userData?.payment_details}
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
