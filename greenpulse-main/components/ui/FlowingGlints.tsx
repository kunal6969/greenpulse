import React, { useMemo } from 'react';

const FlowingGlints: React.FC = () => {
    const glints = useMemo(() => [
        {
            id: 1,
            animationClass: 'animate-flowing-glint-1',
            style: {
                animationDuration: '15s',
                animationDelay: '0s',
            },
        },
        {
            id: 2,
            animationClass: 'animate-flowing-glint-2',
            style: {
                animationDuration: '20s',
                animationDelay: '5s',
            },
        },
        {
            id: 3,
            animationClass: 'animate-flowing-glint-3',
            style: {
                animationDuration: '25s',
                animationDelay: '12s',
            },
        },
    ], []);

    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
            {glints.map(glint => (
                <div key={glint.id} className={`glint ${glint.animationClass}`} style={glint.style} />
            ))}
        </div>
    );
};

export default FlowingGlints;