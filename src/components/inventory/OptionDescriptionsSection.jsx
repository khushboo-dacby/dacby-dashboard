import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function OptionDescriptionsSection({
  optionDescriptions,
  addOptionDescription,
  updateOptionDescription,
  removeOptionDescription,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Option Descriptions
        </h3>
      </div>

      <div className="space-y-3">
        {optionDescriptions.length > 0 ? (
          optionDescriptions.map((entry, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex flex-col gap-2 relative">
                <div className="flex gap-2 pr-12">
                  <input
                    value={entry.option}
                    onChange={(event) =>
                      updateOptionDescription(index, "option", event.target.value)
                    }
                    placeholder="Key (e.g., Visible Marks)"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium"
                  />
                </div>
                <textarea
                  value={entry.description}
                  onChange={(event) =>
                    updateOptionDescription(
                      index,
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Description"
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => removeOptionDescription(index)}
                  className="absolute top-0 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No option descriptions set.</p>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addOptionDescription}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" /> Add Description
          </button>
        </div>
      </div>
    </div>
  );
}
