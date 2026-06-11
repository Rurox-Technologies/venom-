"use client";

import { useState } from "react";
import { useChat } from "../../hooks/useChat";

export default function ChatInput() {
  const [value, setValue] = useState("");
  const { sendMessage } = useChat();

  const onSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    sendMessage(value);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit} className="mt-3 flex items-center gap-2 border border-slate-700 bg-slate-950/60 p-2">
      <input
        className="flex-1 bg-transparent px-2 text-xs uppercase tracking-[0.12em] text-slate-200 outline-none placeholder:text-slate-600"
        placeholder="Type command for venom..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" className="border border-lime-400/50 bg-lime-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-lime-300 hover:bg-lime-500/20">
        Transmit
      </button>
    </form>
  );
}
