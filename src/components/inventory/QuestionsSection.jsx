import { Plus, Trash2 } from "lucide-react";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Questions</h3>
      </div>

      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((q, qi) => (
            <div key={q.id || qi} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-600">Question {qi + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="inline-flex h-9 min-w-28 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="block text-sm font-medium text-slate-700">
                  Question
                  <input
                    value={q.question || ""}
                    onChange={(event) => updateQuestion(qi, "question", event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="block text-sm font-medium text-slate-700">
                  <span>Type</span>
                  <div className="mt-1 flex h-10 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600">
                    {q.type || "radio"}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(q.isRequired)}
                    onChange={(event) => updateQuestion(qi, "isRequired", event.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Required
                </label>
                {(q.type === "radio" || q.type === "dropdown") && (
                  <div className="block text-sm font-medium text-slate-700">
                    Deduction
                    <input
                      type="number"
                      value={Number(q.deduction) || 0}
                      onChange={(event) => updateQuestion(qi, "deduction", Number(event.target.value) || 0)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 block text-sm font-medium text-slate-700">
                Description
                <textarea
                  value={q.description || ""}
                  onChange={(event) => updateQuestion(qi, "description", event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-700">Options</span>
                </div>
                <div className="space-y-2">
                  {(Array.isArray(q.options) ? q.options : []).length > 0 ? (
                    (Array.isArray(q.options) ? q.options : []).map((option, optionIndex) => {
                      const normalized = typeof option === "string" ? { label: option, deduction: 0, icon: "" } : option;
                      return (
                        <div
                          key={`option-${qi}-${optionIndex}`}
                          className={`grid gap-2 rounded-lg border border-slate-200 bg-white p-2 ${
                            q.type === "checkbox"
                              ? "md:grid-cols-[1.3fr_120px_1fr_auto]"
                              : "md:grid-cols-[minmax(0,1fr)_auto]"
                          }`}
                        >
                          <input
                            value={normalized.label || ""}
                            onChange={(event) => updateOption(qi, optionIndex, q.type === "radio" || q.type === "dropdown" ? null : "label", event.target.value)}
                            placeholder="Option label"
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                          {q.type === "checkbox" ? (
                            <>
                              <input
                                type="number"
                                value={Number(normalized.deduction) || 0}
                                onChange={(event) => updateOption(qi, optionIndex, "deduction", Number(event.target.value) || 0)}
                                placeholder="Deduction"
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                              <input
                                value={normalized.icon || ""}
                                onChange={(event) => updateOption(qi, optionIndex, "icon", event.target.value)}
                                placeholder="Icon URL"
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                            </>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeOption(qi, optionIndex)}
                            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">No options configured yet.</p>
                  )}
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => addOption(qi)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4" /> Add option
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No questions configured.</p>
        )}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {[
            ["radio", "Add Single-choice"],
            ["checkbox", "Add Multi-choice"],
            ["dropdown", "Add Dropdown"],
          ].map(([type, label]) => (
            <button
              key={type}
              type="button"
              onClick={() => addQuestion(type)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
