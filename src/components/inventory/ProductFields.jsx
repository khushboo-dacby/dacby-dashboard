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

export default function ProductFields({ fields, setField }) {
  const autoSpecId = autoSpecIdByCategory[fields.category_name] || "";
  const isSpecIdReadOnly = Boolean(autoSpecId);
  const isPreOrderCategory = fields.category_name === "Pre Orders";
  const isCdCategory =
    fields.category_name === "PS5 CDs" || fields.category_name === "PS4 CDs";

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

        {!isCdCategory ? (
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <div className="relative">
              <select
                className={`block w-full appearance-none rounded-lg border ${!fields.category_name ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-slate-700"} px-3 py-2 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100`}
                value={fields.type}
                onChange={(e) => setField("type", e.target.value)}
                disabled={!fields.category_name}
              >
                <option className="bg-white text-slate-900" value="">
                  Select type
                </option>
                {(typeMap[fields.category_name] || ["General"]).map((t) => (
                  <option className="bg-white text-slate-900" key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        ) : null}

        {!isCdCategory ? (
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <div className="relative">
              <select
                className={`block w-full appearance-none rounded-lg border ${!fields.category_name ? "border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 bg-white text-slate-700"} px-3 py-2 pr-10 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100`}
                value={fields.brand}
                onChange={(e) => setField("brand", e.target.value)}
                disabled={!fields.category_name}
              >
                <option className="bg-white text-slate-900" value="">
                  Select brand
                </option>
                {(brandMap[fields.category_name] || brandMap["Cameras"]).map(
                  (b) => (
                    <option className="bg-white text-slate-900" key={b} value={b}>
                      {b}
                    </option>
                  ),
                )}
              </select>
              <SelectChevron />
            </div>
          </div>
        ) : null}

        <input type="hidden" value={fields.code} />

        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select
            className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            value={fields.condition}
            onChange={(e) => setField("condition", e.target.value)}
          >
            <option className="bg-white text-slate-900" value="pre-Owned">
              Pre Owned
            </option>
            <option className="bg-white text-slate-900" value="open-box">
              Open Box
            </option>
            <option className="bg-white text-slate-900" value="pre-order">
              Pre Order
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
          YouTube Iframe (optional)
        </label>
        <textarea
          rows={3}
          className="w-full border rounded px-3 py-2"
          value={fields.yt_iframe}
          onChange={(e) => setField("yt_iframe", e.target.value)}
        />
      </div>

    </>
  );
}
