"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addWarranty } from "@/app/apis/api";
const WARRANTY_OPTIONS = [
  { id: "1-year", label: "1 Year Total Warranty", months: 12 },
  { id: "7-months", label: "7 Months Total Warranty", months: 7 },
  { id: "6-months", label: "6 Months Total Warranty", months: 6 },
];

export default function AddWarrantyModal({ specId, onClose, onSave }) {
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function submit(event) {
    event.preventDefault();
    if (!selectedWarranty) return;

    const payload = {
      spec_id: specId,
      warranties: [
        {
          title: selectedWarranty.label,
          price: Number(price),
        },
      ],
    };
    try {
      const response = await addWarranty(payload);

      toast.success(response?.message || "Warranty added successfully");
      onClose();
    } catch (error) {
      console.error("Failed to add warranty:", error);
      toast.error(error.message || "Failed to add warranty");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="warranty-modal-title"
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="warranty-modal-title"
                className="text-2xl font-bold text-slate-950"
              >
                Select Warranty
              </h2>
              <p className="mt-2 text-base text-slate-500">
                Choose a warranty plan and set its price
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close warranty modal"
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="mt-8 space-y-4"
            role="radiogroup"
            aria-label="Warranty plan"
          >
            {WARRANTY_OPTIONS.map((option) => {
              const isSelected = selectedWarranty?.id === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedWarranty(option)}
                  className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 px-5 py-5 text-left transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    )}
                  </span>

                  <span className="flex-1 text-base font-semibold sm:text-lg">
                    {option.label}
                  </span>

                  {isSelected && <Check className="h-6 w-6 text-blue-600" />}
                </button>
              );
            })}
          </div>

          <label
            className="mt-8 block text-base font-semibold text-slate-700"
            htmlFor="warranty-price"
          >
            Warranty Price
          </label>
          <div className="mt-2 flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="flex items-center border-r border-slate-200 px-4 text-lg text-slate-400">
              ₹
            </span>
            <input
              id="warranty-price"
              type="number"
              min="0"
              step="1"
              required
              value={price}
              onChange={(event) => {
                const value = event.target.value;

                if (value === "" || Number(value) <= 100000) {
                  setPrice(value);
                }
              }}
              className="min-w-0 flex-1 px-4 py-4 text-lg text-slate-950 outline-none"
              placeholder="Enter price"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-blue-100 bg-blue-50/50 px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedWarranty}
            className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save Warranty
          </button>
        </div>
      </form>
    </div>
  );
}
