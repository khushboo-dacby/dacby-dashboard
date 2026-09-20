import React from "react";
import { Plus } from "lucide-react";

export default function PricingRules({ fields, setField }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Pricing Rules</h3>
      </div>
      <div className="grid max-w-2xl gap-6 md:grid-cols-2">
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">Minimum Price</span>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            type="number"
            value={fields.minimum_price ?? ""}
            onChange={(event) =>
              setField("minimum_price", event.target.value === "" ? "" : Number(event.target.value))
            }
          />
        </div>
        <div>
          {fields.fast_pickup_deduction !== undefined && fields.fast_pickup_deduction !== null && fields.fast_pickup_deduction !== "" ? (
            <>
              <span className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                Fast Pickup Deduction
                <button
                  type="button"
                  onClick={() => setField("fast_pickup_deduction", "")}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
                >
                  Remove
                </button>
              </span>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                type="number"
                value={fields.fast_pickup_deduction ?? ""}
                onChange={(event) =>
                  setField("fast_pickup_deduction", event.target.value === "" ? "" : Number(event.target.value))
                }
              />
            </>
          ) : (
            <div className="flex h-full items-end">
              <button
                type="button"
                onClick={() => setField("fast_pickup_deduction", 0)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" /> Add Fast Pickup Deduction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
