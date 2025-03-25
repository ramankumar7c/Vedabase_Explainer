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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}