import { Pencil } from "lucide-react";
import { getYouTubeEmbedUrl } from "./ProductFields";

export default function ProductVideoSection({ fields, setField }) {
  const youtubePreviewUrl = getYouTubeEmbedUrl(fields.yt_iframe);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Video</h2>
          <p className="text-sm text-slate-500">
            Manage YouTube unboxing or product showcase video embeds for this catalog item.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <span className="block text-sm font-medium text-slate-700 mb-2">
          YouTube embed (yt_iframe)
        </span>
        <textarea
          value={fields.yt_iframe ?? ""}
          onChange={(event) => setField("yt_iframe", event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder='<iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>'
        />
      </div>

      {youtubePreviewUrl && (
        <div className="mt-6">
          <span className="block text-sm font-medium text-slate-700 mb-2">Preview</span>
          <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            <iframe
              src={youtubePreviewUrl}
              title="Product Video Preview"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
