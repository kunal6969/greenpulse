
import { LeaderboardEntry, LiveEvent, Alert, EnergyDataPoint } from './types';

export const BUILDING_USAGE_DATA = [
    { id: 'b1', name: 'Science Wing', usage: 1250.5, change: 12.5 },
    { id: 'b2', name: 'Engineering Block', usage: 2890.2, change: -5.2 },
    { id: 'b3', name: 'Library', usage: 870.1, change: 8.1 },
    { id: 'b4', name: 'Admin Block', usage: 650.8, change: -2.0 },
    { id: 'b5', name: 'Dormitory A', usage: 1530.9, change: 3.5 },
];

export const SAVINGS_LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, name: 'Engineering Dept.', score: 8450, rankChange: 'up' },
    { rank: 2, name: 'Facilities Mgmt.', score: 8120, rankChange: 'down' },
    { rank: 3, name: 'Science Dept.', score: 7980, rankChange: 'stable' },
    { rank: 4, name: 'Arts & Humanities', score: 7500, rankChange: 'up' },
    { rank: 5, name: 'Library Staff', score: 7310, rankChange: 'stable' },
    { rank: 6, name: 'Athletics Dept.', score: 6950, rankChange: 'down' },
];

export const AI_SUGGESTIONS = [
    "What's the current highest energy consumer?",
    "Summarize any active high-priority alerts.",
    "Compare the Science Wing and Engineering Block.",
    "Who is winning the savings leaderboard?",
];

export const PREDICTIVE_ALERTS: Alert[] = [
    { id: '1', timestamp: '2 minutes ago', severity: 'high', building: 'Science Wing', description: 'HVAC unit showing signs of imminent failure. High energy draw detected.' },
    { id: '2', timestamp: '45 minutes ago', severity: 'medium', building: 'Library', description: 'Lighting grid in West Wing is drawing 20% more power than expected.' },
    { id: '3', timestamp: '5 hours ago', severity: 'low', building: 'Admin Block', description: 'Server room temperature slightly above optimal.' },
];

export const ENERGY_DISTRIBUTION_DATA = [
  { name: 'HVAC', value: 45, fill: '#68D8B1' },
  { name: 'Lighting', value: 25, fill: '#F7C948' },
  { name: 'Equipment', value: 20, fill: '#8884d8' },
  { name: 'Other', value: 10, fill: '#FF8042' },
];

export const LIVE_FEED_DATA: LiveEvent[] = [
    { id: 'evt5', timestamp: new Date(Date.now() - 5000).toLocaleTimeString(), type: 'info', device: 'HVAC Unit 2', message: 'System recalibrated successfully.' },
    { id: 'evt4', timestamp: new Date(Date.now() - 15000).toLocaleTimeString(), type: 'success', device: 'Admin Mainframe', message: 'Energy saving mode activated.' },
    { id: 'evt3', timestamp: new Date(Date.now() - 32000).toLocaleTimeString(), type: 'warning', device: 'Library West Wing', message: 'Unusual spike in usage detected.' },
    { id: 'evt2', timestamp: new Date(Date.now() - 65000).toLocaleTimeString(), type: 'error', device: 'Dormitory B', message: 'Device offline. No data being received.' },
    { id: 'evt1', timestamp: new Date(Date.now() - 120000).toLocaleTimeString(), type: 'info', device: 'Engineering Block', message: 'Power draw nominal.' },
];


export const ENERGY_CONSUMPTION_DATA: EnergyDataPoint[] = [
    { time: '00:00', actual: 45.2, predicted: 48.5 },
    { time: '01:00', actual: 42.1, predicted: 44.0 },
    { time: '02:00', actual: 40.5, predicted: 41.5 },
    { time: '03:00', actual: 39.8, predicted: 40.0 },
    { time: '04:00', actual: 41.2, predicted: 41.0 },
    { time: '05:00', actual: 48.9, predicted: 45.5 },
    { time: '06:00', actual: 60.3, predicted: 58.0 },
    { time: '07:00', actual: 75.6, predicted: 72.0 },
    { time: '08:00', actual: 88.1, predicted: 85.0 },
    { time: '09:00', actual: 92.4, predicted: 90.5 },
    { time: '10:00', actual: 95.0, predicted: 94.0 },
];
