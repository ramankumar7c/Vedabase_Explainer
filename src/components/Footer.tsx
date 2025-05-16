import Link from "next/link"
import { Heart, Github } from "lucide-react"

export function Footer() {
  return (
    <div className="mt-6 pt-6 border-t border-amber-200/40">
      <div className="text-sm text-amber-800/80 flex items-center justify-center gap-1.5">
        <p>Developed with</p>
        <Heart className="h-4 w-4 text-red-500 animate-pulse-slow" />
        <p>by</p>
        <Link 
          href="https://github.com/ramankumar7c/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 hover:underline transition-colors flex items-center gap-1.5 font-medium"
        >
          Raman
          <Github className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
} 