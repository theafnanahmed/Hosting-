
import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

export const getArchitectAdvice = async (query: string, currentProject?: Project): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';

  const context = currentProject 
    ? `Current Project: ${currentProject.name} (${currentProject.framework}). Status: ${currentProject.status}.` 
    : "The user is in the general dashboard.";

  const prompt = `
    You are the "ReactHost Pro Architect". You help developers deploy React applications.
    Context: ${context}
    User Query: ${query}

    Rules:
    1. Give technical, professional, but friendly advice.
    2. Use Markdown for formatting.
    3. If they ask about build errors, suggest checking package.json or public folder.
    4. Keep it concise (max 4 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "I'm analyzing the architectural logs. Please wait.";
  } catch (err) {
    return "Architect is currently offline. Please check your API configuration.";
  }
};
