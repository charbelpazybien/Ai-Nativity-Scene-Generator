
import { GoogleGenAI } from "@google/genai";

export const generateImage = async (prompt: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return Promise.reject(new Error("API_KEY environment variable is not set"));
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content.parts ?? []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        return Promise.reject(`Failed to generate image: ${error.message}`);
    }
    return Promise.reject("An unknown error occurred while generating the image.");
  }
};
