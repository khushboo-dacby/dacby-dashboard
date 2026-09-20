import React, { useState } from "react";
import { Plus } from "lucide-react";

function normalizeHexColor(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("#")) return trimmed;
  return trimmed.length === 3 || trimmed.length === 6 ? `#${trimmed}` : trimmed;
}

function isHexColorValue(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return false;
  const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
  return /^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withoutHash);
}

export default function ColorCodeSection({
  specification,
  addColorCode,
  updateColorCode,
  removeColorCode,
  addColorCodesFromText,
}) {
  const [colorCodeInputText, setColorCodeInputText] = useState("");

  function handleApplyColorCodeText() {
    if (!addColorCodesFromText) return;
    addColorCodesFromText(colorCodeInputText);
    setColorCodeInputText("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Color Codes</h3>
          <p className="text-sm text-slate-500">Map specific hex codes to color names used in variants.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
          onClick={addColorCode}
        >
          <Plus className="h-4 w-4" /> Add Color
        </button>
      </div>

      <div className="space-y-4">

        {specification.color_codes && specification.color_codes.map((c, ci) => (
          <div
            key={ci}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-end"
          >
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Color Name
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={c.name}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (isHexColorValue(nextValue)) {
                    updateColorCode(ci, "hex", normalizeHexColor(nextValue));
                    updateColorCode(ci, "name", "");
                  } else {
                    updateColorCode(ci, "name", nextValue);
                  }
                }}
                placeholder="Space Gray"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
                  value={c.hex || "#000000"}
                  onChange={(e) => updateColorCode(ci, "hex", e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-auto">
              <button
                type="button"
                className="w-full rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 md:w-auto"
                onClick={() => removeColorCode(ci)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
