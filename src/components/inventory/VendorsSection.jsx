import CombinationAttributesFields from "@/components/inventory/CombinationAttributesFields";
import DedicatedColorSelector from "@/components/inventory/DedicatedColorSelector";
import ItemDetailsFields from "@/components/inventory/ItemDetailsFields";
import VariantAttributeDefinitionsFields from "@/components/inventory/VariantAttributeDefinitionsFields";
import VendorDetailsFields from "@/components/inventory/VendorDetailsFields";

export default function VendorsSection({
  vendors,
  specification,
  specId,
  addVendor,
  updateVendor,
  removeVendor,
  addItemToVendor,
  removeItem,
  updateItem,
  updateItemAttribute,
  addSpecificationValueFromItem,
  addColorCodeFromVariant,
  addValueToCombination,
  updateItemAttributeKey,
  finalizeItemAttributeKey,
  saveItemAttributeValue,
  removeItemAttribute,
  addItemAttribute,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Vendors</h3>
        <button
          type="button"
          className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          onClick={addVendor}
        >
          + Add Vendor
        </button>
      </div>
      <div className="space-y-4">
        {vendors.map((vendor, vendorIndex) => (
          <div
            key={vendorIndex}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <VendorDetailsFields
              vendor={vendor}
              vendorIndex={vendorIndex}
              updateVendor={updateVendor}
              removeVendor={removeVendor}
            />

            <div className="mt-3">
              <div className="mb-3">
                <h4 className="font-medium text-slate-900">Items / Variants</h4>
              </div>
              <div className="space-y-3">
                {vendor.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      <VariantAttributeDefinitionsFields
                        item={item}
                        vendorIndex={vendorIndex}
                        itemIndex={itemIndex}
                        specification={specification}
                        updateItemAttribute={updateItemAttribute}
                        addSpecificationValueFromItem={
                          addSpecificationValueFromItem
                        }
                      />

                      <DedicatedColorSelector
                        item={item}
                        vendorIndex={vendorIndex}
                        itemIndex={itemIndex}
                        specification={specification}
                        updateItemAttribute={updateItemAttribute}
                        addColorCodeFromVariant={addColorCodeFromVariant}
                        addValueToCombination={addValueToCombination}
                      />

                      <CombinationAttributesFields
                        item={item}
                        vendorIndex={vendorIndex}
                        itemIndex={itemIndex}
                        specification={specification}
                        updateItemAttribute={updateItemAttribute}
                        addColorCodeFromVariant={addColorCodeFromVariant}
                        addValueToCombination={addValueToCombination}
                        updateItemAttributeKey={updateItemAttributeKey}
                        finalizeItemAttributeKey={finalizeItemAttributeKey}
                        saveItemAttributeValue={saveItemAttributeValue}
                        removeItemAttribute={removeItemAttribute}
                        addItemAttribute={addItemAttribute}
                      />

                      <ItemDetailsFields
                        item={item}
                        vendorIndex={vendorIndex}
                        itemIndex={itemIndex}
                        specId={specId}
                        updateItem={updateItem}
                      />
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                        onClick={() => removeItem(vendorIndex, itemIndex)}
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button
                  type="button"
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  onClick={() => addItemToVendor(vendorIndex)}
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
