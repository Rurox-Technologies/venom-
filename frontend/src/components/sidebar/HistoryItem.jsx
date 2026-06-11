export default function HistoryItem({ label, active, onSelect, onDelete }) {
  return (
    <div className={`group flex items-center gap-2 rounded-xl border px-3 py-2 ${active ? "border-cyan-300/50 bg-cyan-500/10" : "border-slate-700/50 bg-slate-900/50"}`}>
      <button onClick={onSelect} className="flex-1 text-left text-sm text-slate-300 transition hover:text-cyan-100">
        {label}
      </button>
      <button onClick={onDelete} className="text-xs text-slate-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-300">
        Delete
      </button>
    </div>
  );
}
