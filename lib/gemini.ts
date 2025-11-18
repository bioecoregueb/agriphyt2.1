import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSafetyInfo(ingredientName: string): Promise<string> {
  try {
    const prompt = `Provide a concise safety analysis for the pesticide active ingredient "${ingredientName}". Focus on key hazards for applicators (e.g., PPE requirements, inhalation/dermal risks) and primary environmental concerns (e.g., aquatic toxicity, pollinator risks). Present the information in clear, easy-to-understand bullet points using markdown. Do not include a preamble or conclusion, just the direct analysis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not retrieve safety information. The API key may be invalid or the service may be temporarily unavailable. Please try again later.";
  }
}
