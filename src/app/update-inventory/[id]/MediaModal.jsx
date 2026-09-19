"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Star, StarOff, AlertTriangle } from "lucide-react";
import { convertFirebaseImageToCdn } from "../../add-variant/AddVariant";

export default function MediaModal({ variant, isEditing, onClose, onApply }) {
  const item = variant?.item || {};
  
  // States for Edit Mode
  const [images, setImages] = useState(Array.isArray(item.images) ? [...item.images].filter(Boolean) : []);
  const [ytIframe, setYtIframe] = useState(item.yt_iframe || "");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [applyToColor, setApplyToColor] = useState(false);

  const hasColor = Boolean(item.color?.trim());

  function handleAddImage() {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, convertFirebaseImageToCdn(newImageUrl.trim())]);
    setNewImageUrl("");
  }

  function handleRemoveImage(indexToRemove) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function handleMakePrimary(index) {
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      copy.unshift(selected);
      return copy;
    });
  }

  function handleSave() {
    const nextItem = {
      ...item,
      images,
      yt_iframe: ytIframe.trim()
    };
    onApply(nextItem, { applyToAllSameColor: applyToColor, color: item.color, images });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? "Edit Variant Media" : "View Variant Media"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {item.sku ? `SKU: ${item.sku}` : "No SKU"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Images Section */}
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Variant Images
              </h3>
              
              {isEditing && (
                <div className="mb-6 flex gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL to add..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddImage}
                    disabled={!newImageUrl.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" /> Add Image
                  </button>
                </div>
              )}

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((url, idx) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={url}
                        alt={`Variant Image ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex justify-between">
                            {idx === 0 ? (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow">
                                <Star className="h-3 w-3 fill-white" /> Primary
                              </span>
                            ) : (
                              <button
                                onClick={() => handleMakePrimary(idx)}
                                className="rounded bg-black/50 p-1.5 text-white transition hover:bg-black"
                                title="Set as primary"
                              >
                                <StarOff className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveImage(idx)}
                              className="rounded bg-rose-500 p-1.5 text-white transition hover:bg-rose-600"
                              title="Delete image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <p className="text-sm text-slate-500">No images provided for this variant.</p>
                </div>
              )}
            </section>

            {/* YouTube Embed Section */}
            <section className="border-t border-slate-100 pt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Variant Video
              </h3>
              
              {isEditing ? (
                <textarea
                  value={ytIframe}
                  onChange={(e) => setYtIframe(e.target.value)}
                  rows={3}
                  placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
                  className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              ) : ytIframe ? (
                <div className="mb-4 rounded-lg bg-slate-50 p-3 font-mono text-xs text-slate-600">
                  {ytIframe}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No video embedded for this variant.</p>
              )}

              {ytIframe && (
                <div className="aspect-video w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
                  <iframe
                    src={ytIframe.match(/src=["']([^"']+)["']/)?.[1] || null}
                    title="Variant Video Preview"
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              )}
            </section>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            {hasColor ? (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={applyToColor}
                  onChange={(e) => setApplyToColor(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Apply images to all variants with color <strong>{item.color}</strong>
              </label>
            ) : <div />}
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Apply Media Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
