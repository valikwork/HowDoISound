"use client";

import { VISUALIZER_CONFIG } from "@/lib/utils/constants";
import { useEffect, useRef } from "react";

export function useAudioVisualizer(
  stream: MediaStream | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const animationIdRef = useRef<number | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | undefined>(undefined);
  const audioContextRef = useRef<AudioContext | undefined>(undefined);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create audio context and analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = VISUALIZER_CONFIG.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = VISUALIZER_CONFIG.barWidth;
      const barGap = VISUALIZER_CONFIG.barGap;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        ctx.fillStyle = VISUALIZER_CONFIG.barColor;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + barGap;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stream, canvasRef]);
}
