"use client";

import AudioPlayer from "@/components/AudioPlayer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/contexts/ModalContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from "@/lib/utils/formatters";
import type { LocalRecording } from "@/types/recording";
import { useEffect, useState } from "react";

export default function RecordingsList() {
  const {
    recordings,
    isLoading,
    error,
    loadRecordings,
    deleteRecording,
    updateTitle,
  } = useRecordings();
  const { showModal } = useModal();
  const [selectedRecording, setSelectedRecording] =
    useState<LocalRecording | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [audioURL, setAudioURL] = useState<string | null>(null);

  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  useEffect(() => {
    // Cleanup audio URL when component unmounts
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const handlePlay = (recording: LocalRecording) => {
    // Revoke previous URL if exists
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    const url = URL.createObjectURL(recording.blob);
    setAudioURL(url);
    setSelectedRecording(recording);
  };

  const handleDelete = (id: number) => {
    showModal({
      title: "Delete Recording",
      message:
        "Are you sure you want to delete this recording? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        const success = await deleteRecording(id);
        if (success && selectedRecording?.id === id) {
          setSelectedRecording(null);
          if (audioURL) {
            URL.revokeObjectURL(audioURL);
            setAudioURL(null);
          }
        }
      },
    });
  };

  const handleDownload = (recording: LocalRecording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recording.title}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditing = (recording: LocalRecording) => {
    setEditingId(recording.id);
    setEditTitle(recording.title);
  };

  const saveEdit = async (id: number) => {
    if (editTitle.trim()) {
      await updateTitle(id, editTitle.trim());
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  if (isLoading && recordings.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading recordings...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </Card>
    );
  }

  if (recordings.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            No recordings yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Record different mics. Save and compare the sound!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Recordings ({recordings.length})
          </h2>
          <Button onClick={loadRecordings} variant="ghost" size="sm">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </Button>
        </div>

        <div className="space-y-3">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {editingId === recording.id ? (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(recording.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                      <Button
                        onClick={() => saveEdit(recording.id)}
                        variant="primary"
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <h3
                      className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate cursor-pointer hover:text-primary-600 dark:hover:text-primary-400"
                      onClick={() => startEditing(recording)}
                      title="Click to edit"
                    >
                      {recording.title}
                    </h3>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDate(recording.createdAt)}</span>
                    <span>•</span>
                    <span>{formatDuration(recording.duration)}</span>
                    <span>•</span>
                    <span>{formatFileSize(recording.size)}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handlePlay(recording)}
                    variant="primary"
                    size="sm"
                    title="Play"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  <Button
                    onClick={() => handleDownload(recording)}
                    variant="secondary"
                    size="sm"
                    title="Download"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  <Button
                    onClick={() => handleDelete(recording.id)}
                    variant="danger"
                    size="sm"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Playback Modal */}
      <Modal
        isOpen={!!selectedRecording && !!audioURL}
        onClose={() => {
          setSelectedRecording(null);
          if (audioURL) {
            URL.revokeObjectURL(audioURL);
            setAudioURL(null);
          }
        }}
        title={selectedRecording?.title || "Playback"}
      >
        {audioURL && <AudioPlayer audioURL={audioURL} />}
      </Modal>
    </>
  );
}
