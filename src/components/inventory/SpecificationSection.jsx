import CombinationEditor from "@/components/inventory/CombinationEditor";

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
}) {
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
          <div className="space-y-2">
            {specification.color_codes.map((c, ci) => (
              <div key={ci} className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Color Name
                  </label>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    value={c.name}
                    onChange={(e) =>
                      updateColorCode(ci, "name", e.target.value)
                    }
                  />
                </div>
                <div className="w-40">
                  <label className="block text-sm font-medium mb-1">Hex</label>
                  <input
                    type="color"
                    className="w-12 h-8 p-0 border rounded"
                    value={c.hex || "#000000"}
                    onChange={(e) => updateColorCode(ci, "hex", e.target.value)}
                  />
                </div>
                <div className="w-24 text-right">
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
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
