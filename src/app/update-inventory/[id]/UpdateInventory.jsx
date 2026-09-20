"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, LoaderCircle, Pencil, RotateCcw, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getProductDetail,
  getProductFullJson,
  updateInventoryDoc,
  updateSpecDoc,
} from "../../apis/api";
import { categories } from "../../../constants/inventory";
import MediaModal from "./MediaModal";
import SpecificationTab from "./SpecificationTab";
import WarningPopup from "../../../components/confirmation-modal/WarningPopup";
import { BASE_CONDITIONS } from "../../../constants/inventory";
import { SelectWithOther } from "@/components/fields/SelectWithOther";
import { brandMap,typeMap } from "../../../constants/inventory";
import {
  normalizeProductResponse,
  useProductContext,
} from "../../../context/ProductContext";
import { convertFirebaseImageToCdn } from "@/app/add-variant/AddVariant";
import AddWarrantyModal from "@/app/product-detail/AddWarrantyModal";
const TABS = ["Overview", "Inventory", "Specification"];
const INVENTORY_DESCRIPTION_CODES = new Set(["D001Y", "D002Y", "D003Y"]);

// Item-level keys that are NOT variant-defining attributes. Everything else on
// an item (color, storage, ram, ...) is treated as a dynamic attribute column.
const NON_ATTRIBUTE_ITEM_KEYS = new Set([
  "sku",
  "images",
  "mrp",
  "price",
  "sell_price",
  "weight",
  "condition",
  "type",
  "stocks",
  "sell",
  "rating",
  "rating_count",
  "yt_iframe",
  "accessories",
  "id",
  "combination_name",
  "minimum_price",
  "oneDayDelivery",
  "one_day_delivery",
  "onedaydelivery",
  "price_analysis"
]);

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

function usesInventoryDescription(inventory) {
  return INVENTORY_DESCRIPTION_CODES.has(String(inventory?.code ?? "").trim());
}

function getVariants(inventory) {
  return Object.entries(inventory?.vendors ?? {}).flatMap(
    ([vendorId, vendor]) =>
      Object.entries(vendor?.combination_offered ?? {}).flatMap(
        ([combinationId, combination]) =>
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

function recalculateInventoryDerivedFlags(inventory) {
  const nextInventory = clone(inventory ?? {});
  const items = getVariants(nextInventory).map(({ item }) => item).filter(Boolean);
  nextInventory.in_stock = items.some((item) => Number(item?.stocks) > 0);
  nextInventory.sell = items.some((item) => Boolean(item?.sell));
  return nextInventory;
}

function cleanInventoryPayload(inventory) {
  const cleaned = clone(inventory ?? {});
  delete cleaned.created_at;
  delete cleaned.updated_at;

  const rootNumberFields = ["mrp", "sell_max_price", "price", "rating", "rating_count"];
  rootNumberFields.forEach((field) => {
    if (cleaned[field] !== undefined && cleaned[field] !== null) {
      if (cleaned[field] === "") {
        cleaned[field] = null;
      } else {
        cleaned[field] = Number(cleaned[field]);
      }
    }
  });

  const variants = getVariants(cleaned);
  const itemNumberFields = ["mrp", "sell_price", "price", "stocks", "rating", "rating_count"];
  
  variants.forEach(({ item }) => {
    itemNumberFields.forEach((field) => {
      if (item[field] !== undefined && item[field] !== null) {
        if (item[field] === "") {
          item[field] = null;
        } else {
          item[field] = Number(item[field]);
        }
      }
    });

    if (item.weight !== undefined && item.weight !== null) {
      if (item.weight === "") {
        item.weight = null;
      } else {
        item.weight = Number(String(item.weight).replace(/kg/i, "").trim());
      }
    }
  });

  return cleaned;
}

function getAttributeKeys(spec, variants) {
  const combinationKeys = Object.values(spec?.combination ?? {}).flatMap(
    (combination) => Object.keys(combination ?? {}),
  ).filter((key) => !["condition", "type"].includes(key.toLowerCase()));
  const itemKeys = variants.flatMap(({ item }) =>
    Object.keys(item ?? {}).filter((key) => !NON_ATTRIBUTE_ITEM_KEYS.has(key)),
  );
  return [...new Set([...combinationKeys, ...itemKeys])];
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
        value={
          value === "" || value === null || value === undefined ? "" : value
        }
        onChange={(event) =>
          onChange(event.target.value === "" ? "" : Number(event.target.value))
        }
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  const merged =
    options.includes(value) || !value ? options : [value, ...options];
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
  const { getProduct, setProduct } = useProductContext();

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
  
  // Edit mode states
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSpec, setIsEditingSpec] = useState(false);
  const [discardCount, setDiscardCount] = useState(0);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);

  const [isSavingInventory, setIsSavingInventory] = useState(false);
  const [isSavingSpec, setIsSavingSpec] = useState(false);
  const [pendingBack, setPendingBack] = useState(false);
  const [addingCustomBrand, setAddingCustomBrand] = useState(false);
  const [addingCustomType, setAddingCustomType] = useState(false);

  // Apply images to every variant that shares the same color attribute.
  const applyImagesToColor = useCallback((images, matchingColor) => {
    setInventoryDraft((current) => {
      const next = clone(current);
      Object.values(next.vendors ?? {}).forEach((vendor) => {
        Object.values(vendor.combination_offered ?? {}).forEach((combination) => {
          Object.values(combination ?? {}).forEach((item) => {
            const itemColor = String(item.color || "").trim().toLowerCase();
            if (itemColor === matchingColor) {
              item.images = [...images];
            }
          });
        });
      });
      return recalculateInventoryDerivedFlags(next);
    });
  }, []);

  const applyVideoToAllVariants = useCallback((ytIframe) => {
    setInventoryDraft((current) => {
      const next = clone(current);
      Object.values(next.vendors ?? {}).forEach((vendor) => {
        Object.values(vendor.combination_offered ?? {}).forEach((combination) => {
          Object.values(combination ?? {}).forEach((item) => {
            item.yt_iframe = ytIframe;
          });
        });
      });
      return recalculateInventoryDerivedFlags(next);
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);

    function initializeProduct(product) {
      if (ignore) return;

      const inventory = clone(product?.inventory_json ?? {});
      delete inventory.created_at;
      delete inventory.updated_at;
      const spec = clone(product?.spec_json ?? {});
      delete spec.created_at;
      delete spec.updated_at;
      if (spec.color_codes && typeof spec.color_codes === "object") {
        Object.keys(spec.color_codes).forEach((key) => {
          if (!spec.color_codes[key] || typeof spec.color_codes[key] !== "string" || !spec.color_codes[key].trim()) {
            spec.color_codes[key] = "#000000";
          }
        });
      }
      setMeta({
        productId: product?.productId || id,
        specId:
          product?.spec_id || inventory?.spec_id || spec?.spec_id || "",
      });
      const syncedInventory = recalculateInventoryDerivedFlags(inventory);
      setInventoryDraft(syncedInventory);
      setSpecDraft(spec);
      setInventoryBaseline(JSON.stringify(syncedInventory));
      setSpecBaseline(JSON.stringify(spec));
      setError("");
    }

    const cachedProduct = getProduct(id);
    if (cachedProduct) {
      initializeProduct(cachedProduct);
      setIsLoading(false);
      return () => {
        ignore = true;
      };
    }

    getProductFullJson(id)
      .then((response) => {
        if (ignore) return;
        setProduct(id, response);
        initializeProduct(normalizeProductResponse(id, response));
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
  }, [getProduct, id, retryCount, setProduct]);

  const variants = useMemo(() => getVariants(inventoryDraft), [inventoryDraft]);
  const isInventoryDescription = usesInventoryDescription(inventoryDraft);
  const attributeKeys = useMemo(
    () => getAttributeKeys(specDraft, variants),
    [specDraft, variants],
  );
  const inventoryDirty = useMemo(
    () =>
      inventoryDraft !== null &&
      JSON.stringify(inventoryDraft) !== inventoryBaseline,
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
      const existingItem = next.vendors?.[vendorId]?.combination_offered?.[combinationId]?.[itemId] ?? {};
      const mergedItem = {
        ...existingItem,
        ...nextItem,
      };
      next.vendors[vendorId].combination_offered[combinationId][itemId] = mergedItem;
      return recalculateInventoryDerivedFlags(next);
    });
  }, []);

  function retry() {
    setError("");
    setRetryCount((count) => count + 1);
  }

  function discardAll() {
    setInventoryDraft(
      inventoryBaseline ? JSON.parse(inventoryBaseline) : inventoryDraft,
    );
    setSpecDraft(specBaseline ? JSON.parse(specBaseline) : specDraft);
    setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
    setIsEditingSpec(false);
    setDiscardCount(c => c + 1);
    toast.message("Reverted unsaved changes");
  }

  function collectSkus(inventory) {
    return getVariants(inventory).map(({ item }) =>
      String(item?.sku || "").trim(),
    );
  }

  async function saveInventory() {
    const skus = collectSkus(inventoryDraft);
    if (skus.some((sku) => !sku)) {
      toast.error("Every item needs a non-empty SKU before saving.");
      return;
    }
    const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    if (duplicates.length) {
      toast.error(
        `Duplicate SKU in this product: ${[...new Set(duplicates)].join(", ")}`,
      );
      return;
    }

      setIsSavingInventory(true);
      try {
        let finalInventoryPayload = recalculateInventoryDerivedFlags(clone(inventoryDraft));
        finalInventoryPayload = cleanInventoryPayload(finalInventoryPayload);
        
        console.log("Update Inventory Payload:", finalInventoryPayload);
        const response = await updateInventoryDoc(meta.productId, finalInventoryPayload);
        // Update baseline and notify user
        setInventoryBaseline(JSON.stringify(finalInventoryPayload));
        const successMessage = response?.message || "Inventory saved successfully.";
        toast.success(successMessage);
        
        // Disable all edit modes on successful save
        setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
        
        // Note: Intentionally avoiding getProductDetail / setProduct per user request
      } catch (requestError) {
        toast.error(requestError.message || "Failed to prepare inventory payload");
      } finally {
        setIsSavingInventory(false);
      }
  }

  async function saveSpec() {
    if (!specDraft) {
      toast.error("No specification draft available.");
      return;
    }

    const targetSpecId = meta.specId || specDraft.spec_id || id;
    if (!targetSpecId) {
      toast.error("No specification ID available.");
      return;
    }

    setIsSavingSpec(true);
    try {
      const finalSpecPayload = clone(specDraft);
      delete finalSpecPayload.created_at;
      delete finalSpecPayload.updated_at;
      if (finalSpecPayload.color_codes && typeof finalSpecPayload.color_codes === "object") {
        Object.keys(finalSpecPayload.color_codes).forEach((key) => {
          if (!finalSpecPayload.color_codes[key] || typeof finalSpecPayload.color_codes[key] !== "string" || !finalSpecPayload.color_codes[key].trim()) {
            finalSpecPayload.color_codes[key] = "#000000";
          }
        });
      }
      console.log("Update Specification Payload:", finalSpecPayload);
      const response = await updateSpecDoc(targetSpecId, finalSpecPayload);
      setSpecBaseline(JSON.stringify(finalSpecPayload));
      const successMessage = response?.message || "Specification saved successfully.";
      toast.success(successMessage);
      const refreshed = await getProductDetail(meta.productId || id);
      setProduct(id, refreshed);
    } catch (requestError) {
      toast.error(requestError.message || "Failed to save specification");
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
        <LoaderCircle className="mr-3 h-7 w-7 animate-spin" /> Loading
        inventory…
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

  const categoryOptions = categories.map(
    (category) => category.name || category,
  );
  function updateCategory(categoryName) {
    const category = categories.find(({ name }) => name === categoryName);
    setInventoryDraft((current) => ({
      ...current,
      category_name: categoryName,
      code: category?.code ?? "",
    }));
  }
const brandOptions = brandMap[inventoryDraft.category_name] || [];
const typeOptions = typeMap[inventoryDraft.category_name] || [];
  return (
    <main className="min-h-screen bg-slate-50 pb-28 text-slate-950">
      <div className="mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-slate-200 bg-white px-4 py-4 sm:px-10 lg:px-20">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-slate-400">
                <span className="uppercase">{formatDisplay(inventoryDraft.category_name)}</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium">{inventoryDraft.brand || "Brand"} Inventory</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">
                  {formatDisplay(inventoryDraft.product_title)}
                </h1>
                {inventoryDraft.code && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {formatDisplay(inventoryDraft.code)}
                  </span>
                )}
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-tight text-slate-500">
                  spec: {formatDisplay(meta.specId)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setShowWarrantyModal(true)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-x font-semibold text-amber-700 hover:bg-amber-100">
              Add Warranty
            </button>
           
          </div>
        </header>

        {/* Main Content Area */}
        <div className="px-4 py-8 sm:px-10 lg:px-20 space-y-6">

        {/* <div
          role="note"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Specifications are shared by{" "}
          <span className="font-semibold">spec_id</span>. Editing the
          Specification tab may affect other listings that share{" "}
          <span className="font-mono font-semibold">
            {formatDisplay(meta.specId)}
          </span>
          . Inventory and Specification are saved to separate backend documents.
        </div> */}

        <div className="flex justify-center pt-2">
          <nav className="inline-flex gap-1 rounded-full border border-slate-200 bg-slate-100/50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("Inventory")}
              className={`flex min-w-[200px] items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition ${
                activeTab === "Inventory" || activeTab === "Overview"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inventory
              {inventoryDirty && (
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Specification")}
              className={`flex min-w-[200px] items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition ${
                activeTab === "Specification"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Specification
              {specDirty && (
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
          </nav>
        </div>

        {/* Replace activeTab === 'Overview' with just rendering the content, 
            since there's no tab switching for now (Specification disabled) */}
        {(activeTab === "Overview" || activeTab === "Inventory") && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Listing Details & Base Information</h2>
                  <p className="text-sm text-slate-500">Manage general product title, categorization, default pricing, and catalog presentation.</p>
                </div>
                <div className="flex items-center gap-3">
                  {inventoryDirty && !isEditingDetails && (
                     <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                       Unsaved changes
                     </span>
                  )}
                  {!inventoryDirty && !isEditingDetails && (
                     <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                       All changes saved
                     </span>
                  )}
                  
                  {!isEditingDetails ? (
                    <>
                      <button
                        onClick={() => setIsEditingDetails(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" /> Edit Details
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        discardAll();
                        setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
                      }}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isEditingDetails ? (
                  <>
                    <TextField label="Product Title" value={inventoryDraft.product_title} onChange={(val) => setInventoryField("product_title", val)} />
                    <SelectField label="Category" value={inventoryDraft.category_name} options={categoryOptions} onChange={updateCategory} />
                    <SelectField label="Condition" value={inventoryDraft.condition} options={BASE_CONDITIONS} onChange={(val) => setInventoryField("condition", val)} />
                    <SelectWithOther label="Brand" value={inventoryDraft.brand} options={brandOptions} addingCustom={addingCustomBrand} onCustomToggle={setAddingCustomBrand} onChange={(val) => setInventoryField("brand", val)} customPlaceholder="Enter another brand" />
                    <SelectWithOther label="Type" value={inventoryDraft.type} options={typeOptions} addingCustom={addingCustomType} onCustomToggle={setAddingCustomType} onChange={(val) => setInventoryField("type", val)} customPlaceholder="Enter another type" />
                  </>
                ) : (
                  <>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Product Title</span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">{formatDisplay(inventoryDraft.product_title)}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Category</span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">{formatDisplay(inventoryDraft.category_name)}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Condition</span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">{formatDisplay(inventoryDraft.condition)}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">{formatDisplay(inventoryDraft.brand)}</div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Type</span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900">{formatDisplay(inventoryDraft.type)}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Default Pricing Parameters</h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {isEditingDetails ? (
                    <>
                      <NumberField label="Maximum Retail Price (MRP)" value={inventoryDraft.mrp} onChange={(val) => setInventoryField("mrp", val)} />
                      <NumberField label="Buy Price" value={inventoryDraft.price} onChange={(val) => setInventoryField("price", val)} />
                      <NumberField label="Max Sell Price" value={inventoryDraft.sell_max_price} onChange={(val) => setInventoryField("sell_max_price", val)} />
                    </>
                  ) : (
                    <>
                    <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Maximum Retail Price (MRP)</span>
                        <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium text-slate-900">{formatPrice(inventoryDraft.mrp)}</div>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Buy Price</span>
                        <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium text-slate-900">{formatPrice(inventoryDraft.price)}</div>
                      </div>
                      
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Max Sell Price</span>
                        <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-medium text-slate-900">{formatPrice(inventoryDraft.sell_max_price)}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Product Video</h2>
                  <p className="text-sm text-slate-500">Manage YouTube unboxing or product showcase video embeds for this catalog item.</p>
                </div>
                <div>
                  {!isEditingVideo ? (
                    <button
                      onClick={() => setIsEditingVideo(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil className="h-4 w-4" /> Edit Video
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        discardAll();
                        setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
                      }}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <span className="block text-sm font-medium text-slate-700">YouTube embed (yt_iframe)</span>
                {isEditingVideo ? (
                  <textarea
                    value={inventoryDraft.yt_iframe ?? ""}
                    onChange={(event) => setInventoryField("yt_iframe", event.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder='<iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>'
                  />
                ) : (
                  <div className="mt-2 w-full break-all rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 font-mono text-xs text-slate-600">
                    {inventoryDraft.yt_iframe || "—"}
                  </div>
                )}
              </div>

              {inventoryDraft.yt_iframe && (
                <div className="mt-6">
                  <span className="block text-sm font-medium text-slate-700">Preview</span>
                  <div className="mt-3 aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                    <iframe
                      src={inventoryDraft.yt_iframe.match(/src=["']([^"']+)["']/)?.[1] || null}
                      title="Product Video"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {isInventoryDescription && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">Description</h3>
                    <p className="mt-1 text-sm text-slate-500">Manage the product specification and summary details.</p>
                  </div>
                  <div>
                    {!isEditingDescription ? (
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" /> Edit Description
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          discardAll();
                          setIsEditingDetails(false);
                          setIsEditingVideo(false);
                          setIsEditingInventory(false);
                          setIsEditingDescription(false);
                        }}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                
                <SpecificationTab
                  key={discardCount}
                  spec={specDraft}
                  onChange={setSpecDraft}
                  specId={meta.specId}
                  description={inventoryDraft.description}
                  onDescriptionChange={(nextDescription) =>
                    setInventoryField("description", nextDescription)
                  }
                  descriptionOnly
                  readOnly={!isEditingDescription}
                />
              </div>
            )}

          </section>
        )}

        {(activeTab === "Overview" || activeTab === "Inventory") && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Variants & Stock Inventory</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">{variants.length} variant combinations configured</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Manage live warehouse quantities, selling prices, and active catalog visibility.</p>
              </div>
              
              <div className="flex items-center gap-3">
                {inventoryDirty && !isEditingInventory && (
                   <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                     Unsaved changes
                   </span>
                )}
                {!inventoryDirty && !isEditingInventory && (
                   <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                     All changes saved
                   </span>
                )}
                
                {!isEditingInventory ? (
                  <button
                    onClick={() => setIsEditingInventory(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" /> Edit Inventory
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      discardAll();
                      setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[800px] overflow-auto pb-4">
              <table className="w-full min-w-max text-left text-sm">
                <thead className="sticky top-0 z-10 border-b border-slate-100 bg-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Image</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">SKU</th>
                    {attributeKeys.map((attribute) => (
                      <th key={attribute} className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">
                        {titleCase(attribute)}
                      </th>
                    ))}
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Weight</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">MRP</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Buy Price</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Sell Price</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Sell</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((variant) => {
                    const item = variant.item;
                    const stockNum = Number(item.stocks) || 0;
                    const hasStock = stockNum > 0;
                    const isSelling = Boolean(item.sell);
                    
                    return (
                      <tr key={`${variant.vendorId}-${variant.combinationId}-${variant.itemId}`} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setEditingVariant(variant)} // We will update this later to trigger the Media Modal
                            className="group relative flex flex-col items-center gap-2"
                          >
                            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow group-hover:shadow-sm">
                              {item.images?.[0]?.trim() || item.yt_iframe ? (
                                <>
                                  {item.images?.[0]?.trim() && (
                                    <Image src={convertFirebaseImageToCdn(item.images[0])} alt={item.sku || "Variant image"} fill sizes="56px" className="object-contain p-1.5" />
                                  )}
                                  {item.yt_iframe && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <div className="rounded-full bg-red-600 p-1 shadow-sm">
                                        <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-600">
                                  <Plus className="h-5 w-5" />
                                </div>
                              )}
                              
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-[10px] font-bold text-white">
                                  {isEditingInventory ? "Edit Media" : "View Media"}
                                </span>
                              </div>
                            </div>
                          </button>
                        </td>
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <input type="text" value={item.sku ?? ""} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { sku: e.target.value })} className="w-64 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                          ) : (
                            <span className="font-mono text-sm font-medium text-slate-800">{formatDisplay(item.sku)}</span>
                          )}
                        </td>
                        
                        {attributeKeys.map((attribute) => (
                          <td key={attribute} className="px-4 py-4 align-top">
                            <span className="text-sm font-semibold text-slate-700">{formatDisplay(item[attribute])}</span>
                          </td>
                        ))}
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <div className="flex w-24 items-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                              <input type="text" value={String(item.weight ?? "").replace("kg", "").trim()} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { weight: e.target.value + " kg" })} className="w-full text-sm outline-none" />
                              <span className="text-[10px] font-medium text-slate-400">kg</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-slate-700">{formatDisplay(item.weight)}</span>
                          )}
                        </td>
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <input type="number" value={item.mrp ?? ""} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { mrp: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                          ) : (
                            <span className="text-sm font-medium text-slate-700">{formatPrice(item.mrp)}</span>
                          )}
                        </td>
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <input type="number" value={item.price ?? ""} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { price: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                          ) : (
                            <span className="text-sm font-medium text-slate-700">{formatPrice(item.price)}</span>
                          )}
                        </td>
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <input type="number" value={item.sell_price ?? ""} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { sell_price: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                          ) : (
                            <span className="text-sm font-bold text-slate-900">{formatPrice(item.sell_price)}</span>
                          )}
                        </td>
                        
                        <td className="px-4 py-4 align-top">
                          {isEditingInventory ? (
                            <input type="number" value={item.stocks ?? ""} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { stocks: e.target.value })} className="w-20 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                          ) : (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium border ${hasStock ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                              {stockNum} unit{stockNum !== 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 align-top">
                          {isEditingInventory ? (
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input type="checkbox" checked={isSelling} onChange={(e) => applyItem(variant.vendorId, variant.combinationId, variant.itemId, { sell: e.target.checked })} className="peer sr-only" />
                              <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300"></div>
                              <span className="ml-2 text-sm font-medium text-slate-700">{isSelling ? 'Selling' : 'Not Selling'}</span>
                            </label>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium ${isSelling ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${isSelling ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              {isSelling ? 'Selling' : 'Not Selling'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {variants.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                  No items found.
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <span className="text-xs text-slate-500">Showing {variants.length} of {variants.length} variant configurations</span>
              <span className="text-xs font-medium text-slate-700">Total in-stock: {variants.reduce((acc, v) => acc + (Number(v.item.stocks) || 0), 0)} units</span>
            </div>
          </section>
        )}

        {activeTab === "Specification" && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">Specification Details</h2>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the full product specification, box contents, colors, and questionnaire.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {!isEditingSpec ? (
                  <button
                    onClick={() => setIsEditingSpec(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" /> Edit Specification
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSpecDraft(specBaseline ? JSON.parse(specBaseline) : specDraft);
                      setIsEditingSpec(false);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <SpecificationTab
                key={discardCount}
                spec={specDraft}
                onChange={setSpecDraft}
                specId={meta.specId}
                description={isInventoryDescription ? undefined : specDraft?.description}
                onDescriptionChange={(nextDescription) => {
                  setSpecDraft((current) => ({
                    ...current,
                    description: nextDescription,
                  }));
                }}
                showDescription={!isInventoryDescription}
                readOnly={!isEditingSpec}
              />
            </div>
          </section>
        )}
      </div>

      {anyDirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur sm:px-10 lg:px-20">
          <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              Unsaved changes
              {inventoryDirty && (
                <span className="ml-2 text-amber-600">• inventory</span>
              )}
              {specDirty && (
                <span className="ml-2 text-amber-600">• specification</span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  discardAll();
                  setIsEditingDetails(false);
    setIsEditingVideo(false);
    setIsEditingInventory(false);
    setIsEditingDescription(false);
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" /> Cancel
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
                Save Changes
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
        <MediaModal
          key={`${editingVariant.vendorId}-${editingVariant.combinationId}-${editingVariant.itemId}`}
          variant={editingVariant}
          isEditing={isEditingInventory}
          onClose={() => setEditingVariant(null)}
          onApply={(nextItem, options) => {
            applyItem(
              editingVariant.vendorId,
              editingVariant.combinationId,
              editingVariant.itemId,
              nextItem,
            );

            if (options?.applyToAllSameColor && options?.color && options?.images) {
              applyImagesToColor(options.images, options.color.toLowerCase());
            }

            if (options?.applyVideoToAll && options?.yt_iframe !== undefined) {
              applyVideoToAllVariants(options.yt_iframe);
            }

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

      {showWarrantyModal && (
        <AddWarrantyModal
          specId={meta.specId}
          onClose={() => setShowWarrantyModal(false)}
        />
      )}
      </div>
    </main>
  );
}
