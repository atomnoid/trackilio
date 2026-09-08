'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedScoreProps {
  targetScore: number;
}

export function AnimatedScore({ targetScore }: AnimatedScoreProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetScore);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [targetScore]);

  return (
    <span className="tabular-nums">{display}</span>
  );
}
