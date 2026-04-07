"use client";

import { useEffect, useRef, useState } from "react";

interface AudioSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  isPlaying?: boolean;
  className?: string;
}

export default function AudioSlider({
  value,
  max,
  onChange,
  audioRef,
  isPlaying = false,
  className = "",
}: AudioSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const updateValueFromPosition = (clientX: number) => {
    const slider = sliderRef.current;
    if (!slider || max === 0) return;

    const rect = slider.getBoundingClientRect();
    const pos = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = pos / rect.width;
    const newValue = percentage * max;

    onChange(newValue);
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateValueFromPosition(e.clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateValueFromPosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // Smooth animation loop for playback
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) {
      setDisplayValue(value);
      return;
    }

    const updateDisplayValue = () => {
      if (audio && !audio.paused && !isDragging) {
        setDisplayValue(audio.currentTime);
        rafRef.current = requestAnimationFrame(updateDisplayValue);
      }
    };

    if (isPlaying && !isDragging) {
      rafRef.current = requestAnimationFrame(updateDisplayValue);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setDisplayValue(value);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, isDragging, audioRef, value]);

  const progress = max > 0 ? (displayValue / max) * 100 : 0;

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-2 cursor-pointer group ${className}`}
      onClick={handleSliderClick}
      onMouseDown={handleMouseDown}
    >
      {/* Track */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />

      {/* Progress */}
      <div
        className="absolute inset-y-0 left-0 bg-blue-600 rounded-full"
        style={{ width: `${progress}%` }}
      />

      {/* Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-md 
                   transition-transform group-hover:scale-110 cursor-grab active:cursor-grabbing"
        style={{ left: `calc(${progress}% - 8px)` }}
      />
    </div>
  );
}
