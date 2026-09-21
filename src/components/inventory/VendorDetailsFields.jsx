export default function VendorDetailsFields({
  vendor,
  vendorIndex,
  updateVendor,
  removeVendor,
}) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 w-full">
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={vendor.name}
            onChange={(e) =>
              updateVendor(vendorIndex, "name", e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          {/* vendor_id, ratings, total_sales removed per request */}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Note</label>
          <textarea
            rows={3}
            className="w-full border rounded px-3 py-2"
            value={vendor.vendor_note}
            onChange={(e) =>
              updateVendor(vendorIndex, "vendor_note", e.target.value)
            }
          />
        </div>
      </div>
      <div className="ml-4">
        <button
          type="button"
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          onClick={() => removeVendor(vendorIndex)}
          disabled={true}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
