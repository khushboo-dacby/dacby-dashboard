import { useState } from "react";
import { formatDescriptionKey } from "@/utils/formatters";

const defaultDescription = {
  summary: "",
  Global_Attributes: [],
  Performance: [],
  Connectivity: [],
  Design: [],
};

export default function useDescriptionState(initialDescription = defaultDescription) {
  const [description, setDescription] = useState(initialDescription);

  function resetDescription(nextDescription = defaultDescription) {
    setDescription(nextDescription);
  }

  function updateSummary(value) {
    setDescription((prev) => ({ ...prev, summary: value }));
  }

  function addDescriptionField(section) {
    setDescription((prev) => ({
      ...prev,
      [section]: [
        ...(prev[section] || []),
        { key: "", value: "", valueType: "single" },
      ],
    }));
  }

  function addDescriptionSection(name) {
    const sectionName = formatDescriptionKey(name);
    if (!sectionName) return;
    setDescription((prev) => {
      if (prev[sectionName]) return prev;
      return { ...prev, [sectionName]: [] };
    });
  }

  function removeDescriptionSection(name) {
    if (!name || name === "summary") return;
    setDescription((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }

  function renameDescriptionSection(oldName, newName) {
    const sectionName = formatDescriptionKey(newName, { trimEnd: false });
    if (!oldName || !sectionName || oldName === "summary") return;
    setDescription((prev) => {
      if (!prev[oldName]) return prev;
      const copy = { ...prev };
      copy[sectionName] = copy[oldName];
      delete copy[oldName];
      return copy;
    });
  }

  function finalizeDescriptionSection(oldName) {
    const sectionName = formatDescriptionKey(oldName);
    if (!sectionName || sectionName === oldName) return;
    renameDescriptionSection(oldName, sectionName);
  }

  function updateDescriptionFieldKey(section, idx, newKey) {
    setDescription((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field, i) =>
        i === idx
          ? { ...field, key: formatDescriptionKey(newKey, { trimEnd: false }) }
          : field,
      ),
    }));
  }

  function finalizeDescriptionFieldKey(section, idx, key) {
    setDescription((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field, i) =>
        i === idx ? { ...field, key: formatDescriptionKey(key) } : field,
      ),
    }));
  }

  function updateDescriptionFieldValue(section, idx, newValue) {
    setDescription((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field, i) =>
        i === idx ? { ...field, value: newValue } : field,
      ),
    }));
  }

  function updateDescriptionFieldValueType(section, idx, valueType) {
    setDescription((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((field, i) =>
        i === idx ? { ...field, valueType } : field,
      ),
    }));
  }

  function removeDescriptionField(section, idx) {
    setDescription((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_, i) => i !== idx),
    }));
  }

  return {
    description,
    resetDescription,
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
  };
}
