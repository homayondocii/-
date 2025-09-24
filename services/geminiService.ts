
import { GoogleGenAI } from "@google/genai";

// A mock to simulate process.env.API_KEY, as it's not available in this environment.
// In a real application, this would be set in your environment variables.
const API_KEY = undefined; 

const FAKE_API_RESPONSE = "متاسفانه کلید API برای اتصال به دستیار هوشمند تنظیم نشده است. این یک پاسخ نمونه است. برای فعال کردن این ویژگی، لطفاً کلید Gemini API خود را در متغیرهای محیطی برنامه قرار دهید. \n\n در حالت فعال، من می‌توانم به شما در تحلیل داده‌های مالی کمک کنم. برای مثال، می‌توانید بپرسید 'بیشترین هزینه من در ماه گذشته چه بوده است؟' یا 'مجموع درآمدهای من چقدر است؟'";

export const askFinancialAssistant = async (prompt: string, contextData: string): Promise<string> => {
    if (!API_KEY) {
        console.warn("API_KEY is not set. Returning a mock response.");
        return new Promise(resolve => setTimeout(() => resolve(FAKE_API_RESPONSE), 1000));
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        
        const fullPrompt = `You are a professional financial assistant for a personal accounting app. Your responses must be in Persian. Analyze the following data and answer the user's question.
        
        Data:
        ${contextData}
        
        User's Question:
        ${prompt}
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "خطایی در ارتباط با دستیار هوشمند رخ داد. لطفاً دوباره تلاش کنید.";
    }
};
