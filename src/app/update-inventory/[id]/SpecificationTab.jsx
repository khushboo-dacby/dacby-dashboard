"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import DescriptionEditor from "@/components/inventory/DescriptionEditor";
import ImagePreview from "@/components/inventory/ImagePreview";

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value ?? null));
}

function safeSpec(spec) {
  return spec && typeof spec === "object" ? spec : {};
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeQuestionOptions(options, type = "checkbox") {
  if (!Array.isArray(options)) return [];
  return options.map((option) => {
    if (type === "radio" || type === "dropdown") {
      return typeof option === "string" ? option : option?.label ?? "";
    }
    if (typeof option === "string") return { label: option, deduction: 0, icon: "" };
    if (option && typeof option === "object") {
      return {
        label: option.label ?? "",
        deduction: Number(option.deduction) || 0,
        icon: option.icon ?? "",
      };
    }
    return { label: "", deduction: 0, icon: "" };
  });
}

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

function isFieldArray(value) {
  return Array.isArray(value)
    && value.every((item) => item && typeof item === "object" && typeof item.key === "string");
}

function convertValueToField(value) {
  if (Array.isArray(value)) {
    const isPrimitiveArray = value.every(
      (item) => item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
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

  if (parsed?.summary !== undefined) {
    result.summary = typeof parsed.summary === "string" ? parsed.summary : JSON.stringify(parsed.summary);
  }

  Object.keys(parsed || {}).forEach((key) => {
    if (key === "summary") return;
    const sectionValue = parsed[key];

    if (isFieldArray(sectionValue)) {
      result[key] = sectionValue;
      return;
    }

    if (sectionValue === null || typeof sectionValue !== "object" || Array.isArray(sectionValue)) {
      result[key] = [convertValueToField(sectionValue)];
      return;
    }

    const sectionFields = Object.keys(sectionValue).map((fieldKey) => {
      const fieldValue = sectionValue[fieldKey];

      if (Array.isArray(fieldValue)) {
        const isPrimitiveArray = fieldValue.every(
          (item) => item === null || item === undefined || ["string", "number", "boolean"].includes(typeof item),
        );
        if (isPrimitiveArray) {
          return {
            key: String(fieldKey),
            value: fieldValue.map((item) => (item === null ? "null" : String(item))).join("\n"),
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
        value: fieldValue === undefined || fieldValue === null ? "" : String(fieldValue),
        valueType: "single",
      };
    });

    result[key] = sectionFields;
  });

  return result;
}

function renderPrimitiveInput(value, onChange, multiline = false) {
  if (multiline) {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    );
  }

  return (
    <input
      value={String(value ?? "")}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

// function ImagePreviewCell({ imageUrl }) {
//   const [isBroken, setIsBroken] = useState(false);

//   const normalizedUrl = typeof imageUrl === "string" ? imageUrl.trim() : "";

//   if (!normalizedUrl) {
//     return (
//       <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-100 text-[10px] font-medium text-slate-400">
//         No
//       </div>
//     );
//   }

//   return (
//     <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
//       {isBroken ? null : (
//         <img
//           src={normalizedUrl}
//           alt=""
//           className="h-full w-full object-contain"
//           onError={() => setIsBroken(true)}
//         />
//       )}
//     </div>
//   );
// }

function ImagePreviewCell({ imageUrl }) {
  const normalizedUrl =
    typeof imageUrl === "string" ? imageUrl.trim() : "";

  const [isBroken, setIsBroken] = useState(false);

  useEffect(() => {
    setIsBroken(false);
  }, [normalizedUrl]);

  if (!normalizedUrl) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-100 text-[9px] font-medium text-slate-400">
        No image
      </div>
    );
  }

  if (isBroken) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-100 text-[9px] font-medium text-slate-400">
        Error
      </div>
    );
  }

  return (
    <PhotoView src={normalizedUrl}>
      <button
        type="button"
        className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-0 hover:border-blue-400"
        title="Preview image"
      >
        <img
          src={normalizedUrl}
          alt="Preview"
          className="h-full w-full object-contain"
          onError={() => setIsBroken(true)}
        />
      </button>
    </PhotoView>
  );
}
export default function SpecificationTab({ spec, onChange, specId }) {
  const safe = useMemo(() => safeSpec(spec), [spec]);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    questions: true,
  });

  const [descriptionForm, setDescriptionForm] = useState(() =>
    convertDescriptionObjectToFormState(safe.description ?? {}),
  );
  const hasHydratedDescriptionRef = useRef(false);

  useEffect(() => {
    if (!spec || hasHydratedDescriptionRef.current) return;
    setDescriptionForm(convertDescriptionObjectToFormState(spec?.description ?? {}));
    hasHydratedDescriptionRef.current = true;
  }, [spec]);

  function syncDescriptionForm(nextDescription) {
    updateSpec((next) => {
      const updated = clone(next ?? {});
      updated.description = serializeDescriptionState(nextDescription);
      return updated;
    });
  }

  function updateDescriptionSummary(value) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }), summary: value };
      syncDescriptionForm(next);
      return next;
    });
  }

  function addDescriptionSection(name) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const sectionName = String(name || "").trim();
      if (!sectionName) return next;
      if (!next[sectionName]) next[sectionName] = [];
      syncDescriptionForm(next);
      return next;
    });
  }

  function removeDescriptionSection(sectionName) {
    setDescriptionForm((current) => {
      if (!sectionName || sectionName === "summary") return current;
      const next = { ...(current ?? { summary: "" }) };
      delete next[sectionName];
      syncDescriptionForm(next);
      return next;
    });
  }

  function renameDescriptionSection(oldName, newName) {
    setDescriptionForm((current) => {
      if (!oldName || !newName || oldName === "summary") return current;
      const next = { ...(current ?? { summary: "" }) };
      const trimmed = String(newName).trim();
      if (!trimmed || trimmed === oldName) return next;
      if (!next[oldName]) return next;
      next[trimmed] = next[oldName];
      delete next[oldName];
      syncDescriptionForm(next);
      return next;
    });
  }

  function finalizeDescriptionSection(sectionName) {
    setDescriptionForm((current) => {
      if (!sectionName || !current?.[sectionName]) return current;
      const next = { ...(current ?? { summary: "" }) };
      const trimmed = String(sectionName).trim();
      if (!trimmed || trimmed === sectionName) return next;
      next[trimmed] = next[sectionName];
      delete next[sectionName];
      syncDescriptionForm(next);
      return next;
    });
  }

  function addDescriptionField(sectionName) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      next[sectionName] = [...(next[sectionName] || []), { key: "", value: "", valueType: "single" }];
      syncDescriptionForm(next);
      return next;
    });
  }

  function updateDescriptionFieldKey(sectionName, index, newKey) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const fields = [...(next[sectionName] || [])];
      fields[index] = { ...(fields[index] ?? {}), key: newKey };
      next[sectionName] = fields;
      syncDescriptionForm(next);
      return next;
    });
  }

  function finalizeDescriptionFieldKey(sectionName, index, newKey) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const fields = [...(next[sectionName] || [])];
      fields[index] = { ...(fields[index] ?? {}), key: String(newKey || "").trim() };
      next[sectionName] = fields;
      syncDescriptionForm(next);
      return next;
    });
  }

  function updateDescriptionFieldValue(sectionName, index, newValue) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const fields = [...(next[sectionName] || [])];
      fields[index] = { ...(fields[index] ?? {}), value: newValue };
      next[sectionName] = fields;
      syncDescriptionForm(next);
      return next;
    });
  }

  function updateDescriptionFieldValueType(sectionName, index, newType) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const fields = [...(next[sectionName] || [])];
      fields[index] = { ...(fields[index] ?? {}), valueType: newType };
      next[sectionName] = fields;
      syncDescriptionForm(next);
      return next;
    });
  }

  function removeDescriptionField(sectionName, index) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      const fields = [...(next[sectionName] || [])];
      next[sectionName] = fields.filter((_, itemIndex) => itemIndex !== index);
      syncDescriptionForm(next);
      return next;
    });
  }

  function resetDescription(nextDescription) {
    const safeDescription = nextDescription && typeof nextDescription === "object"
      ? nextDescription
      : { summary: "" };
    setDescriptionForm(safeDescription);
    syncDescriptionForm(safeDescription);
  }

  function updateDescriptionTopLevelField(oldKey, newKey, newValue) {
    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };

      if (oldKey && oldKey !== newKey && Object.prototype.hasOwnProperty.call(next, oldKey)) {
        delete next[oldKey];
      }

      if (!newKey) {
        syncDescriptionForm(next);
        return next;
      }

      next[newKey] = newValue;
      syncDescriptionForm(next);
      return next;
    });
  }

  function removeDescriptionTopLevelField(key) {
    if (!key) return;

    setDescriptionForm((current) => {
      const next = { ...(current ?? { summary: "" }) };
      delete next[key];
      syncDescriptionForm(next);
      return next;
    });
  }

  function buildIconEntries(configurationIcons) {
    if (!configurationIcons || typeof configurationIcons !== "object") return [];

    return Object.entries(configurationIcons).map(([label, value], index) => ({
      id: `icon-${index}-${label || "empty"}`,
      label: String(label ?? ""),
      value: String(value ?? ""),
    }));
  }

  function buildColorEntries(colorCodes) {
    if (!colorCodes || typeof colorCodes !== "object") return [];

    return Object.entries(colorCodes).map(([name, hex], index) => ({
      id: `color-${index}-${name || "empty"}`,
      name: String(name ?? ""),
      hex: String(hex ?? ""),
    }));
  }

  const hasHydratedEntryStateRef = useRef(false);

  const [iconEntries, setIconEntries] = useState(() => buildIconEntries(spec?.configuration_icons));
  const [colorEntries, setColorEntries] = useState(() => buildColorEntries(spec?.color_codes));

  useEffect(() => {
    if (!spec || hasHydratedEntryStateRef.current) return;

    setIconEntries(buildIconEntries(spec.configuration_icons));
    setColorEntries(buildColorEntries(spec.color_codes));
    hasHydratedEntryStateRef.current = true;
  }, [spec]);

  function updateSpec(mutator) {
    onChange((current) => {
      const next = clone(current ?? {});
      const updated = mutator(next);
      return updated ?? next;
    });
  }

  function setKeyValue(key, value) {
    updateSpec((next) => {
      next[key] = value;
      return next;
    });
  }

  function setNestedValue(path, value) {
    updateSpec((next) => {
      let cursor = next;
      for (let index = 0; index < path.length - 1; index += 1) {
        const segment = path[index];
        const nextSegment = path[index + 1];
        if (cursor[segment] === undefined || cursor[segment] === null || typeof cursor[segment] !== "object") {
          cursor[segment] = Number.isInteger(Number(nextSegment)) ? [] : {};
        }
        cursor = cursor[segment];
      }
      cursor[path[path.length - 1]] = value;
      return next;
    });
  }

  function addBoxItem() {
    updateSpec((next) => {
      const items = Array.isArray(next.whats_in_the_box)
        ? [...next.whats_in_the_box]
        : [];
      items.push({ label: "New item", image_url: "" });
      next.whats_in_the_box = items;
      return next;
    });
  }

  function updateBoxItem(index, field, value) {
    updateSpec((next) => {
      const items = Array.isArray(next.whats_in_the_box)
        ? [...next.whats_in_the_box]
        : [];
      items[index] = {
        ...(items[index] ?? {}),
        [field]: value,
      };
      next.whats_in_the_box = items;
      return next;
    });
  }

  function removeBoxItem(index) {
    updateSpec((next) => {
      const items = Array.isArray(next.whats_in_the_box)
        ? [...next.whats_in_the_box]
        : [];
      next.whats_in_the_box = items.filter((_, itemIndex) => itemIndex !== index);
      return next;
    });
  }

  function syncColorEntries(entries) {
    const nextMap = {};

    entries.forEach((entry) => {
      const name = String(entry?.name ?? "");
      const hex = String(entry?.hex ?? "");

      if (name) {
        nextMap[name] = hex;
      }
    });

    setKeyValue("color_codes", nextMap);
  }

  function updateColorEntry(index, field, value) {
    const entries = [...colorEntries];
    entries[index] = { ...entries[index], [field]: value };
    setColorEntries(entries);
    syncColorEntries(entries);
  }

  function addColorEntry() {
    const entries = [...colorEntries];
    entries.push({
      id: `color-${Date.now()}-${entries.length}`,
      name: "",
      hex: "",
    });
    setColorEntries(entries);
    syncColorEntries(entries);
  }

  function removeColorEntry(index) {
    const entries = [...colorEntries];
    entries.splice(index, 1);
    setColorEntries(entries);
    syncColorEntries(entries);
  }

  function syncIconEntries(entries) {
    const nextMap = {};

    entries.forEach((entry) => {
      const label = String(entry?.label ?? "");
      const value = String(entry?.value ?? "");

      if (label) {
        nextMap[label] = value;
      }
    });

    setKeyValue("configuration_icons", nextMap);
  }

  function updateIconEntry(index, field, value) {
    const entries = [...iconEntries];
    entries[index] = { ...entries[index], [field]: value };
    setIconEntries(entries);
    syncIconEntries(entries);
  }

  function addIconEntry() {
    const entries = [...iconEntries];
    entries.push({
      id: `icon-${Date.now()}-${entries.length}`,
      label: "",
      value: "",
    });
    setIconEntries(entries);
    syncIconEntries(entries);
  }

  function removeIconEntry(index) {
    const entries = [...iconEntries];
    entries.splice(index, 1);
    setIconEntries(entries);
    syncIconEntries(entries);
  }

  function getQuestionEntries() {
    const questions = safe.questions;
    if (!questions || typeof questions !== "object") return [];
    return Object.entries(questions).map(([key, question]) => ({ key, ...question }));
  }

  function updateQuestionField(questionKey, field, value) {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      const question = questions[questionKey] && typeof questions[questionKey] === "object"
        ? { ...questions[questionKey] }
        : {};
      question[field] = value;
      if (field === "type") {
        question.options = normalizeQuestionOptions(question.options || [], value);
      }
      questions[questionKey] = question;
      next.questions = questions;
      return next;
    });
  }

  function addQuestion(type = "radio") {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      const nextIndex = Object.keys(questions).length + 1;
      const key = `q${nextIndex}`;
      questions[key] = {
        question: "",
        type,
        isRequired: type === "radio",
        description: "",
        ...(type === "checkbox" ? {} : { deduction: 0 }),
        options:
          type === "checkbox"
            ? [{ label: "", deduction: 0, icon: "" }]
            : type === "radio"
              ? ["Yes", "No"]
              : ["New Option"],
      };
      next.questions = questions;
      return next;
    });
  }

  function removeQuestion(questionKey) {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      delete questions[questionKey];
      next.questions = Object.fromEntries(
        Object.values(questions).map((question, index) => [
          `q${index + 1}`,
          question,
        ]),
      );
      return next;
    });
  }

  function updateQuestionOption(questionKey, optionIndex, field, value) {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      const question = questions[questionKey] && typeof questions[questionKey] === "object"
        ? { ...questions[questionKey] }
        : {};
      const options = normalizeQuestionOptions(question.options || [], question.type);
      if (question.type === "radio" || question.type === "dropdown") {
        options[optionIndex] = value;
      } else {
        options[optionIndex] = { ...options[optionIndex], [field]: value };
      }
      question.options = options;
      questions[questionKey] = question;
      next.questions = questions;
      return next;
    });
  }

  function addQuestionOption(questionKey) {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      const question = questions[questionKey] && typeof questions[questionKey] === "object"
        ? { ...questions[questionKey] }
        : {};
      const options = normalizeQuestionOptions(question.options || [], question.type);
      options.push(
        question.type === "radio" || question.type === "dropdown"
          ? "New Option"
          : { label: "", deduction: 0, icon: "" },
      );
      question.options = options;
      questions[questionKey] = question;
      next.questions = questions;
      return next;
    });
  }

  function removeQuestionOption(questionKey, optionIndex) {
    updateSpec((next) => {
      const questions = next.questions && typeof next.questions === "object" ? { ...next.questions } : {};
      const question = questions[questionKey] && typeof questions[questionKey] === "object"
        ? { ...questions[questionKey] }
        : {};
      const options = normalizeQuestionOptions(question.options || [], question.type);
      options.splice(optionIndex, 1);
      question.options = options;
      questions[questionKey] = question;
      next.questions = questions;
      return next;
    });
  }

  function DescriptionObjectEditor({ value, path = [] }) {
    if (Array.isArray(value)) {
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(event) => {
              try {
                const parsed = JSON.parse(event.target.value);
                setNestedValue(path, parsed);
              } catch {
                // Intentionally leave invalid JSON in the textarea while the user edits it.
              }
            }}
            rows={5}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      );
    }

    if (value && typeof value === "object") {
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([key, nestedValue]) => (
            <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">{key}</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextValue = clone(value);
                    delete nextValue[key];
                    setNestedValue(path, nextValue);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>

              {nestedValue && typeof nestedValue === "object" ? (
                <DescriptionObjectEditor value={nestedValue} path={[...path, key]} />
              ) : (
                <div className="space-y-2">
                  {typeof nestedValue === "boolean" ? (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(nestedValue)}
                        onChange={(event) => setNestedValue([...path, key], event.target.checked)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      Enabled
                    </label>
                  ) : (
                    renderPrimitiveInput(
                      nestedValue,
                      (nextValue) => setNestedValue([...path, key], nextValue),
                      typeof nestedValue === "string" && nestedValue.includes("\n"),
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                const nextValue = clone(value);
                nextValue[`new_field_${Object.keys(nextValue).length + 1}`] = "";
                setNestedValue(path, nextValue);
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" /> Add field
            </button>
          </div>
        </div>
      );
    }

    return renderPrimitiveInput(value, (nextValue) => setNestedValue(path, nextValue));
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Specification</h2>
            <p className="mt-1 text-sm text-slate-500">{specId || "Shared specification"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Minimum Price</h3>
        </div>
        <div className="max-w-md">
         <input
         className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  type="number"
  value={safe.minimum_price ?? ""}
  onChange={(event) =>
    setKeyValue(
      "minimum_price",
      event.target.value === "" ? "" : Number(event.target.value)
    )
  }
/>
        </div>
      </div>
       <PhotoProvider>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">What&apos;s in the box</h3>
          <button
            type="button"
            onClick={addBoxItem}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>

        <div className="space-y-3">
          {Array.isArray(safe.whats_in_the_box) && safe.whats_in_the_box.length > 0 ? (
            safe.whats_in_the_box.map((item, index) => (
             <div
  key={`box-item-${index}`}
  className="grid items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(220px,0.8fr)_minmax(400px,1.8fr)_48px_48px]"
>
  <textarea
    value={item?.label ?? ""}
    onChange={(event) =>
      updateBoxItem(index, "label", event.target.value)
    }
    placeholder="Label"
    rows={2}
    className="min-h-[44px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

  <input
    value={item?.image_url ?? ""}
    onChange={(event) =>
      updateBoxItem(index, "image_url", event.target.value)
    }
    placeholder="Image URL"
    className="min-w-0 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

<ImagePreview
  imageUrls={item?.image_url ? [item.image_url] : []}
  hw="h-10 w-10"
/>
  <button
    type="button"
    onClick={() => removeBoxItem(index)}
    className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 hover:bg-rose-50"
  >
    <Trash2 className="h-4 w-4" />
  </button>
</div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No box contents configured.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Configuration Icons</h3>
          <button
            type="button"
            onClick={addIconEntry}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add icon
          </button>
        </div>

        <div className="space-y-3">
          {iconEntries.length > 0 ? (
            iconEntries.map((entry, index) => (
              <div key={entry.id} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1.5fr_48px_auto]">
                <input
                  value={entry.label}
                  onChange={(event) => updateIconEntry(index, "label", event.target.value)}
                  placeholder="Key"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={entry.value}
                  onChange={(event) => updateIconEntry(index, "value", event.target.value)}
                  placeholder="https://example.com/icon.png"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <ImagePreview
                  imageUrls={entry.value ? [entry.value] : []}
                  hw="h-10 w-10"
                />
                <button
                  type="button"
                  onClick={() => removeIconEntry(index)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No configuration icons set.</p>
          )}
        </div>
      </div>
      </PhotoProvider>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Color Codes</h3>
          <button
            type="button"
            onClick={addColorEntry}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add color
          </button>
        </div>

        <div className="space-y-3">
          {colorEntries.length > 0 ? (
            colorEntries.map((entry, index) => (
              <div key={entry.id} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_120px_auto]">
                <input
                  value={entry.name}
                  onChange={(event) => updateColorEntry(index, "name", event.target.value)}
                  placeholder="Color name"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="color"
                  value={entry.hex || "#000000"}
                  onChange={(event) => updateColorEntry(index, "hex", event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pr-1"
                />
                <button
                  type="button"
                  onClick={() => removeColorEntry(index)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No color codes configured.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <DescriptionEditor
          description={descriptionForm}
          updateSummary={updateDescriptionSummary}
          addDescriptionSection={addDescriptionSection}
          removeDescriptionSection={removeDescriptionSection}
          renameDescriptionSection={renameDescriptionSection}
          finalizeDescriptionSection={finalizeDescriptionSection}
          addDescriptionField={addDescriptionField}
          updateDescriptionFieldKey={updateDescriptionFieldKey}
          finalizeDescriptionFieldKey={finalizeDescriptionFieldKey}
          updateDescriptionFieldValue={updateDescriptionFieldValue}
          updateDescriptionFieldValueType={updateDescriptionFieldValueType}
          removeDescriptionField={removeDescriptionField}
          resetDescription={resetDescription}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              ["radio", "Add Single-choice"],
              ["checkbox", "Add Multi-choice"],
              ["dropdown", "Add Dropdown"],
            ].map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => addQuestion(type)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {getQuestionEntries().length > 0 ? (
            getQuestionEntries().map(({ key, question, type, isRequired, description, deduction, options }) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-600">{key}</span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(key)}
                    className="inline-flex h-9 min-w-28 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Question
                    <input
                      value={question || ""}
                      onChange={(event) => updateQuestionField(key, "question", event.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <div className="block text-sm font-medium text-slate-700">
                    <span>Type</span>
                    <div className="mt-1 flex h-10 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600">
                      {type || "radio"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(isRequired)}
                      onChange={(event) => updateQuestionField(key, "isRequired", event.target.checked)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    Required
                  </label>
                  {(type === "radio" || type === "dropdown") && (
                    <label className="block text-sm font-medium text-slate-700">
                      Deduction
                      <input
                        type="number"
                        value={Number(deduction) || 0}
                        onChange={(event) => updateQuestionField(key, "deduction", Number(event.target.value) || 0)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </label>
                  )}
                </div>

                <label className="mt-3 block text-sm font-medium text-slate-700">
                  Description
                  <textarea
                    value={description || ""}
                    onChange={(event) => updateQuestionField(key, "description", event.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700">Options</span>
                    <button
                      type="button"
                      onClick={() => addQuestionOption(key)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-2.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(Array.isArray(options) ? options : []).length > 0 ? (
                      (Array.isArray(options) ? options : []).map((option, optionIndex) => {
                        const normalized = typeof option === "string" ? { label: option, deduction: 0, icon: "" } : option;
                        return (
                          <div
                            key={`${key}-option-${optionIndex}`}
                            className={`grid gap-2 rounded-lg border border-slate-200 bg-white p-2 ${
                              type === "checkbox"
                                ? "md:grid-cols-[1.3fr_120px_1fr_auto]"
                                : "md:grid-cols-[minmax(0,1fr)_auto]"
                            }`}
                          >
                            <input
                              value={normalized.label || ""}
                              onChange={(event) => updateQuestionOption(key, optionIndex, type === "radio" || type === "dropdown" ? null : "label", event.target.value)}
                              placeholder="Option label"
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            {type === "checkbox" ? (
                              <>
                                <input
                                  type="number"
                                  value={Number(normalized.deduction) || 0}
                                  onChange={(event) => updateQuestionOption(key, optionIndex, "deduction", Number(event.target.value) || 0)}
                                  placeholder="Deduction"
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                                <input
                                  value={normalized.icon || ""}
                                  onChange={(event) => updateQuestionOption(key, optionIndex, "icon", event.target.value)}
                                  placeholder="Icon"
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                              </>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => removeQuestionOption(key, optionIndex)}
                              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500">No options configured yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No questions configured.</p>
          )}
        </div>
      </div>
    </section>
  );
}
