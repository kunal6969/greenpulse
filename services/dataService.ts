import { EnergyDataPoint, Alert, Anomaly, BuildingDataRecord, LeaderboardEntry, LiveEvent } from '../types';

// The error message indicates the path does not contain '/api'.
// Removing it to align with the observed network request.
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

// --- API HELPER ---

/**
 * A generic helper function to fetch data from the API backend.
 * It handles the base URL, error checking, and JSON parsing.
 * @param endpoint The API endpoint to request (e.g., '/leaderboard').
 * @param options Optional fetch options (for POST requests, etc.).
 * @returns A promise that resolves to the JSON response.
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // The backend server now has CORS enabled (allow_origins=["*"]),
    // which means a CORS proxy is no longer needed and may cause issues with POST request bodies.
    // Removing the proxy and fetching directly from the API.
    const requestUrl = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(requestUrl, options);
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API server error for ${requestUrl}: ${response.status}`, errorBody);
            throw new Error(`API request failed with status ${response.status}. See console for details.`);
        }
        
        const textResponse = await response.text();
        try {
            return JSON.parse(textResponse) as T;
        } catch (e) {
            console.error("Failed to parse JSON response. Raw response:", textResponse);
            throw new Error(`The response from the server was not valid JSON, which may indicate an API error.`);
        }

    } catch (error) {
        console.error(`Network error during fetch for endpoint "${endpoint}":`, error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
             // This error can occur if the API server is down or there is a general network connectivity problem.
             throw new Error(`Network Error: Could not connect to the API server at ${API_BASE_URL}. Please check your internet connection and the status of the API server.`);
        }
        // Re-throw other errors
        throw error;
    }
}

// FIX: Added a cache for building data to prevent redundant API calls.
const buildingDataCache = new Map<number, BuildingDataRecord[]>();

// --- REAL API FUNCTIONS ---

export const fetchBuildingData = async (buildingId: number): Promise<BuildingDataRecord[]> => {
    // FIX: Check the cache before making a network request.
    if (buildingDataCache.has(buildingId)) {
        console.log(`Cache hit for building ${buildingId}`);
        return buildingDataCache.get(buildingId)!;
    }

    console.log(`Fetching data for building ${buildingId}`);
    const data = await apiFetch<BuildingDataRecord[]>(`/building/${buildingId}`);
    
    // FIX: Store the fetched data in the cache for future use.
    if (data && data.length > 0) {
        buildingDataCache.set(buildingId, data);
    }
    
    return data;
};

export interface BuildingCumulativeData {
    building_id: number;
    cumulative_net_savings: number;
}

export const fetchAllBuildingsCumulativeData = async (endTime: Date): Promise<BuildingCumulativeData[]> => {
    console.log(`Fetching efficiency data for all buildings up to time ${endTime.toISOString()}`);
    
    // Per user request, use the /building/:id endpoint for each building.
    // Fetching for 20 buildings as a balance between completeness and performance.
    const buildingIds = Array.from({ length: 20 }, (_, i) => i + 1);
    
    const buildingDataPromises = buildingIds.map(id => fetchBuildingData(id));
    
    // Use Promise.allSettled to handle potential failures for individual buildings
    const results = await Promise.allSettled(buildingDataPromises);

    const cumulativeData: BuildingCumulativeData[] = [];

    results.forEach((result, index) => {
        const building_id = buildingIds[index];

        if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
            const records = result.value;
            const relevantRecords = records.filter(record => new Date(record.timestamp) <= endTime);

            const savings = relevantRecords.reduce((total, record) => {
                const actual = record.meter_reading ?? 0;
                const predicted = record.predicted_meter_reading ?? 0;
                return total + (predicted - actual);
            }, 0);

            cumulativeData.push({
                building_id: building_id,
                cumulative_net_savings: savings
            });
        } else {
            // If fetch failed or returned no data, treat savings as 0.
            if (result.status === 'rejected') {
                console.error(`Failed to fetch data for building ${building_id}:`, result.reason);
            }
            cumulativeData.push({ building_id, cumulative_net_savings: 0 });
        }
    });

    return cumulativeData;
};

export const predictFutureUsage = async (data: PredictRequest): Promise<BuildingDataRecord[]> => {
    console.log(`Forecasting future usage for building ${data.building_id}`);
    return apiFetch<BuildingDataRecord[]>('/predict_future_usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export const suggestParamAdjustment = async (data: SuggestRequest): Promise<{ suggestion: string }> => {
    console.log('Suggesting param adjustment');
    return apiFetch<{ suggestion: string }>('/suggest_param_adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
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

export const fetchAlerts = async (time: Date): Promise<Alert[]> => {
    console.log(`Fetching alerts for time ${time.toISOString()}`);
    return apiFetch<Alert[]>(`/alerts?time=${time.toISOString()}`);
};

export interface BuildingBreakdownData {
  id: string;
  name: string;
  usage: number;
  change: number;
}

export const fetchBuildingBreakdown = async (time: Date): Promise<BuildingBreakdownData[]> => {
    console.log(`Fetching building breakdown for time ${time.toISOString()}`);
    return apiFetch<BuildingBreakdownData[]>(`/breakdown?time=${time.toISOString()}`);
};

export const fetchLiveEvents = async (since?: Date): Promise<LiveEvent[]> => {
    const endpoint = since ? `/events?since=${since.toISOString()}` : '/events';
    console.log(`Fetching live events from ${endpoint}`);
    return apiFetch<LiveEvent[]>(endpoint);
};