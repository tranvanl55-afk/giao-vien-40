import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBGkGh8cbbiLppt-mLAO_OA2FPqqx3zwFE' });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Hello!'],
    });
    console.log('Success:', response.text);
  } catch (err) {
    console.error('Error with array of strings:', err);
  }
}

run();
