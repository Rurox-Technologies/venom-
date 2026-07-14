"use client";

import HistoryItem from "./HistoryItem";
import { useChat } from "../../hooks/useChat";

export default function MemoryPanel() {
  const { conversations, activeConversationId, setActiveConversationId, deleteConversation } = useChat();

  return (
    <div className="space-y-2">
      {conversations.map((item) => (
        <HistoryItem
          key={item.session_id}
          label={item.title}
          active={item.session_id === activeConversationId}
          onSelect={() => setActiveConversationId(item.session_id)}
          onDelete={() => deleteConversation(item.session_id)}
        />
      ))}
    </div>
  );
}
