import { useState } from "react";
import {
  formatAttributeValue,
  normalizeAttributeKey,
} from "@/utils/formatters";

export default function VariantAttributeDefinitionsFields({
  item,
  vendorIndex,
  itemIndex,
  specification,
  updateItem,
  updateItemAttribute,
  addValueToCombination,
}) {
  const [valueInputs, setValueInputs] = useState({});
  const combinations = specification.combinations || [];
  const selectedCombination = combinations.find(
    (combination) => combination.name === item.combination_name,
  );

  function addValue(attributeKey) {
    const normalizedKey = normalizeAttributeKey(attributeKey);
    const value = String(valueInputs[normalizedKey] || "").trim();
    if (!value || !selectedCombination) return;

    addValueToCombination(selectedCombination.name, attributeKey, value);
    updateItemAttribute(vendorIndex, itemIndex, normalizedKey, value);
    setValueInputs((current) => ({ ...current, [normalizedKey]: "" }));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Combination *
        </label>
        <select
          className="w-full rounded border px-3 py-2"
          value={item.combination_name || ""}
          onChange={(event) =>
            updateItem(
              vendorIndex,
              itemIndex,
              "combination_name",
              event.target.value,
            )
          }
        >
          <option value="">Select combination first</option>
          {combinations.map((combination) => (
            <option key={combination.name} value={combination.name}>
              {combination.name.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {!selectedCombination ? (
        <p className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
          Select a combination to choose its attribute values.
        </p>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium">
            Combination Attributes
          </label>
          <div className="space-y-3">
            {(selectedCombination.attributes || []).map((attribute) => {
              const attributeKey = normalizeAttributeKey(attribute.key);
              const values = attribute.values || [];

              return (
                <div
                  key={attributeKey}
                  className="grid gap-2 md:grid-cols-[160px_1fr_220px] md:items-center"
                >
                  <span className="text-sm font-medium capitalize text-slate-700">
                    {attribute.key.replaceAll("_", " ")}
                  </span>
                  <select
                    className="rounded border px-3 py-2"
                    value={(item.attributes || {})[attributeKey] || ""}
                    onChange={(event) =>
                      updateItemAttribute(
                        vendorIndex,
                        itemIndex,
                        attributeKey,
                        event.target.value,
                      )
                    }
                  >
                    <option value="">Select {attribute.key.replaceAll("_", " ")}</option>
                    {values.map((value) => {
                      const formattedValue = formatAttributeValue(value);
                      return (
                        <option key={formattedValue} value={formattedValue}>
                          {formattedValue}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex gap-2">
                    <input
                      className="min-w-0 flex-1 rounded border px-3 py-2"
                      value={valueInputs[attributeKey] || ""}
                      placeholder="Add value"
                      onChange={(event) =>
                        setValueInputs((current) => ({
                          ...current,
                          [attributeKey]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addValue(attribute.key);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addValue(attribute.key)}
                      className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}

            {!(selectedCombination.attributes || []).length ? (
              <p className="text-sm text-slate-500">
                Selected combination has no attributes yet.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
