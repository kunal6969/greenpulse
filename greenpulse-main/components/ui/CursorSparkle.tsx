import React, { useState, useEffect } from 'react';

const SPARKLE_COUNT = 10;
const DURATION = 500; // ms

interface Sparkle {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const CursorSparkle: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const newSparkle: Sparkle = {
        id: now,
        x: e.clientX,
        y: e.clientY,
        createdAt: now,
      };

      setSparkles(prev => {
        const newSparkles = [...prev, newSparkle].slice(-SPARKLE_COUNT);
        return newSparkles;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      const now = Date.now();
      setSparkles(prev => prev.filter(s => now - s.createdAt < DURATION));
    }, DURATION / 2);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {sparkles.map((sparkle, index) => {
        const life = (Date.now() - sparkle.createdAt) / DURATION;
        const style: React.CSSProperties = {
          left: `${sparkle.x}px`,
          top: `${sparkle.y}px`,
          opacity: 1 - life,
          transform: `translate(-50%, -50%) scale(${1 - life})`,
          animationDelay: `${index * 0.01}s`,
        };
        return (
          <div
            key={sparkle.id}
            className="sparkle"
            style={style}
          />
        );
      })}
    </>
  );
};

export default CursorSparkle;
