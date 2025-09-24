import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
let configured = false;

// FIX: API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// The API key is no longer managed through localStorage or the settings UI.
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    configured = true;
} else {
    console.warn("Gemini API key not found in environment variables (process.env.API_KEY). Financial assistant will be disabled.");
}

export const isGeminiConfigured = () => configured;

export const getFinancialAdvice = async (contextData: string, question: string): Promise<string> => {
    if (!ai) {
        return "Gemini API client is not initialized. Please ensure the API_KEY environment variable is set.";
    }

    try {
        // FIX: Using systemInstruction for better prompt structure.
        const systemInstruction = `You are a professional financial advisor. Based on the following JSON data, answer the user's question. Provide a concise and helpful analysis.`;
        const prompt = `Data:
${contextData}

User's Question:
${question}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred while fetching financial advice: ${error.message}`;
        }
        return "An unknown error occurred while fetching financial advice.";
    }
};
