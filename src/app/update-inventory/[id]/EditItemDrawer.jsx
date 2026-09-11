"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import ImagePreview from "../../../components/inventory/ImagePreview";
import WarningPopup from "../../../components/confirmation-modal/WarningPopup";

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

export default function EditItemDrawer({ variant, attributeKeys, onClose, onSave }) {
  const originalSku = variant.item.sku || "";
  const [sku, setSku] = useState(originalSku);
  const [imageUrls, setImageUrls] = useState(() =>
    Array.from({ length: 4 }, (_, index) =>
      Array.isArray(variant.item.images) ? variant.item.images[index] || "" : "",
    ),
  );
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const skuChanged = sku.trim() !== originalSku.trim();
  const item = variant.item;

  function updateImageUrl(index, value) {
    setImageUrls((current) => current.map((url, i) => (i === index ? value : url)));
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
        targetSku: sku.trim() || originalSku,
        originalSku,
        images: imageUrls,
      });
    } finally {
      setIsSaving(false);
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
              Only images and SKU are saved to the backend. Other fields are read-only.
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
          <section>
            <label className="block text-sm font-medium text-slate-700" htmlFor="edit-item-sku">
              SKU
            </label>
            <input
              id="edit-item-sku"
              value={inputValue(sku)}
              onChange={(event) => setSku(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {skuChanged && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  SKU is the identifier used to save images. Saving will write images to the new
                  SKU <span className="font-mono font-semibold">{sku.trim()}</span>, which may not
                  match an existing backend record.
                </span>
              </div>
            )}
          </section>

          <section>
            <p className="mb-1 block text-sm font-medium text-slate-700">Item Images</p>
            <ImagePreview imageUrls={imageUrls} />
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

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Read-only details
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
            Save Images
          </button>
        </div>
      </form>

      {showSaveWarning && (
        <WarningPopup
          title={skuChanged ? "Save to a changed SKU?" : "Save item images?"}
          message={
            skuChanged
              ? `Images will be saved to SKU "${sku.trim()}" instead of "${originalSku}". Continue?`
              : `Confirm image changes for ${originalSku || "this item"}.`
          }
          isConfirming={isSaving}
          onCancel={() => setShowSaveWarning(false)}
          onConfirm={confirmSave}
        />
      )}
    </div>
  );
}
