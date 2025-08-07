import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { TanstackProvider } from "@/components/providers/tanstack-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Management Tool",
  description: "Team collaboration and project management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TanstackProvider><ThemeProvider>
        {children}</ThemeProvider></TanstackProvider>
        
      </body>
    </html>
    </ClerkProvider>
  )
}
