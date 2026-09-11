"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

function titleCase(value) {
  return String(value || "").replaceAll("_", " ");
}

export default function CombinationMapEditor({ combination, onChange }) {
  const [valueInputs, setValueInputs] = useState({});
  const entries = Object.entries(combination ?? {});

  function addValue(combinationKey, attributeKey) {
    const inputKey = `${combinationKey}:${attributeKey}`;
    const value = String(valueInputs[inputKey] || "").trim();
    if (!value) return;

    onChange((current) => {
      const target = current[combinationKey] ?? {};
      const values = Array.isArray(target[attributeKey]) ? target[attributeKey] : [];
      if (values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
        return current;
      }
      return {
        ...current,
        [combinationKey]: {
          ...target,
          [attributeKey]: [...values, value],
        },
      };
    });
    setValueInputs((current) => ({ ...current, [inputKey]: "" }));
  }

  function removeValue(combinationKey, attributeKey, valueIndex) {
    onChange((current) => {
      const target = current[combinationKey] ?? {};
      const values = Array.isArray(target[attributeKey]) ? target[attributeKey] : [];
      return {
        ...current,
        [combinationKey]: {
          ...target,
          [attributeKey]: values.filter((_, index) => index !== valueIndex),
        },
      };
    });
  }

  if (entries.length === 0) {
    return <p className="text-sm text-slate-500">No combinations found for this specification.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map(([combinationKey, attributes]) => (
        <div key={combinationKey} className="rounded-xl border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <span className="font-semibold uppercase text-slate-800">
              {titleCase(combinationKey)}
            </span>
          </div>
          <div className="space-y-4 p-4">
            {Object.entries(attributes ?? {}).map(([attributeKey, values]) => {
              const inputKey = `${combinationKey}:${attributeKey}`;
              const valueList = Array.isArray(values) ? values : [];
              return (
                <div key={attributeKey} className="rounded-lg border border-slate-200 p-3">
                  <p className="mb-2 text-sm font-medium capitalize text-slate-700">
                    {titleCase(attributeKey)}
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {valueList.map((value, index) => (
                      <span
                        key={`${value}-${index}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                      >
                        {value}
                        <button
                          type="button"
                          onClick={() => removeValue(combinationKey, attributeKey, index)}
                          aria-label={`Remove ${value}`}
                          className="cursor-pointer text-rose-600 hover:text-rose-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    {valueList.length === 0 && (
                      <span className="text-xs text-slate-400">No values</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={valueInputs[inputKey] || ""}
                      onChange={(event) =>
                        setValueInputs((current) => ({
                          ...current,
                          [inputKey]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          addValue(combinationKey, attributeKey);
                        }
                      }}
                      placeholder="New value"
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => addValue(combinationKey, attributeKey)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
