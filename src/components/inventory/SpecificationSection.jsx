import { useState } from "react";
import CombinationEditor from "@/components/inventory/CombinationEditor";

function normalizeHexColor(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#")) return trimmed;
  return trimmed.length === 3 || trimmed.length === 6 ? `#${trimmed}` : trimmed;
}

function isHexColorValue(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return false;
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  return /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withoutHash);
}

export default function SpecificationSection({
  specification,
  addColorCode,
  updateColorCode,
  removeColorCode,
  addAttributeDefinition,
  updateAttributeDefinitionKey,
  finalizeAttributeDefinitionKey,
  updateAttributeDefinitionIcon,
  removeAttributeDefinition,
  removeAttributeDefinitionValue,
  getOptionDescription,
  updateOptionDescriptionForValue,
  updateAttributeDefinitionInput,
  addAttributeDefinitionValue,
  updateCombinations,
  addCombinationsFromAttributes,
  addColorCodesFromText,
}) {
  const [colorCodeInputText, setColorCodeInputText] = useState("");

  function handleApplyColorCodeText() {
    if (!addColorCodesFromText) return;
    addColorCodesFromText(colorCodeInputText);
    setColorCodeInputText("");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Specification</h3>
        <div className="flex gap-3">
          <button
            type="button"
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={addColorCode}
          >
            + Color Code
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 font-medium text-slate-900">Color Codes</h4>
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Add color map directly
              </label>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm"
                placeholder='{"Space Gray": "#535150", "Silver": "#f2f3f5"}'
                value={colorCodeInputText}
                onChange={(e) => setColorCodeInputText(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  onClick={handleApplyColorCodeText}
                >
                  Apply colors
                </button>
              </div>
            </div>

            {specification.color_codes.map((c, ci) => (
              <div
                key={ci}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-end"
              >
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Color name or hex
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={c.name}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (isHexColorValue(nextValue)) {
                        updateColorCode(ci, "hex", normalizeHexColor(nextValue));
                        updateColorCode(ci, "name", "");
                      } else {
                        updateColorCode(ci, "name", nextValue);
                      }
                    }}
                    placeholder="Space Gray or #535150"
                  />
                </div>
                <div className="w-full md:w-44">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Hex value
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      value={c.hex || ""}
                      onChange={(e) =>
                        updateColorCode(ci, "hex", normalizeHexColor(e.target.value))
                      }
                      placeholder="#000000"
                    />
                    <input
                      type="color"
                      className="h-10 w-12 rounded-lg border border-slate-200 p-0"
                      value={c.hex || "#000000"}
                      onChange={(e) => updateColorCode(ci, "hex", e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-24 md:text-right">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 md:w-auto"
                    onClick={() => removeColorCode(ci)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-slate-900">Attributes</h4>
            <button
              type="button"
              className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              onClick={addAttributeDefinition}
            >
              + Add Attribute
            </button>
          </div>

          <div className="space-y-3">
            {(specification.attributeDefinitions || []).map((attr, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Attribute Name
                    </label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Color, Storage, Physical Condition..."
                      value={attr.key}
                      onChange={(e) =>
                        updateAttributeDefinitionKey(idx, e.target.value)
                      }
                      onBlur={(e) =>
                        finalizeAttributeDefinitionKey(idx, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Icon URL
                    </label>
                    <input
                      className="border rounded px-3 py-2 w-full"
                      placeholder="https://"
                      value={attr.icon || ""}
                      onChange={(e) =>
                        updateAttributeDefinitionIcon(idx, e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 md:mt-7"
                    onClick={() => removeAttributeDefinition(idx)}
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">
                    Values
                  </label>
                  <div className="space-y-2">
                    {(attr.values || []).map((value, valueIdx) => (
                      <div
                        key={valueIdx}
                        className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-2 items-center"
                      >
                        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                          <span>{value}</span>
                          <button
                            type="button"
                            className="text-xs font-medium text-rose-600 hover:text-rose-700"
                            onClick={() =>
                              removeAttributeDefinitionValue(idx, valueIdx)
                            }
                          >
                            ×
                          </button>
                        </div>
                        <input
                          className="border rounded px-3 py-2"
                          placeholder={`Description for ${value}`}
                          value={getOptionDescription(value)}
                          onChange={(e) =>
                            updateOptionDescriptionForValue(
                              value,
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        className="border rounded px-2 py-1 min-w-45"
                        placeholder="Type a value and press Enter"
                        value={attr.input || ""}
                        onChange={(e) =>
                          updateAttributeDefinitionInput(idx, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if ((attr.input || "").trim()) {
                              addAttributeDefinitionValue(idx);
                            }
                          }
                          if (
                            e.key === "Backspace" &&
                            !(attr.input || "").length &&
                            (attr.values || []).length
                          ) {
                            removeAttributeDefinitionValue(
                              idx,
                              (attr.values || []).length - 1,
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CombinationEditor
        combinations={specification.combinations || []}
        onChange={updateCombinations}
        onGenerateFromAttributes={addCombinationsFromAttributes}
      />
    </div>
  );
}
