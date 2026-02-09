"use client";

import AudioPlayer from "@/components/AudioPlayer";
import DeviceSelector from "@/components/DeviceSelector";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { useModal } from "@/contexts/ModalContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { formatDuration } from "@/lib/utils/formatters";
import { MEETING_PHRASES } from "@/lib/utils/meetingPhrases";
import { useEffect, useState } from "react";

export default function AudioRecorder() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPhraseFading, setIsPhraseFading] = useState(false);

  const {
    isRecording,
    isPaused,
    duration,
    audioURL,
    audioBlob,
    error: recorderError,
    stream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    resetRecorder,
  } = useAudioRecorder();

  const { saveRecording, error: storageError } = useRecordings();
  const { showModal } = useModal();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPhraseFading(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % MEETING_PHRASES.length);
        setIsPhraseFading(false);
      }, 500);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = () => {
    startRecording(selectedDeviceId || undefined);
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleSaveClick = () => {
    setRecordingTitle(`Recording ${new Date().toLocaleString()}`);
    setShowSaveModal(true);
  };

  const handleSaveRecording = async () => {
    if (!audioBlob || !recordingTitle.trim()) return;

    setIsSaving(true);
    const success = await saveRecording(audioBlob, recordingTitle, duration);
    setIsSaving(false);

    if (success) {
      setShowSaveModal(false);
      resetRecorder();
      setRecordingTitle("");
    }
  };

  const handleCancel = () => {
    showModal({
      title: "Cancel Recording",
      message:
        "Are you sure you want to cancel this recording? All progress will be lost.",
      confirmText: "Yes, Cancel",
      cancelText: "No, Keep Recording",
      variant: "danger",
      onConfirm: () => {
        cancelRecording();
      },
    });
  };

  const handleDiscard = () => {
    showModal({
      title: "Discard Recording",
      message:
        "Are you sure you want to discard this recording? This action cannot be undone.",
      confirmText: "Yes, Discard",
      cancelText: "No, Keep It",
      variant: "danger",
      onConfirm: () => {
        resetRecorder();
      },
    });
  };

  return (
    <>
      <Card>
        <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-gray-100 mb-4">
          Select the mic
        </h2>

        {/* Device Selector */}
        {!isRecording && !audioURL && (
          <div className="mb-6">
            <DeviceSelector
              onDeviceChange={setSelectedDeviceId}
              disabled={isRecording}
            />
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            And say something like...
          </p>
          <p
            className={`text-xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-500 ${
              isPhraseFading ? "opacity-0" : "opacity-100"
            }`}
          >
            &ldquo;{MEETING_PHRASES[currentPhraseIndex]}&rdquo;
          </p>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                {!isPaused && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            {/* Waveform Visualizer */}
            {!isPaused && stream && (
              <div className="mb-4">
                <WaveformVisualizer stream={stream} />
              </div>
            )}

            {isPaused && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Recording paused
              </div>
            )}
          </div>
        )}

        {/* Playback */}
        {audioURL && !isRecording && (
          <div className="mb-6">
            <AudioPlayer audioURL={audioURL} />
          </div>
        )}

        {/* Error Display */}
        {(recorderError || storageError) && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {recorderError || storageError}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!isRecording && !audioURL && (
            <Button
              onClick={handleStartRecording}
              variant="danger"
              size="lg"
              className="cursor-pointer !w-32 !h-32 !rounded-full !p-0 flex items-center justify-center"
            >
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          )}

          {isRecording && (
            <>
              {!isPaused ? (
                <Button onClick={pauseRecording} variant="secondary" size="lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeRecording} variant="primary" size="lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Resume
                </Button>
              )}

              <Button onClick={handleStopRecording} variant="danger" size="lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                    clipRule="evenodd"
                  />
                </svg>
                Stop
              </Button>

              <Button onClick={handleCancel} variant="ghost" size="lg">
                Cancel
              </Button>
            </>
          )}

          {audioURL && !isRecording && (
            <>
              <Button onClick={handleSaveClick} variant="primary" size="lg">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save Recording
              </Button>

              <Button onClick={handleDiscard} variant="ghost" size="lg">
                Discard
              </Button>

              <Button onClick={resetRecorder} variant="secondary" size="lg">
                Record New
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Recording"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Recording Title
            </label>
            <input
              id="title"
              type="text"
              value={recordingTitle}
              onChange={(e) => setRecordingTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter title..."
              autoFocus
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setShowSaveModal(false)}
              variant="ghost"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRecording}
              variant="primary"
              disabled={!recordingTitle.trim() || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
