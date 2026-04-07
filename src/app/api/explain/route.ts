import { NextResponse } from 'next/server'
import { generateExplanation } from '@/lib/gemini'

export async function POST(request: Request) {
  try {
    const { verse, verseText } = await request.json()

    if (!verse || !verseText) {
      return NextResponse.json(
        { error: "Both verse reference and text are required" },
        { status: 400 }
      )
    }

    const explanation = await generateExplanation(verse, verseText)
    return NextResponse.json({ explanation })

  } catch (error: unknown) {
    // Handle quota/rate limit errors with proper status code
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const apiError = error as { statusCode: number; message?: string; retryAfter?: number | null };
      
      if (apiError.statusCode === 429) {
        return NextResponse.json(
          { error: apiError.message || "API rate limit exceeded. Please try again later." },
          { 
            status: 429,
            headers: apiError.retryAfter 
              ? { 'Retry-After': apiError.retryAfter.toString() }
              : undefined
          }
        )
      }
      
      // Handle 400 Bad Request errors
      if (apiError.statusCode === 400) {
        return NextResponse.json(
          { error: apiError.message || "Invalid request. Please check your input and try again." },
          { status: 400 }
        )
      }
    }

    // For other errors, return 500 with the error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Internal server error"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}