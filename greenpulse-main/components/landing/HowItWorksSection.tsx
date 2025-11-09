import React from 'react';
import Card from '../ui/Card';
import useScrollAnimate from '../../hooks/useScrollAnimate';


const HowItWorksSection: React.FC = () => {
    const { ref, isVisible } = useScrollAnimate();

    const steps = [
        { title: 'Real-Time Dashboard', text: 'Monitor energy usage effectively across your institution with a live, intuitive dashboard that breaks down consumption for clear analysis.' },
        { title: 'Predictive Analytics', text: 'Our platform identifies underperforming systems early by comparing actual usage against AI-generated predictions, flagging potential waste.' },
        { title: 'Promote Energy Efficiency', text: 'Receive actionable insights and alerts designed to help you minimize unnecessary energy consumption and optimize operational efficiency.' },
        { title: 'Gamified Incentives', text: 'Engage the entire community with a gamified dashboard, featuring contests and leaderboards that reward tangible energy savings.' },
        ];

  return (
    <section ref={ref} className="py-20 bg-bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-text-primary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`}>How Our Platform Works</h2>
            <p className={`mt-4 max-w-2xl mx-auto text-text-secondary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: '150ms'}}>
                Our integrated cycle of monitoring, analysis, and engagement provides a comprehensive solution for smart energy management.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
                <Card key={index} className={`transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: `${(index + 2) * 150}ms`}}>
                    <div className="flex items-center">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg">{index + 1}</span>
                        <h3 className="ml-4 text-xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="mt-4 text-text-secondary">{step.text}</p>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;