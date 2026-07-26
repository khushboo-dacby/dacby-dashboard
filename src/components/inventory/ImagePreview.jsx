"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

function isPreviewableImageUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return (
      url.protocol === "https:" &&
      (url.hostname === "dacby-database.web.app" ||
        url.hostname === "firebasestorage.googleapis.com")
    );
  } catch {
    return false;
  }
}

function getOptimizedImageUrl(src) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=2048&q=75`;
}

export default function ImagePreview({ imageUrls }) {
  const previewableImages = imageUrls
    .map((imageUrl) => String(imageUrl || "").trim())
    .filter(isPreviewableImageUrl);

  if (previewableImages.length === 0) return null;

  return (
    <PhotoProvider
      overlayRender={({ images, index, onIndexChange }) =>
        images.length > 1 ? (
          <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-between px-3 sm:px-6">
            <button
              type="button"
              className="pointer-events-auto rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={index === 0}
              onClick={(event) => {
                event.stopPropagation();
                onIndexChange(index - 1);
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              type="button"
              className="pointer-events-auto rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={index === images.length - 1}
              onClick={(event) => {
                event.stopPropagation();
                onIndexChange(index + 1);
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        ) : null
      }
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {previewableImages.map((imageUrl, imageIndex) => (
          <PhotoView key={`${imageUrl}-${imageIndex}`} src={getOptimizedImageUrl(imageUrl)}>
            <button
              type="button"
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label={`Preview item image ${imageIndex + 1}`}
            >
              <Image
                src={imageUrl}
                alt={`Item image ${imageIndex + 1}`}
                fill
                sizes="80px"
                className="object-contain object-center p-1"
              />
            </button>
          </PhotoView>
        ))}
      </div>
    </PhotoProvider>
  );
}
