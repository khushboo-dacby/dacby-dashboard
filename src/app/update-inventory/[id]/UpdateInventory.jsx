"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LoaderCircle, Pencil, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProductDetail, updateSkuImages, updateCombination } from "../../apis/api";
import { convertFirebaseImageToCdn } from "../../add-variant/AddVariant";
import EditItemDrawer from "./EditItemDrawer";
import CombinationMapEditor from "./CombinationMapEditor";

const ITEM_FIELDS = new Set([
  "sku", "images", "mrp", "price", "sell_price", "weight", "stocks", "sell",
  "rating", "rating_count", "yt_iframe", "combination_name", "minimum_price",
  "oneDayDelivery", "one_day_delivery", "onedaydelivery",
]);
const EMPTY_DETAILS = {};
const TABS = ["Overview", "Inventory", "Specification"];

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDisplay(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function getVariants(details) {
  return Object.entries(details?.vendors ?? {}).flatMap(([vendorId, vendor]) =>
    Object.entries(vendor.combination_offered ?? {}).flatMap(([combinationId, combination]) =>
      Object.entries(combination ?? {}).map(([itemId, item]) => ({
        vendorId,
        vendor,
        combinationId,
        itemId,
        item,
      })),
    ),
  );
}

function getAttributeKeys(specifications, variants) {
  const combinationKeys = Object.values(specifications?.combination ?? {}).flatMap((combination) =>
    Object.keys(combination ?? {}).filter((key) => !ITEM_FIELDS.has(key)),
  );
  const itemKeys = variants.flatMap(({ item }) =>
    Object.keys(item ?? {}).filter((key) => !ITEM_FIELDS.has(key)),
  );
  return [...new Set([...combinationKeys, ...itemKeys])];
}

function InfoCard({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function UpdateInventory({ id }) {
  const router = useRouter();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [editingVariant, setEditingVariant] = useState(null);
  const [combinationDraft, setCombinationDraft] = useState({});
  const [isSavingCombination, setIsSavingCombination] = useState(false);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    getProductDetail(id)
      .then((response) => {
        if (ignore) return;
        const next = Array.isArray(response) ? response[0] : response;
        setProductData(next);
        setCombinationDraft(next?.specifications?.combination ?? {});
        setError("");
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message || "Failed to load product details");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, retryCount]);

  const details = productData?.details ?? EMPTY_DETAILS;
  const specifications = productData?.specifications ?? EMPTY_DETAILS;
  const variants = useMemo(() => getVariants(details), [details]);
  const attributeKeys = useMemo(
    () => getAttributeKeys(specifications, variants),
    [specifications, variants],
  );

  const combinationDirty = useMemo(
    () =>
      JSON.stringify(combinationDraft) !==
      JSON.stringify(specifications?.combination ?? {}),
    [combinationDraft, specifications],
  );

  function retry() {
    setError("");
    setRetryCount((count) => count + 1);
  }

  async function saveItemImages(updated) {
    const images = (updated.images || [])
      .map((image) => (typeof image === "string" ? convertFirebaseImageToCdn(image) : ""))
      .filter(Boolean);
    const sku = updated.targetSku || updated.originalSku;

    try {
      const response = await updateSkuImages(
        encodeURIComponent(id),
        encodeURIComponent(sku),
        images,
      );

      setProductData((current) => {
        const currentDetails = current?.details ?? {};
        const currentVendors = currentDetails.vendors ?? {};
        const vendor = currentVendors[updated.vendorId] ?? {};
        const offered = vendor.combination_offered ?? {};
        const combination = offered[updated.combinationId] ?? {};
        const currentItem = combination[updated.itemId] ?? {};

        return {
          ...current,
          details: {
            ...currentDetails,
            vendors: {
              ...currentVendors,
              [updated.vendorId]: {
                ...vendor,
                combination_offered: {
                  ...offered,
                  [updated.combinationId]: {
                    ...combination,
                    [updated.itemId]: { ...currentItem, sku, images },
                  },
                },
              },
            },
          },
        };
      });
      toast.success(response?.message || "Item images updated successfully");
      setEditingVariant(null);
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update item images");
      throw requestError;
    }
  }

  async function saveCombination() {
    const specId = details.spec_id;
    if (!specId) {
      toast.error("Missing spec_id — cannot save combinations.");
      return;
    }

    setIsSavingCombination(true);
    try {
      const response = await updateCombination({
        spec_id: specId,
        combination: combinationDraft,
      });
      setProductData((current) => ({
        ...current,
        specifications: {
          ...current?.specifications,
          combination: combinationDraft,
        },
      }));
      toast.success(response?.message || "Combinations updated successfully");
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update combinations");
    } finally {
      setIsSavingCombination(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-blue-600">
        <LoaderCircle className="mr-3 h-7 w-7 animate-spin" /> Loading inventory...
      </main>
    );
  }

  if (error || !productData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-rose-600">{error || "Inventory item not found."}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-10 lg:px-20">
      <div className="mx-auto w-full space-y-6">
        <header className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="cursor-pointer rounded-lg p-2 hover:bg-slate-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold">{formatDisplay(details.product_title)}</h1>
              <p className="mt-1 text-slate-500">{formatDisplay(details.category_name)}</p>
            </div>
            {details.code && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                {formatDisplay(details.code)}
              </span>
            )}
            {details.condition && (
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
                {formatDisplay(details.condition)}
              </span>
            )}
          </div>
        </header>

        <div
          role="status"
          className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
        >
          This screen edits only what the backend persists today: item images (per SKU) and the
          specification&apos;s combination attributes. All other fields are shown read-only.
        </div>

        <nav className="flex gap-2 rounded-2xl bg-slate-100 p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Listing Details</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard label="Title" value={formatDisplay(details.product_title)} />
                <InfoCard label="Category" value={formatDisplay(details.category_name)} />
                <InfoCard label="Condition" value={formatDisplay(details.condition)} />
                <InfoCard label="Code" value={formatDisplay(details.code)} />
                <InfoCard label="Spec ID" value={formatDisplay(details.spec_id)} />
                <InfoCard label="In Stock" value={formatDisplay(details.in_stock)} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Pricing</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard label="Current Price" value={formatPrice(details.price)} />
                <InfoCard label="MRP" value={formatPrice(details.mrp)} />
                <InfoCard label="Max Sell Price" value={formatPrice(details.sell_max_price)} />
                <InfoCard label="Extra Coins" value={formatDisplay(details.extra_coins ?? 0)} />
              </div>
            </div>
          </section>
        )}

        {activeTab === "Inventory" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Items</h2>
            <p className="mt-1 text-sm text-slate-500">
              Edit images per item. SKU is editable with a warning.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    {attributeKeys.map((attribute) => (
                      <th key={attribute} className="px-4 py-3 font-medium">
                        {titleCase(attribute)}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr
                      key={`${variant.vendorId}-${variant.combinationId}-${variant.itemId}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200">
                          {variant.item.images?.[0] ? (
                            <Image
                              src={variant.item.images[0]}
                              alt={variant.item.sku || "Item"}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="max-w-72 px-4 py-4 font-mono text-xs">
                        {formatDisplay(variant.item.sku)}
                      </td>
                      {attributeKeys.map((attribute) => (
                        <td key={attribute} className="px-4 py-4">
                          {formatDisplay(variant.item[attribute])}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          {formatDisplay(variant.item.stocks, 0)} units
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium">{formatPrice(variant.item.price)}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setEditingVariant(variant)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {variants.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">No items found.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "Specification" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Combination Attributes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Edit attribute values per combination, then save. This updates the shared
                  specification (spec_id {formatDisplay(details.spec_id)}).
                </p>
              </div>
              <button
                type="button"
                onClick={saveCombination}
                disabled={!combinationDirty || isSavingCombination}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingCombination ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Combinations
              </button>
            </div>
            <div className="mt-6">
              <CombinationMapEditor combination={combinationDraft} onChange={setCombinationDraft} />
            </div>
          </section>
        )}
      </div>

      {editingVariant && (
        <EditItemDrawer
          variant={editingVariant}
          attributeKeys={attributeKeys}
          onClose={() => setEditingVariant(null)}
          onSave={saveItemImages}
        />
      )}
    </main>
  );
}
