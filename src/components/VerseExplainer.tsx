"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { LoadingDots } from "./LoadingDots"
import { BookOpen, Sparkles } from "lucide-react"

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
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-3">
        <div className="relative">
          <label htmlFor="verse" className="block text-sm font-medium text-amber-900 mb-1.5">
            Enter Verse Reference
          </label>
          <div className="relative">
            <input
              id="verse"
              {...register("verse", { required: "Verse reference is required" })}
              className={`w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-amber-500 text-black bg-white/50 backdrop-blur-sm transition-all duration-200 ${
                errors.verse ? "border-red-500" : "border-amber-200"
              }`}
              placeholder="e.g., SB 1.1.1 or BG 2.13"
              disabled={isLoading}
            />
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600" />
          </div>
          {errors.verse && (
            <p className="mt-1.5 text-sm text-red-600">{errors.verse.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full mt-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
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
            <>
              <Sparkles className="h-4 w-4" />
              Get Explanation
            </>
          )}
        </button>
      </form>

      <div className="space-y-3">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-fade-in">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {explanation && (
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-lg animate-fade-in">
            <h3 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Explanation
            </h3>
            <div className="prose prose-amber max-w-none text-amber-900">
              {explanation.split('\n\n').map((para, i) => (
                <p key={i} className="mb-2 last:mb-0 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
