"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

/**
 * Delete Confirmation Modal for Blogs
 * Matches the DACBY design system (DeletePop / WarningPopup)
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {string} props.blogTitle - Heading/title of the blog being deleted
 * @param {boolean} [props.isDeleting=false] - Whether the delete request is in-flight
 * @param {Function} props.onCancel - Called when user cancels or closes modal
 * @param {Function} props.onConfirm - Called when user confirms deletion
 * @param {string} [props.title="Are you sure?"] - Modal title
 * @param {string} [props.description] - Custom description (optional)
 */
export default function DeleteBlogModal({
  isOpen,
  blogTitle = "this blog",
  isDeleting = false,
  onCancel,
  onConfirm,
  title = "Are you sure?",
  description,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onCancel?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onCancel?.();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-9 text-center shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={onCancel}
          aria-label="Close confirmation"
          className="absolute right-5 top-5 cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon Badge matching DeletePop */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-rose-500 bg-rose-600 text-white ring-4 ring-rose-100 shadow-sm">
          <AlertTriangle className="h-10 w-10 stroke-[2.2]" />
        </div>

        {/* Modal Title */}
        <h2
          id="delete-title"
          className="mt-7 text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
        >
          {title}
        </h2>

        {/* Description */}
        <p
          id="delete-description"
          className="mt-3.5 text-sm sm:text-base leading-6 text-slate-500"
        >
          {description ? (
            description
          ) : (
            <>
              This action cannot be undone. Confirm deletion of{" "}
              <span className="font-semibold text-slate-800 break-words">
                &ldquo;{blogTitle}&rdquo;
              </span>
              .
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 transition active:scale-95 shadow-xs"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

