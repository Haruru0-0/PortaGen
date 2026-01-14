import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
})

export const metadata: Metadata = {
    title: "PortaGen - Pixel Art Portfolio Generator",
    description: "Create stunning desktop-style portfolios with pixel-art aesthetics",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={`${pressStart2P.className} font-sans antialiased`}>
                     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                       {children}
                        <Toaster />
                    </ThemeProvider>
                    <Analytics />
                </body>
            </html>
        </ClerkProvider>
    )
}
