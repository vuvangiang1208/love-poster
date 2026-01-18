import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRomanticPoem = async (achievements: string[]) => {
  const ai = getAI();
  const prompt = `Viết một bài thơ lục bát cực kỳ ngọt ngào (6-8 câu) và một lời chúc lãng mạn cho năm 2025 dựa trên các thành tựu: ${achievements.join(', ')}. Hãy dùng từ ngữ hoa mỹ, tình tứ bằng tiếng Việt.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poem: { type: Type.STRING, description: "Bài thơ ngọt ngào" },
            quote: { type: Type.STRING, description: "Lời chúc/trích dẫn lãng mạn" }
          },
          required: ["poem", "quote"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    return {
      poem: "Mơ ước bấy lâu nay thành thực,\nNgười thương đáp lại tấm chân tình.\nMôi hôn, giấc ngủ, chung nhịp đập,\nĐời này chỉ muốn có mình em.",
      quote: "2025 là khởi đầu cho một đời bên nhau hạnh phúc."
    };
  }
};

export const generateSpecificImage = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `ULTRA-HIGH-END romantic anime digital illustration. Art by Makoto Shinkai or CoMix Wave Films style. Ethereal lighting, extremely detailed, emotional storytelling, vibrant colors, cinematic composition. Theme: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:5",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

export const generatePosterImage = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `MASTERPIECE vertical romantic anime movie poster. High quality digital painting, breathtaking scenery, intense emotional atmosphere, beautiful lighting and particles, trending on Pixiv and Artstation. Theme: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

