import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Score Lab",
    description: "A clean and modern Next.js application",
    icons: {
        icon: "/paper.png",  // Points to public/pencil.png
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/paper.png" type="image/png" />
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}
