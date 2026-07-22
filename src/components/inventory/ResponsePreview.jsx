export default function ResponsePreview({
  resp,
  isPreview = false,
  sending = false,
  onFinalSubmit,
}) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-slate-950">
        {isPreview ? "Preview" : "Response"}
      </h3>
      <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-800">
        {resp ? JSON.stringify(resp, null, 2) : "No response yet"}
      </pre>
      {isPreview ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={sending}
            onClick={onFinalSubmit}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-cyan-200/70 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Submitting..." : "Final Submit"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
