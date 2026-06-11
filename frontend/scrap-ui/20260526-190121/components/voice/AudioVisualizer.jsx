"use client";

export default function AudioVisualizer() {
  return (
    <div className="flex items-end gap-1">
      {[8, 14, 10, 16, 12].map((height, index) => (
        <span key={index} className="w-1 rounded bg-cyan-300/80" style={{ height }} />
      ))}
    </div>
  );
}
