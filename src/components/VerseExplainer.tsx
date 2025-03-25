"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { LoadingDots } from "./LoadingDots"

type FormData = {
  verse: string
}

type ApiResponse = {
  explanation: string
  error?: string
}

export function VerseExplainer() {
  const [explanation, setExplanation] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setError("")
    setExplanation("")
    setIsLoading(true)

    try {
      // 1. Fetch verse text
      const verseRes = await fetch(`/api/fetch-verse?verse=${encodeURIComponent(data.verse)}`)
      
      if (!verseRes.ok) {
        throw new Error(`Failed to fetch verse: ${verseRes.status}`)
      }

      const { verseText } = await verseRes.json()

      if (!verseText?.trim()) {
        throw new Error("Invalid verse text received")
      }

      // 2. Get explanation
      const explanationRes = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verse: data.verse, verseText })
      })
      
      if (!explanationRes.ok) {
        const errorData: ApiResponse = await explanationRes.json()
        throw new Error(errorData.error || "Explanation request failed")
      }

      const result: ApiResponse = await explanationRes.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      setExplanation(result.explanation)

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="verse" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Verse
          </label>
          <input
            id="verse"
            {...register("verse", { required: "Verse is required" })}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 text-black ${
              errors.verse ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., BG 2.13"
            disabled={isLoading}
          />
          {errors.verse && (
            <p className="mt-1 text-sm text-red-600">{errors.verse.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingDots className="mr-2" />
              Processing...
            </>
          ) : (
            "Get Explanation"
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {explanation && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2">Explanation:</h3>
          <div className="prose prose-amber max-w-none text-black">
            {explanation.split('\n\n').map((para, i) => (
              <p key={i} className="mb-3 last:mb-0">{para}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}