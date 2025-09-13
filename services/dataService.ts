import { EnergyDataPoint, Alert, Anomaly, BuildingDataRecord } from '../types';

export const API_BASE_URL = 'https://green-pulse.onrender.com';

export interface PredictRequest {
    building_id: number;
    user_params: { [key: string]: any };
    predict_hours?: number;
    seq_length?: number;
}

export interface SuggestRequest {
    building_id: number;
    user_params: { [key: string]: any };
    target_usage: number;
    param_candidates?: string[];
    seq_length?: number;
}


export const fetchBuildingData = async (buildingId: number): Promise<BuildingDataRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/building/${buildingId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch building data for building ${buildingId}`);
    }
    return response.json();
};

export interface BuildingCumulativeData {
    building_id: number;
    cumulative_net_savings: number;
}

/**
 * Mocks fetching and calculating cumulative savings data for all buildings over the last 24 hours.
 * This is used to power the live leaderboard with rolling 24h performance data.
 * @param endTime The specific time marking the end of the 24-hour window.
 * @returns A promise that resolves to an array of objects containing building ID and their cumulative savings.
 */
export const fetchAllBuildingsCumulativeData = async (endTime: Date): Promise<BuildingCumulativeData[]> => {
    const startTime = new Date(endTime);
    startTime.setHours(endTime.getHours() - 24);

    const cumulativeSavings: { [buildingId: number]: number } = {};

    // Initialize savings map for all 100 buildings
    for (let i = 1; i <= 100; i++) {
        cumulativeSavings[i] = 0;
    }

    // Loop through each hour in the last 24-hour window
    for (let h = 0; h < 24; h++) {
        const currentTime = new Date(startTime);
        currentTime.setHours(startTime.getHours() + h);
        const hour = currentTime.getHours();

        // Generate data for each building for the current hour and add to cumulative savings
        for (let i = 1; i <= 100; i++) {
            // Re-use the same plausible data generation logic for consistency
            const basePredicted = 40 + (i % 20) * 3 + Math.sin(i) * 5;
            const timeFactor = Math.sin((hour * Math.PI) / 24) * 25; // Daily curve
            const predicted = basePredicted + timeFactor + (Math.random() - 0.5) * 5;
            
            const baseSavings = (i % 15) - 5; // Some buildings are inherently better/worse
            const randomSavingsFactor = (Math.random() - 0.4) * 8; // Performance fluctuation
            const actual = predicted - (baseSavings + randomSavingsFactor);
            
            const netSavingForHour = predicted - actual;
            cumulativeSavings[i] += netSavingForHour;
        }
    }
    
    const result: BuildingCumulativeData[] = Object.entries(cumulativeSavings).map(([buildingId, savings]) => ({
        building_id: Number(buildingId),
        cumulative_net_savings: savings,
    }));
    
    // Simulate a slightly longer network delay as this is a more intensive "query"
    await new Promise(res => setTimeout(res, 400));
    return result;
};


export const predictFutureUsage = async (data: PredictRequest): Promise<BuildingDataRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/predict_future_usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to get prediction');
    }
    return response.json();
};

export const suggestParamAdjustment = async (data: SuggestRequest) => {
    const response = await fetch(`${API_BASE_URL}/suggest_param_adjustment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to get suggestion');
    }
    return response.json();
};


export const processApiData = (records: BuildingDataRecord[]): EnergyDataPoint[] => {
    if (!records || records.length === 0) return [];
    return records
      .map(record => ({
        historical: new Date(record.timestamp),
        time: new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        actual: record.meter_reading,
        predicted: record.predicted_meter_reading,
      }))
      .filter(p => p.actual !== null || p.predicted !== null) // Keep if either value is present
      .sort((a, b) => a.historical!.getTime() - b.historical!.getTime());
};


// Dummy data and functions to keep other parts of the app from breaking
const DUMMY_POINT: EnergyDataPoint = { time: '12:00', actual: 50, predicted: 55, historical: new Date() };

export const dataService = {
  // These functions are now less relevant but kept for components that haven't been refactored
  generateAlerts: (time: Date): Alert[] => {
    return [
      { id: '1', timestamp: 'Just now', severity: 'high', building: 'Science Wing', description: `HVAC unit exceeded predicted usage.` },
      { id: '3', timestamp: '5 hours ago', severity: 'low', building: 'Admin Block', description: 'Server room temperature slightly above optimal.' },
    ];
  },
  generateAnomalies: (time: Date): Anomaly[] => {
     return [
       {
         id: `anomaly-1`,
         timestamp: new Date().toLocaleString(),
         building: 'Science Wing',
         device: 'HVAC Unit 3',
         severity: 'high',
         description: `Unscheduled spike detected.`,
         deviation: 0.6,
         data: [{time: '10:00', actual: 80, predicted: 50}, {time: '11:00', actual: 95, predicted: 55}]
       }
     ];
  },
};