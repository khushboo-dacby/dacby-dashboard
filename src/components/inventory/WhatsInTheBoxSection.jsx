import { Trash2, Plus } from "lucide-react";
import ImagePreview from "@/components/inventory/ImagePreview";

export default function WhatsInTheBoxSection({
  whatsInTheBox,
  addBoxItem,
  updateBoxItem,
  removeBoxItem,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          What&apos;s in the box
        </h3>
      </div>

      <div className="space-y-3">
        {Array.isArray(whatsInTheBox) && whatsInTheBox.length > 0 ? (
          whatsInTheBox.map((item, index) => (
            <div
              key={`box-item-${index}`}
              className="grid items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[minmax(220px,0.8fr)_minmax(400px,1.8fr)_48px_48px]"
            >
              <textarea
                value={item?.label ?? ""}
                onChange={(event) =>
                  updateBoxItem(index, "label", event.target.value)
                }
                placeholder="Label"
                rows={2}
                className="min-h-[44px] w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                value={item?.image_url ?? ""}
                onChange={(event) =>
                  updateBoxItem(index, "image_url", event.target.value)
                }
                placeholder="Image URL"
                className="min-w-0 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <ImagePreview
                imageUrls={item?.image_url ? [item.image_url] : []}
                hw="h-10 w-10"
              />
              <button
                type="button"
                onClick={() => removeBoxItem(index)}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No box contents configured.</p>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addBoxItem}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add item
          </button>
        </div>
      </div>
    </div>
  );
}
