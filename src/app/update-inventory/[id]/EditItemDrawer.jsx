"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import ImagePreview from "../../../components/inventory/ImagePreview";
import WarningPopup from "../../../components/confirmation-modal/WarningPopup";
import ImagePropagationModal from "../../../components/confirmation-modal/ImagePropagationModal";
import { convertFirebaseImageToCdn } from "../../add-variant/AddVariant";

function inputValue(value) {
  return typeof value === "string" || typeof value === "number" ? value : "";
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function EditItemDrawer({ variant, attributeKeys, allVariants = [], onClose, onApply }) {
  const originalSku = variant.item.sku || "";
  const originalItem = variant.item ?? {};
  const [sku, setSku] = useState(originalSku);
  const [mrp, setMrp] = useState(originalItem.mrp ?? 0);
  const [sellPrice, setSellPrice] = useState(originalItem.sell_price ?? 0);
  const [weight, setWeight] = useState(originalItem.weight ?? 0);
  const [price, setPrice] = useState(originalItem.price ?? 0);
  const [stocks, setStocks] = useState(originalItem.stocks ?? 0);
  const [sell, setSell] = useState(Boolean(originalItem.sell));
  const [ytIframe, setYtIframe] = useState(originalItem.yt_iframe ?? "");
  const [imageUrls, setImageUrls] = useState(() =>
    Array.from({ length: 4 }, (_, index) =>
      Array.isArray(originalItem.images) ? originalItem.images[index] || "" : "",
    ),
  );
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [pendingImagePropagation, setPendingImagePropagation] = useState(null);
  const [pendingMergedItem, setPendingMergedItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const skuChanged = sku.trim() !== originalSku.trim();
  const item = variant.item;

  const ytPreviewSrc = useMemo(() => {
    if (!ytIframe) return "";
    const match = ytIframe.match(/src=["']([^"']+)["']/i) || ytIframe.match(/https?:\/\/[^\s"']+/i);
    return match ? match[1] || match[0] : "";
  }, [ytIframe]);

  function updateImageUrl(index, value) {
    setImageUrls((current) => current.map((url, i) => (i === index ? value : url)));
  }

  function submit(event) {
    event.preventDefault();

    const normalizedImages = imageUrls
      .map((imageUrl) => {
        if (!imageUrl || typeof imageUrl !== "string") return "";
        const trimmed = imageUrl.trim();
        if (!trimmed) return "";
        return convertFirebaseImageToCdn(trimmed);
      })
      .filter(Boolean);

    const mergedItem = {
      ...originalItem,
      sku: sku.trim() || originalSku,
      images: normalizedImages,
      mrp: Number(mrp) || 0,
      sell_price: Number(sellPrice) || 0,
      weight: Number(weight) || 0,
      price: Number(price) || 0,
      stocks: Number(stocks) || 0,
      sell: Boolean(sell),
      yt_iframe: ytIframe.trim(),
    };

    const originalImages = (originalItem.images ?? [])
      .map((u) => convertFirebaseImageToCdn(String(u || "").trim()))
      .filter(Boolean);

    const imagesChanged =
      JSON.stringify(normalizedImages) !== JSON.stringify(originalImages);

    const color = String(originalItem.color || "").trim();
    const sameColorOthers = (allVariants || []).filter(
      (v) =>
        !(
          v.vendorId === variant.vendorId &&
          v.combinationId === variant.combinationId &&
          v.itemId === variant.itemId
        ) &&
        String(v.item?.color || "").trim().toLowerCase() === color.toLowerCase(),
    );

    if (imagesChanged && color && sameColorOthers.length > 0) {
      setPendingImagePropagation({
        mergedItem,
        normalizedImages,
        color,
        count: sameColorOthers.length,
      });
      return;
    }

    if (skuChanged) {
      setPendingMergedItem(mergedItem);
      setShowSaveWarning(true);
      return;
    }

    onApply(mergedItem, { applyToAllSameColor: false, color, images: normalizedImages });
  }

  async function confirmSave() {
    setIsSaving(true);
    try {
      const itemToSave = pendingMergedItem || {
        ...originalItem,
        sku: sku.trim() || originalSku,
        images: imageUrls.map(u => convertFirebaseImageToCdn(String(u || "").trim())).filter(Boolean),
        mrp: Number(mrp) || 0,
        sell_price: Number(sellPrice) || 0,
        weight: Number(weight) || 0,
        price: Number(price) || 0,
        stocks: Number(stocks) || 0,
        sell: Boolean(sell),
        yt_iframe: ytIframe.trim(),
      };
      await onApply(itemToSave, { applyToAllSameColor: false });
    } finally {
      setIsSaving(false);
      setShowSaveWarning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
      <form
        onSubmit={submit}
        className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Edit Item</h2>
            <p className="mt-1 text-sm text-slate-500">
              Edit the current item without creating or deleting vendors, combinations, or items.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit item drawer"
            className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <section className="space-y-4">
            <label className="block text-sm font-medium text-slate-700" htmlFor="edit-item-sku">
              SKU
            </label>
            <input
              id="edit-item-sku"
              value={inputValue(sku)}
              onChange={(event) => setSku(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {skuChanged && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  This changes the existing item SKU from <span className="font-mono font-semibold">{originalSku}</span> to <span className="font-mono font-semibold">{sku.trim() || originalSku}</span>.
                </span>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <p className="mb-1 block text-sm font-medium text-slate-700">Item Images</p>
            <ImagePreview imageUrls={imageUrls.filter(Boolean)} />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="min-w-0">
                  <label
                    className="mb-1 block text-xs text-slate-600"
                    htmlFor={`edit-item-image-${index + 1}`}
                  >
                    Image {index + 1} URL
                  </label>
                  <input
                    id={`edit-item-image-${index + 1}`}
                    type="url"
                    value={url}
                    onChange={(event) => updateImageUrl(index, event.target.value)}
                    placeholder={`Image ${index + 1} URL`}
                    className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              MRP
              <input
                type="number"
                value={mrp}
                onChange={(event) => setMrp(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Sell Price
              <input
                type="number"
                value={sellPrice}
                onChange={(event) => setSellPrice(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Weight
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(event) => setWeight(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Price
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Stocks
              <input
                type="number"
                value={stocks}
                onChange={(event) => setStocks(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700">
              <span>For Sale</span>
              <button
                type="button"
                onClick={() => setSell(true)}
                className={`px-2 py-1 rounded ${sell ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setSell(false)}
                className={`px-2 py-1 rounded ${!sell ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                No
              </button>
            </div>
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="block text-sm font-medium text-slate-700">
              YouTube embed (yt_iframe)
              <textarea
                value={ytIframe}
                onChange={(event) => setYtIframe(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder={'<iframe src="https://www.youtube.com/embed/..." ...></iframe>'}
              />
            </label>

            {ytPreviewSrc && (
              <div className="mt-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Preview</p>
                <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <iframe
                    src={ytPreviewSrc}
                    title="Item video preview"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Existing item details
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {attributeKeys.map((key) => (
                <ReadOnlyField
                  key={key}
                  label={key.replaceAll("_", " ")}
                  value={inputValue(item[key]) || "—"}
                />
              ))}
              <ReadOnlyField label="Stocks" value={`${item.stocks ?? 0} units`} />
              <ReadOnlyField label="Price" value={formatPrice(item.price)} />
              <ReadOnlyField label="Sell Price" value={formatPrice(item.sell_price)} />
              <ReadOnlyField label="MRP" value={formatPrice(item.mrp)} />
              <ReadOnlyField label="Weight" value={item.weight ?? "—"} />
              <ReadOnlyField label="For Sale" value={item.sell ? "Yes" : "No"} />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      {showSaveWarning && (
        <WarningPopup
          title={skuChanged ? "Save updated item SKU?" : "Save item changes?"}
          message={
            skuChanged
              ? `This will update the existing item from "${originalSku}" to "${sku.trim() || originalSku}". Continue?`
              : "This will update the current item and keep all untouched fields intact. Continue?"
          }
          isConfirming={isSaving}
          onCancel={() => setShowSaveWarning(false)}
          onConfirm={confirmSave}
        />
      )}

      {pendingImagePropagation && (
        <ImagePropagationModal
          color={pendingImagePropagation.color}
          sameColorCount={pendingImagePropagation.count}
          onApplyAll={() => {
            const { mergedItem, color, normalizedImages } = pendingImagePropagation;
            setPendingImagePropagation(null);
            onApply(mergedItem, { applyToAllSameColor: true, color, images: normalizedImages });
          }}
          onApplyOnlyThis={() => {
            const { mergedItem, color, normalizedImages } = pendingImagePropagation;
            setPendingImagePropagation(null);
            onApply(mergedItem, { applyToAllSameColor: false, color, images: normalizedImages });
          }}
          onCancel={() => {
            setPendingImagePropagation(null);
          }}
        />
      )}
    </div>
  );
}
