"use client";

import { AUDIO_CONFIG, MAX_RECORDING_DURATION } from "@/lib/utils/constants";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const startRecording = useCallback(
    async (deviceId?: string) => {
      setError(null);

      try {
        const constraints: MediaStreamConstraints = {
          audio: deviceId
            ? { deviceId: { exact: deviceId }, ...AUDIO_CONFIG }
            : AUDIO_CONFIG,
        };

        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);

        const mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: AUDIO_CONFIG.mimeType,
        });

        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        setDuration(0);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: AUDIO_CONFIG.mimeType,
          });
          const url = URL.createObjectURL(blob);

          setAudioBlob(blob);
          setAudioURL(url);

          // Clean up stream
          mediaStream.getTracks().forEach((track) => track.stop());
          setStream(null);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);

        // Start timer
        timerRef.current = setInterval(() => {
          setDuration((prev) => {
            const newDuration = prev + 1;

            // Auto-stop at max duration
            if (newDuration >= MAX_RECORDING_DURATION) {
              stopRecording();
            }

            return newDuration;
          });
        }, 1000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start recording";
        setError(errorMessage);
        console.error("Recording error:", err);
      }
    },
    [stopRecording],
  );

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  }, [isRecording, isPaused]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      // Clean up stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    setAudioURL(null);
    setAudioBlob(null);
  }, [stream]);

  const resetRecorder = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setAudioURL(null);
    setAudioBlob(null);
    setDuration(0);
    setError(null);
  }, [audioURL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL, stream]);

  return {
    isRecording,
    isPaused,
    duration,
    audioURL,
    audioBlob,
    error,
    stream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    resetRecorder,
  };
}
