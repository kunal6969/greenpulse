
import { GoogleGenAI } from "@google/genai";
import { EnergyDataPoint, ReportSummary } from '../types';

/**
 * Creates a comprehensive statistical summary of the energy data to be injected into the AI prompt.
 * @param buildingId The ID of the building being analyzed.
 * @param data An array of all available EnergyDataPoint objects.
 * @returns A formatted string summarizing the data for the AI.
 */
const createDataSummary = (buildingId: number, data: EnergyDataPoint[]): string => {
    if (!data || data.length < 2) {
        return "No sufficient energy data is available for analysis.";
    }

    const validData = data.filter(p => p.actual !== null && p.predicted !== null && p.historical);
    if (validData.length < 2) {
        return "No sufficient energy data is available for analysis.";
    }

    const firstPoint = validData[0];
    const lastPoint = validData[validData.length - 1];
    
    const startTime = firstPoint.historical!.toLocaleString();
    const endTime = lastPoint.historical!.toLocaleString();
    const durationHours = ((lastPoint.historical!.getTime() - firstPoint.historical!.getTime()) / (1000 * 60 * 60)).toFixed(1);

    let peak = { value: -Infinity, time: '' };
    let trough = { value: Infinity, time: '' };
    let totalActual = 0;
    let anomalyCount = 0;

    validData.forEach(p => {
        const actual = p.actual!;
        const predicted = p.predicted!;

        if (actual > peak.value) {
            peak = { value: actual, time: p.time };
        }
        if (actual < trough.value) {
            trough = { value: actual, time: p.time };
        }
        totalActual += actual;

        if (predicted > 0) {
            const deviation = (actual - predicted) / predicted;
            if (Math.abs(deviation) > 0.20) { // Anomaly threshold
                anomalyCount++;
            }
        }
    });

    const averageActual = (totalActual / validData.length).toFixed(2);

    const recentPoints = validData.slice(-3).map(p => 
        ` - Time: ${p.time}, Actual: ${p.actual?.toFixed(1)} kWh, Predicted: ${p.predicted?.toFixed(1)} kWh`
    ).join('\n');

    return `
**Full Data Context for Building #${buildingId}:**
- Time Range: ${startTime} to ${endTime} (approx. ${durationHours} hours)
- Data Points Analyzed: ${validData.length}
- Average Consumption: ${averageActual} kWh
- Peak Consumption: ${peak.value.toFixed(1)} kWh at ${peak.time}
- Lowest Consumption: ${trough.value.toFixed(1)} kWh at ${trough.time}
- Anomalies Detected (>20% deviation): ${anomalyCount}

**Most Recent Readings:**
${recentPoints}
`;
};


/**
 * Streams a response from the Gemini API based on a user prompt and contextual data.
 * @param prompt The user's message to the chatbot.
 * @param buildingId The ID of the building being analyzed.
 * @param contextData Real-time energy data to provide context for the AI.
 * @returns An async generator that yields the AI's response in chunks.
 */
export const streamChatResponse = async function* (prompt: string, buildingId: number, contextData: EnergyDataPoint[]) {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set. Chatbot will not function.");
        yield "I'm sorry, but I'm unable to connect to my services right now. Please ensure the API key is configured correctly.";
        return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataSummary = createDataSummary(buildingId, contextData);
    
    const systemInstruction = `You are GreenPulse AI, an expert energy analyst integrated into a real-time monitoring dashboard. Your purpose is to provide deep, data-driven insights to facility managers.

You have been provided with a comprehensive statistical summary of the building's recent energy data. Use this information as your primary source of truth.

**Your core tasks are:**
1.  **Deep Analysis:** Answer complex questions by synthesizing information from the full data context (e.g., "What were the trends this morning?", "Why was peak consumption so high?", "Correlate anomalies with time of day.").
2.  **Proactive Insights:** Identify and highlight key events from the data summary, such as peak usage times or the number of anomalies, and explain their potential significance.
3.  **Actionable Recommendations:** Provide specific, practical optimization tips based on the patterns you observe in the data. For instance, if peak usage is in the afternoon, suggest HVAC adjustments.
4.  **Data Interpretation:** When asked, clearly explain what the metrics in the data summary mean (e.g., "Average consumption is X, which is higher than the typical average of Y for a building of this type.").

**Response Guidelines:**
- Be concise, professional, and data-driven.
- Refer to specific data points from the summary to back up your claims (e.g., "Peak usage was at ${"peak.time"}...").
- Use markdown for formatting (bolding, lists) to improve readability.
- Do not invent data. If the user's question cannot be answered from the provided summary, state that the specific information isn't available in the current context.

**Full Data Summary:**
${dataSummary}
`;
    
    const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            thinkingConfig: { thinkingBudget: 0 } // For faster response
        }
    });

    for await (const chunk of responseStream) {
        yield chunk.text;
    }
};


const createReportSummaryPrompt = (summary: ReportSummary): string => {
  return `
**Energy Performance Report Summary:**
- Building ID: ${summary.buildingId}
- Period: ${summary.startDate} to ${summary.endDate}
- Total Actual Consumption: ${summary.totalActualKwh.toFixed(1)} kWh
- Total Predicted Consumption: ${summary.totalPredictedKwh.toFixed(1)} kWh
- Net Savings: ${summary.netSavingsKwh.toFixed(1)} kWh (${summary.netSavingsKwh >= 0 ? 'Savings' : 'Over-consumption'})
- Peak Consumption: ${summary.peakConsumption.value.toFixed(1)} kWh (on ${summary.peakConsumption.time})
- Lowest Consumption: ${summary.lowestConsumption.value.toFixed(1)} kWh (on ${summary.lowestConsumption.time})
- Anomalies Detected (>20% deviation): ${summary.anomalyCount}
`;
};

/**
 * Generates a professional energy report consultation from a data summary.
 * @param summary The statistical summary of the energy data for the report period.
 * @returns A promise that resolves to the AI-generated consultation text.
 */
export const generateReportConsultation = async (summary: ReportSummary): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return "AI consultation is unavailable: API key is not configured.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const dataSummaryPrompt = createReportSummaryPrompt(summary);
    
    const systemInstruction = `You are GreenPulse AI, an expert energy consultant. Your task is to analyze the provided energy performance summary and generate a professional, actionable report for a facility manager.

**Structure your response in the following format using markdown:**

### 1. Executive Summary
Provide a brief, high-level overview of the building's performance during the specified period. State clearly whether the building performed efficiently (savings) or inefficiently (over-consumption).

### 2. Key Observations
- Analyze the total consumption vs. prediction. Explain what the net savings or overage means.
- Comment on the peak and lowest consumption points. Are they expected? Do they suggest opportunities?
- Discuss the number of anomalies. If high, express concern and suggest investigation. If low or zero, commend the stability.

### 3. Actionable Recommendations
- Based on your observations, provide 2-3 specific, practical recommendations.
- For example, if savings are negative (over-consumption), suggest investigating HVAC schedules or lighting during peak hours. If anomalies are frequent, recommend equipment diagnostics.
- Keep the recommendations targeted and easy to understand.

**Tone:** Professional, data-driven, and supportive. The goal is to empower the facility manager to make improvements.

**Data Summary to Analyze:**
${dataSummaryPrompt}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Please generate the energy report analysis based on the provided data summary.",
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text;
};
