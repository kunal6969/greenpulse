
import React from 'react';
import Card from '../ui/Card';
import ProgressTracker from './ProgressTracker';
import BadgesGallery from './BadgesGallery';

const RewardsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary animate-fade-in-down">Your Rewards Hub</h1>
      <p className="text-text-secondary animate-fade-in-down" style={{ animationDelay: '100ms' }}>
        Track your energy-saving achievements, earn Green Points (GP), and unlock exclusive badges.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
          <ProgressTracker />
        </div>
        <div className="lg:col-span-2 animate-fade-in-down" style={{ animationDelay: '300ms' }}>
          <BadgesGallery />
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
