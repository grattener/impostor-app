import { GoogleGenAI, Type } from "@google/genai";
import { GeminiWordResponse } from "../types";
import { getRandomFallbackWord } from "../data/categories";

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY || '';
  // Check if API key is missing or is the placeholder from .env.example
  if (!apiKey || apiKey === 'tu_clave_de_api_aqui') {
    console.warn("VITE_API_KEY is missing or invalid. Using fallback words.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const checkApiStatus = async (): Promise<boolean> => {
  const ai = getGenAI();
  if (!ai) return false;

  try {
    // Simple lightweight check - generate a single char
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Test",
    });
    return true;
  } catch (e) {
    console.warn("API check failed:", e);
    return false;
  }
};

interface GenerateOptions {
  difficulty: 'easy' | 'normal' | 'hard';
  hintsEnabled: boolean;
  useApi: boolean;
  mixedMode: boolean;
}

const DIFFICULTY_PROMPTS = {
  easy: 'La palabra debe ser MUY conocida y simple, un sustantivo cotidiano que cualquier persona reconocería (ej: Mesa, Perro, Sol, Pan).',
  normal: 'La palabra debe ser un sustantivo conocido por la mayoría de la gente.',
  hard: 'La palabra debe ser un sustantivo menos común, puede ser un concepto más específico o especializado pero que aún sea identificable (ej: Fonógrafo, Arrecife, Sextante, Crisálida).',
};

export const generateSecretWord = async (options: GenerateOptions): Promise<GeminiWordResponse> => {
  // Determine effective difficulty
  let effectiveDifficulty = options.difficulty;
  if (options.mixedMode) {
    // Combine Easy and Hard as requested
    effectiveDifficulty = Math.random() < 0.5 ? 'easy' : 'hard';
  }

  // If user chose offline mode, go straight to fallback
  if (!options.useApi) {
    return getRandomFallbackWord(effectiveDifficulty);
  }

  try {
    const ai = getGenAI();

    if (!ai) {
      return getRandomFallbackWord(effectiveDifficulty);
    }

    const themes = ["objetos cotidianos", "lugares", "profesiones", "comida", "hobbies", "tecnología", "naturaleza", "cine", "conceptos abstractos simples"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const hintInstruction = options.hintsEnabled
      ? `6. Genera también una pista sutil e indirecta para ayudar a alguien que NO conoce la palabra. La pista debe ser una asociación lejana, un lugar de origen, una propiedad sensorial, o un contexto cultural. NO debe ser obvia ni revelar la palabra directamente. Ejemplo: si la palabra es "Pizza", la pista podría ser "Nápoles" o "Masa". Si la palabra es "Guitarra", la pista podría ser "Cuerdas" o "España".`
      : '';

    const responseProperties: Record<string, any> = {
      word: {
        type: Type.STRING,
        description: "La palabra secreta (ej: Pizza, Astronauta, Guitarra, Pirámide)",
      },
      category: {
        type: Type.STRING,
        description: "La categoría general para dar contexto (ej: Comida, Profesión, Música, Lugar)",
      },
    };

    const requiredFields = ["word", "category"];

    if (options.hintsEnabled) {
      responseProperties.hint = {
        type: Type.STRING,
        description: "Una pista sutil e indirecta, NO obvia (ej: para Pizza → 'Nápoles', para Guitarra → 'Cuerdas')",
      };
      requiredFields.push("hint");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera una palabra secreta aleatoria para el juego social 'El Impostor'. 
      
      Instrucciones:
      1. La palabra debe ser un sustantivo en Español.
      2. ${DIFFICULTY_PROMPTS[effectiveDifficulty]}
      3. Categoría sugerida para esta ronda (pero puedes cambiarla si se te ocurre algo mejor): ${randomTheme}.
      4. EVITA palabras demasiado genéricas como 'Cosa' o 'Lugar'.
      5. Sé creativo.
      ${hintInstruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: responseProperties,
          required: requiredFields,
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeminiWordResponse;
    }

    return getRandomFallbackWord(effectiveDifficulty);
  } catch (error) {
    console.warn("Error generating word with Gemini, using fallback:", error);
    return getRandomFallbackWord(effectiveDifficulty);
  }
};