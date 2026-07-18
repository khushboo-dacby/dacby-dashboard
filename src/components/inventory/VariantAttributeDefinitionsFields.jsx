import { normalizeAttributeKey } from "@/utils/formatters";

export default function VariantAttributeDefinitionsFields({
  item,
  vendorIndex,
  itemIndex,
  specification,
  updateItemAttribute,
  addSpecificationValueFromItem,
}) {
  const attributes = (specification.attributeDefinitions || []).filter((attr) =>
    String(attr.key || "").trim(),
  );

  if (!attributes.length) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Variant Attributes
      </label>
      <div className="space-y-2">
        {attributes.map((attr, attrIdx) => {
          const attrKey = normalizeAttributeKey(attr.key);
          const values = Array.isArray(attr.values) ? attr.values : [];

          return (
            <div
              key={`${attrKey}-${attrIdx}`}
              className="flex gap-2 items-center"
            >
              <div className="w-40 text-sm font-medium text-slate-700">
                {attr.key}
              </div>
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
                  Select
                </option>
                {values.map((value, valueIdx) => (
                  <option
                    className="bg-white text-slate-900"
                    key={valueIdx}
                    value={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
              <input
                className="border rounded px-2 py-1 w-40"
                placeholder="Add value"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();

                  const value = (e.target.value || "").trim();
                  if (!value) return;

                  addSpecificationValueFromItem(
                    vendorIndex,
                    itemIndex,
                    attrKey,
                    value,
                  );
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
