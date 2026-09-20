import { useState } from "react";

export default function useConfigurationIconsState(initialIcons = []) {
  const [configurationIcons, setConfigurationIcons] = useState(initialIcons);

  function resetConfigurationIcons(nextIcons = []) {
    setConfigurationIcons(nextIcons);
  }

  function addConfigurationIcon() {
    setConfigurationIcons((prev) => [...prev, { label: "", value: "" }]);
  }

  function updateConfigurationIcon(index, field, value) {
    setConfigurationIcons((prev) =>
      prev.map((icon, i) =>
        i === index ? { ...icon, [field]: value } : icon
      )
    );
  }

  function removeConfigurationIcon(index) {
    setConfigurationIcons((prev) => prev.filter((_, i) => i !== index));
  }

  return {
    configurationIcons,
    resetConfigurationIcons,
    addConfigurationIcon,
    updateConfigurationIcon,
    removeConfigurationIcon,
  };
}
