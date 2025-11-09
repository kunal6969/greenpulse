import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Added style prop to allow inline styling. This is used in AIInsightsPage for animation delays.
  style?: React.CSSProperties;
}

// FIX: Wrapped Card component with React.forwardRef to allow passing a ref.
// This is necessary for components like FeatureCard that use the useScrollAnimate hook.
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '', style }, ref) => {
  return (
    <div
      ref={ref}
      style={style}
      className={`
        bg-card-bg/80 backdrop-blur-lg 
        border border-glass-border 
        rounded-2xl shadow-card
        p-4 sm:p-6 
        transition-all duration-500 ease-in-out
        hover:border-primary/50 hover:shadow-glow-primary hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;