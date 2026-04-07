import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

interface GeminiError extends Error {
  status?: number;
  statusText?: string;
  errorDetails?: unknown;
}

interface QuotaError extends Error {
  statusCode: number;
  retryAfter: number | null;
}

interface ApiError extends Error {
  statusCode: number;
  originalStatus?: number;
}

export async function generateExplanation(verse: string, verseText: string) {
  try {
    // Use the correct model name from your quickstart guide
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Updated model name
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
    
    const geminiError = error as GeminiError;
    const errorMessageStr = geminiError.message || String(error);
    const status = geminiError.status;
    
    // Check if it's a quota/rate limit error (429)
    const isQuotaError = 
      status === 429 || 
      errorMessageStr.includes("429") || 
      errorMessageStr.includes("quota") ||
      errorMessageStr.includes("Too Many Requests") ||
      errorMessageStr.includes("rate limit");
    
    if (isQuotaError) {
      // Extract retry delay if available (format: "Please retry in 24.75s")
      const retryMatch = errorMessageStr.match(/retry in ([\d.]+)s/i);
      const retryDelay = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
      
      const userMessage = retryDelay 
        ? `API rate limit exceeded. Please try again in ${retryDelay} seconds. The free tier quota has been reached for today.`
        : "API rate limit exceeded. The free tier quota has been reached. Please try again later or check your API billing settings.";
      
      const quotaError = new Error(userMessage) as QuotaError;
      quotaError.statusCode = 429;
      quotaError.retryAfter = retryDelay;
      throw quotaError;
    }
    
    // Check if it's a bad request error (400)
    if (status === 400 || errorMessageStr.includes("400") || errorMessageStr.includes("Bad Request")) {
      // Try to extract more specific error information
      let userMessage: string;
      
      if (errorMessageStr.includes("API key") || errorMessageStr.includes("API_KEY_INVALID") || errorMessageStr.includes("authentication")) {
        userMessage = "The API key is invalid or missing. Please check your API configuration and ensure a valid Gemini API key is set in your environment variables.";
      } else if (errorMessageStr.includes("safety") || errorMessageStr.includes("content filter")) {
        userMessage = "The content may have triggered a safety filter. Please try rephrasing your request.";
      } else if (errorMessageStr.includes("model") || errorMessageStr.includes("not found")) {
        userMessage = "The AI model may not be available. Please check the configuration and try again.";
      } else {
        userMessage = "Invalid request to the AI service. Please check your input and try again.";
      }
      
      const apiError = new Error(userMessage) as ApiError;
      apiError.statusCode = 400;
      apiError.originalStatus = status;
      throw apiError;
    }
    
    // For other errors, throw a generic message
    throw new Error("Explanation service is currently unavailable. Please try again later.");
  }
}