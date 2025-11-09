import React from 'react';
import { BrainCircuit, Layers, PlugZap, Trophy } from 'lucide-react';
import useScrollAnimate from '../../hooks/useScrollAnimate';

const DifferentiatorsSection = () => {
    const { ref, isVisible } = useScrollAnimate();
    
    const differentiators = [
        { icon: BrainCircuit, title: 'AI-Driven Counterfactuals', text: 'Our platform uses sophisticated AI to simulate optimal energy usage based on weather, time-of-day, and historical patterns, providing highly accurate benchmarks.' },
        { icon: Layers, title: 'Integrated Tech Stack', text: 'Our solution uniquely combines ASHRAE data, predictive AI analytics, behavioral analysis, and blockchain into one scalable platform.' },
        { icon: PlugZap, title: 'Future-Ready Integration', text: 'Provides seamless integration with renewable sources and existing infrastructure like IoT-enabled smart meters, ensuring your system evolves with technology.' },
        { icon: Trophy, title: 'Behavioral-Focused Gamification', text: 'We incentivize sustained behavioral impact by using a savings-to-benchmark ratio as a scoring mechanism, fostering engagement and long-term energy reduction.' },
    ];

    return (
        <section ref={ref} className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-4xl md:text-5xl font-bold text-text-primary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`}>What Sets Us Apart</h2>
                     <p className={`mt-4 max-w-3xl mx-auto text-text-secondary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: '150ms'}}>
                        Our solution uniquely combines cutting-edge technology and behavioral science to deliver unparalleled energy management capabilities.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {differentiators.map((item, index) => (
                        <div key={index} className={`flex items-start transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: `${(index + 2) * 150}ms`}}>
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    <item.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                                <p className="mt-2 text-base text-text-secondary">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DifferentiatorsSection;