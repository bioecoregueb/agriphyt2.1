import { GoogleGenAI, Type } from "@google/genai";

// Check if API key is available
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function fileToGenerativePart(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve({
                    inlineData: {
                        mimeType: file.type,
                        data: reader.result.split(',')[1],
                    },
                });
            } else {
                reject(new Error('Failed to read file as base64 string.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function getSafetyInfo(ingredientName: string): Promise<string> {
  if (!ai) {
    return "AI safety analysis is not available. Please configure the GEMINI_API_KEY in your environment to enable this feature.";
  }

  try {
    const prompt = `Provide a concise safety analysis for the pesticide active ingredient "${ingredientName}". Focus on key hazards for applicators (e.g., PPE requirements, inhalation/dermal risks) and primary environmental concerns (e.g., aquatic toxicity, pollinator risks). Present the information in clear, easy-to-understand bullet points using markdown. Do not include a preamble or conclusion, just the direct analysis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Could not retrieve safety information. The API key may be invalid or the service may be temporarily unavailable. Please try again later.";
  }
}

export async function getCompatibilityInfo(pesticides: { name: string, family: string }[]): Promise<string> {
    if (!ai) {
        return "AI compatibility analysis is not available. Please configure the GEMINI_API_KEY in your environment to enable this feature.";
    }

    try {
        const pesticideList = pesticides.map(p => `${p.name} (Family: ${p.family})`).join(', ');
        const prompt = `Analyze the compatibility of mixing the following pesticides: ${pesticideList}.
        Based on their chemical families, provide a summary of potential risks (e.g., phytotoxicity, reduced efficacy, precipitate formation) or synergies.
        Conclude with a clear recommendation: "Safe to Mix", "Use with Caution", or "Do Not Mix".
        Format the response in markdown with a main heading for the recommendation and bullet points for the analysis. Do not include a preamble.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Could not retrieve compatibility information. The API key may be invalid or the service may be temporarily unavailable. Please try again later.";
    }
}


export async function parseIracPdf(pdfFile: File): Promise<{ code: string; modeOfAction: string }[]> {
    if (!ai) {
        throw new Error("AI PDF parsing is not available. Please configure the GEMINI_API_KEY in your environment to enable this feature.");
    }

    try {
        const pdfPart = await fileToGenerativePart(pdfFile);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Extract all IRAC codes and their corresponding 'Mode of Action' descriptions from this document. Provide the output as a JSON array." },
                    pdfPart
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            code: {
                                type: Type.STRING,
                                description: "The IRAC code, e.g., '1A', '3B'."
                            },
                            modeOfAction: {
                                type: Type.STRING,
                                description: "The full mode of action description corresponding to the code."
                            }
                        },
                        required: ["code", "modeOfAction"]
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        // Sometimes the response might be wrapped in ```json ... ```
        const cleanedJsonStr = jsonStr.replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedJsonStr);

    } catch (error) {
        console.error("Gemini API error during PDF parsing:", error);
        throw new Error("Failed to parse IRAC PDF. Please check the file and try again.");
    }
}