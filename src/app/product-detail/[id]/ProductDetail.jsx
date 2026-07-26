"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LoaderCircle, Pencil, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProductDetail, updateSkuImages } from "../../apis/api";
import ItemDetailsFields from "../../../components/inventory/ItemDetailsFields";
import WarningPopup from "../../../components/confirmation-modal/WarningPopup";
import { toast } from "sonner";

const ITEM_FIELDS = new Set([
  "sku", "images", "mrp", "price", "sell_price", "weight", "stocks", "sell",
  "rating", "rating_count", "yt_iframe", "combination_name", "minimum_price",
  "oneDayDelivery", "one_day_delivery", "onedaydelivery",
]);
const EMPTY_DETAILS = {};

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

function getCreatedDate(createdAt) {
  const seconds = createdAt?._seconds ?? createdAt?.seconds;
  if (!seconds) return "—";
  return new Intl.DateTimeFormat("en-GB").format(new Date(seconds * 1000));
}

function getYoutubeUrl(iframe) {
  const match = String(iframe || "").match(/src=["']([^"']+)["']/i);
  if (!match) return "";

  try {
    const url = new URL(match[1]);
    return ["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function getVariants(details) {
  return Object.entries(details?.vendors ?? {}).flatMap(([vendorId, vendor]) =>
    Object.entries(vendor.combination_offered ?? {}).flatMap(
      ([combinationId, combination]) =>
        Object.entries(combination ?? {}).map(([itemId, item]) => ({
          vendorId,
          vendor,
          combinationId,
          itemId,
          item,
        }))
    )
  );
}

function getAttributeKeys(productData, variants) {
  const combinationKeys = Object.values(productData?.specifications?.combination ?? {})
    .flatMap((combination) =>
      Object.keys(combination ?? {}).filter((key) => !ITEM_FIELDS.has(key))
    );
  const itemKeys = variants.flatMap(({ item }) =>
    Object.keys(item ?? {}).filter((key) => !ITEM_FIELDS.has(key))
  );
  return [...new Set([...combinationKeys, ...itemKeys])];
}

function InfoCard({ label, value, children }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-1 text-lg font-semibold text-slate-900">{children ?? value ?? "—"}</div>
    </div>
  );
}

function EditVariantModal({ variant, attributeKeys, specId, onClose, onSave }) {
  const [item, setItem] = useState(() => ({ ...variant.item }));
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function updateItem(_vendorIndex, _itemIndex, field, value) {
    setItem((current) => ({ ...current, [field]: value }));
  }

  function updateAttribute(attribute, value) {
    setItem((current) => ({ ...current, [attribute]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setShowSaveWarning(true);
  }

  async function confirmSave() {
    setIsSaving(true);
    try {
      await onSave({
        ...variant,
        originalSku: variant.item.sku,
        item,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <form onSubmit={submit} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Edit Variant</h2>
            <p className="mt-1 text-sm text-slate-500">Update variant attributes, inventory, prices, media, and selling status.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close edit variant modal" className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {attributeKeys.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Combination Attributes</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {attributeKeys.map((attribute) => (
                  <label key={attribute} className="text-sm font-medium text-slate-700">
                    {titleCase(attribute)}
                    <input
                      value={item[attribute] ?? ""}
                      onChange={(event) => updateAttribute(attribute, event.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <ItemDetailsFields
            item={item}
            vendorIndex="edit"
            itemIndex={variant.itemId}
            specId={specId}
            updateItem={updateItem}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-100">Cancel</button>
          <button type="submit" className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
      {showSaveWarning && (
        <WarningPopup
          title="Save variant changes?"
          message={`Confirm image changes for ${variant.item.sku || "this variant"}.`}
          isConfirming={isSaving}
          onCancel={() => setShowSaveWarning(false)}
          onConfirm={confirmSave}
        />
      )}
    </div>
  );
}

export default function ProductDetail({ id }) {
  const router = useRouter();
  const [productData, setProductData] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    getProductDetail(id)
      .then((response) => {
        if (!ignore) setProductData(Array.isArray(response) ? response[0] : response);
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
  const variants = useMemo(() => getVariants(details), [details]);
  const attributeKeys = useMemo(
    () => getAttributeKeys(productData, variants),
    [productData, variants]
  );
  const vendors = Object.values(details.vendors ?? {});
  const primaryVendor = vendors[0] ?? {};
  const videoUrl = getYoutubeUrl(details.yt_iframe);

  function retry() {
    setError("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  async function saveVariant(updatedVariant) {
    const originalImages = Array.isArray(updatedVariant.item?.images)
      ? editingVariant?.item?.images || []
      : [];
    const editedImages = Array.isArray(updatedVariant.item?.images)
      ? updatedVariant.item.images
      : [];
    const imageCount = Math.max(4, originalImages.length, editedImages.length);
    const images = Array.from({ length: imageCount }, (_, index) =>
      Object.hasOwn(editedImages, index)
        ? editedImages[index]
        : originalImages[index] || ""
    );
    const sku = updatedVariant.originalSku || updatedVariant.item.sku;

    const imagePayload = {
      productId: encodeURIComponent(id),
      sku: encodeURIComponent(sku),
      images,
    };

    console.log("Update SKU images test payload:", imagePayload);

    try {
      const response = await updateSkuImages(
        imagePayload.productId,
        imagePayload.sku,
        imagePayload.images
      );

      setProductData((current) => {
        const currentDetails = current?.details ?? {};
        const currentVendors = currentDetails.vendors ?? {};
        const vendor = currentVendors[updatedVariant.vendorId] ?? {};
        const offered = vendor.combination_offered ?? {};
        const combination = offered[updatedVariant.combinationId] ?? {};
        const currentItem = combination[updatedVariant.itemId] ?? {};

        return {
          ...current,
          details: {
            ...currentDetails,
            vendors: {
              ...currentVendors,
              [updatedVariant.vendorId]: {
                ...vendor,
                combination_offered: {
                  ...offered,
                  [updatedVariant.combinationId]: {
                    ...combination,
                    [updatedVariant.itemId]: { ...currentItem, images },
                  },
                },
              },
            },
          },
        };
      });
      toast.success(response?.message || "Variant images updated successfully");
      setEditingVariant(null);
    } catch (requestError) {
      toast.error(requestError.message || "Failed to update variant images");
      throw requestError;
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-blue-600">
        <LoaderCircle className="mr-3 h-7 w-7 animate-spin" /> Loading product details...
      </main>
    );
  }

  if (error || !productData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <p className="text-rose-600">{error || "Product details not found."}</p>
        <button type="button" onClick={retry} className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Try Again</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-10 lg:px-20">
      <div className="mx-auto w-full space-y-6">
        <header className="flex items-center gap-5">
          <button type="button" onClick={() => router.back()} aria-label="Go back" className="cursor-pointer rounded-lg p-2 hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold">{details.product_title}</h1>
              <p className="mt-1 text-slate-500">{details.category_name}</p>
            </div>
            {details.code && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{details.code}</span>}
            {details.condition && <span className="rounded-full bg-white px-3 py-1 text-sm font-medium shadow-sm">{details.condition}</span>}
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Pricing Information</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard label="Current Price" value={formatPrice(details.price)} />
            <InfoCard label="MRP" value={formatPrice(details.mrp)} />
            <InfoCard label="Max Sell Price" value={formatPrice(details.sell_max_price)} />
            <InfoCard label="Extra Coins" value={details.extra_coins ?? 0} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Vendor Information</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <InfoCard label="Vendor Name" value={primaryVendor.name} />
            <InfoCard label="Rating">
              <span className="inline-flex items-center gap-2"><Star className="h-5 w-5" /> {primaryVendor.ratings ?? primaryVendor.rating ?? "—"}</span>
            </InfoCard>
            <InfoCard label="Total Sales" value={primaryVendor.total_sales} />
          </div>
        </section>

        <nav className="grid grid-cols-4 rounded-2xl bg-slate-100 py-3 text-center text-sm font-semibold">
          <span>Variants</span><span>Specifications</span><span>Assessment</span><span>Warranty</span>
        </nav>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Product Variants</h2>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-max text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  {attributeKeys.map((attribute) => <th key={attribute} className="px-4 py-3 font-medium">{titleCase(attribute)}</th>)}
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Sell Price</th>
                  <th className="px-4 py-3 font-medium">MRP</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={`${variant.vendorId}-${variant.combinationId}-${variant.itemId}`} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200">
                        {variant.item.images?.[0] ? <Image src={variant.item.images[0]} alt={variant.item.sku || "Variant"} fill sizes="48px" className="object-contain p-1" /> : null}
                      </div>
                    </td>
                    <td className="max-w-72 px-4 py-4 font-mono text-xs">{variant.item.sku || "—"}</td>
                    {attributeKeys.map((attribute) => <td key={attribute} className="px-4 py-4">{variant.item[attribute] ?? "—"}</td>)}
                    <td className="px-4 py-4"><span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{variant.item.stocks ?? 0} units</span></td>
                    <td className="px-4 py-4 font-medium">{formatPrice(variant.item.price)}</td>
                    <td className="px-4 py-4 font-medium">{formatPrice(variant.item.sell_price)}</td>
                    <td className="px-4 py-4 font-medium">{formatPrice(variant.item.mrp)}</td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => setEditingVariant(variant)} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {variants.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No variants found.</p>}
          </div>
        </section>

        {videoUrl && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Product Video</h2>
            <div className="mt-7 overflow-hidden rounded-xl bg-slate-100">
              <iframe src={videoUrl} title={`${details.product_title} video`} className="aspect-video w-full max-w-3xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Product Metadata</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <InfoCard label="Product ID" value={details.id ?? id} />
            <InfoCard label="Spec ID" value={details.spec_id} />
            <InfoCard label="Created At" value={getCreatedDate(details.created_at)} />
          </div>
        </section>
      </div>

      {editingVariant && (
        <EditVariantModal
          variant={editingVariant}
          attributeKeys={attributeKeys}
          specId={details.spec_id}
          onClose={() => setEditingVariant(null)}
          onSave={saveVariant}
        />
      )}
    </main>
  );
}
