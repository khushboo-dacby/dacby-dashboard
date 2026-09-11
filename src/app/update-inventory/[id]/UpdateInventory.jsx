"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, LoaderCircle, Pencil, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProductFullJson, updateInventoryDoc, updateSpecDoc } from "../../apis/api";
import { categories } from "../../../constants/inventory";
import EditItemDrawer from "./EditItemDrawer";
import SpecificationTab from "./SpecificationTab";
import WarningPopup from "../../../components/confirmation-modal/WarningPopup";

const TABS = ["Overview", "Inventory", "Specification"];

// Item-level keys that are NOT variant-defining attributes. Everything else on
// an item (color, storage, ram, ...) is treated as a dynamic attribute column.
const NON_ATTRIBUTE_ITEM_KEYS = new Set([
  "sku", "images", "mrp", "price", "sell_price", "weight", "stocks", "sell",
  "rating", "rating_count", "yt_iframe", "accessories", "id", "combination_name",
  "minimum_price", "oneDayDelivery", "one_day_delivery", "onedaydelivery",
]);

const BASE_CONDITIONS = ["Brand New", "Pre Owned", "Pre Ordered", "Refurbished", "Open Box"];

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value ?? null));
}

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

function getVariants(inventory) {
  return Object.entries(inventory?.vendors ?? {}).flatMap(([vendorId, vendor]) =>
    Object.entries(vendor?.combination_offered ?? {}).flatMap(([combinationId, combination]) =>
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

function getAttributeKeys(spec, variants) {
  const combinationKeys = Object.values(spec?.combination ?? {}).flatMap((combination) =>
    Object.keys(combination ?? {}),
  );
  const itemKeys = variants.flatMap(({ item }) =>
    Object.keys(item ?? {}).filter((key) => !NON_ATTRIBUTE_ITEM_KEYS.has(key)),
  );
  return [...new Set([...combinationKeys, ...itemKeys])];
}

function TextField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value === "" || value === null || value === undefined ? "" : value}
        onChange={(event) =>
          onChange(event.target.value === "" ? "" : Number(event.target.value))
        }
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  const merged = options.includes(value) || !value ? options : [value, ...options];
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {!value && <option value="">Select…</option>}
        {merged.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 cursor-pointer accent-blue-600"
      />
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </label>
  );
}

export default function UpdateInventory({ id }) {
  const router = useRouter();

  const [meta, setMeta] = useState({ productId: id, specId: "" });
  const [inventoryDraft, setInventoryDraft] = useState(null);
  const [specDraft, setSpecDraft] = useState(null);
  const [inventoryBaseline, setInventoryBaseline] = useState("");
  const [specBaseline, setSpecBaseline] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const [activeTab, setActiveTab] = useState("Overview");
  const [editingVariant, setEditingVariant] = useState(null);
  const [isSavingInventory, setIsSavingInventory] = useState(false);
  const [isSavingSpec, setIsSavingSpec] = useState(false);
  const [pendingBack, setPendingBack] = useState(false);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    getProductFullJson(id)
      .then((response) => {
        if (ignore) return;
        const inventory = response?.inventory_json ?? {};
        const spec = response?.spec_json ?? {};
        setMeta({
          productId: response?.productId || id,
          specId: response?.spec_id || inventory?.spec_id || spec?.spec_id || "",
        });
        setInventoryDraft(clone(inventory));
        setSpecDraft(clone(spec));
        setInventoryBaseline(JSON.stringify(inventory));
        setSpecBaseline(JSON.stringify(spec));
        setError("");
      })
      .catch((requestError) => {
        if (!ignore) setError(requestError.message || "Failed to load product");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, retryCount]);

  const variants = useMemo(() => getVariants(inventoryDraft), [inventoryDraft]);
  const attributeKeys = useMemo(
    () => getAttributeKeys(specDraft, variants),
    [specDraft, variants],
  );

  const inventoryDirty = useMemo(
    () => inventoryDraft !== null && JSON.stringify(inventoryDraft) !== inventoryBaseline,
    [inventoryDraft, inventoryBaseline],
  );
  const specDirty = useMemo(
    () => specDraft !== null && JSON.stringify(specDraft) !== specBaseline,
    [specDraft, specBaseline],
  );
  const anyDirty = inventoryDirty || specDirty;

  useEffect(() => {
    if (!anyDirty) return undefined;
    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [anyDirty]);

  const setInventoryField = useCallback((field, value) => {
    setInventoryDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const applyItem = useCallback((vendorId, combinationId, itemId, nextItem) => {
    setInventoryDraft((current) => {
      const next = clone(current);
      next.vendors[vendorId].combination_offered[combinationId][itemId] = nextItem;
      return next;
    });
  }, []);

  function retry() {
    setError("");
    setRetryCount((count) => count + 1);
  }

  function discardAll() {
    setInventoryDraft(inventoryBaseline ? JSON.parse(inventoryBaseline) : inventoryDraft);
    setSpecDraft(specBaseline ? JSON.parse(specBaseline) : specDraft);
    toast.message("Reverted unsaved changes");
  }

  function collectSkus(inventory) {
    return getVariants(inventory).map(({ item }) => String(item?.sku || "").trim());
  }

  async function saveInventory() {
    const skus = collectSkus(inventoryDraft);
    if (skus.some((sku) => !sku)) {
      toast.error("Every item needs a non-empty SKU before saving.");
      return;
    }
    const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicates.length) {
      toast.error(`Duplicate SKU in this product: ${[...new Set(duplicates)].join(", ")}`);
      return;
    }

    setIsSavingInventory(true);
    try {
      const payload = clone(inventoryDraft);
      const response = await updateInventoryDoc(meta.productId, payload);
      setInventoryBaseline(JSON.stringify(inventoryDraft));
      toast.success(response?.message || "Inventory updated successfully");
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update inventory");
    } finally {
      setIsSavingInventory(false);
    }
  }

  async function saveSpec() {
    if (!meta.specId) {
      toast.error("Missing spec_id — cannot save specification.");
      return;
    }
    setIsSavingSpec(true);
    try {
      const payload = clone(specDraft);
      const response = await updateSpecDoc(meta.specId, payload);
      setSpecBaseline(JSON.stringify(specDraft));
      toast.success(response?.message || "Specification updated successfully");
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update specification");
    } finally {
      setIsSavingSpec(false);
    }
  }

  function handleBack() {
    if (anyDirty) {
      setPendingBack(true);
      return;
    }
    router.back();
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-blue-600">
        <LoaderCircle className="mr-3 h-7 w-7 animate-spin" /> Loading inventory…
      </main>
    );
  }

  if (error || !inventoryDraft) {
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

  const categoryOptions = categories.map((category) => category.name || category);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 pb-28 text-slate-950 sm:px-10 lg:px-20">
      <div className="mx-auto w-full space-y-6">
        <header className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="cursor-pointer rounded-lg p-2 hover:bg-slate-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold">{formatDisplay(inventoryDraft.product_title)}</h1>
              <p className="mt-1 text-slate-500">{formatDisplay(inventoryDraft.category_name)}</p>
            </div>
            {inventoryDraft.code && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                {formatDisplay(inventoryDraft.code)}
              </span>
            )}
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">
              spec: {formatDisplay(meta.specId)}
            </span>
          </div>
        </header>

        <div
          role="note"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Specifications are shared by <span className="font-semibold">spec_id</span>. Editing the
          Specification tab may affect other listings that share{" "}
          <span className="font-mono font-semibold">{formatDisplay(meta.specId)}</span>. Inventory
          and Specification are saved to separate backend documents.
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
              {tab !== "Specification" && inventoryDirty && (
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500 align-middle" />
              )}
              {tab === "Specification" && specDirty && (
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500 align-middle" />
              )}
            </button>
          ))}
        </nav>

        {activeTab === "Overview" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Listing Details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  label="Product Title"
                  value={inventoryDraft.product_title}
                  onChange={(value) => setInventoryField("product_title", value)}
                />
                <SelectField
                  label="Category"
                  value={inventoryDraft.category_name}
                  options={categoryOptions}
                  onChange={(value) => setInventoryField("category_name", value)}
                />
                <SelectField
                  label="Condition"
                  value={inventoryDraft.condition}
                  options={BASE_CONDITIONS}
                  onChange={(value) => setInventoryField("condition", value)}
                />
                <TextField
                  label="Brand"
                  value={inventoryDraft.brand}
                  onChange={(value) => setInventoryField("brand", value)}
                />
                <TextField
                  label="Type"
                  value={inventoryDraft.type}
                  onChange={(value) => setInventoryField("type", value)}
                />
                <TextField
                  label="Code (read-only)"
                  value={inventoryDraft.code}
                  onChange={() => {}}
                />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ToggleField
                  label="Listed for sale (sell)"
                  checked={inventoryDraft.sell}
                  onChange={(value) => setInventoryField("sell", value)}
                />
                <ToggleField
                  label="In stock"
                  checked={inventoryDraft.in_stock}
                  onChange={(value) => setInventoryField("in_stock", value)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Pricing</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <NumberField
                  label="Current Price"
                  value={inventoryDraft.price}
                  onChange={(value) => setInventoryField("price", value)}
                />
                <NumberField
                  label="MRP"
                  value={inventoryDraft.mrp}
                  onChange={(value) => setInventoryField("mrp", value)}
                />
                <NumberField
                  label="Max Sell Price"
                  value={inventoryDraft.sell_max_price}
                  onChange={(value) => setInventoryField("sell_max_price", value)}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Product Video</h2>
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">YouTube embed (yt_iframe)</span>
                <textarea
                  value={inventoryDraft.yt_iframe ?? ""}
                  onChange={(event) => setInventoryField("yt_iframe", event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="<iframe …></iframe>"
                />
              </label>
            </div>
          </section>
        )}

        {activeTab === "Inventory" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Items</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vendor → combination → item, rendered from the live document. Edit any item, then save
              inventory.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Vendor</th>
                    <th className="px-4 py-3 font-medium">Combination</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    {attributeKeys.map((attribute) => (
                      <th key={attribute} className="px-4 py-3 font-medium">
                        {titleCase(attribute)}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Sell</th>
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
                      <td className="px-4 py-4 text-xs text-slate-500">{variant.vendorId}</td>
                      <td className="px-4 py-4 text-xs text-slate-500">{variant.combinationId}</td>
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
                      <td className="px-4 py-4">{variant.item.sell ? "Yes" : "No"}</td>
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
          <SpecificationTab spec={specDraft} onChange={setSpecDraft} specId={meta.specId} />
        )}
      </div>

      {anyDirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 lg:px-20">
          <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              Unsaved changes
              {inventoryDirty && <span className="ml-2 text-amber-600">• inventory</span>}
              {specDirty && <span className="ml-2 text-amber-600">• specification</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={discardAll}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" /> Discard
              </button>
              <button
                type="button"
                onClick={saveInventory}
                disabled={!inventoryDirty || isSavingInventory}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingInventory ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save inventory
              </button>
              <button
                type="button"
                onClick={saveSpec}
                disabled={!specDirty || isSavingSpec}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingSpec ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save specification
              </button>
            </div>
          </div>
        </div>
      )}

      {editingVariant && (
        <EditItemDrawer
          key={`${editingVariant.vendorId}-${editingVariant.combinationId}-${editingVariant.itemId}`}
          variant={editingVariant}
          attributeKeys={attributeKeys}
          allSkus={collectSkus(inventoryDraft)}
          onClose={() => setEditingVariant(null)}
          onApply={(nextItem) => {
            applyItem(
              editingVariant.vendorId,
              editingVariant.combinationId,
              editingVariant.itemId,
              nextItem,
            );
            setEditingVariant(null);
          }}
        />
      )}

      {pendingBack && (
        <WarningPopup
          title="Leave with unsaved changes?"
          message="You have unsaved edits that have not been sent to the backend. Leaving will discard them."
          onCancel={() => setPendingBack(false)}
          onConfirm={() => {
            setPendingBack(false);
            router.back();
          }}
        />
      )}
    </main>
  );
}
