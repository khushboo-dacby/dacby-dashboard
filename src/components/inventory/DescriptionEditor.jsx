import React, { useEffect, useMemo, useRef, useState } from "react";
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
  value,
  onChange,
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
  const descriptionState = value ?? description ?? {};
  const [topLevelFieldRows, setTopLevelFieldRows] = useState(() =>
    getTopLevelFieldRows(descriptionState),
  );
  const [mode, setMode] = useState("form");
  const [jsonText, setJsonText] = useState(() => createDescriptionJson(descriptionState));
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const jsonChangeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(jsonChangeTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (mode === "json") {
      setJsonText(createDescriptionJson(descriptionState));
    }
  }, [descriptionState, mode]);

  useEffect(() => {
    const persistedRows = getTopLevelFieldRows(descriptionState);
    setTopLevelFieldRows((currentRows) => {
      const nextRows = persistedRows.map((row) => {
        const existingRow = currentRows.find((currentRow) => currentRow.key === row.key);
        return existingRow ? { ...existingRow, value: row.value } : row;
      });
      const incompleteRows = currentRows.filter(
        (row) => !row.key.trim() || !row.value.trim(),
      );
      return [...nextRows, ...incompleteRows.filter((row) => !nextRows.some((nextRow) => nextRow.id === row.id))];
    });
  }, [descriptionState]);

  function commitDescription(nextDescription) {
    if (typeof onChange === "function") {
      onChange(nextDescription);
      return;
    }
    if (typeof resetDescription === "function") {
      resetDescription(nextDescription);
    }
  }

  function handleModeChange(nextMode) {
    if (nextMode === "json") {
      setJsonText(createDescriptionJson(descriptionState));
      setMessage(null);
      setMessageType("");
    }
    setMode(nextMode);
  }

  function addTopLevelFieldRow() {
    setTopLevelFieldRows((currentRows) => [
      ...currentRows,
      {
        id: `top-level-field-${Date.now()}-${Math.random()}`,
        key: "",
        value: "",
      },
    ]);
  }

  function updateTopLevelField(rowId, field, nextValue) {
    const nextRows = topLevelFieldRows.map((row) =>
      row.id === rowId ? { ...row, [field]: nextValue } : row,
    );
    setTopLevelFieldRows(nextRows);

    const nextDescription = Object.entries(descriptionState || {}).reduce(
      (result, [key, currentValue]) => {
        if (
          key === "summary" ||
          Array.isArray(currentValue) ||
          (currentValue && typeof currentValue === "object")
        ) {
          result[key] = currentValue;
        }
        return result;
      },
      {},
    );

    nextRows.forEach((row) => {
      const key = row.key.trim();
      const fieldValue = row.value.trim();
      if (key && fieldValue && key !== "summary") {
        nextDescription[key] = row.value;
      }
    });

    commitDescription(nextDescription);
  }

  function removeTopLevelField(rowKey) {
    const nextRows = topLevelFieldRows.filter((row) => row.id !== rowKey);
    setTopLevelFieldRows(nextRows);

    const nextDescription = Object.entries(descriptionState || {}).reduce(
      (result, [key, currentValue]) => {
        if (
          key === "summary" ||
          Array.isArray(currentValue) ||
          (currentValue && typeof currentValue === "object")
        ) {
          result[key] = currentValue;
        }
        return result;
      },
      {},
    );

    nextRows.forEach((row) => {
      const key = row.key.trim();
      const fieldValue = row.value.trim();
      if (key && fieldValue && key !== "summary") {
        nextDescription[key] = row.value;
      }
    });

    commitDescription(nextDescription);
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
        parsedResult.parsed,
      );
      if (typeof onChange === "function") {
        onChange(transformedDescription);
      } else if (typeof resetDescription === "function") {
        resetDescription(transformedDescription);
      }
      setJsonText(createDescriptionJson(transformedDescription));
      setMessage("JSON imported and formatted automatically.");
      setMessageType("success");
    }, 600);
  }

  const summaryText = typeof descriptionState?.summary === "string" ? descriptionState.summary : "";
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Summary</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                rows={5}
                value={summaryText}
                onChange={(event) => updateSummary(event.target.value)}
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="font-medium text-slate-900">Additional Fields</h4>
                <button
                  type="button"
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  onClick={addTopLevelFieldRow}
                >
                  + Add Field
                </button>
              </div>

              <div className="space-y-2">
                {topLevelFieldRows.length > 0 ? (
                  topLevelFieldRows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(180px,1fr)_minmax(220px,1.5fr)_auto]"
                    >
                      <input
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        value={row.key}
                        onChange={(event) =>
                          updateTopLevelField(row.id, "key", event.target.value)
                        }
                      />
                      <input
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                        value={row.value}
                        onChange={(event) =>
                          updateTopLevelField(row.id, "value", event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                        onClick={() => removeTopLevelField(row.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                    No additional top-level fields.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-medium text-slate-900">Description Sections</h4>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="newSectionName"
                  placeholder="New section name"
                  className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  onClick={() => {
                    const input = document.getElementById("newSectionName");
                    if (input && input.value && String(input.value).trim()) {
                      addDescriptionSection(String(input.value).trim());
                      input.value = "";
                    }
                  }}
                >
                  + Add Section
                </button>
              </div>
            </div>

            {Object.keys(descriptionState || {})
              .filter((key) => isFieldArray(descriptionState[key]))
              .map((section) => (
                <div
                  key={section}
                  className="mt-4 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        className="border-b border-slate-200 bg-transparent pb-1 font-medium text-slate-900 outline-none focus:border-cyan-500"
                        value={section}
                        onChange={(event) =>
                          renameDescriptionSection(section, event.target.value)
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
                    {(Array.isArray(descriptionState[section]) ? descriptionState[section] : []).map((field, index) => (
                      <div
                        key={`${section}-${field?.id || index}`}
                        className="grid grid-cols-1 items-start gap-2 md:grid-cols-[192px_160px_minmax(0,1fr)_auto]"
                      >
                        <input
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                          placeholder="key"
                          value={field.key || ""}
                          onChange={(event) =>
                            updateDescriptionFieldKey(
                              section,
                              index,
                              event.target.value,
                            )
                          }
                          onBlur={(event) =>
                            finalizeDescriptionFieldKey(
                              section,
                              index,
                              event.target.value,
                            )
                          }
                        />
                        <select
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                          value={field.valueType || "single"}
                          onChange={(event) =>
                            updateDescriptionFieldValueType(
                              section,
                              index,
                              event.target.value,
                            )
                          }
                        >
                          <option value="single">Single value</option>
                          <option value="multiple">Multiple values</option>
                        </select>
                        {field.valueType === "multiple" ? (
                          <textarea
                            rows={2}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            placeholder="One value per line"
                            value={field.value || ""}
                            onChange={(event) =>
                              updateDescriptionFieldValue(
                                section,
                                index,
                                event.target.value,
                              )
                            }
                          />
                        ) : (
                          <input
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            placeholder="value (number or string)"
                            value={field.value || ""}
                            onChange={(event) =>
                              updateDescriptionFieldValue(
                                section,
                                index,
                                event.target.value,
                              )
                            }
                          />
                        )}
                        <button
                          type="button"
                          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                          onClick={() => removeDescriptionField(section, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {!((description && description[section]) || []).length && (
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
              <label className="mb-2 block text-sm font-medium text-slate-700">Description JSON</label>
              <textarea
                className={editorStyle}
                value={jsonText}
                onChange={(event) => handleJsonChange(event.target.value)}
                spellCheck={false}
              />
            </div>
            {message && (
              <div
                className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
                  messageType === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
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
