import React, { useContext } from 'react';
import TimeControl from './TimeControl';
import BuildingSelector from './BuildingSelector';
import { SimulationContext } from '../../contexts/SimulationContext';
import { Menu } from 'lucide-react';

const Header: React.FC<{ title: string; subtitle: string; toggleSidebar: () => void; }> = ({ title, subtitle, toggleSidebar }) => {
    const { dataStartDate, dataEndDate, isLoading } = useContext(SimulationContext);

    const formatDate = (date: Date | null) => {
        if (!date) return '...';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <header className="flex-shrink-0 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-border-color header">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="lg:hidden mr-4 text-text-secondary hover:text-primary">
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-text-primary header-title">{title}</h1>
                    <p className="text-xs sm:text-sm text-text-secondary">{subtitle}</p>
                    {!isLoading && dataStartDate && dataEndDate && (
                        <p className="text-xs text-text-secondary font-mono mt-1 animate-fade-in hidden sm:block">
                            Dataset Range: {formatDate(dataStartDate)} to {formatDate(dataEndDate)}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full lg:w-auto justify-end">
                <BuildingSelector />
                <TimeControl />
            </div>
        </header>
    );
};

export default Header;