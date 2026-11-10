import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P, Pixelify_Sans, Barlow_Condensed, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import "@/components/workspace/workspace-theme.css"
import "@/components/workspace/persona-world.css"
import { WorkspaceMotionProvider } from "@/components/workspace/workspace-motion-provider"
import { WorkspaceExperienceProvider } from "@/components/workspace/workspace-experience-provider"
import { Toaster } from "@/components/ui/sonner";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
})

const pixelifyDialogue = Pixelify_Sans({
    subsets: ["latin"],
    variable: "--font-portfolio-dialogue",
    display: "swap",
})

const displayFont = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-workspace-display", display: "swap" })
const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-workspace-body", display: "swap" })

export const metadata: Metadata = {
    title: "PortaGen - Pixel Art Portfolio Generator",
    description: "Create stunning desktop-style portfolios with pixel-art aesthetics",
    icons: {
      icon: '/logo.png',
      apple: '/logo.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body style={{"--font-dialogue": "var(--font-portfolio-dialogue)"} as React.CSSProperties} className={`${pressStart2P.className} ${pressStart2P.variable} ${pixelifyDialogue.variable} ${displayFont.variable} ${bodyFont.variable} font-sans antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                    <WorkspaceMotionProvider><WorkspaceExperienceProvider>{children}</WorkspaceExperienceProvider></WorkspaceMotionProvider>
                    <Toaster />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}
