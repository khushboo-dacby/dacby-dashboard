"use client";

import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function DeletePop({ 
  productName, 
  isDeleting = false, 
  isProcessing = false,
  onCancel, 
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  processingLabel = "Deleting..."
}) {
  const isBusy = isDeleting || isProcessing;
  const activeProcessingLabel = isProcessing ? processingLabel : "Deleting...";
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="relative w-full max-w-md rounded-3xl bg-white px-8 py-9 text-center shadow-2xl">
        <button type="button" disabled={isBusy} onClick={onCancel} aria-label="Close confirmation" className="absolute right-5 top-5 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-rose-500 bg-rose-600 text-white ring-4 ring-rose-100">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h2 id="delete-title" className="mt-8 text-3xl font-bold tracking-tight text-slate-950">{title}</h2>
        <p id="delete-description" className="mt-4 text-base leading-7 text-slate-500">
          {description ? description : (
            <>This action can&apos;t be undone. Confirm deletion of <span className="font-semibold text-slate-700">{productName}</span>.</>
          )}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button type="button" disabled={isBusy} onClick={onCancel} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
          <button type="button" disabled={isBusy} onClick={onConfirm} className="cursor-pointer rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">{isBusy ? activeProcessingLabel : confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
