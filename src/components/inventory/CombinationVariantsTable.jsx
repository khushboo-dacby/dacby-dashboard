"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";
import ItemDetailsFields from "@/components/inventory/ItemDetailsFields";
import WarningPopup from "@/components/confirmation-modal/WarningPopup";
import MediaModal from "@/app/update-inventory/[id]/MediaModal";
import { emptyItem } from "@/constants/inventory";
import { normalizeAttributeKey } from "@/utils/formatters";
import { generateSKUForItem } from "@/utils/sku";
import Image from "next/image";
import { convertFirebaseImageToCdn } from "@/app/add-variant/AddVariant";

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeValue(value) {
  return String(value || "").trim().toLowerCase();
}

function expandAttributes(attributes, index = 0, current = {}) {
  if (index === attributes.length) return [current];
  const attribute = attributes[index];
  const key = normalizeAttributeKey(attribute.key);
  const values = (attribute.values || []).filter((value) => String(value).trim());
  if (!key || values.length === 0) return expandAttributes(attributes, index + 1, current);

  return values.flatMap((value) =>
    expandAttributes(attributes, index + 1, { ...current, [key]: value })
  );
}

function getCombinationRows(combinations) {
  return combinations.filter((combination) =>
    (combination?.attributes || []).some((attribute) => {
      const key = normalizeAttributeKey(attribute?.key);
      const values = Array.isArray(attribute?.values)
        ? attribute.values.filter((value) => String(value ?? "").trim())
        : [];
      return Boolean(key && values.length);
    })
  ).flatMap((combination) =>
    expandAttributes(combination.attributes || []).map((attributes) => ({
      key: `${combination.name}:${Object.entries(attributes).map(([key, value]) => `${key}=${value}`).join("|")}`,
      combinationName: combination.name,
      attributes,
    }))
  );
}

function findSavedItem(items, row) {
  return items.find((item) =>
    item._variantKey === row.key ||
    (item.combination_name === row.combinationName &&
      Object.entries(row.attributes).every(
        ([key, value]) => String(item.attributes?.[key] ?? "") === String(value)
      ))
  );
}

export default function CombinationVariantsTable({
  vendorIndex,
  items,
  specification,
  fields,
  sharedImagesByColor,
  confirmedImageColors,
  onSaveVariant,
}) {
  const [mediaRow, setMediaRow] = useState(null);
  const rows = useMemo(
    () => getCombinationRows(specification.combinations || []),
    [specification.combinations]
  );
  const attributeKeys = useMemo(
    () => [...new Set(rows.flatMap((row) => Object.keys(row.attributes)))],
    [rows]
  );

  function getDraft(row) {
    const savedItem = findSavedItem(items, row);
    if (savedItem) return { ...savedItem, images: [...(savedItem.images || [])] };

    const draft = {
      ...emptyItem(),
      combination_name: row.combinationName,
      attributes: { ...row.attributes },
      images: [
        ...(sharedImagesByColor[normalizeValue(row.attributes.color)] || []),
      ],
    };
    draft.sku = generateSKUForItem(
      fields.spec_id,
      draft,
      specification.attributeDefinitions,
      { categoryName: fields.category_name, categoryCode: fields.code }
    );
    return draft;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="font-semibold text-slate-900">Combination Variants</h4>
        <p className="mt-1 text-sm text-slate-500">Add inventory details for every generated attribute combination.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Image</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">SKU</th>
              {attributeKeys.map((key) => <th key={key} className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">{titleCase(key)}</th>)}
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Weight</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">MRP</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Buy Price</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Sell Price</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Stock</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-700">Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const item = getDraft(row);
              const hasImages = Boolean(item.images?.[0]?.trim());
              const hasVideo = Boolean(item.yt_iframe);
              const isSelling = Boolean(item.sell);
              
              const handleUpdate = (updates) => {
                onSaveVariant(vendorIndex, row, { ...item, ...updates }, false);
              };

              return (
                <tr key={row.key} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setMediaRow(row)}
                      className="group relative flex flex-col items-center gap-2"
                    >
                      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow group-hover:shadow-sm">
                        {hasImages || hasVideo ? (
                          <>
                            {hasImages && (
                              <Image
                                src={convertFirebaseImageToCdn(item.images[0])}
                                alt="Variant thumbnail"
                                fill
                                sizes="56px"
                                className="object-contain p-1.5"
                              />
                            )}
                            {hasVideo && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="rounded-full bg-red-600 p-1 shadow-sm">
                                  <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <Plus className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-[10px] font-bold text-white">Edit Media</span>
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <input type="text" value={item.sku ?? ""} onChange={(e) => handleUpdate({ sku: e.target.value })} className="w-64 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </td>
                  {attributeKeys.map((key) => <td key={key} className="px-4 py-4 align-top">
                    <span className="text-sm font-semibold text-slate-700">{row.attributes[key] ?? "—"}</span>
                  </td>)}
                  <td className="px-4 py-4 align-top">
                    <div className="flex w-24 items-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                      <input type="text" value={String(item.weight ?? "").replace("kg", "").trim()} onChange={(e) => handleUpdate({ weight: e.target.value + " kg" })} className="w-full text-sm outline-none bg-transparent" />
                      <span className="text-[10px] font-medium text-slate-400">kg</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <input type="number" value={item.mrp ?? ""} onChange={(e) => handleUpdate({ mrp: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <input type="number" value={item.price ?? ""} onChange={(e) => handleUpdate({ price: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <input type="number" value={item.sell_price ?? ""} onChange={(e) => handleUpdate({ sell_price: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <input type="number" value={item.stocks ?? ""} onChange={(e) => handleUpdate({ stocks: e.target.value })} className="w-20 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white" />
                  </td>
                  <td className="px-6 py-4 align-top">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={isSelling} onChange={(e) => handleUpdate({ sell: e.target.checked })} className="peer sr-only" />
                      <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300"></div>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {mediaRow && (
        <MediaModal
          variant={{ item: getDraft(mediaRow) }}
          isEditing={true}
          onClose={() => setMediaRow(null)}
          onApply={(nextItem, options) => {
            onSaveVariant(vendorIndex, mediaRow, nextItem, options);
            setMediaRow(null);
          }}
        />
      )}
    </div>
  );
}
