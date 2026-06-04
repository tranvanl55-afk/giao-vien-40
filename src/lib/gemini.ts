import { GoogleGenAI } from '@google/genai';
import { auth } from '../firebase';

export function getGeminiApiKey(): string {
  const currentUser = auth.currentUser;
  
  // Try to get from Vite env first, then process.env (injected by vite config)
  const systemKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  
  if (currentUser && currentUser.email === 'tranvanl55@gmail.com') {
    return systemKey;
  }
  
  return localStorage.getItem('user_gemini_api_key') || systemKey;
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  return new GoogleGenAI({ apiKey });
}
