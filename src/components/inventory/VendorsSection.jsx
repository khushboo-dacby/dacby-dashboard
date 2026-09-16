import VendorDetailsFields from "@/components/inventory/VendorDetailsFields";
import CombinationVariantsTable from "@/components/inventory/CombinationVariantsTable";
import { Info } from "lucide-react";

export default function VendorsSection({
  vendors,
  specification,
  addVendor,
  updateVendor,
  removeVendor,
  fields,
  sharedImagesByColor,
  confirmedImageColors,
  onSaveVariant,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Vendors</h3>
        <button
          type="button"
          className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          onClick={addVendor}
          disabled={true}
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
              {(specification.combinations || []).length > 0 ? (
                <CombinationVariantsTable
                  vendorIndex={vendorIndex}
                  items={vendor.items}
                  specification={specification}
                  fields={fields}
                  sharedImagesByColor={sharedImagesByColor}
                  confirmedImageColors={confirmedImageColors}
                  onSaveVariant={onSaveVariant}
                />
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-amber-950">Create combinations before adding variants</h5>
                      <p className="mt-1 text-sm text-amber-800">
                        Variant forms open from the generated combinations table.
                      </p>
                      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-amber-900">
                        <li>Go to Specification and add attribute names with their values.</li>
                        <li>Click Generate from Attributes in the Combinations section.</li>
                        <li>Return here and click Add Variant on each combination row.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
