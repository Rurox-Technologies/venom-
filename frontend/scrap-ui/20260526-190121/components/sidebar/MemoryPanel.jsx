"use client";

import HistoryItem from "./HistoryItem";
import { useChat } from "../../hooks/useChat";

export default function MemoryPanel() {
  const { conversations, activeConversationId, setActiveConversationId, deleteConversation } = useChat();

  return (
    <div className="space-y-2">
      {conversations.map((item) => (
        <HistoryItem
          key={item.id}
          label={item.title}
          active={item.id === activeConversationId}
          onSelect={() => setActiveConversationId(item.id)}
          onDelete={() => deleteConversation(item.id)}
        />
      ))}
    </div>
  );
}
