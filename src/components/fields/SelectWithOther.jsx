
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
export function SelectWithOther({
  label,
  value,
  options,
  addingCustom,
  onCustomToggle,
  onChange,
  customPlaceholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="relative">
        <select
          className="block w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          value={addingCustom ? "__other__" : value}
          onChange={(e) => {
            const selectedValue = e.target.value;
            const isOther = selectedValue === "__other__";

            onCustomToggle(isOther);
            onChange(isOther ? "" : selectedValue);
          }}
        >
          <option value="">Select {label.toLowerCase()}</option>

          {options.map((option) => (
            <option
              className="bg-white text-slate-900"
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}

          <option
            className="bg-white text-slate-900"
            value="__other__"
          >
            Other
          </option>
        </select>

        <SelectChevron />
      </div>

      {addingCustom ? (
        <input
          autoFocus
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          value={value}
          placeholder={customPlaceholder || `Enter another ${label.toLowerCase()}`}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

