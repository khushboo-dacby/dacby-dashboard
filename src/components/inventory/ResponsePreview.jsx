export default function ResponsePreview({ resp }) {
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-slate-950">Response</h3>
      <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-800">
        {resp ? JSON.stringify(resp, null, 2) : "No response yet"}
      </pre>
    </div>
  );
}
