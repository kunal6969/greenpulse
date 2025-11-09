import React from 'react';
import Card from '../ui/Card';
import useScrollAnimate from '../../hooks/useScrollAnimate';
import { Code, Brain, Palette, Server, Blocks } from 'lucide-react';

const TeamSection = () => {
    const { ref, isVisible } = useScrollAnimate();

    const team = [
        { name: 'Priyansh Joshi', role: 'Frontend UI/UX Designer', description: 'Crafts the user interface and experience for a beautiful, intuitive dashboard.', icon: Palette },
        { name: 'Vikas Chandwara', role: 'Lead Web Developer', description: 'Leads the overall web development and application architecture.', icon: Code },
        { name: 'Anushka Rani', role: 'Backend Web Developer', description: 'Manages server-side logic, databases, and API integrations.', icon: Server },
        { name: 'Garvit Dudeja', role: 'AI/ML Engineer', description: 'Develops the core prediction engine and counterfactual models.', icon: Brain },
        { name: 'Kunal Thapliyal', role: 'AI/ML Engineer', description: 'Focuses on model optimization and deploying AI-driven insights.', icon: Brain },
        { name: 'Neel Shah', role: 'Blockchain & Web Developer', description: 'Integrates web technologies and explores blockchain applications.', icon: Blocks }
    ];

    return (
        <section ref={ref} className="py-20 bg-bg-secondary">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className={`text-4xl md:text-5xl font-bold text-text-primary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`}>Built By a Cross-Functional Team</h2>
                    <p className={`mt-4 max-w-2xl mx-auto text-text-secondary transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: '150ms'}}>
                        Our dedicated team combines expertise in web development, database management, and cutting-edge AI/ML to bring this vision to life.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <Card key={index} className={`text-center transition-all duration-500 ${isVisible ? 'animate-slide-and-fade-in' : 'opacity-0'}`} style={{animationDelay: `${(index + 2) * 150}ms`}}>
                           <div className="flex justify-center mb-4">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                                    <member.icon className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary">{member.name}</h3>
                            <p className="mt-2 font-semibold text-text-primary">{member.role}</p>
                            <p className="mt-2 text-text-secondary">{member.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;