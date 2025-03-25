import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export async function generateExplanation(verse: string, verseText: string) {
  try {
    // Use the correct model name from your quickstart guide
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", // Updated model name
      generationConfig: {
        temperature: 0.7,
      },
    });

    const prompt = `Explain this Vedic verse in simple terms:
    
    Verse Reference: ${verse}
    Verse Text: ${verseText}
    
    Provide:
    1. A plain English translation
    2. The spiritual meaning
    3. Practical life lessons
    4. How to apply this wisdom today
    
    Keep the explanation clear and concise (under 300 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error Details:", error);
    throw new Error("Explanation service is currently unavailable. Please try again later.");
  }
}