import { useState } from "react";

export default function useOptionDescriptionsState(initialDescriptions = []) {
  const [optionDescriptions, setOptionDescriptions] = useState(initialDescriptions);

  function resetOptionDescriptions(nextDescriptions = []) {
    setOptionDescriptions(nextDescriptions);
  }

  function addOptionDescription() {
    setOptionDescriptions((prev) => [...prev, { option: "", description: "" }]);
  }

  function updateOptionDescription(index, field, value) {
    setOptionDescriptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeOptionDescription(index) {
    setOptionDescriptions((prev) => prev.filter((_, i) => i !== index));
  }

  return {
    optionDescriptions,
    resetOptionDescriptions,
    addOptionDescription,
    updateOptionDescription,
    removeOptionDescription,
  };
}
