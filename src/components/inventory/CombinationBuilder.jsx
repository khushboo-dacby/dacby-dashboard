import React, { useState } from "react";
import { Plus, X, Layers, Bolt } from "lucide-react";
import CombinationEditor from "./CombinationEditor";

export default function CombinationBuilder({
  specification,
  updateCombinations,
  addCombinationsFromAttributes,
  addAttributeDefinition,
  updateAttributeDefinitionKey,
  finalizeAttributeDefinitionKey,
  removeAttributeDefinition,
  removeAttributeDefinitionValue,
  updateAttributeDefinitionInput,
  addAttributeDefinitionValue,
}) {
  const [activeMode, setActiveMode] = useState("batch"); // 'batch' | 'manual'
  const [showReview, setShowReview] = useState(false);

  const defs = specification.attributeDefinitions || [];
  
  // Calculate total combinations
  const totalCombinations = defs.reduce((acc, def) => {
    const valuesCount = Array.isArray(def.values) ? def.values.length : 0;
    return valuesCount > 0 ? acc * valuesCount : acc;
  }, defs.length > 0 ? 1 : 0);

  function handleGenerateClick() {
    if (totalCombinations > 0) {
      addCombinationsFromAttributes();
      setShowReview(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Variant & Combination Builder</h2>
            <p className="text-sm text-slate-500">
              Select or input variant values together to auto-generate all SKU combinations, or create manual combinations.
            </p>
          </div>
        </div>
        
        <div className="flex shrink-0 items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveMode("batch")}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeMode === "batch"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Bolt className="h-4 w-4" />
            Batch Attribute Generator
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("manual")}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeMode === "manual"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Manual Combination
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeMode === "manual" && (
          <CombinationEditor
            combinations={specification.combinations}
            onChange={updateCombinations}
            onGenerateFromAttributes={addCombinationsFromAttributes}
          />
        )}

        {activeMode === "batch" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              {defs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 rounded-full bg-blue-100 p-3 text-blue-600">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">No Attributes Defined</h3>
                  <p className="mt-1 text-sm text-slate-500 max-w-sm">
                    Add attributes like Color, Storage, or Condition to automatically generate inventory combinations.
                  </p>
                  <button
                    type="button"
                    onClick={addAttributeDefinition}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add Attribute
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {defs.map((def, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="sm:w-48 shrink-0">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="w-full rounded-md border-0 bg-transparent px-2 py-1 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            value={def.key}
                            placeholder="e.g. Color"
                            onChange={(e) => updateAttributeDefinitionKey(i, e.target.value)}
                            onBlur={() => finalizeAttributeDefinitionKey(i)}
                          />
                          <span className="text-xs font-semibold text-slate-400">({def.values?.length || 0})</span>
                          <button
                            type="button"
                            onClick={() => removeAttributeDefinition(i)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-colors ml-auto sm:hidden"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 flex-wrap items-center gap-2">
                        {def.values && def.values.map((val, vi) => (
                          <div key={vi} className="flex items-center gap-1 rounded-full border border-slate-200 bg-white pl-3 pr-1 py-1 text-sm text-slate-700 shadow-sm">
                            <span className="font-medium">{val}</span>
                            <button
                              type="button"
                              onClick={() => removeAttributeDefinitionValue(i, vi)}
                              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`+ Add ${def.key || 'Value'}`}
                            className="w-32 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-blue-500 placeholder:font-medium"
                            value={def.input || ""}
                            onChange={(e) => updateAttributeDefinitionInput(i, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addAttributeDefinitionValue(i);
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeAttributeDefinition(i)}
                        className="hidden sm:block text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-rose-50 transition-colors shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {defs.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={addAttributeDefinition}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Plus className="h-4 w-4" /> Add Attribute
                  </button>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Attributes bundled</span>
                    <span className="font-medium text-slate-300">•</span>
                    <span className="font-semibold text-slate-900">{totalCombinations} total combinations</span>
                    <span>ready to review</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateClick}
                  disabled={totalCombinations === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <Bolt className="h-4 w-4" /> Generate Combinations ({totalCombinations})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
