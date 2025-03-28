import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-amber-100 border-b border-amber-200 py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-amber-900">VedaBase Simplified Explorer</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-amber-900 hover:text-amber-700">
            Home
          </Link>
          <Link href="/about" className="text-amber-900 hover:text-amber-700">
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}