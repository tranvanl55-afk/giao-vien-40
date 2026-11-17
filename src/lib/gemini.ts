import { GoogleGenAI } from '@google/genai';
import { auth } from '../firebase';

/**
 * Checks if an email, phone number, or identifier belongs to a privileged account.
 * Privileged accounts:
 * 1. tranvanl55@gmail.com
 * 2. 0965819180 (and associated phone/email variants)
 */
export function isPrivilegedAccount(identifier?: string | null): boolean {
  if (!identifier) return false;
  const clean = identifier.trim().toLowerCase();
  if (clean === 'tranvanl55@gmail.com') return true;
  if (
    clean.includes('0965819180') ||
    clean.includes('965819180') ||
    clean.includes('+84965819180')
  ) {
    return true;
  }
  return false;
}

/**
 * Checks if current logged-in Firebase user is a privileged account.
 */
export function isPrivilegedUser(): boolean {
  const user = auth.currentUser;
  if (!user) return false;
  return (
    isPrivilegedAccount(user.email) ||
    isPrivilegedAccount(user.phoneNumber) ||
    isPrivilegedAccount(user.displayName)
  );
}

/**
 * Returns the Gemini API Key to use:
 * - If current user is privileged: returns the built-in system key from env.
 * - Otherwise: returns the key provided by the user in this session or localStorage.
 *   DOES NOT fall back to the system key for non-privileged users!
 */
export function getGeminiApiKey(): string {
  const systemKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  
  if (isPrivilegedUser()) {
    return systemKey;
  }
  
  const sessionKey = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('session_gemini_api_key') || '') : '';
  const userKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('user_gemini_api_key') || '') : '';
  return (sessionKey || userKey).trim();
}

/**
 * Creates a GoogleGenAI client instance with the appropriate key.
 */
export function getGeminiClient(customApiKey?: string): GoogleGenAI {
  const apiKey = (customApiKey || getGeminiApiKey()).trim();
  return new GoogleGenAI({ apiKey });
}

// Global queue for pending API key requests
let pendingApiKeyResolvers: {
  resolve: (key: string) => void;
  reject: (err: Error) => void;
}[] = [];

/**
 * Dispatches an event to open the ApiKeyModal and returns a promise that
 * resolves when the user enters a valid key or rejects if they cancel.
 */
export function requestApiKeyFromUser(): Promise<string> {
  return new Promise((resolve, reject) => {
    pendingApiKeyResolvers.push({ resolve, reject });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open_gemini_api_key_modal'));
    }
  });
}

/**
 * Submits the user-entered API key, saving to session and/or localStorage,
 * and resolves any pending requests.
 */
export function submitUserApiKey(key: string, remember: boolean = true) {
  const cleanKey = key.trim();
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('session_gemini_api_key', cleanKey);
  }
  if (remember && typeof localStorage !== 'undefined') {
    localStorage.setItem('user_gemini_api_key', cleanKey);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gemini_api_key_changed'));
  }
  const resolvers = [...pendingApiKeyResolvers];
  pendingApiKeyResolvers = [];
  resolvers.forEach(r => r.resolve(cleanKey));
}

/**
 * Cancels any pending API key request and closes the modal.
 */
export function cancelUserApiKeyRequest() {
  const resolvers = [...pendingApiKeyResolvers];
  pendingApiKeyResolvers = [];
  resolvers.forEach(r => r.reject(new Error("Bạn đã hủy thao tác nhập API Key.")));
}

/**
 * Ensures a valid Gemini API Key is available before executing an AI call.
 * - If privileged user: returns the system key automatically.
 * - If non-privileged user:
 *    - Returns session/local key if already available.
 *    - Otherwise pops up the ApiKeyModal on demand and waits for user input.
 */
export async function ensureGeminiApiKey(): Promise<string> {
  if (isPrivilegedUser()) {
    const systemKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
    return systemKey;
  }

  const sessionKey = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('session_gemini_api_key') || '') : '';
  const localKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('user_gemini_api_key') || '') : '';
  const existingKey = (sessionKey || localKey).trim();

  if (existingKey) {
    return existingKey;
  }

  return await requestApiKeyFromUser();
}

/**
 * Executes a Gemini prompt, automatically prompting for an API key if missing.
 */
export async function askGemini(
  prompt: string, 
  systemInstruction?: string,
  model = 'gemini-2.5-flash'
): Promise<string> {
  const isPrivileged = isPrivilegedUser();
  const systemKey = (import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

  let activeKey = getGeminiApiKey();
  if (!activeKey) {
    if (isPrivileged) {
      activeKey = systemKey;
    } else {
      activeKey = await ensureGeminiApiKey();
    }
  }

  const callModel = async (key: string) => {
    if (!key) throw new Error("Chưa có API Key để thực hiện dịch vụ.");
    const client = new GoogleGenAI({ apiKey: key });
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return (response.text || '').trim();
  };

  try {
    return await callModel(activeKey);
  } catch (primaryErr: any) {
    const isKeyInvalid = primaryErr?.message?.includes('API key not valid') || 
                         primaryErr?.message?.includes('API_KEY_INVALID') ||
                         primaryErr?.status === 400;
                         
    if (isKeyInvalid && typeof window !== 'undefined') {
      sessionStorage.removeItem('session_gemini_api_key');
      localStorage.removeItem('user_gemini_api_key');
      window.dispatchEvent(new CustomEvent('gemini_api_key_changed'));
    }

    // Fallback to system key ONLY for privileged user if their custom key failed
    if (isPrivileged && systemKey && activeKey !== systemKey) {
      console.warn("User key failed, falling back to system key for privileged account...", primaryErr);
      return await callModel(systemKey);
    }
    
    if (isKeyInvalid) {
      throw new Error("Khóa API Gemini không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng thử lại với API Key mới.");
    }
    throw primaryErr;
  }
}
