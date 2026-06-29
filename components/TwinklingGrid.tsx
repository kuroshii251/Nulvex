"use client";

import React, { useMemo, useEffect, useState } from 'react';

export default function TwinklingGrid({
  squareSize = 40,
  numSquares = 60,
  className = "",
}: {
  squareSize?: number;
  numSquares?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const squares = useMemo(() => {
    const sq = [];
    for (let i = 0; i < numSquares; i++) {
      // Generate grid coordinates spanning a very large area (0 to 100 on both axes)
      const gridX = Math.floor(Math.random() * 100);
      const gridY = Math.floor(Math.random() * 100);
      const duration = (Math.random() * 3 + 2).toFixed(2); // 2s to 5s
      const delay = (Math.random() * 5).toFixed(2); // 0s to 5s
      sq.push({ gridX, gridY, duration, delay });
    }
    return sq;
  }, [numSquares]);

  return (
    <div className={`absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full stroke-white/5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="twinkling-grid-pattern"
            width={squareSize}
            height={squareSize}
            patternUnits="userSpaceOnUse"
          >
            <path d={`M.5 ${squareSize}V.5H${squareSize}`} fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#twinkling-grid-pattern)" />

        {mounted && (
          <svg x="0" y="0" className="overflow-visible">
            {squares.map((sq, i) => (
              <rect
                key={i}
                width={squareSize - 1}
                height={squareSize - 1}
                x={sq.gridX * squareSize + 1}
                y={sq.gridY * squareSize + 1}
                className="fill-white/10"
                style={{
                  opacity: 0,
                  animation: `twinkle ${sq.duration}s infinite alternate ${sq.delay}s`,
                }}
              />
            ))}
          </svg>
        )}
      </svg>
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
