
import React from 'react';
import { LayoutDashboard, BarChart3, Cpu, Power, Award, FileText } from 'lucide-react';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard' },
        { icon: BarChart3, label: 'Analytics' },
        { icon: Cpu, label: 'Forecasting' },
        { icon: Award, label: 'Rewards' },
        { icon: FileText, label: 'Reports' },
    ];

    return (
        <aside className="w-64 bg-bg-secondary/80 backdrop-blur-lg flex-shrink-0 flex flex-col border-r border-border-color p-4">
            <div className="flex items-center mb-10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#68D8B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#68D8B1" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#68D8B1" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold ml-2 text-primary">GREENPULSE</span>
            </div>
            <nav className="flex-1">
                <ul>
                    {navItems.map(({ icon: Icon, label }) => (
                        <li key={label} className="my-1">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActivePage(label); }}
                                className={`flex items-center py-3 px-4 rounded-lg transition-all duration-500 ease-in-out group transform hover:translate-x-1 ${
                                    activePage === label
                                        ? 'bg-primary/10 text-primary font-semibold shadow-inner shadow-primary/10'
                                        : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
                                }`}
                            >
                                <Icon size={20} className={`mr-3 transition-colors group-hover:text-primary ${activePage === label ? 'text-primary' : ''}`} />
                                <span>{label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <button 
                    onClick={onLogout}
                    className="flex items-center w-full py-3 px-4 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all duration-500 ease-in-out transform hover:translate-x-1 group"
                >
                    <Power size={20} className="mr-3 transition-colors group-hover:text-red-400" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;