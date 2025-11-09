import React from 'react';
import Card from '../ui/Card';
import useScrollAnimate from '../../hooks/useScrollAnimate';

const FeatureCard = ({ title, text, delay }: { title: string, text: string, delay: number }) => {
    const { ref, isVisible } = useScrollAnimate();
    return (
        <Card ref={ref} className={`text-center transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms`}}>
            <h3 className="text-2xl font-bold text-primary">{title}</h3>
            <p className="mt-4 text-text-secondary">{text}</p>
        </Card>
    );
};


const FeaturesSection: React.FC = () => {
    const features = [
        {
            title: 'Reduce Energy Waste by 30-50%',
            text: 'Leverage AI-driven counterfactual benchmarks and predictive alerts to identify and eliminate unnecessary energy consumption.'
        },
        {
            title: 'Real-Time Monitoring',
            text: 'Solve inefficient energy management with a dynamic dashboard that provides instant insights into your energy consumption patterns.'
        },
        {
            title: 'Gamified Engagement',
            text: 'Our gamification dashboard incentivizes long-term engagement through contests and leaderboards based on energy savings.'
        }
    ];

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FIX: Explicitly pass props to FeatureCard. This avoids passing the 'key' attribute as a prop, which can occur with object spreading and cause a type error. */}
        {features.map((feature, index) => (
            <FeatureCard key={index} title={feature.title} text={feature.text} delay={index * 150} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;