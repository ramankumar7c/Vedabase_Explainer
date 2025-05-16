import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 py-6 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <BookOpen className="h-8 w-8 text-amber-600 group-hover:rotate-12 transition-transform" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
            VedaBase Simplified Explorer
          </h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-amber-900 hover:text-amber-700 transition-colors relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/about" 
            className="text-amber-900 hover:text-amber-700 transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
      </div>
    </header>
  )
}