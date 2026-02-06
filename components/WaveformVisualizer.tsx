"use client";

import { useAudioVisualizer } from "@/hooks/useAudioVisualizer";
import { useRef } from "react";

interface WaveformVisualizerProps {
  stream: MediaStream | null;
  width?: number;
  height?: number;
}

export default function WaveformVisualizer({
  stream,
  width = 600,
  height = 100,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAudioVisualizer(stream, canvasRef);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"
    />
  );
}
