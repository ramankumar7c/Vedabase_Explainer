import type { VerseExplanation } from "@/lib/types"
import { LoadingDots } from "./LoadingDots"

export default function VerseExplanation({ verse, explanation, isLoading, error }: VerseExplanation) {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Explanation for {verse}
        {isLoading && (
          <span className="ml-2 text-sm text-gray-500">
            <LoadingDots />
          </span>
        )}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {explanation && !isLoading && (
        <div className="prose prose-sm sm:prose max-w-none text-gray-700">
          {explanation.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}