"use client";

import { X } from "lucide-react";
import { createPortal } from "react-dom";

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDetailRows(description) {
  return Object.entries(description || {}).flatMap(([section, sectionValue]) => {
    if (section === "summary" || sectionValue === undefined || sectionValue === "") {
      return [];
    }

    if (sectionValue && typeof sectionValue === "object" && !Array.isArray(sectionValue)) {
      const entries = Object.entries(sectionValue);
      if (entries.length === 1 && entries[0][0] === "value") {
        return [{ label: titleCase(section), value: entries[0][1] }];
      }
      return entries.map(([key, value]) => ({ label: titleCase(key), value }));
    }

    return [{ label: titleCase(section), value: sectionValue }];
  });
}

function DetailValue({ value }) {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1.5 pl-5">
        {value.map((item, index) => (
          <li key={`${String(item)}-${index}`}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (value && typeof value === "object") {
    return <span>{JSON.stringify(value)}</span>;
  }

  return <span>{String(value ?? "—")}</span>;
}

export default function DescriptionPreviewModal({ description, onClose }) {
  const rows = getDetailRows(description);
  const summaryParagraphs = String(description?.summary || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="description-preview-title" className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="description-preview-title" className="text-xl font-semibold text-slate-950">Description Preview</h2>
            <p className="mt-1 text-sm text-slate-500">Customer-facing product details and description.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close description preview" className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto bg-slate-50 p-6 sm:p-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-950">Details</h3>
            {rows.length > 0 ? (
              <dl className="mt-6 divide-y divide-slate-100">
                {rows.map((row, index) => (
                  <div key={`${row.label}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[220px_1fr] sm:gap-8">
                    <dt className="font-medium text-slate-500">{row.label}</dt>
                    <dd className="leading-7 text-slate-800"><DetailValue value={row.value} /></dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No detail fields added.</p>
            )}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-950">Summary</h3>
            {summaryParagraphs.length > 0 ? (
              <div className="mt-5 space-y-5 leading-8 text-slate-700">
                {summaryParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No summary added.</p>
            )}
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
