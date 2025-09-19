import React from 'react';

const Leaf = ({ style }: { style: React.CSSProperties }) => (
  // The scale will be part of the style for the container
  <div style={style} className="leaf-container-bg">
    <svg width="30" height="30" viewBox="0 0 100 100" className="leaf-swing-bg" style={{ animationDelay: style.animationDelay }}>
      <path
        d="M50 0 C25 25, 25 75, 50 100 C75 75, 75 25, 50 0 Z"
        fill="var(--primary)"
      />
    </svg>
  </div>
);

const FloatingLeaves: React.FC = () => {
  const leaves = React.useMemo(() => Array.from({ length: 15 }).map((_, i) => {
    // Simulate depth: smaller scale means further away
    const scale = Math.random() * 0.7 + 0.3; // Scale from 0.3 to 1.0

    // Further leaves are slower
    const fallDuration = `${(1 / scale) * (Math.random() * 8 + 12)}s`; // ~12s to ~40s
    
    // Further leaves swing less dramatically
    const swingMagnitude = scale * 60; // px
    const swingRotation = scale * 50; // deg
    const swingDuration = `${(1 / scale) * (Math.random() * 3 + 4)}s`; // ~4s to ~13s
    
    const left = `${Math.random() * 100}%`;
    const animationDelay = `${Math.random() * 20}s`;
    
    return {
      id: i,
      style: {
        '--fall-duration-bg': fallDuration,
        '--swing-duration-bg': swingDuration,
        '--left-bg': left,
        '--translateX-bg': `${(Math.random() - 0.5) * 200}px`, // Add horizontal drift
        '--rotate-bg': `${(Math.random() - 0.5) * 1000}deg`,
        '--swingX-bg': `${(Math.random() - 0.5) * swingMagnitude}px`,
        '--swingRotate-bg': `${(Math.random() - 0.5) * swingRotation}deg`,
        // Set opacity based on scale for depth perception
        '--leaf-opacity': scale * 0.35, // max opacity of 0.35 for subtle effect
        // Apply scale transform to the container
        transform: `scale(${scale})`,
        animationDelay,
      } as React.CSSProperties
    };
  }), []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {leaves.map(leaf => (
        <Leaf key={leaf.id} style={leaf.style} />
      ))}
    </div>
  );
};

export default FloatingLeaves;