import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyBGkGh8cbbiLppt-mLAO_OA2FPqqx3zwFE' });

async function run() {
  try {
    const contents = [
      'Describe this image.',
      {
        inlineData: {
          data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // 1x1 transparent png
          mimeType: 'image/png'
        }
      }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
    console.log('Success:', response.text);
  } catch (err) {
    console.error('Error with mixed array:', err);
  }
}

run();
