import React, { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import DescriptionPreviewModal from "@/components/description-preview/DescriptionPreviewModal";

const editorStyle =
  "min-h-[500px] w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400";

function parseFieldValue(field) {
  if (!field || field.value === undefined || field.value === null) {
    return "";
  }

  if (field.valueType === "multiple") {
    return String(field.value || "")
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => {
        if (/^-?\d+(?:\.\d+)?$/.test(item)) return Number(item);
        if (item.toLowerCase() === "true") return true;
        if (item.toLowerCase() === "false") return false;
        if (item.toLowerCase() === "null") return null;
        return item;
      });
  }

  const value = String(field.value).trim();
  if (value === "") return "";
  if ((value.startsWith("{") || value.startsWith("[")) && (value.endsWith("}") || value.endsWith("]"))) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "null") return null;
  return value;
}

export function serializeDescriptionState(description) {
  const result = {};

  if (description?.summary) {
    result.summary = description.summary;
  }

  const fields = description?.fields || [];
  fields.forEach((field) => {
    if (!field || !field.key) return;
    result[field.key] = parseFieldValue(field);
  });

  return result;
}

function createDescriptionJson(description) {
  try {
    return JSON.stringify(serializeDescriptionState(description), null, 2);
  } catch {
    return "{}";
  }
}

function parseJsonWithLocation(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    return { parsed };
  } catch (err) {
    const message = String(err.message || err);
    const match = message.match(/at position (\d+)/i);
    if (match) {
      const index = Number(match[1]);
      let line = 1;
      let column = 1;
      for (let i = 0; i < index; i += 1) {
        if (jsonText[i] === "\n") {
          line += 1;
          column = 1;
        } else {
          column += 1;
        }
      }
      return {
        error: `${message} (line ${line}, column ${column})`,
      };
    }

    return { error: message };
  }
}

function isFieldArray(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item && typeof item === "object" && typeof item.key === "string",
    )
  );
}

function convertValueToField(value) {
  const fields = [];
  function recurse(current) {
    if (current === null || current === undefined) return;
    if (Array.isArray(current)) {
      const isPrimitiveArray = current.every(
        (item) => item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
      );
      if (isPrimitiveArray) {
        fields.push({
          key: "value",
          value: current.map((item) => (item === null ? "null" : String(item))).join("\n"),
          valueType: "multiple",
        });
      } else {
        current.forEach(recurse);
      }
    } else if (typeof current === "object") {
      Object.keys(current).forEach((key) => {
        const val = current[key];
        if (val && typeof val === "object" && !Array.isArray(val)) {
          recurse(val);
        } else if (Array.isArray(val)) {
          const isPrimitiveArray = val.every(
            (item) => item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
          );
          if (isPrimitiveArray) {
            fields.push({ key: String(key), value: val.map((item) => (item === null ? "null" : String(item))).join("\n"), valueType: "multiple" });
          } else {
            recurse(val);
          }
        } else {
          fields.push({ key: String(key), value: val === null || val === undefined ? "" : String(val), valueType: "single" });
        }
      });
    } else {
      fields.push({ key: "value", value: String(current), valueType: "single" });
    }
  }

  recurse(value);
  return fields;
}

export function convertDescriptionObjectToFormState(parsed) {
  const result = { summary: "", fields: [] };

  if (parsed?.summary !== undefined) {
    result.summary =
      typeof parsed.summary === "string"
        ? parsed.summary
        : JSON.stringify(parsed.summary);
  }

  Object.keys(parsed || {}).forEach((key) => {
    if (key === "summary") return;
    const sectionValue = parsed[key];

    if (typeof sectionValue === "object" && sectionValue !== null) {
      if (Array.isArray(sectionValue)) {
        const flattened = convertValueToField(sectionValue);
        if (flattened.length === 1 && flattened[0].key === "value") {
          flattened[0].key = key;
        }
        result.fields.push(...flattened);
      } else {
        Object.keys(sectionValue).forEach((fieldKey) => {
          const fieldValue = sectionValue[fieldKey];
          if (fieldValue && typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
             const flattened = convertValueToField(fieldValue);
             if (flattened.length === 1 && flattened[0].key === "value") {
                 flattened[0].key = fieldKey;
             }
             result.fields.push(...flattened);
          } else if (Array.isArray(fieldValue)) {
             const isPrimitiveArray = fieldValue.every(
                (item) => item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
             );
             if (isPrimitiveArray) {
                result.fields.push({ key: String(fieldKey), value: fieldValue.map((item) => (item === null ? "null" : String(item))).join("\n"), valueType: "multiple" });
             } else {
                result.fields.push(...convertValueToField(fieldValue));
             }
          } else {
             result.fields.push({ key: String(fieldKey), value: fieldValue === undefined || fieldValue === null ? "" : String(fieldValue), valueType: "single" });
          }
        });
      }
    } else {
      result.fields.push({ key: String(key), value: sectionValue === undefined || sectionValue === null ? "" : String(sectionValue), valueType: "single" });
    }
  });

  return result;
}

function getTopLevelFieldRows(description) {
  return Object.entries(description || {})
    .filter(([key, value]) => {
      if (key === "summary" || Array.isArray(value)) return false;
      return !value || typeof value !== "object";
    })
    .map(([key, value], index) => ({
      id: `top-level-field-${index}-${key}`,
      key,
      value: value === undefined || value === null ? "" : String(value),
    }));
}

export default function DescriptionEditor({
  productTitle,
  category,
  condition,
  promptType,
  description,
  updateSummary,
  addDescriptionField,
  updateDescriptionFieldKey,
  updateDescriptionFieldValue,
  removeDescriptionField,
  resetDescription,
  readOnly = false,
}) {
  const descriptionState = description ?? {};
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "🔍 Researching product...",
    "✍️ Writing description...",
    "✓ Preparing product details..."
  ];

  useEffect(() => {
    if (aiLoading) {
      setLoadingTextIndex(0);
      const interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [aiLoading]);

  const flatFields = (descriptionState.fields || []).map((field, index) => ({
    id: `field-${index}`,
    index,
    key: field.key,
    value: field.value,
    valueType: field.valueType,
  }));

  const summaryText =
    typeof descriptionState?.summary === "string" ? descriptionState.summary : "";

  function handleAddField() {
    addDescriptionField();
  }

  const handleGenerateWithAI = async () => {
    if (!productTitle) {
      setAiError("Please enter a product title first.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productTitle, category, condition, promptType }),
      });
      const data = await response.json();
      console.log("Gemini API Response:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate");
      }
      
      let rawJson = data.result;
      if (typeof rawJson === 'string') {
        rawJson = rawJson.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/, '').trim();
      }
      let parsedJson = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      if (parsedJson && parsedJson.description) {
        const newState = convertDescriptionObjectToFormState(parsedJson.description);
        if (resetDescription) {
          resetDescription(newState);
        } else {
          console.warn("resetDescription prop is missing. Cannot populate form.");
        }
      } else {
         throw new Error("Invalid format from AI");
      }
    } catch (err) {
      console.error(err);
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  function handleKeyChange(field, newKey) {
    updateDescriptionFieldKey(field.index, newKey);
  }

  function handleValueChange(field, newValue) {
    updateDescriptionFieldValue(field.index, newValue);
  }

  function handleRemove(field) {
    removeDescriptionField(field.index);
  }

  function toReadableLabel(key) {
    if (!key) return "";
    const str = String(key);
    if (!str.includes("_")) return str;
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-950">Description Editor</h3>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-slate-900">1. Details</h4>
              <p className="text-sm text-slate-500">
                Manage all product specification fields here.
              </p>
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={aiLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {aiLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {loadingTexts[loadingTextIndex]}
                  </span>
                ) : (
                  "✨ Generate with AI"
                )}
              </button>
            )}
          </div>

          <div className="space-y-3">
            {flatFields.length > 0 ? (
              flatFields.map((field) => {
                const isMultiLine =
                  field.valueType === "multiple" ||
                  (typeof field.value === "string" && field.value.includes("\n"));
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-start"
                  >
                    <div className="w-full sm:w-[250px] shrink-0">
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Label"
                        value={toReadableLabel(field.key)}
                        onChange={(e) => handleKeyChange(field, e.target.value)}
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="w-full flex-1">
                      {isMultiLine ? (
                        <textarea
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          rows={4}
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => handleValueChange(field, e.target.value)}
                          readOnly={readOnly}
                        />
                      ) : (
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => handleValueChange(field, e.target.value)}
                          readOnly={readOnly}
                        />
                      )}
                    </div>
                    {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(field)}
                      className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                      title="Remove field"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No details added yet.
              </div>
            )}
          </div>
          
          {!readOnly && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleAddField}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                + Add Field
              </button>
            </div>
          )}

          {/* AI Error Box */}
          {aiError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h5 className="font-semibold text-red-900">AI Generation Failed</h5>
                <button
                  type="button"
                  onClick={() => setAiError("")}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
              <div className="rounded-lg bg-white p-3 text-sm text-red-600 border border-red-100">{aiError}</div>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h4 className="text-base font-semibold text-slate-900">2. Summary</h4>
            <p className="text-sm text-slate-500">Main product description.</p>
          </div>
          <textarea
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            rows={8}
            placeholder="Main product description..."
            value={summaryText}
            onChange={(event) => updateSummary(event.target.value)}
            readOnly={readOnly}
          />
        </section>
      </div>

      {showPreview && (
        <DescriptionPreviewModal
          description={serializeDescriptionState(descriptionState)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
