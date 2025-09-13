
import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { LIVE_FEED_DATA } from '../../constants';
import { LiveEvent } from '../../types';
import { Zap, AlertTriangle, Info, CheckCircle, Cpu } from 'lucide-react';

const eventIcons: { [key in LiveEvent['type']]: React.ReactElement } = {
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle className="w-5 h-5 text-primary" />,
    warning: <AlertTriangle className="w-5 h-5 text-secondary" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
};

const eventBorderColors: { [key in LiveEvent['type']]: string } = {
    info: 'border-blue-400/20',
    success: 'border-primary/20',
    warning: 'border-secondary/20',
    error: 'border-red-500/20',
};

const getRandomEvent = (): LiveEvent => {
    const types: LiveEvent['type'][] = ['info', 'success', 'warning', 'error'];
    const devices = ['HVAC Unit 5', 'Library West Wing', 'Dormitory B', 'Science Lab 2A', 'Admin Building Mainframe'];
    const messages = [
        'Energy consumption stabilized.', 'Power draw nominal.', 'System rebooted successfully.',
        'Connection timeout detected.', 'Unusual spike in usage.', 'Device went offline.', 'Threshold exceeded.'
    ];
    
    return {
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type: types[Math.floor(Math.random() * types.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
    };
};

const LiveFeedPage: React.FC = () => {
  const [events, setEvents] = useState<LiveEvent[]>(LIVE_FEED_DATA);
  const [isLive, setIsLive] = useState(true);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let intervalId: ReturnType<typeof setInterval>;
    if (isLive) {
      intervalId = setInterval(() => {
        setEvents(prevEvents => [getRandomEvent(), ...prevEvents]);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isLive]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <Card className="h-full flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <Zap className="text-primary"/>
                <h2 className="text-lg font-semibold text-text-primary">Live Event Stream</h2>
            </div>
            <button
                onClick={() => setIsLive(!isLive)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center space-x-2 transition-colors ${
                    isLive
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
            >
                <Cpu size={16} />
                <span>{isLive ? 'Pause Feed' : 'Resume Feed'}</span>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 bg-black/20 rounded-lg p-4 border border-glass-border">
            <div className="space-y-3">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className={`flex items-start p-3 rounded-lg border-l-4 animate-fade-in-down ${eventBorderColors[event.type]}`}
                    >
                        <div className="shrink-0 mt-1">{eventIcons[event.type]}</div>
                        <div className="ml-3 flex-1">
                            <p className="font-mono text-xs text-text-secondary">
                                [{event.timestamp}] <span className="font-semibold text-text-primary">{event.device}</span>
                            </p>
                            <p className="text-sm text-text-primary mt-1">{event.message}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div ref={feedEndRef} />
        </div>
    </Card>
  );
};

export default LiveFeedPage;
