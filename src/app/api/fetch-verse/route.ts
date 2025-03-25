import { NextResponse } from "next/server"

// Mock data - replace with actual Vedabase API calls
const mockVerses: Record<string, string> = {
  "SB 1.1.1": "dharmaḥ projjhita-kaitavo 'tra paramo nirmatsarāṇāṁ satām...",
  "SB 1.1.2": "dharmaḥ projjhita-kaitavo 'tra paramo nirmatsarāṇāṁ satām...",
  "BG 2.13": "dehino 'smin yathā dehe kaumāraṁ yauvanaṁ jarā..."
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const verse = searchParams.get("verse")

  if (!verse) {
    return NextResponse.json(
      { error: "Verse parameter is required" },
      { status: 400 }
    )
  }

  try {
    // In a real implementation, you would fetch from Vedabase API here
    const verseText = mockVerses[verse] || "Verse text not found in mock data"
    
    return NextResponse.json({ verseText })
    
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch verse" },
      { status: 500 }
    )
  }
}