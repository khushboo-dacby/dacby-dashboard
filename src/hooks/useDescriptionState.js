import { useState } from "react";
import { formatDescriptionKey } from "@/utils/formatters";

const defaultDescription = {
  summary: "",
  fields: [],
};

export default function useDescriptionState(initialDescription = defaultDescription) {
  const [description, setDescription] = useState(initialDescription);

  function resetDescription(nextDescription = defaultDescription) {
    setDescription(nextDescription);
  }

  function updateSummary(value) {
    setDescription((prev) => ({ ...prev, summary: value }));
  }

  function addDescriptionField() {
    setDescription((prev) => ({
      ...prev,
      fields: [
        ...(prev.fields || []),
        { key: "", value: "", valueType: "single" },
      ],
    }));
  }

  function updateDescriptionFieldKey(idx, newKey) {
    setDescription((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((field, i) =>
        i === idx
          ? { ...field, key: formatDescriptionKey(newKey, { trimEnd: false }) }
          : field,
      ),
    }));
  }

  function finalizeDescriptionFieldKey(idx, key) {
    setDescription((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((field, i) =>
        i === idx ? { ...field, key: formatDescriptionKey(key) } : field,
      ),
    }));
  }

  function updateDescriptionFieldValue(idx, newValue) {
    setDescription((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((field, i) =>
        i === idx ? { ...field, value: newValue } : field,
      ),
    }));
  }

  function updateDescriptionFieldValueType(idx, valueType) {
    setDescription((prev) => ({
      ...prev,
      fields: (prev.fields || []).map((field, i) =>
        i === idx ? { ...field, valueType } : field,
      ),
    }));
  }

  function removeDescriptionField(idx) {
    setDescription((prev) => ({
      ...prev,
      fields: (prev.fields || []).filter((_, i) => i !== idx),
    }));
  }

  function updateDescriptionTopLevelField(oldKey, newKey, newValue) {
    setDescription((prev) => {
      const next = { ...prev };

      if (oldKey && oldKey !== newKey && Object.prototype.hasOwnProperty.call(next, oldKey)) {
        delete next[oldKey];
      }

      if (!newKey) {
        return next;
      }

      next[newKey] = newValue;
      return next;
    });
  }

  function removeDescriptionTopLevelField(key) {
    if (!key) return;

    setDescription((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  return {
    description,
    setDescription,
    resetDescription,
    updateSummary,
    addDescriptionField,
    updateDescriptionFieldKey,
    finalizeDescriptionFieldKey,
    updateDescriptionFieldValue,
    updateDescriptionFieldValueType,
    removeDescriptionField,
    updateDescriptionTopLevelField,
    removeDescriptionTopLevelField,
  };
}
