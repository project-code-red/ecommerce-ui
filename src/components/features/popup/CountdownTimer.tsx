"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  duration?: number; // in seconds
  className?: string;
  onComplete?: () => void;
}

export function CountdownTimer({
  duration = 3600, // 1 hour default
  className,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  if (timeLeft <= 0) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="text-gray-600">Offer ends in:</span>
      <div className="flex items-center gap-1.5 font-semibold text-secondary">
        <span className="px-2 py-1 bg-gray-100 rounded">{formatTime(hours)}</span>
        <span>:</span>
        <span className="px-2 py-1 bg-gray-100 rounded">{formatTime(minutes)}</span>
        <span>:</span>
        <span className="px-2 py-1 bg-gray-100 rounded">{formatTime(seconds)}</span>
      </div>
    </div>
  );
}

