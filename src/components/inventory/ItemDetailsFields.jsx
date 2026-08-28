"use client";

import ImagePreview from "./ImagePreview";

export default function ItemDetailsFields({
  item,
  vendorIndex,
  itemIndex,
  specId,
  updateItem,
}) {
  const imageUrls = Array.isArray(item.images) ? item.images.slice(0, 4) : [];
  const inputValue = (value) =>
    typeof value === "string" || typeof value === "number" ? value : "";

  function updateImageUrl(imageIndex, value) {
    const nextImageUrls = Array.from({ length: 4 }, (_, index) =>
      index === imageIndex ? value : imageUrls[index] || "",
    );

    updateItem(vendorIndex, itemIndex, "images", nextImageUrls);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.sku)}
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "sku", e.target.value)
            }
            placeholder={specId ? `${specId}-...` : "spec-id-generated-sku"}
          />
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.weight)}
            type="number"
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "weight", Number(e.target.value || 0))
            }
          />
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">Stocks</label>
          <input
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.stocks)}
            type="number"
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "stocks", Number(e.target.value || 0))
            }
          />
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">MRP</label>
          <input
            type="number"
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.mrp)}
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "mrp", Number(e.target.value || 0))
            }
          />
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.price)}
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "price", Number(e.target.value || 0))
            }
          />
        </div>
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-1">Sell Price</label>
          <input
            type="number"
            className="w-full min-w-0 border rounded px-3 py-2"
            value={inputValue(item.sell_price)}
            onChange={(e) =>
              updateItem(vendorIndex, itemIndex, "sell_price", Number(e.target.value || 0))
            }
          />
        </div>
        <div className="flex items-center gap-2 md:col-span-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!item.sell}
              onChange={(e) =>
                updateItem(vendorIndex, itemIndex, "sell", e.target.checked)
              }
            />{" "}
            <span className="text-sm">is item for sell?</span>
          </label>
        </div>
        {/* variant minimum_price removed; product-level min shown next to Max Sell Price */}
      </div>

      <div className="mt-2">
        <label className="block text-sm mb-1">
          Item YouTube Iframe (optional)
        </label>
        <textarea
          rows={3}
          className="w-full border rounded p-2"
          value={inputValue(item.yt_iframe)}
          onChange={(e) =>
            updateItem(vendorIndex, itemIndex, "yt_iframe", e.target.value)
          }
        />
      </div>
      <div className="mt-2">
        <p className="mb-1 block text-sm">Item Images</p>
        <ImagePreview imageUrls={imageUrls} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, imageIndex) => (
            <div key={imageIndex} className="min-w-0">
              <label
                className="mb-1 block text-xs text-slate-600"
                htmlFor={`item-${vendorIndex}-${itemIndex}-image-${imageIndex + 1}`}
              >
                Image {imageIndex + 1} URL
              </label>
              <input
                id={`item-${vendorIndex}-${itemIndex}-image-${imageIndex + 1}`}
                type="url"
                className="w-full min-w-0 rounded border px-3 py-2"
                value={imageUrls[imageIndex] || ""}
                onChange={(e) => updateImageUrl(imageIndex, e.target.value)}
                placeholder={`Image ${imageIndex + 1} URL`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
