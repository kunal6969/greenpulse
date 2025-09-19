import React, { useMemo } from 'react';

const PARTICLE_COUNT = 50;

const DriftingParticles: React.FC = () => {
    const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const size = Math.random() * 2 + 1; // 1px to 3px
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        return {
            id: i,
            style: {
                width: `${size}px`,
                height: `${size}px`,
                // Animation properties
                animationDuration: `${Math.random() * 30 + 20}s`, // 20-50 seconds
                animationDelay: `${Math.random() * 40}s`, // 0-40 seconds delay
                // CSS variables for keyframes
                '--start-x': `${Math.random() * screenWidth}px`,
                '--start-y': `${Math.random() * screenHeight * 1.2 - (screenHeight * 0.1)}px`, // Start slightly off-screen y
                '--end-x': `${Math.random() * screenWidth}px`,
                '--end-y': `${Math.random() * screenHeight * 1.2 - (screenHeight * 0.1)}px`, // End slightly off-screen y
                '--max-opacity': `${Math.random() * 0.3 + 0.1}`, // 0.1 to 0.4 opacity
            } as React.CSSProperties
        };
    }), []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
            {particles.map(particle => (
                <div key={particle.id} className="particle" style={particle.style} />
            ))}
        </div>
    );
};

export default DriftingParticles;