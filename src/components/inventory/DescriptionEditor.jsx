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

  Object.keys(description || {}).forEach((section) => {
    if (section === "summary") {
      result.summary = description.summary;
      return;
    }

    const sectionFields = description[section];
    if (!Array.isArray(sectionFields)) {
      result[section] = sectionFields;
      return;
    }

    const sectionObject = {};
    sectionFields.forEach((field) => {
      if (!field || !field.key) return;
      sectionObject[field.key] = parseFieldValue(field);
    });
    result[section] = sectionObject;
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
  if (Array.isArray(value)) {
    const isPrimitiveArray = value.every(
      (item) =>
        item === null ||
        item === undefined ||
        ["string", "number", "boolean"].includes(typeof item),
    );
    if (isPrimitiveArray) {
      return {
        key: "value",
        value: value.map((item) => (item === null ? "null" : String(item))).join("\n"),
        valueType: "multiple",
      };
    }
    return {
      key: "value",
      value: JSON.stringify(value, null, 2),
      valueType: "single",
    };
  }

  if (value && typeof value === "object") {
    return {
      key: "value",
      value: JSON.stringify(value, null, 2),
      valueType: "single",
    };
  }

  return {
    key: "value",
    value: value === undefined || value === null ? "" : String(value),
    valueType: "single",
  };
}

export function convertDescriptionObjectToFormState(parsed) {
  const result = { summary: "" };

  if (parsed?.summary !== undefined) {
    result.summary =
      typeof parsed.summary === "string"
        ? parsed.summary
        : JSON.stringify(parsed.summary);
  }

  Object.keys(parsed || {}).forEach((key) => {
    if (key === "summary") return;
    const sectionValue = parsed[key];

    if (sectionValue === null || sectionValue === undefined) {
      result[key] = "";
      return;
    }

    if (isFieldArray(sectionValue)) {
      result[key] = sectionValue;
      return;
    }

    if (typeof sectionValue === "string" || typeof sectionValue === "number" || typeof sectionValue === "boolean") {
      result[key] = sectionValue;
      return;
    }

    if (Array.isArray(sectionValue)) {
      result[key] = [convertValueToField(sectionValue)];
      return;
    }

    const sectionFields = Object.keys(sectionValue).map((fieldKey) => {
      const fieldValue = sectionValue[fieldKey];
      if (Array.isArray(fieldValue)) {
        const isPrimitiveArray = fieldValue.every(
          (item) =>
            item === null ||
            item === undefined ||
            ["string", "number", "boolean"].includes(typeof item),
        );
        if (isPrimitiveArray) {
          return {
            key: String(fieldKey),
            value: fieldValue
              .map((item) => (item === null ? "null" : String(item)))
              .join("\n"),
            valueType: "multiple",
          };
        }
        return {
          key: String(fieldKey),
          value: JSON.stringify(fieldValue, null, 2),
          valueType: "single",
        };
      }

      if (fieldValue && typeof fieldValue === "object") {
        return {
          key: String(fieldKey),
          value: JSON.stringify(fieldValue, null, 2),
          valueType: "single",
        };
      }

      return {
        key: String(fieldKey),
        value:
          fieldValue === undefined || fieldValue === null
            ? ""
            : String(fieldValue),
        valueType: "single",
      };
    });

    result[key] = sectionFields;
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
  description,
  updateSummary,
  addDescriptionField,
  updateDescriptionFieldKey,
  updateDescriptionFieldValue,
  removeDescriptionField,
  readOnly = false,
}) {
  const descriptionState = description ?? {};
  const [showPreview, setShowPreview] = useState(false);

  const flatFields = [];
  Object.keys(descriptionState).forEach((section) => {
    if (section === "summary") return;
    const val = descriptionState[section];

    if (Array.isArray(val)) {
      val.forEach((field, index) => {
        flatFields.push({
          id: `${section}-${index}`,
          section,
          index,
          key: field.key,
          value: field.value,
          valueType: field.valueType,
          isTopLevel: false,
        });
      });
    } else if (val !== null && typeof val !== "object") {
      flatFields.push({
        id: `top-${section}`,
        section: "TOP",
        key: section,
        value: val,
        valueType: "single",
        isTopLevel: true,
      });
    }
  });

  const summaryText =
    typeof descriptionState?.summary === "string" ? descriptionState.summary : "";

  function handleAddField() {
    addDescriptionField("Details");
  }

  function handleKeyChange(field, newKey) {
    if (!field.isTopLevel) {
      updateDescriptionFieldKey(field.section, field.index, newKey);
    }
  }

  function handleValueChange(field, newValue) {
    if (!field.isTopLevel) {
      updateDescriptionFieldValue(field.section, field.index, newValue);
    }
  }

  function handleRemove(field) {
    if (!field.isTopLevel) {
      removeDescriptionField(field.section, field.index);
    }
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
