import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAdvisorInsight = async (gameState: GameState): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      Actúa como un asesor macroeconómico senior para el Ministro de Hacienda de Colombia en el año 2026.
      
      CONTEXTO DEL JUEGO (Basado en datos reales):
      - El país enfrenta un hueco fiscal de 16.3 billones tras caerse la reforma tributaria.
      - La caja está en mínimos (1.4 billones).
      - Emitir deuda TES es costoso (13.15%) y desplaza al crédito privado (Crowding Out).
      - Declarar Emergencia Económica es arriesgado políticamente.
      - Recortar gasto afecta el crecimiento y la popularidad.

      ESTADO ACTUAL:
      // Fixed: Property 'turn' does not exist on type 'GameState', changed to 'week'.
      - Mes (Turno): ${gameState.week}
      - Caja Disponible: $${gameState.cash.toFixed(1)} Billones
      - Brecha Fiscal Restante: $${gameState.fiscalGap.toFixed(1)} Billones
      - Deuda/PIB: ${gameState.debtToGDP.toFixed(1)}%
      - Aprobación Presidencial: ${gameState.approval.toFixed(1)}%
      - Inflación: ${gameState.inflation.toFixed(1)}%
      - Tasa TES: ${gameState.tesRate.toFixed(2)}%

      INSTRUCCIÓN:
      Dame un consejo estratégico MUY BREVE (máximo 2 frases) sobre qué hacer a continuación. 
      Sé crudo y realista. Advierte sobre los riesgos de los bonos TES si la tasa es alta.
      Si la aprobación es baja, advierte sobre estallido social.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text || "La incertidumbre en los mercados impide un análisis claro.";
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return "Conexión con el asesor perdida. Proceda con cautela.";
  }
};