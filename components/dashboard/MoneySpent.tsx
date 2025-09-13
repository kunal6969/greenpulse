
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import { BUILDING_USAGE_DATA } from '../../constants';

const BuildingBreakdown: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <Card className={className}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Building Breakdown</h2>
            <div className="space-y-2">
                {BUILDING_USAGE_DATA.map((building) => (
                    <div key={building.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div>
                            <p className="font-medium text-text-primary">{building.name}</p>
                            <p className="text-sm text-text-secondary">{building.usage.toFixed(1)} kWh</p>
                        </div>
                        <div className={`flex items-center text-sm font-semibold ${building.change > 0 ? 'text-red-400' : 'text-primary'}`}>
                            {building.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="ml-1">{Math.abs(building.change)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default BuildingBreakdown;