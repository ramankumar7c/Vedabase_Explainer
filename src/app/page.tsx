import { VerseExplainer } from "@/components/VerseExplainer"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-sacred-maroon">
          VedaBase Simplified Explorer
        </h1>
        <p className="mt-2 text-sacred-teal">
          Get simple explanations for Srimad Bhagavatam verses
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-sacred-sandal">
        <VerseExplainer />
      </div>
    </div>
  )
}