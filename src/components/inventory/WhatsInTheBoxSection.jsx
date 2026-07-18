export default function WhatsInTheBoxSection({
  whatsInTheBox,
  addBoxItem,
  updateBoxItem,
  removeBoxItem,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-950">
          What&apos;s in the box
        </h3>
        <button
          type="button"
          className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          onClick={addBoxItem}
        >
          + Add Item
        </button>
      </div>
      {whatsInTheBox.length > 0 && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          {whatsInTheBox.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://"
                  value={item.image_url}
                  onChange={(e) =>
                    updateBoxItem(idx, "image_url", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Compatible Charger"
                  value={item.label}
                  onChange={(e) =>
                    updateBoxItem(idx, "label", e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 md:mb-0.5"
                onClick={() => removeBoxItem(idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
