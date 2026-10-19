import { GoogleGenAI } from '@google/genai';
import { auth } from '../firebase';

export function getGeminiApiKey(): string {
  const currentUser = auth.currentUser;
  
  // Try to get from Vite env first, then process.env (injected by vite config)
  const systemKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  
  if (currentUser && currentUser.email === 'tranvanl55@gmail.com') {
    return systemKey;
  }
  
  const userKey = (localStorage.getItem('user_gemini_api_key') || '').trim();
  return userKey || systemKey;
}

export function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey || getGeminiApiKey()).trim();
  return new GoogleGenAI({ apiKey });
}

export async function askGemini(
  prompt: string, 
  systemInstruction?: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  const currentKey = getGeminiApiKey();
  const systemKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

  const callModel = async (key: string) => {
    if (!key) throw new Error("Chưa cấu hình API Key");
    const client = new GoogleGenAI({ apiKey: key });
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return (response.text || '').trim();
  };

  try {
    return await callModel(currentKey);
  } catch (primaryErr) {
    // If the call failed and currentKey was different from systemKey, attempt fallback to systemKey
    if (systemKey && currentKey !== systemKey) {
      console.warn("User API key failed, falling back to system key...", primaryErr);
      return await callModel(systemKey);
    }
    throw primaryErr;
  }
}
