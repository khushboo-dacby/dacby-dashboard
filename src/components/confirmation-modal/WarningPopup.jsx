"use client";

import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function WarningPopup({
  title = "Save these changes?",
  message = "Please confirm that you want to update this variant.",
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  isConfirming = false,
  onClose,
  onCancel,
  onConfirm,
}) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="warning-title"
        aria-describedby="warning-description"
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-9 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose || onCancel}
          aria-label="Close save confirmation"
          className="absolute right-5 top-5 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-400 text-white ring-4 ring-amber-100">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h2 id="warning-title" className="mt-8 text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        <p id="warning-description" className="mt-4 text-base leading-7 text-slate-500">
          {message}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="cursor-pointer rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
