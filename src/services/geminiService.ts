import { GoogleGenAI, Type } from "@google/genai";
import { GeminiWordResponse } from "../types";
import { getRandomFallbackWord } from "../data/categories";

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY || ''; // Fallback to empty string if undefined (or use a mock/placeholder if appropriate)

  if (!apiKey) {
    console.warn("VITE_API_KEY is missing. Gemini features will likely fail or use fallback.");
  }

  return new GoogleGenAI({ apiKey });
};

export const generateSecretWord = async (): Promise<GeminiWordResponse> => {
  try {
    const ai = getGenAI();
    const themes = ["objetos cotidianos", "lugares", "profesiones", "comida", "hobbies", "tecnología", "naturaleza", "cine", "conceptos abstractos simples"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera una palabra secreta aleatoria para el juego social 'El Impostor'. 
      
      Instrucciones:
      1. La palabra debe ser un sustantivo en Español.
      2. Debe ser conocida por la mayoría de la gente.
      3. Categoría sugerida para esta ronda (pero puedes cambiarla si se te ocurre algo mejor): ${randomTheme}.
      4. EVITA palabras demasiado genéricas como 'Cosa' o 'Lugar'.
      5. Sé creativo.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: {
              type: Type.STRING,
              description: "La palabra secreta (ej: Pizza, Astronauta, Guitarra, Pirámide)",
            },
            category: {
              type: Type.STRING,
              description: "La categoría general para dar contexto (ej: Comida, Profesión, Música, Lugar)",
            },
          },
          required: ["word", "category"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiWordResponse;
    }

    return getRandomFallbackWord();
  } catch (error) {
    console.warn("Error generating word with Gemini, using fallback:", error);
    return getRandomFallbackWord();
  }
};