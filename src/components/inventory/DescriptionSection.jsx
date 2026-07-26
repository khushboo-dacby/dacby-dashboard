import React, { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
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
      // Fall back to raw string
    }
  }
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "null") return null;
  return value;
}

function serializeDescriptionState(description) {
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
        item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
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

function convertDescriptionObjectToFormState(parsed) {
  const result = { summary: "" };

  if (parsed.summary !== undefined) {
    result.summary =
      typeof parsed.summary === "string"
        ? parsed.summary
        : JSON.stringify(parsed.summary);
  }

  Object.keys(parsed).forEach((key) => {
    if (key === "summary") return;
    const sectionValue = parsed[key];

    if (isFieldArray(sectionValue)) {
      result[key] = sectionValue;
      return;
    }

    if (sectionValue === null || typeof sectionValue !== "object") {
      result[key] = [convertValueToField(sectionValue)];
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
            item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
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

export default function DescriptionSection({
  description,
  updateSummary,
  addDescriptionSection,
  removeDescriptionSection,
  renameDescriptionSection,
  finalizeDescriptionSection,
  addDescriptionField,
  updateDescriptionFieldKey,
  finalizeDescriptionFieldKey,
  updateDescriptionFieldValue,
  updateDescriptionFieldValueType,
  removeDescriptionField,
  resetDescription,
}) {
  const [mode, setMode] = useState("form");
  const [jsonText, setJsonText] = useState(() => createDescriptionJson(description));
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const jsonChangeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(jsonChangeTimeoutRef.current);
  }, []);

  function handleModeChange(nextMode) {
    if (nextMode === "json") {
      setJsonText(createDescriptionJson(description));
      setMessage(null);
      setMessageType("");
    }
    setMode(nextMode);
  }

  function handleJsonChange(nextJsonText) {
    setJsonText(nextJsonText);
    setMessage(null);
    setMessageType("");
    window.clearTimeout(jsonChangeTimeoutRef.current);

    jsonChangeTimeoutRef.current = window.setTimeout(() => {
      const parsedResult = parseJsonWithLocation(nextJsonText);
      if (parsedResult.error) {
        setMessage(parsedResult.error);
        setMessageType("error");
        return;
      }
      if (
        !parsedResult.parsed ||
        typeof parsedResult.parsed !== "object" ||
        Array.isArray(parsedResult.parsed)
      ) {
        setMessage("Description JSON must be an object at the top level.");
        setMessageType("error");
        return;
      }

      const transformedDescription = convertDescriptionObjectToFormState(
        parsedResult.parsed
      );
      resetDescription(transformedDescription);
      setJsonText(createDescriptionJson(transformedDescription));
      setMessage("JSON imported and formatted automatically.");
      setMessageType("success");
    }, 600);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-950">Description</h3>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              mode === "form"
                ? "border-cyan-500 bg-cyan-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("form")}
          >
            Form Mode
          </button>
          <button
            type="button"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              mode === "json"
                ? "border-cyan-500 bg-cyan-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("json")}
          >
            JSON Mode
          </button>
        </div>

        {mode === "form" ? (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Summary</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={description.summary}
                onChange={(e) => updateSummary(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-medium text-slate-900">Description Sections</h4>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="newSectionName"
                  placeholder="New section name"
                  className="border rounded px-2 py-1"
                />
                <button
                  type="button"
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  onClick={() => {
                    const el = document.getElementById("newSectionName");
                    if (el && el.value.trim()) {
                      addDescriptionSection(el.value.trim());
                      el.value = "";
                    }
                  }}
                >
                  + Add Section
                </button>
              </div>
            </div>

            {Object.keys(description)
              .filter((k) => k !== "summary")
              .map((section) => (
                <div
                  key={section}
                  className="mt-4 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        className="border-b border-slate-200 bg-transparent pb-1 font-medium text-slate-900"
                        value={section}
                        onChange={(e) =>
                          renameDescriptionSection(section, e.target.value)
                        }
                        onBlur={() => finalizeDescriptionSection(section)}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="mr-2 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                        onClick={() => addDescriptionField(section)}
                      >
                        + Add Field
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                        onClick={() => removeDescriptionSection(section)}
                      >
                        Remove Section
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    {(description[section] || []).map((f, fi) => (
                      <div
                        key={fi}
                        className="grid grid-cols-1 md:grid-cols-[192px_160px_1fr_auto] gap-2 items-start"
                      >
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="key"
                          value={f.key}
                          onChange={(e) =>
                            updateDescriptionFieldKey(
                              section,
                              fi,
                              e.target.value,
                            )
                          }
                          onBlur={(e) =>
                            finalizeDescriptionFieldKey(
                              section,
                              fi,
                              e.target.value,
                            )
                          }
                        />
                        <select
                          className="border rounded px-2 py-1"
                          value={f.valueType || "single"}
                          onChange={(e) =>
                            updateDescriptionFieldValueType(
                              section,
                              fi,
                              e.target.value,
                            )
                          }
                        >
                          <option className="bg-white text-slate-900" value="single">
                            Single value
                          </option>
                          <option
                            className="bg-white text-slate-900"
                            value="multiple"
                          >
                            Multiple values
                          </option>
                        </select>
                        {f.valueType === "multiple" ? (
                          <textarea
                            rows={2}
                            className="border rounded px-2 py-1"
                            placeholder="One value per line"
                            value={f.value}
                            onChange={(e) =>
                              updateDescriptionFieldValue(
                                section,
                                fi,
                                e.target.value,
                              )
                            }
                          />
                        ) : (
                          <input
                            className="border rounded px-2 py-1"
                            placeholder="value (number or string)"
                            value={f.value}
                            onChange={(e) =>
                              updateDescriptionFieldValue(
                                section,
                                fi,
                                e.target.value,
                              )
                            }
                          />
                        )}
                        <button
                          type="button"
                          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 md:pt-1"
                          onClick={() => removeDescriptionField(section, fi)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {!(description[section] || []).length && (
                      <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                        No fields yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </>
        ) : (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description JSON</label>
              <textarea
                className={editorStyle}
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                spellCheck={false}
              />
            </div>
            {message && (
              <div
                className={`mt-3 rounded-lg px-4 py-3 text-sm ${
                  messageType === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {message}
              </div>
            )}
          </>
        )}
      </div>
      {showPreview && (
        <DescriptionPreviewModal
          description={serializeDescriptionState(description)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
