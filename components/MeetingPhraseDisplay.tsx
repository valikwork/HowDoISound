"use client";

import { MEETING_PHRASES } from "@/lib/utils/meetingPhrases";
import { useEffect, useState } from "react";

export default function MeetingPhraseDisplay() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(() =>
    Math.floor(Math.random() * MEETING_PHRASES.length),
  );
  const [isPhraseFading, setIsPhraseFading] = useState(false);
  const [isPhraseHovered, setIsPhraseHovered] = useState(false);
  const [useShortInterval, setUseShortInterval] = useState(false);

  useEffect(() => {
    if (isPhraseHovered) return;

    const intervalDuration = useShortInterval ? 3000 : 10000;

    const interval = setInterval(() => {
      setIsPhraseFading(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % MEETING_PHRASES.length);
        setIsPhraseFading(false);
        setUseShortInterval(false); // Reset to normal interval after first rotation
      }, 500);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isPhraseHovered, useShortInterval]);

  const handleMouseLeave = () => {
    setIsPhraseHovered(false);
    setUseShortInterval(true); // Use short interval for next rotation
  };

  const handleMouseEnter = () => {
    setIsPhraseHovered(true);
  };

  return (
    <div
      className="text-center mb-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
        And say something like... (Hover to pause)
      </p>
      <p
        className={`text-xl font-medium text-gray-900 dark:text-gray-100 transition-opacity duration-500 ${
          isPhraseFading ? "opacity-0" : "opacity-100"
        }`}
      >
        &ldquo;{MEETING_PHRASES[currentPhraseIndex]}&rdquo;
      </p>
    </div>
  );
}
