"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, X } from "lucide-react";
import ItemDetailsFields from "@/components/inventory/ItemDetailsFields";
import WarningPopup from "@/components/confirmation-modal/WarningPopup";
import { emptyItem } from "@/constants/inventory";
import { normalizeAttributeKey } from "@/utils/formatters";
import { generateSKUForItem } from "@/utils/sku";

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

function VariantModal({ row, initialItem, specId, autoApplyImages, onClose, onSave }) {
  const [item, setItem] = useState(initialItem);
  const [showImageWarning, setShowImageWarning] = useState(false);

  function updateItem(_vendorIndex, _itemIndex, key, value) {
    setItem((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const hasImages = (item.images || []).some((image) => String(image || "").trim());
    const color = row.attributes.color;
    if (hasImages && color && autoApplyImages) {
      onSave(item, true);
      return;
    }
    if (hasImages && color) {
      setShowImageWarning(true);
      return;
    }
    onSave(item, false);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <form onSubmit={submit} className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Add Variant</h2>
            <p className="mt-1 text-sm text-slate-500">{titleCase(row.combinationName)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close variant form" className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(row.attributes).map(([key, value]) => (
              <span key={key} className="rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-800">
                {titleCase(key)}: {value}
              </span>
            ))}
          </div>
          <ItemDetailsFields
            item={item}
            vendorIndex="variant"
            itemIndex={row.key}
            specId={specId}
            updateItem={updateItem}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-100">Cancel</button>
          <button type="submit" className="cursor-pointer rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">Save Changes</button>
        </div>
      </form>

      {showImageWarning && (
        <WarningPopup
          title="Apply images to matching color?"
          message={`Use these image URLs for every ${row.attributes.color} variant, including matching variants added later?`}
          cancelLabel="Only This Variant"
          confirmLabel="Apply to All"
          onClose={() => setShowImageWarning(false)}
          onCancel={() => onSave(item, false)}
          onConfirm={() => onSave(item, true)}
        />
      )}
    </div>,
    document.body
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
  const [activeRow, setActiveRow] = useState(null);
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
              <th className="px-4 py-3 font-semibold">Combination Name</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              {attributeKeys.map((key) => <th key={key} className="px-4 py-3 font-semibold">{titleCase(key)}</th>)}
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const savedItem = findSavedItem(items, row);
              const sku = savedItem?.sku || getDraft(row).sku;
              return (
                <tr key={row.key} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium">{titleCase(row.combinationName)}</td>
                  <td className="max-w-80 px-4 py-3 font-mono text-xs">{sku || "—"}</td>
                  {attributeKeys.map((key) => <td key={key} className="px-4 py-3">{row.attributes[key] ?? "—"}</td>)}
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setActiveRow(row)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-semibold ${savedItem
                          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                    >
                      {savedItem ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {savedItem ? "Edit Variant" : "Add Variant"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeRow && (
        <VariantModal
          row={activeRow}
          initialItem={getDraft(activeRow)}
          specId={fields.spec_id}
          autoApplyImages={confirmedImageColors.includes(
            normalizeValue(activeRow.attributes.color)
          )}
          onClose={() => setActiveRow(null)}
          onSave={(item, applyImagesToAll) => {
            onSaveVariant(vendorIndex, activeRow, item, applyImagesToAll);
            setActiveRow(null);
          }}
        />
      )}
    </div>
  );
}
