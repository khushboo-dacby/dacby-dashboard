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

export function getYouTubeEmbedUrl(value) {
  const sourceMatch = String(value || "").match(/src=["']([^"']+)["']/i);
  const input = (sourceMatch?.[1] || String(value || "").trim()).replaceAll(
    "&amp;",
    "&"
  );
  if (!input) return "";

  try {
    const url = new URL(input);
    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];
    if (url.protocol !== "https:") return "";

    if (sourceMatch) {
      return allowedHosts.includes(url.hostname) ? url.toString() : "";
    }

    if (allowedHosts.includes(url.hostname) && url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    const videoId =
      url.hostname === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0]
        : url.searchParams.get("v");

    return videoId
      ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`
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
  const typeOptions = typeMap[fields.category_name] || [];
  const brandOptions = brandMap[fields.category_name] || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Listing Details & Base Information</h3>
        <p className="text-sm text-slate-500">Manage general product title, categorization, default pricing, and catalog presentation.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Row 1 */}
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Product Title</label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={fields.product_title}
            onChange={(e) => setField("product_title", e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Condition</label>
          <select
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={fields.condition}
            required
            onChange={(e) => setField("condition", e.target.value)}
          >
            <option value="">Select condition</option>
            <option value="Pre Owned">Pre Owned</option>
            <option value="Open Box">Open Box</option>
            <option value="Pre Order">Pre Order</option>
            <option value="New">New</option>
          </select>
        </div>

        {/* Row 2 */}
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Brand</label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={addingCustomBrand ? "__other__" : fields.brand}
              onChange={(e) => {
                const value = e.target.value;
                const isOther = value === "__other__";
                setAddingCustomBrand(isOther);
                setField("brand", isOther ? "" : value);
              }}
            >
              <option value="">Select brand</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="__other__">Other</option>
            </select>
            <SelectChevron />
          </div>
          {addingCustomBrand && (
            <input
              autoFocus
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={fields.brand}
              placeholder="Enter another brand"
              onChange={(e) => setField("brand", e.target.value)}
            />
          )}
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={addingCustomType ? "__other__" : fields.type}
              onChange={(e) => {
                const value = e.target.value;
                const isOther = value === "__other__";
                setAddingCustomType(isOther);
                setField("type", isOther ? "" : value);
              }}
            >
              <option value="">Select type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="__other__">Other</option>
            </select>
            <SelectChevron />
          </div>
          {addingCustomType && (
            <input
              autoFocus
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={fields.type}
              placeholder="Enter another type"
              onChange={(e) => setField("type", e.target.value)}
            />
          )}
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Spec ID</label>
          <input
            placeholder="e.g. macbook-pro-13"
            className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
              isSpecIdReadOnly ? "bg-slate-50 text-slate-500" : "bg-white text-slate-800"
            }`}
            value={fields.spec_id}
            onChange={(e) => setField("spec_id", e.target.value)}
            readOnly={isSpecIdReadOnly}
          />
        </div>

        {/* Optional Row 3 based on category */}
        {isPreOrderCategory && (
          <div className="md:col-span-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">Release Date</label>
            <input
              placeholder="25th September 2026"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={fields.release_date}
              onChange={(e) => setField("release_date", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mt-8 mb-4">
        <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Default Pricing Parameters</h4>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Maximum Retail Price (MRP)</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={fields.mrp}
            onChange={(e) => setField("mrp", e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Buy Price</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={fields.price}
            onChange={(e) => setField("price", e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">Max Sell Price</label>
          <input
            type="number"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={fields.sell_max_price}
            onChange={(e) => setField("sell_max_price", e.target.value)}
          />
        </div>
      </div>
      
      <input type="hidden" value={fields.code} />
    </div>
  );
}
