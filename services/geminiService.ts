
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function processNotebookPage(base64Image: string): Promise<string> {
  // Initialize AI client with the provided API_KEY from environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract pure base64 data
  const base64Data = base64Image.split(',')[1];
  
  const prompt = `
    Esta é uma foto de uma página de caderno. 
    1. Leia todo o texto manuscrito ou impresso com atenção.
    2. Forneça um resumo claro e estruturado do conteúdo EM PORTUGUÊS.
    3. Se houver itens de ação ou datas, liste-os claramente no final.
    4. Mantenha um tom direto e conciso, mas útil.
    5. Não inclua comentários sobre a qualidade da imagem, foque apenas no conteúdo.
    6. Responda INTEIRAMENTE em Português do Brasil.
  `;

  try {
    // Call generateContent with multiple parts: the notebook image and the processing prompt.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      }
    });

    // Access the .text property directly (do not call as a method).
    return response.text || "Não consegui ler o conteúdo. Tente uma foto mais nítida.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
