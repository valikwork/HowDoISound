"use client";

import * as IndexedDB from "@/lib/storage/indexedDB";
import type { LocalRecording } from "@/types/recording";
import { useCallback, useState } from "react";

export function useIndexedDB() {
  const [recordings, setRecordings] = useState<LocalRecording[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecordings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await IndexedDB.getAllRecordings();
      setRecordings(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load recordings",
      );
      console.error("Error loading recordings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRecording = useCallback(
    async (blob: Blob, title: string, duration: number) => {
      setError(null);

      try {
        await IndexedDB.saveRecording(blob, title, duration);
        await loadRecordings();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save recording",
        );
        console.error("Error saving recording:", err);
        return false;
      }
    },
    [loadRecordings],
  );

  const deleteRecording = useCallback(
    async (id: number) => {
      setError(null);

      try {
        await IndexedDB.deleteRecording(id);
        await loadRecordings();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete recording",
        );
        console.error("Error deleting recording:", err);
        return false;
      }
    },
    [loadRecordings],
  );

  const updateTitle = useCallback(
    async (id: number, title: string) => {
      setError(null);

      try {
        await IndexedDB.updateRecordingTitle(id, title);
        await loadRecordings();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update title");
        console.error("Error updating title:", err);
        return false;
      }
    },
    [loadRecordings],
  );

  const clearAll = useCallback(async () => {
    setError(null);

    try {
      await IndexedDB.clearAllRecordings();
      setRecordings([]);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to clear recordings",
      );
      console.error("Error clearing recordings:", err);
      return false;
    }
  }, []);

  return {
    recordings,
    isLoading,
    error,
    loadRecordings,
    saveRecording,
    deleteRecording,
    updateTitle,
    clearAll,
  };
}
