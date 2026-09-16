"use client";

import { Image as ImageIcon, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function ImagePropagationModal({
  color,
  sameColorCount,
  onApplyAll,
  onApplyOnlyThis,
  onCancel,
}) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-9 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close image propagation modal"
          className="absolute right-5 top-5 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-50 text-blue-600 ring-4 ring-blue-100">
          <ImageIcon className="h-10 w-10" />
        </div>

        <h2 id="image-modal-title" className="mt-6 text-xl font-bold tracking-tight text-slate-950">
          Do you want to apply this image change to all variants with the same color?
        </h2>

        <p id="image-modal-description" className="mt-3 text-sm leading-6 text-slate-500">
          This variant has color <span className="font-semibold text-slate-900">"{color}"</span>. There {sameColorCount === 1 ? "is 1 other variant" : `are ${sameColorCount} other variants`} with the same color.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onApplyAll}
            className="w-full cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Yes, update all same-color variants
          </button>
          <button
            type="button"
            onClick={onApplyOnlyThis}
            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            No, only this variant
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full cursor-pointer rounded-xl px-5 py-2.5 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
