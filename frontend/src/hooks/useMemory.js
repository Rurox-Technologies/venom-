"use client";

import { useState } from "react";

export function useMemory() {
  const [memoryItems, setMemoryItems] = useState([]);

  return { memoryItems, setMemoryItems };
}
