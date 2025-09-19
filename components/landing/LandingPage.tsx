import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import DifferentiatorsSection from './DifferentiatorsSection';
import TeamSection from './TeamSection';
import LandingFooter from './LandingFooter';
import CursorSparkle from '../ui/CursorSparkle';
import FloatingLeaves from '../ui/FloatingLeaves';
import FlowingGlints from '../ui/FlowingGlints';
import AmbientSoundPlayer from '../ui/AmbientSoundPlayer';
import AuroraBackground from '../ui/AuroraBackground';
import GlowingOrbs from '../ui/GlowingOrbs';
import DriftingParticles from '../ui/DriftingParticles';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="bg-bg-primary/80 text-text-primary font-outfit relative">
      <CursorSparkle />
      <FloatingLeaves />
      <FlowingGlints />
      <AuroraBackground />
      <GlowingOrbs />
      <DriftingParticles />
      <AmbientSoundPlayer />
      <LandingHeader onLogin={onLogin} />
      <main>
        <HeroSection onLogin={onLogin} />
        <FeaturesSection />
        <HowItWorksSection />
        <DifferentiatorsSection />
        <TeamSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;