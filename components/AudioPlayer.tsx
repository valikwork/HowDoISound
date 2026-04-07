"use client";

import AudioSlider from "@/components/ui/AudioSlider";
import Button from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils/formatters";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  audioURL: string;
  title?: string;
}

export default function AudioPlayer({ audioURL, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
      <audio ref={audioRef} src={audioURL} preload="metadata" />

      {title && (
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlay}
          variant="primary"
          size="sm"
          className="flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Button>

        <div className="flex-1">
          <AudioSlider
            value={currentTime}
            max={duration}
            onChange={handleSliderChange}
            audioRef={audioRef}
            isPlaying={isPlaying}
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
