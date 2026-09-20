import { Plus, Trash2 } from "lucide-react";
import ImagePreview from "@/components/inventory/ImagePreview";

export default function ConfigurationIconsSection({
  configurationIcons,
  addConfigurationIcon,
  updateConfigurationIcon,
  removeConfigurationIcon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Configuration Icons
        </h3>
      </div>

      <div className="space-y-3">
        {configurationIcons.length > 0 ? (
          configurationIcons.map((entry, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1.5fr_48px_auto]"
            >
              <input
                value={entry.label}
                onChange={(event) =>
                  updateConfigurationIcon(index, "label", event.target.value)
                }
                placeholder="Key (e.g., Storage)"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <input
                value={entry.value}
                onChange={(event) =>
                  updateConfigurationIcon(index, "value", event.target.value)
                }
                placeholder="https://example.com/icon.png"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <ImagePreview
                imageUrls={entry.value ? [entry.value] : []}
                hw="h-10 w-10"
              />
              <button
                type="button"
                onClick={() => removeConfigurationIcon(index)}
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No configuration icons set.</p>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addConfigurationIcon}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add icon
          </button>
        </div>
      </div>
    </div>
  );
}
