function SelectedColorSwatch({ value, colorCodes }) {
  const normalizedValue =
    typeof value === "string" ? value : value != null ? String(value) : "";
  const colorCode = colorCodes.find((c) => c.name === value);
  const hex = colorCode
    ? colorCode.hex
    : normalizedValue.startsWith("#")
      ? normalizedValue
      : null;

  return hex ? (
    <div
      className="w-6 h-6 rounded border"
      style={{ background: hex }}
      title={value}
    ></div>
  ) : null;
}

export default function CombinationAttributesFields({
  item,
  vendorIndex,
  itemIndex,
  specification,
  updateItemAttribute,
  addColorCodeFromVariant,
  addValueToCombination,
  updateItemAttributeKey,
  finalizeItemAttributeKey,
  saveItemAttributeValue,
  removeItemAttribute,
  addItemAttribute,
}) {
  if (
    !(specification.combinations || []).length ||
    !item.combination_name ||
    (specification.attributeDefinitions || []).length
  ) {
    return null;
  }

  const comb =
    (specification.combinations || []).find(
      (c) => c.name === item.combination_name,
    ) || { attributes: [] };
  const showDedicatedColor =
    item.combination_name && comb && !!comb.include_colors;
  const colorCodes = specification.color_codes || [];
  const isColorAttribute = (key) =>
    String(key || "").trim().toLowerCase().includes("color");

  const combinationAttributes = (comb.attributes || []).filter((attr) => {
    if (showDedicatedColor && isColorAttribute(attr.key)) return false;
    return true;
  });

  const customAttributeKeys = Object.keys(item.attributes || {}).filter(
    (key) =>
      !(
        (
          (specification.combinations || []).find(
            (c) => c.name === item.combination_name,
          ) || { attributes: [] }
        ).attributes || []
      ).some((attr) => attr.key === key),
  );

  function addCombinationValue(e, attrKey) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = (e.target.value || "").trim();
    if (!value) return;

    if (item.combination_name) {
      addValueToCombination(item.combination_name, attrKey, value);
    }

    updateItemAttribute(vendorIndex, itemIndex, attrKey, value);
    e.target.value = "";
  }

  function addColorValue(e, attrKey) {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const name = (e.target.value || "").trim();
    const colorInput = e.target.parentElement.querySelector(
      'input[type="color"]',
    );
    const hex = colorInput ? colorInput.value : "#000000";

    if (name) {
      addColorCodeFromVariant(name, hex);
      addValueToCombination(item.combination_name, attrKey, name);
      updateItemAttribute(vendorIndex, itemIndex, attrKey, name);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Combination Attributes
      </label>
      <div className="space-y-2">
        {combinationAttributes.map((attr, attrIndex) => (
          <div key={attrIndex} className="flex gap-2 items-center">
            <div className="w-40 text-sm font-medium text-slate-700">
              {attr.key}
            </div>

            <div className="flex-1">
              {Array.isArray(attr.values) && attr.values.length > 0 ? (
                <div className="flex gap-2">
                  {attr.key &&
                  attr.key.toLowerCase().includes("color") &&
                  colorCodes.length > 0 ? (
                    <div className="flex-1 flex items-center gap-2">
                      <select
                        className="flex-1 border rounded px-3 py-2"
                        value={(item.attributes || {})[attr.key] || ""}
                        onChange={(e) =>
                          updateItemAttribute(
                            vendorIndex,
                            itemIndex,
                            attr.key,
                            e.target.value,
                          )
                        }
                      >
                        <option className="bg-white text-slate-900" value="">
                          Select color
                        </option>

                        {colorCodes.map((colorCode, colorIndex) => (
                          <option
                            className="bg-white text-slate-900"
                            key={colorIndex}
                            value={colorCode.name}
                          >
                            {colorCode.name} — {colorCode.hex}
                          </option>
                        ))}

                        {attr.values
                          .filter(
                            (value) =>
                              !colorCodes.some(
                                (colorCode) => colorCode.name === value,
                              ),
                          )
                          .map((value, valueIndex) => (
                            <option
                              className="bg-white text-slate-900"
                              key={valueIndex}
                              value={value}
                            >
                              {value}
                            </option>
                          ))}
                      </select>

                      <SelectedColorSwatch
                        value={(item.attributes || {})[attr.key]}
                        colorCodes={colorCodes}
                      />

                      <input
                        placeholder="Name"
                        className="border rounded px-2 py-1 w-32"
                        onKeyDown={(e) => addColorValue(e, attr.key)}
                      />

                      <input
                        type="color"
                        className="w-10 h-8 p-0 border rounded"
                        defaultValue="#000000"
                      />
                    </div>
                  ) : (
                    <select
                      className="flex-1 border rounded px-3 py-2"
                      value={(item.attributes || {})[attr.key] || ""}
                      onChange={(e) =>
                        updateItemAttribute(
                          vendorIndex,
                          itemIndex,
                          attr.key,
                          e.target.value,
                        )
                      }
                    >
                      <option className="bg-white text-slate-900" value="">
                        Select
                      </option>

                      {attr.values.map((value, valueIndex) => (
                        <option
                          className="bg-white text-slate-900"
                          key={valueIndex}
                          value={value}
                        >
                          {value}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    placeholder="Add value"
                    className="border rounded px-2 py-1 w-40"
                    onKeyDown={(e) => addCombinationValue(e, attr.key)}
                  />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-3 py-2"
                    value={(item.attributes || {})[attr.key] || ""}
                    onChange={(e) =>
                      updateItemAttribute(
                        vendorIndex,
                        itemIndex,
                        attr.key,
                        e.target.value,
                      )
                    }
                  />

                  <input
                    placeholder="Add value"
                    className="border rounded px-2 py-1 w-40"
                    onKeyDown={(e) => addCombinationValue(e, attr.key)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {customAttributeKeys.map((customKey, customKeyIndex) => (
          <div key={customKeyIndex} className="flex gap-2 items-center">
            <input
              className="border rounded px-2 py-1 w-40"
              value={customKey}
              onChange={(e) =>
                updateItemAttributeKey(
                  vendorIndex,
                  itemIndex,
                  customKey,
                  e.target.value,
                )
              }
              onBlur={() =>
                finalizeItemAttributeKey(vendorIndex, itemIndex, customKey)
              }
            />
            <input
              className="flex-1 border rounded px-3 py-2"
              value={(item.attributes || {})[customKey] || ""}
              onChange={(e) =>
                updateItemAttribute(
                  vendorIndex,
                  itemIndex,
                  customKey,
                  e.target.value,
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveItemAttributeValue(vendorIndex, itemIndex, customKey);
                }
              }}
            />
            <button
              type="button"
              className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
              onClick={() =>
                removeItemAttribute(vendorIndex, itemIndex, customKey)
              }
            >
              Remove
            </button>
          </div>
        ))}

        <div>
          <button
            type="button"
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={() => addItemAttribute(vendorIndex, itemIndex)}
          >
            + Add Attribute
          </button>
        </div>
      </div>
    </div>
  );
}
