import { useState } from "react";

export default function useWhatsInTheBoxState(initialItems = []) {
  const [whatsInTheBox, setWhatsInTheBox] = useState(initialItems);

  function resetWhatsInTheBox(nextItems = []) {
    setWhatsInTheBox(nextItems);
  }

  function addBoxItem() {
    setWhatsInTheBox((prev) => [...prev, { image_url: "", label: "" }]);
  }

  function updateBoxItem(idx, key, value) {
    setWhatsInTheBox((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );
  }

  function removeBoxItem(idx) {
    setWhatsInTheBox((prev) => prev.filter((_, i) => i !== idx));
  }

  return {
    whatsInTheBox,
    resetWhatsInTheBox,
    addBoxItem,
    updateBoxItem,
    removeBoxItem,
  };
}
