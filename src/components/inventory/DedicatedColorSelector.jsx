export default function DedicatedColorSelector({
  item,
  vendorIndex,
  itemIndex,
  specification,
  updateItemAttribute,
  addColorCodeFromVariant,
  addValueToCombination,
}) {
  if (
    !item.combination_name ||
    (specification.attributeDefinitions || []).length
  ) {
    return null;
  }

  const comb =
    (specification.combinations || []).find(
      (c) => c.name === item.combination_name,
    ) || null;
  const showColors = comb
    ? !!comb.include_colors
    : (specification.color_codes || []).length > 0;

  if (!showColors) return null;

  const attrKey = "color";
  const selected = (item.attributes || {})[attrKey];
  const normalizedSelected =
    typeof selected === "string"
      ? selected
      : selected != null
        ? String(selected)
        : "";
  const colorCode = (specification.color_codes || []).find(
    (c) => c.name === selected,
  );
  const hex = colorCode
    ? colorCode.hex
    : normalizedSelected.startsWith("#")
      ? normalizedSelected
      : null;

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium mb-1">Color</label>
      <div className="flex items-center gap-2">
        <select
          className="flex-1 border rounded px-3 py-2"
          value={(item.attributes || {})[attrKey] || ""}
          onChange={(e) =>
            updateItemAttribute(
              vendorIndex,
              itemIndex,
              attrKey,
              e.target.value,
            )
          }
        >
          <option className="bg-white text-slate-900" value="">
            Select color
          </option>
          {(specification.color_codes || []).map((cc, ci) => (
            <option className="bg-white text-slate-900" key={ci} value={cc.name}>
              {cc.name} — {cc.hex}
            </option>
          ))}
        </select>
        <input
          placeholder="Add color name"
          className="border rounded px-2 py-1 w-36"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const name = (e.target.value || "").trim();
              const colorInput = e.target.parentElement.querySelector(
                'input[type="color"]',
              );
              const colorHex = colorInput ? colorInput.value : "#000000";
              if (name) {
                addColorCodeFromVariant(name, colorHex);
                if (comb) addValueToCombination(comb.name, attrKey, name);
                updateItemAttribute(vendorIndex, itemIndex, attrKey, name);
                e.target.value = "";
              }
            }
          }}
        />
        <input
          type="color"
          className="w-10 h-8 p-0 border rounded"
          defaultValue="#000000"
        />
        {hex ? (
          <div
            className="w-6 h-6 rounded border"
            style={{ background: hex }}
            title={selected}
          ></div>
        ) : null}
      </div>
    </div>
  );
}
