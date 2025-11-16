
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'placeholder-api-key' });

export const generateIngredients = async (productName: string): Promise<string> => {
  if (!API_KEY || API_KEY === 'placeholder-api-key') {
      throw new Error("API key is not configured.");
  }
  try {
    const prompt = `Generate a typical ingredients list for homemade ${productName}. List the ingredients in descending order of proportion, as they would appear on a food label. For example: "Flour, Sugar, Butter, Eggs...". Do not include the heading "Ingredients:". Just provide the list.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating ingredients:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

export const generateTagline = async (productName: string): Promise<string> => {
    if (!API_KEY || API_KEY === 'placeholder-api-key') {
        throw new Error("API key is not configured.");
    }
  try {
    const prompt = `Generate one short, catchy tagline for a homemade food product called '${productName}'. The brand has an artisanal, cottage-industry feel. Return only the tagline text, without quotation marks.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim().replace(/"/g, ''); // Remove any quotes
  } catch (error) {
    console.error("Error generating tagline:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
