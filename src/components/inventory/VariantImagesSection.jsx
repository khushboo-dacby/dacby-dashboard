import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Star, StarOff, Eye } from "lucide-react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function VariantImagesSection({ images = [], onChange }) {
  const [newImageUrl, setNewImageUrl] = useState("");

  function handleAddImage() {
    if (!newImageUrl.trim()) return;
    onChange([...images, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function handleRemoveImage(indexToRemove) {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  }

  function handleMakePrimary(indexToMakePrimary) {
    const copy = [...images];
    const [itemToMove] = copy.splice(indexToMakePrimary, 1);
    copy.unshift(itemToMove);
    onChange(copy);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Variant Images
      </h3>

      <div className="mb-6 flex gap-3">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL to add..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      {images.length > 0 ? (
        <PhotoProvider>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {images.map((rawUrl, idx) => {
              const url = typeof rawUrl === 'string' ? rawUrl.trim() : "";
              if (!url) return null;

              const optimizedUrl = `/_next/image?url=${encodeURIComponent(url)}&w=3840&q=75`;

              return (
                <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <PhotoView key={idx} src={optimizedUrl}>
                    <div className="h-full w-full cursor-pointer relative">
                      <Image
                        src={url}
                        alt={`Variant Image ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </PhotoView>
                  <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                    <div className="flex justify-between pointer-events-auto">
                      {idx === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-[10px] font-bold text-white shadow">
                          <Star className="h-3 w-3 fill-white" /> Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleMakePrimary(idx); }}
                          className="rounded bg-black/50 p-1.5 text-white transition hover:bg-black"
                          title="Set as primary"
                        >
                          <StarOff className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                        className="rounded bg-rose-500 p-1.5 text-white transition hover:bg-rose-600"
                        title="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white/70 drop-shadow-md" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </PhotoProvider>
      ) : (
        <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
          <p className="text-sm text-slate-500">No images provided for this variant.</p>
        </div>
      )}
    </div>
  );
}
