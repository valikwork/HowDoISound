"use client";

import { useIndexedDB } from "@/hooks/useIndexedDB";
import { createContext, ReactNode, useContext } from "react";

type RecordingsContextType = ReturnType<typeof useIndexedDB>;

const RecordingsContext = createContext<RecordingsContextType | undefined>(
  undefined,
);

export function useRecordings() {
  const context = useContext(RecordingsContext);
  if (!context) {
    throw new Error("useRecordings must be used within a RecordingsProvider");
  }
  return context;
}

export function RecordingsProvider({ children }: { children: ReactNode }) {
  const indexedDB = useIndexedDB();

  return (
    <RecordingsContext.Provider value={indexedDB}>
      {children}
    </RecordingsContext.Provider>
  );
}
