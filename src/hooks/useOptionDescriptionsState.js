import { useState } from "react";
import { formatAttributeValue } from "@/utils/formatters";

export default function useOptionDescriptionsState(initialDescriptions = []) {
  const [optionDescriptions, setOptionDescriptions] =
    useState(initialDescriptions);

  function resetOptionDescriptions(nextDescriptions = []) {
    setOptionDescriptions(nextDescriptions);
  }

  function getOptionDescription(option) {
    const formattedOption = formatAttributeValue(option);
    const match = (optionDescriptions || []).find(
      (item) => formatAttributeValue(item.option) === formattedOption,
    );
    return match?.description || "";
  }

  function updateOptionDescriptionForValue(option, description) {
    const formattedOption = formatAttributeValue(option);
    if (!formattedOption) return;
    setOptionDescriptions((prev) => {
      const existingIdx = prev.findIndex(
        (item) => formatAttributeValue(item.option) === formattedOption,
      );

      if (!String(description || "").trim()) {
        return existingIdx >= 0
          ? prev.filter((_, i) => i !== existingIdx)
          : prev;
      }

      if (existingIdx >= 0) {
        return prev.map((item, i) =>
          i === existingIdx
            ? { ...item, option: formattedOption, description }
            : item,
        );
      }

      return [...prev, { option: formattedOption, description }];
    });
  }

  function removeOptionDescriptionForValue(option) {
    const formattedOption = formatAttributeValue(option);
    setOptionDescriptions((prev) =>
      prev.filter(
        (item) => formatAttributeValue(item.option) !== formattedOption,
      ),
    );
  }

  function removeOptionDescriptionsForValues(options) {
    const removedValues = new Set(
      (options || []).map((option) => formatAttributeValue(option)),
    );
    if (!removedValues.size) return;
    setOptionDescriptions((prev) =>
      prev.filter(
        (item) => !removedValues.has(formatAttributeValue(item.option)),
      ),
    );
  }

  return {
    optionDescriptions,
    resetOptionDescriptions,
    getOptionDescription,
    updateOptionDescriptionForValue,
    removeOptionDescriptionForValue,
    removeOptionDescriptionsForValues,
  };
}
