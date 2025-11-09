import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
  return (
    <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 text-center container mx-auto px-4 sm:px-6 landing-hero">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-text-primary leading-tight animate-fade-in">
        A Web-Based Platform to Monitor, Predict, and <span className="text-primary">Manage Institutional Energy Usage</span>
      </h1>
      <p className="mt-6 sm:mt-8 max-w-3xl mx-auto text-base sm:text-lg text-text-secondary animate-fade-in" style={{ animationDelay: '200ms' }}>
        GreenPulse leverages AI-driven analytics and predictive alerts to reduce energy waste by 30-50%, providing the real-time insights needed to foster a culture of sustainability.
      </p>
      <div className="mt-8 sm:mt-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <button onClick={onLogin} className="bg-primary text-bg-primary font-bold py-3 px-6 sm:px-8 rounded-lg flex items-center space-x-2 hover:bg-primary-focus transition-transform duration-500 hover:scale-105 mx-auto text-base sm:text-lg shadow-glow-primary">
          <span>Explore the Dashboard</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;