export default function FormActions({ sending, onReset }) {
  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <button
        type="submit"
        disabled={sending}
        className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-cyan-200/70 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Working..." : "Preview"}
      </button>
      <button
        type="button"
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
