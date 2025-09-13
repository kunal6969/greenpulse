import React, { useState, useContext, useEffect } from 'react';
import { AlertTriangle, Bell, Info, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import { Alert } from '../../types';
import { SimulationContext } from '../../contexts/SimulationContext';
import { dataService } from '../../services/dataService';

const AlertIcon: React.FC<{severity: Alert['severity']}> = ({ severity }) => {
    switch(severity) {
        case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'medium': return <Bell className="w-5 h-5 text-secondary" />;
        case 'low': return <Info className="w-5 h-5 text-blue-400" />;
        default: return null;
    }
}

const AlertsPanel: React.FC<{ className?: string }> = ({ className }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { simulationTime } = useContext(SimulationContext);

  useEffect(() => {
    const dynamicAlerts = dataService.generateAlerts(simulationTime);
    setAlerts(dynamicAlerts);
  }, [simulationTime]);

  const handleAcknowledge = (id: string) => {
    setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
  };

  return (
    <Card className={className}>
      <h2 className="text-lg font-semibold text-text-primary mb-4">Predictive Alerts</h2>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {alerts.length > 0 ? alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`
              group flex items-center p-3 rounded-lg transition-colors duration-200
              ${alert.severity === 'high' ? 'animate-pulse-bg' : 'hover:bg-white/5'}
            `}
          >
            <div className="shrink-0">
              <AlertIcon severity={alert.severity} />
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium text-text-primary text-sm leading-tight">{alert.description}</p>
              <p className="text-xs text-text-secondary mt-1">{alert.building} &bull; {alert.timestamp}</p>
            </div>
            <button 
              onClick={() => handleAcknowledge(alert.id)}
              aria-label={`Acknowledge alert: ${alert.description}`}
              className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-primary focus:outline-none focus:text-primary"
            >
              <CheckCircle size={18} />
            </button>
          </div>
        )) : (
          <div className="text-center py-10 text-text-secondary flex flex-col items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary/50" />
            <p className="mt-3 font-medium text-text-primary">All Clear</p>
            <p className="text-sm">No active alerts to show.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertsPanel;