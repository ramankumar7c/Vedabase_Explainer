import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VedaBase Simplified Explorer",
  description: "Get simplified explanations of Srimad Bhagavatam verses using AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="max-w-3xl mx-auto">
              {children}
              <Footer />
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}