import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const translateText = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following English text to Arabic. Provide only the translation, without any introductory text. Text: "${text}"`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error translating text:", error);
        throw new Error("Failed to translate text.");
    }
};

export const suggestTaglines = async (productName: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest 3 short, catchy taglines in English for a food product named '${productName}'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taglines: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const json = JSON.parse(response.text);
        return json.taglines || [];
    } catch (error) {
        console.error("Error suggesting taglines:", error);
        throw new Error("Failed to suggest taglines.");
    }
};

export const analyzeIngredients = async (ingredientText: string): Promise<{ formattedIngredients: string; detectedAllergens: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following list of ingredients. Reformat it as a single, comma-separated string with proper capitalization for a food label. Also, identify any of the following major allergens: Wheat, Milk, Eggs, Soy, Nuts, Sesame. Formulate an allergen statement like "CONTAINS: WHEAT, MILK." if allergens are found.

            Ingredient list: "${ingredientText}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        formattedIngredients: {
                            type: Type.STRING,
                            description: "A single, comma-separated string of ingredients."
                        },
                        allergenStatement: {
                            type: Type.STRING,
                            description: "An allergen statement in the format 'CONTAINS: ...' or an empty string if none are found."
                        }
                    }
                }
            }
        });
        const json = JSON.parse(response.text);
        return {
            formattedIngredients: json.formattedIngredients || '',
            detectedAllergens: json.allergenStatement || ''
        };
    } catch (error) {
        console.error("Error analyzing ingredients:", error);
        throw new Error("Failed to analyze ingredients.");
    }
};