import { useState } from "react";

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function nextCombinationName(combinations) {
  const usedNumbers = combinations.map(({ name }) => {
    const match = String(name).match(/^combination_(\d+)$/);
    return match ? Number(match[1]) : 0;
  });

  return `combination_${Math.max(0, ...usedNumbers) + 1}`;
}

export default function CombinationEditor({
  combinations,
  onChange,
  onGenerateFromAttributes,
}) {
  const [attributeScope, setAttributeScope] = useState("current");
  const [valueScope, setValueScope] = useState("current");
  const [openCombination, setOpenCombination] = useState(null);
  const [attributeInputs, setAttributeInputs] = useState({});
  const [valueInputs, setValueInputs] = useState({});

  function addCombination() {
    const name = nextCombinationName(combinations);
    onChange((current) => [
      ...current,
      { name, attributes: [], selectedValues: {}, include_colors: false },
    ]);
    setOpenCombination(name);
  }

  function removeCombination(name) {
    onChange((current) => current.filter((item) => item.name !== name));
    if (openCombination === name) setOpenCombination(null);
  }

  function addAttribute(combinationName) {
    const key = normalizeKey(attributeInputs[combinationName]);
    if (!key) return;

    onChange((current) =>
      current.map((combination) => {
        const applies =
          attributeScope === "all" || combination.name === combinationName;
        const exists = combination.attributes.some(
          (attribute) => normalizeKey(attribute.key) === key,
        );
        if (!applies || exists) return combination;

        return {
          ...combination,
          attributes: [...combination.attributes, { key, values: [] }],
        };
      }),
    );
    setAttributeInputs((current) => ({ ...current, [combinationName]: "" }));
  }

  function removeAttribute(combinationName, attributeKey) {
    onChange((current) =>
      current.map((combination) =>
        combination.name === combinationName
          ? {
              ...combination,
              attributes: combination.attributes.filter(
                (attribute) => attribute.key !== attributeKey,
              ),
            }
          : combination,
      ),
    );
  }

  function addValue(combinationName, attributeKey) {
    const inputKey = `${combinationName}:${attributeKey}`;
    const value = String(valueInputs[inputKey] || "").trim();
    if (!value) return;

    onChange((current) =>
      current.map((combination) => {
        const applies = valueScope === "all" || combination.name === combinationName;
        if (!applies) return combination;

        return {
          ...combination,
          attributes: combination.attributes.map((attribute) => {
            if (attribute.key !== attributeKey) return attribute;
            const exists = attribute.values.some(
              (item) => item.toLowerCase() === value.toLowerCase(),
            );
            return exists
              ? attribute
              : { ...attribute, values: [...attribute.values, value] };
          }),
        };
      }),
    );
    setValueInputs((current) => ({ ...current, [inputKey]: "" }));
  }

  function removeValue(combinationName, attributeKey, valueIndex) {
    onChange((current) =>
      current.map((combination) =>
        combination.name === combinationName
          ? {
              ...combination,
              attributes: combination.attributes.map((attribute) =>
                attribute.key === attributeKey
                  ? {
                      ...attribute,
                      values: attribute.values.filter(
                        (_, index) => index !== valueIndex,
                      ),
                    }
                  : attribute,
              ),
            }
          : combination,
      ),
    );
  }

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-slate-900">Combinations</h4>
          <p className="text-sm text-slate-500">
            Add attributes and values to one combination or every combination.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addCombination}
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Add Combination
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 sm:grid-cols-2">
        <ScopeSelect
          label="Attributes"
          value={attributeScope}
          onChange={setAttributeScope}
        />
        <ScopeSelect label="Values" value={valueScope} onChange={setValueScope} />
      </div>

      <div className="space-y-3">
        {combinations.map((combination) => {
          const isOpen = openCombination === combination.name;

          return (
            <div key={combination.name} className="rounded-xl border border-slate-200">
              <div className="flex items-center justify-between gap-3 bg-slate-50 p-4">
                <button
                  type="button"
                  onClick={() => setOpenCombination(isOpen ? null : combination.name)}
                  className="flex-1 text-left font-semibold uppercase text-indigo-950"
                >
                  {combination.name.replaceAll("_", " ")}
                </button>
                <button
                  type="button"
                  onClick={() => removeCombination(combination.name)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>

              {isOpen ? (
                <div className="space-y-4 p-4">
                  {combination.attributes.map((attribute) => {
                    const inputKey = `${combination.name}:${attribute.key}`;
                    return (
                      <div key={attribute.key} className="rounded-lg border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="font-medium capitalize">
                            {attribute.key.replaceAll("_", " ")}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeAttribute(combination.name, attribute.key)
                            }
                            className="text-sm text-rose-600"
                          >
                            Remove attribute
                          </button>
                        </div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {attribute.values.map((value, index) => (
                            <span
                              key={`${value}-${index}`}
                              className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
                            >
                              {value}{" "}
                              <button
                                type="button"
                                onClick={() =>
                                  removeValue(
                                    combination.name,
                                    attribute.key,
                                    index,
                                  )
                                }
                                className="text-rose-600"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={valueInputs[inputKey] || ""}
                            onChange={(event) =>
                              setValueInputs((current) => ({
                                ...current,
                                [inputKey]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addValue(combination.name, attribute.key);
                              }
                            }}
                            placeholder="New value"
                            className="min-w-0 flex-1 rounded-lg border px-3 py-2"
                          />
                          <button
                            type="button"
                            onClick={() => addValue(combination.name, attribute.key)}
                            className="rounded-lg bg-indigo-700 px-4 py-2 text-white"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex gap-2">
                    <input
                      value={attributeInputs[combination.name] || ""}
                      onChange={(event) =>
                        setAttributeInputs((current) => ({
                          ...current,
                          [combination.name]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addAttribute(combination.name);
                        }
                      }}
                      placeholder="New attribute name"
                      className="min-w-0 flex-1 rounded-lg border px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => addAttribute(combination.name)}
                      className="rounded-lg bg-indigo-700 px-4 py-2 text-white"
                    >
                      Add Attribute
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScopeSelect({ label, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 font-medium text-indigo-950">{label}</legend>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={value === "current"}
            onChange={() => onChange("current")}
          />
          Current combination
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={value === "all"}
            onChange={() => onChange("all")}
          />
          All combinations
        </label>
      </div>
    </fieldset>
  );
}
