"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ChatContext = createContext(null);

const seedConversations = [
  {
    id: "conv-1",
    title: "Welcome Session",
    messages: [
      {
        id: "init-1",
        role: "assistant",
        text: "Venom online. Cloud + local hybrid mode available.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

function buildTitle(text) {
  const clean = text.trim();
  return clean.length > 26 ? `${clean.slice(0, 26)}...` : clean;
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(seedConversations);
  const [activeConversationId, setActiveConversationId] = useState("conv-1");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeConversation = conversations.find((item) => item.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const createConversation = () => {
    const id = `conv-${crypto.randomUUID()}`;
    const newConversation = {
      id,
      title: "New Conversation",
      messages: [],
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(id);
  };

  const deleteConversation = (conversationId) => {
    setConversations((prev) => {
      const next = prev.filter((item) => item.id !== conversationId);
      if (!next.length) {
        const fallback = {
          id: "conv-fallback",
          title: "New Conversation",
          messages: [],
        };
        setActiveConversationId(fallback.id);
        return [fallback];
      }
      if (activeConversationId === conversationId) {
        setActiveConversationId(next[0].id);
      }
      return next;
    });
  };

  const clearActiveConversation = () => {
    setConversations((prev) =>
      prev.map((item) =>
        item.id === activeConversationId
          ? {
              ...item,
              messages: [],
              title: "Cleared Conversation",
            }
          : item,
      ),
    );
  };

  const sendMessage = (text) => {
    const now = new Date().toISOString();
    const userMessage = { id: crypto.randomUUID(), role: "user", text, createdAt: now };
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Streaming placeholder: Venom is preparing a hybrid response from the selected provider.",
      createdAt: new Date().toISOString(),
    };

    setIsTyping(true);
    setIsStreaming(true);

    setConversations((prev) =>
      prev.map((item) => {
        if (item.id !== activeConversationId) return item;
        const title = item.messages.length ? item.title : buildTitle(text);
        return {
          ...item,
          title,
          messages: [...item.messages, userMessage],
        };
      }),
    );

    setTimeout(() => {
      setConversations((prev) =>
        prev.map((item) =>
          item.id === activeConversationId
            ? {
                ...item,
                messages: [...item.messages, assistantMessage],
              }
            : item,
        ),
      );
      setIsTyping(false);
      setIsStreaming(false);
    }, 700);
  };

  const value = useMemo(
    () => ({
      messages,
      sendMessage,
      conversations,
      activeConversationId,
      setActiveConversationId,
      createConversation,
      deleteConversation,
      clearActiveConversation,
      isTyping,
      isStreaming,
    }),
    [messages, conversations, activeConversationId, isTyping, isStreaming],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within ChatProvider");
  return context;
}
