"use client";

import { useState } from "react";

interface CuteLampProps {
  onChainClick?: () => void;
  isPulled?: boolean;
}

export function CuteLamp({ onChainClick, isPulled = false }: CuteLampProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-w-md"
        style={{ overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Light Beam */}
        <defs>
          <linearGradient id="lightBeam" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop
              offset="0%"
              stopColor="#FFA500"
              stopOpacity={isPulled ? "0.5" : "0.2"}
            />
            <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="200"
          cy="350"
          rx="120"
          ry="80"
          fill="url(#lightBeam)"
          opacity={isPulled ? "0.8" : "0.4"}
          className="transition-opacity duration-500"
        />

        {/* Lamp Base */}
        <circle cx="200" cy="450" r="35" fill="#FFFFFF" />

        {/* Lamp Stem */}
        <rect x="190" y="280" width="20" height="170" fill="#FFFFFF" rx="5" />

        {/* Lamp Shade (Green with face) */}
        <g transform="translate(200, 280)">
          {/* Shade body */}
          <path
            d="M -80 0 L -60 60 L 60 60 L 80 0 Z"
            fill="#6B8E6B"
            stroke="#5A7A5A"
            strokeWidth="2"
          />

          {/* Left Eye - closed when sleeping, open when pulled */}
          {isPulled ? (
            <path
              d="M -35 20 Q -35 15 -30 15 Q -25 15 -25 20 Q -25 25 -30 25 Q -35 25 -35 20"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <line
              x1="-35"
              y1="20"
              x2="-25"
              y2="20"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Right Eye */}
          {isPulled ? (
            <path
              d="M 25 20 Q 25 15 30 15 Q 35 15 35 20 Q 35 25 30 25 Q 25 25 25 20"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <line
              x1="25"
              y1="20"
              x2="35"
              y2="20"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Mouth - smile when pulled */}
          {isPulled ? (
            <path
              d="M -20 40 Q 0 50 20 40"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M -20 40 Q 0 35 20 40"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Tongue - only show when pulled */}
          {isPulled && <ellipse cx="0" cy="45" rx="8" ry="6" fill="#FF6B6B" />}
        </g>

        {/* Pull Chain with clickable tongue */}
        <g>
          {/* Chain cord */}
          <line
            x1="200"
            y1="280"
            x2="200"
            y2={isPulled ? "180" : "200"}
            stroke="#666"
            strokeWidth="3"
            className="hidden md:block transition-all duration-300"
          />

          {/* Chain pull end (red tongue) - clickable */}
          <g
            transform={`translate(200, ${isPulled ? 180 : 200})`}
            className="hidden md:block transition-transform duration-300"
            style={{ cursor: "pointer" }}
          >
            <circle
              cx="0"
              cy="0"
              r="12"
              fill={isHovered ? "#FF4444" : "#FF6B6B"}
              className="transition-all duration-200"
              style={{
                filter: isHovered
                  ? "drop-shadow(0 0 8px rgba(255, 107, 107, 0.8))"
                  : "none",
                cursor: "pointer",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onChainClick}
            />
            {/* Tongue shape */}
            <ellipse
              cx="0"
              cy="3"
              rx="6"
              ry="4"
              fill="#CC0000"
              style={{ pointerEvents: "none" }}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
