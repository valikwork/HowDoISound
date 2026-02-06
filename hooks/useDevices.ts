"use client";

import type { AudioDevice } from "@/types/audio";
import { useEffect, useState } from "react";

export function useDevices() {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission first
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Stop the stream immediately
          stream.getTracks().forEach((track) => track.stop());
        });

      // Now get the devices list
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceInfos
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Microphone ${device.deviceId.slice(0, 8)}`,
          kind: device.kind,
        }));

      setDevices(audioInputs);

      // Set default device
      if (audioInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      let errorMessage = "Failed to load devices";

      if (err instanceof Error) {
        // Handle specific permission errors
        if (err.name === "NotAllowedError") {
          errorMessage =
            "Microphone access denied. Please enable microphone permissions in your browser settings.";
        } else if (err.name === "NotFoundError") {
          errorMessage =
            "No microphone found. Please connect a microphone and try again.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Microphone is already in use by another application.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      console.error("Error loading devices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();

    // Listen for device changes
    const handleDeviceChange = () => {
      loadDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
    };
  }, []);

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoading,
    error,
    refreshDevices: loadDevices,
  };
}
