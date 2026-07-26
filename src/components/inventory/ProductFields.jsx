import { useState } from "react";
import { brandMap, categories, typeMap } from "@/constants/inventory";

const autoSpecIdByCategory = {
  "Pre Orders": "pre-order",
  "PS5 CDs": "ps5-cds",
  "PS4 CDs": "ps4-cds",
};

function SelectChevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <svg
        className="h-4 w-4 text-slate-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

function getYouTubeEmbedUrl(iframeCode) {
  const sourceMatch = String(iframeCode || "").match(/src=["']([^"']+)["']/i);
  if (!sourceMatch) return "";

  try {
    const url = new URL(sourceMatch[1]);
    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];
    return url.protocol === "https:" && allowedHosts.includes(url.hostname)
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export default function ProductFields({ fields, setField }) {
  const [addingCustomType, setAddingCustomType] = useState(false);
  const [addingCustomBrand, setAddingCustomBrand] = useState(false);
  const autoSpecId = autoSpecIdByCategory[fields.category_name] || "";
  const isSpecIdReadOnly = Boolean(autoSpecId);
  const isPreOrderCategory = fields.category_name === "Pre Orders";
  const isCdCategory =
    fields.category_name === "PS5 CDs" || fields.category_name === "PS4 CDs";
  const showsTypeAndBrand =
    fields.category_name === "Consoles" || fields.category_name === "Cameras";
  const typeOptions = typeMap[fields.category_name] || [];
  const brandOptions = brandMap[fields.category_name] || [];
  const youtubePreviewUrl = getYouTubeEmbedUrl(fields.yt_iframe);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={fields.category_name}
              onChange={(e) => {
                const sel = categories.find((x) => x.name === e.target.value) || {
                  name: "",
                  code: "",
                };
                setField("category_name", sel.name);
                setField("code", sel.code);
                setField("brand", "");
                setField("type", "");
                setAddingCustomType(false);
                setAddingCustomBrand(false);
                setField("spec_id", autoSpecIdByCategory[sel.name] || "");
              }}
            >
              <option className="bg-white text-slate-900" value="">
                Select category
              </option>
              {categories.map((c) => (
                <option
                  className="bg-white text-slate-900"
                  key={c.name}
                  value={c.name}
                >
                  {c.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        {showsTypeAndBrand ? (
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={addingCustomType ? "__other__" : fields.type}
                onChange={(e) => {
                  const value = e.target.value;
                  const isOther = value === "__other__";
                  setAddingCustomType(isOther);
                  setField("type", isOther ? "" : value);
                }}
              >
                <option className="bg-white text-slate-900" value="">
                  Select type
                </option>
                {typeOptions.map((t) => (
                  <option className="bg-white text-slate-900" key={t} value={t}>
                    {t}
                  </option>
                ))}
                <option className="bg-white text-slate-900" value="__other__">
                  Other
                </option>
              </select>
              <SelectChevron />
            </div>
            {addingCustomType ? (
              <input
                autoFocus
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={fields.type}
                placeholder="Enter another type"
                onChange={(e) => setField("type", e.target.value)}
              />
            ) : null}
          </div>
        ) : null}

        {showsTypeAndBrand ? (
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={addingCustomBrand ? "__other__" : fields.brand}
                onChange={(e) => {
                  const value = e.target.value;
                  const isOther = value === "__other__";
                  setAddingCustomBrand(isOther);
                  setField("brand", isOther ? "" : value);
                }}
              >
                <option className="bg-white text-slate-900" value="">
                  Select brand
                </option>
                {brandOptions.map((b) => (
                  <option className="bg-white text-slate-900" key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option className="bg-white text-slate-900" value="__other__">
                  Other
                </option>
              </select>
              <SelectChevron />
            </div>
            {addingCustomBrand ? (
              <input
                autoFocus
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={fields.brand}
                placeholder="Enter another brand"
                onChange={(e) => setField("brand", e.target.value)}
              />
            ) : null}
          </div>
        ) : null}

        <input type="hidden" value={fields.code} />

        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            value={fields.condition}
            required
            onChange={(e) => setField("condition", e.target.value)}
          >
            <option className="bg-white text-slate-900" value="">
              Select condition
            </option>
            <option className="bg-white text-slate-900" value="Pre Owned">
              Pre Owned
            </option>
            <option className="bg-white text-slate-900" value="Open Box">
              Open Box
            </option>
            <option className="bg-white text-slate-900" value="Pre Order">
              Pre Order
            </option>
            <option className="bg-white text-slate-900" value="New">
              New
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Title</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={fields.product_title}
            onChange={(e) => setField("product_title", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Spec ID</label>
          <input
            placeholder="samsung-galaxy-s24-ultra"
            className={`border rounded px-3 py-2 w-full ${
              isSpecIdReadOnly ? "bg-slate-50 text-slate-500" : ""
            }`}
            value={fields.spec_id}
            onChange={(e) => setField("spec_id", e.target.value)}
            readOnly={isSpecIdReadOnly}
          />
        </div>

        {isPreOrderCategory ? (
          <div>
            <label className="block text-sm font-medium mb-1">Release Date</label>
            <input
              placeholder="25th September 2026"
              className="border rounded px-3 py-2 w-full"
              value={fields.release_date}
              onChange={(e) => setField("release_date", e.target.value)}
            />
          </div>
        ) : null}
       
        <div>
          <label className="block text-sm font-medium mb-1">MRP</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={fields.mrp}
            onChange={(e) => setField("mrp", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={fields.price}
            onChange={(e) => setField("price", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max Sell Price
          </label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={fields.sell_max_price}
            onChange={(e) => setField("sell_max_price", e.target.value)}
          />
        </div>
        {!isCdCategory ? (
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Price
            </label>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={fields.minimum_price}
              onChange={(e) => setField("minimum_price", e.target.value)}
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <label className="block text-sm font-medium mb-1">
          YouTube Iframe
        </label>
        <textarea
          rows={3}
          className="w-full border rounded px-3 py-2"
          value={fields.yt_iframe}
          onChange={(e) => setField("yt_iframe", e.target.value)}
        />
        {youtubePreviewUrl && (
          <div className="mt-4 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <iframe
              src={youtubePreviewUrl}
              title="Global product video preview"
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </div>

    </>
  );
}
