import React, { useMemo } from 'react';

const ORB_COUNT = 20;

const GlowingOrbs: React.FC = () => {
    const orbs = useMemo(() => Array.from({ length: ORB_COUNT }).map((_, i) => ({
        id: i,
        style: {
            '--size': `${Math.random() * 3 + 2}px`, // 2px to 5px
            '--x-pos': `${Math.random() * 100}vw`,
            '--y-pos': `${Math.random() * 100}vh`,
            '--delay': `${Math.random() * 20}s`, // Float animation delay
            '--pulse-delay': `${Math.random() * 5}s`, // Pulse animation delay
            '--duration': `${Math.random() * 20 + 20}s`, // 20s to 40s float duration
            '--drift-x': `${(Math.random() - 0.5) * 100}px`,
            '--drift-y': `${(Math.random() - 0.5) * 100}px`,
        } as React.CSSProperties
    })), []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
            {orbs.map(orb => (
                <div key={orb.id} className="glowing-orb" style={orb.style} />
            ))}
        </div>
    );
};

export default GlowingOrbs;
