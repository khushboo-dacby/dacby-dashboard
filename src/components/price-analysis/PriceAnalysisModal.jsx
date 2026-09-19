import { useState, useEffect } from "react";

const emptyData = {
  amazon: { link: "", buy_price: "", in_stock: true },
  gameloot: { link: "", link_sell: "", buy_price: "", sell_price: "", in_stock: true },
  gamenation: { link: "", buy_price: "", sell_price: "", in_stock: true },
  recommended_price: {
    buy: { price: "", need_manual_price_check: false },
    sell: { price: "", need_manual_price_check: false },
  },
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

function InStockToggle({ checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-sm text-gray-700">In stock</span>
    </label>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PriceAnalysisModal({ isOpen, onClose, initialData, onSubmit }) {
  console.log("initialData ",initialData)
  const [data, setData] = useState(() => mergeData(initialData));

  useEffect(() => {
    if (isOpen) setData(mergeData(initialData));
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function mergeData(initial) {
    return {
      amazon: { ...emptyData.amazon, ...(initial?.amazon || {}) },
      gameloot: { ...emptyData.gameloot, ...(initial?.gameloot || {}) },
      gamenation: { ...emptyData.gamenation, ...(initial?.gamenation || {}) },
      recommended_price: {
        buy: { ...emptyData.recommended_price.buy, ...(initial?.recommended_price?.buy || {}) },
        sell: { ...emptyData.recommended_price.sell, ...(initial?.recommended_price?.sell || {}) },
      },
    };
  }

  const set = (source, field, value) =>
    setData((prev) => ({ ...prev, [source]: { ...prev[source], [field]: value } }));

  const setRecommended = (side, field, value) =>
    setData((prev) => ({
      ...prev,
      recommended_price: {
        ...prev.recommended_price,
        [side]: { ...prev.recommended_price[side], [field]: value },
      },
    }));

  const toNum = (v) => (v === "" ? 0 : Number(v));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      amazon: {
        link: data.amazon.link,
        buy_price: toNum(data.amazon.buy_price),
        in_stock: data.amazon.in_stock,
      },
      gameloot: {
        link: data.gameloot.link,
        link_sell: data.gameloot.link_sell,
        buy_price: toNum(data.gameloot.buy_price),
        sell_price: toNum(data.gameloot.sell_price),
        in_stock: data.gameloot.in_stock,
      },
      gamenation: {
        link: data.gamenation.link,
        buy_price: toNum(data.gamenation.buy_price),
        sell_price: toNum(data.gamenation.sell_price),
        in_stock: data.gamenation.in_stock,
      },
      recommended_price: {
        buy: {
          price: toNum(data.recommended_price.buy.price),
          need_manual_price_check: data.recommended_price.buy.need_manual_price_check,
        },
        sell: {
          price: toNum(data.recommended_price.sell.price),
          need_manual_price_check: data.recommended_price.sell.need_manual_price_check,
        },
      },
    };
    onSubmit ? onSubmit(payload) : console.log(payload);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-50 shadow-xl">
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Price analysis</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <SectionCard title="Amazon">
            <div className="sm:col-span-2">
              <TextField
                label="Product link"
                value={data.amazon.link}
                onChange={(v) => set("amazon", "link", v)}
                placeholder="https://www.amazon.in/..."
              />
            </div>
            <TextField
              label="Buy price"
              type="number"
              value={data.amazon.buy_price}
              onChange={(v) => set("amazon", "buy_price", v)}
              placeholder="0"
            />
            <InStockToggle
              checked={data.amazon.in_stock}
              onChange={(v) => set("amazon", "in_stock", v)}
            />
          </SectionCard>

          <SectionCard title="Gameloot">
            <TextField
              label="Buy link"
              value={data.gameloot.link}
              onChange={(v) => set("gameloot", "link", v)}
              placeholder="https://gameloot.in/shop/..."
            />
            <TextField
              label="Sell link"
              value={data.gameloot.link_sell}
              onChange={(v) => set("gameloot", "link_sell", v)}
              placeholder="https://sell.gameloot.in/shop/..."
            />
            <TextField
              label="Buy price"
              type="number"
              value={data.gameloot.buy_price}
              onChange={(v) => set("gameloot", "buy_price", v)}
              placeholder="0"
            />
            <TextField
              label="Sell price"
              type="number"
              value={data.gameloot.sell_price}
              onChange={(v) => set("gameloot", "sell_price", v)}
              placeholder="0"
            />
            <InStockToggle
              checked={data.gameloot.in_stock}
              onChange={(v) => set("gameloot", "in_stock", v)}
            />
          </SectionCard>

          <SectionCard title="Gamenation">
            <div className="sm:col-span-2">
              <TextField
                label="Link"
                value={data.gamenation.link}
                onChange={(v) => set("gamenation", "link", v)}
                placeholder="https://gamenation.in/Products/..."
              />
            </div>
            <TextField
              label="Buy price"
              type="number"
              value={data.gamenation.buy_price}
              onChange={(v) => set("gamenation", "buy_price", v)}
              placeholder="0"
            />
            <TextField
              label="Sell price"
              type="number"
              value={data.gamenation.sell_price}
              onChange={(v) => set("gamenation", "sell_price", v)}
              placeholder="0"
            />
            <InStockToggle
              checked={data.gamenation.in_stock}
              onChange={(v) => set("gamenation", "in_stock", v)}
            />
          </SectionCard>

          <SectionCard title="Recommended price">
            <TextField
              label="Buy price"
              type="number"
              value={data.recommended_price.buy.price}
              onChange={(v) => setRecommended("buy", "price", v)}
              placeholder="0"
            />
            <TextField
              label="Sell price"
              type="number"
              value={data.recommended_price.sell.price}
              onChange={(v) => setRecommended("sell", "price", v)}
              placeholder="0"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.recommended_price.buy.need_manual_price_check}
                onChange={(e) =>
                  setRecommended("buy", "need_manual_price_check", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Buy needs manual check</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.recommended_price.sell.need_manual_price_check}
                onChange={(e) =>
                  setRecommended("sell", "need_manual_price_check", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Sell needs manual check</span>
            </label>
          </SectionCard>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Save price analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Example usage:
// const [open, setOpen] = useState(false);
// <button onClick={() => setOpen(true)}>Edit price analysis</button>
// <PriceAnalysisModal
//   isOpen={open}
//   onClose={() => setOpen(false)}
//   initialData={priceAnalysis}
//   onSubmit={(payload) => saveToBackend(payload)}
// />
