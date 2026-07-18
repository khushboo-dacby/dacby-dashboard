import Image from "next/image";

export default function QuestionsSection({
  questions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  addOption,
  updateOption,
  removeOption,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Questions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={() => addQuestion("radio")}
          >
            + Add Single-choice
          </button>
          <button
            type="button"
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={() => addQuestion("checkbox")}
          >
            + Add Multi-choice
          </button>
          <button
            type="button"
            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            onClick={() => addQuestion("dropdown")}
          >
            + Add Dropdown
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div
            key={q.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-full space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={q.question}
                    onChange={(e) =>
                      updateQuestion(qi, "question", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (optional)
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={q.description}
                    onChange={(e) =>
                      updateQuestion(qi, "description", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!q.isRequired}
                      onChange={(e) =>
                        updateQuestion(qi, "isRequired", e.target.checked)
                      }
                    />{" "}
                    Required
                  </label>
                  {(q.type === "radio" || q.type === "dropdown") && (
                    <label className="flex items-center gap-2">
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                        Deduction
                      </span>
                      <input
                        title="Deduction"
                        className="w-28 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-2 text-indigo-900"
                        type="number"
                        value={q.deduction}
                        onChange={(e) =>
                          updateQuestion(
                            qi,
                            "deduction",
                            Number(e.target.value),
                          )
                        }
                      />
                    </label>
                  )}
                  <span className="inline-block rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                    {q.type.toUpperCase()}
                  </span>
                </div>

                <div className="mt-2">
                  <label className="block font-medium mb-1">Options</label>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2 items-center">
                        {q.type === "radio" || q.type === "dropdown" ? (
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                              Option
                            </label>
                            <input
                              className="w-full border rounded px-3 py-2"
                              value={opt}
                              onChange={(e) =>
                                updateOption(qi, oi, null, e.target.value)
                              }
                            />
                          </div>
                        ) : q.type === "checkbox" ? (
                          <>
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">
                                Option Label
                              </label>
                              <input
                                className="w-full border rounded px-3 py-2"
                                value={opt.label}
                                onChange={(e) =>
                                  updateOption(
                                    qi,
                                    oi,
                                    "label",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                Deduction
                              </span>
                              <input
                                title="Deduction"
                                className="w-28 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-2 text-indigo-900"
                                placeholder="0"
                                type="number"
                                value={opt.deduction}
                                onChange={(e) =>
                                  updateOption(
                                    qi,
                                    oi,
                                    "deduction",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm">Icon (optional)</label>
                              <input
                                className="w-44 border rounded px-2 py-1"
                                placeholder="https://..."
                                value={opt.icon || ""}
                                onChange={(e) =>
                                  updateOption(qi, oi, "icon", e.target.value)
                                }
                              />
                              {opt.icon && (
                                <Image
                                  src={opt.icon}
                                  alt="icon"
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  unoptimized
                                />
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">
                                Option Label
                              </label>
                              <input
                                className="w-full border rounded px-3 py-2"
                                value={opt.label}
                                onChange={(e) =>
                                  updateOption(
                                    qi,
                                    oi,
                                    "label",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                Deduction
                              </span>
                              <input
                                title="Deduction"
                                className="w-28 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-2 text-indigo-900"
                                placeholder="0"
                                type="number"
                                value={opt.deduction}
                                onChange={(e) =>
                                  updateOption(
                                    qi,
                                    oi,
                                    "deduction",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-sm">Icon (optional)</label>
                              <input
                                className="w-44 border rounded px-2 py-1"
                                placeholder="https://..."
                                value={opt.icon || ""}
                                onChange={(e) =>
                                  updateOption(qi, oi, "icon", e.target.value)
                                }
                              />
                              {opt.icon && (
                                <Image
                                  src={opt.icon}
                                  alt="icon"
                                  width={24}
                                  height={24}
                                  className="object-contain"
                                  unoptimized
                                />
                              )}
                            </div>
                          </>
                        )}
                        <button
                          type="button"
                          className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                          onClick={() => removeOption(qi, oi)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div>
                      <button
                        type="button"
                        className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                        onClick={() => addOption(qi)}
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button
                  type="button"
                  className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
                  onClick={() => removeQuestion(qi)}
                >
                  Remove Question
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
