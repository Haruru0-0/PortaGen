"use client"

import {useEffect, useRef, useState} from "react"
import Link from "next/link"
import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger"
import {PixelButton} from "@/components/pixel-button"
import {PixelCard} from "@/components/pixel-card"
import {PixelClouds} from "@/components/pixel-clouds"
import {PixelCharacter} from "@/components/pixel-character"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
    const heroRef = useRef<HTMLElement>(null)
    const featuresRef = useRef<HTMLElement>(null)
    const stepsRef = useRef<HTMLElement>(null)
    const examplesRef = useRef<HTMLElement>(null)
    const ctaRef = useRef<HTMLElement>(null)
    const [heroBuildings] = useState(() =>
        Array.from({length: 30}, () => Math.random() * 50 + 30)
    )

    const [ctaBuildings] = useState(() =>
        Array.from({length: 30}, () => Math.random() * 50 + 30)
    )

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.from(heroRef.current?.querySelectorAll(".hero-char") || [], {
                y: -50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "bounce.out",
            })

            gsap.from(heroRef.current?.querySelector(".hero-title") || {}, {
                scale: 0.5,
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                ease: "back.out(1.7)",
            })

            // Features scroll animation
            gsap.from(featuresRef.current?.querySelectorAll(".feature-card") || [], {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "power2.out",
            })

            // Steps scroll animation
            gsap.from(stepsRef.current?.querySelectorAll(".step-card") || [], {
                scrollTrigger: {
                    trigger: stepsRef.current,
                    start: "top 80%",
                },
                x: -50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
            })

            // Examples scroll animation
            gsap.from(examplesRef.current?.querySelectorAll(".example-card") || [], {
                scrollTrigger: {
                    trigger: examplesRef.current,
                    start: "top 80%",
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: "back.out(1.7)",
            })

            // CTA scroll animation
            gsap.from(ctaRef.current?.querySelector(".cta-content") || {}, {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
            })
        })

        return () => ctx.revert()
    }, [])

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="relative z-20 border-b-4 border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PixelCharacter color="#8B5CF6" size={32}/>
                        <h1 className="text-sm pixel-text-shadow">PortaGen</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/auth/login">
                            <PixelButton variant="secondary" className="text-[10px] px-4 py-2">
                                LOG IN
                            </PixelButton>
                        </Link>
                        <Link href="/auth/signup">
                            <PixelButton variant="primary" className="text-[10px] px-4 py-2">
                                SIGN UP
                            </PixelButton>
                        </Link>
                    </div>
                </div>
            </nav>

            <PixelClouds/>

            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 px-4 overflow-hidden">
                <div className="container mx-auto text-center space-y-8 relative z-10">
                    <div className="flex justify-center gap-4 mb-6">
                        <div className="hero-char">
                            <PixelCharacter color="#8B5CF6" size={60} animate/>
                        </div>
                        <div className="hero-char">
                            <PixelCharacter color="#EC4899" size={60} animate/>
                        </div>
                        <div className="hero-char">
                            <PixelCharacter color="#FBBF24" size={60} animate/>
                        </div>
                    </div>

                    <h1 className="hero-title text-2xl md:text-4xl pixel-text-shadow leading-relaxed">
                        AETHER
                        <br/>
                        PORTFOLIO
                    </h1>

                    <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        CREATE YOUR PIXEL-PERFECT PORTFOLIO WITH CUSTOM WALLPAPERS, ICONS, AND MUSIC. BUILD A DESKTOP
                        EXPERIENCE
                        THAT STANDS OUT.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/auth/signup">
                            <PixelButton variant="primary" className="w-full sm:w-auto">
                                GET STARTED
                            </PixelButton>
                        </Link>
                        <Link href="#features">
                            <PixelButton variant="secondary" className="w-full sm:w-auto">
                                LEARN MORE
                            </PixelButton>
                        </Link>
                    </div>
                </div>

                {/* Pixel cityscape */}
                <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#8B5CF6] to-[#EC4899]"/>
                    <div className="absolute bottom-0 w-full flex justify-around items-end">
                        {heroBuildings.map((height, i) => (
                            <div
                                key={i}
                                className="bg-[#6D28D9]"
                                style={{
                                    width: "30px",
                                    height: `${height}px`,
                                    opacity: 0.7,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} id="features" className="py-16 px-4 bg-muted relative z-10">
                <div className="container mx-auto">
                    <h2 className="text-xl md:text-2xl text-center pixel-text-shadow mb-12">FEATURES</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <PixelCard>
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-primary flex items-center justify-center">
                                        <svg width="32" height="32" viewBox="0 0 16 16" fill="white">
                                            <rect x="2" y="2" width="12" height="12" fill="white"/>
                                            <rect x="4" y="4" width="8" height="8" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-sm pixel-text-shadow">CUSTOM WALLPAPERS</h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        UPLOAD YOUR OWN BACKGROUNDS OR CHOOSE FROM OUR PIXEL ART LIBRARY
                                    </p>
                                </div>
                            </PixelCard>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card">
                            <PixelCard>
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-secondary flex items-center justify-center">
                                        <svg width="32" height="32" viewBox="0 0 16 16" fill="white">
                                            <rect x="3" y="3" width="4" height="4" fill="white"/>
                                            <rect x="9" y="3" width="4" height="4" fill="white"/>
                                            <rect x="3" y="9" width="4" height="4" fill="white"/>
                                            <rect x="9" y="9" width="4" height="4" fill="white"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-sm pixel-text-shadow">DESKTOP ICONS</h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        DRAG AND DROP ICONS TO CREATE YOUR PERFECT DESKTOP LAYOUT
                                    </p>
                                </div>
                            </PixelCard>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card">
                            <PixelCard>
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-accent flex items-center justify-center">
                                        <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                                            <rect x="4" y="2" width="2" height="12" fill="currentColor"/>
                                            <rect x="7" y="4" width="2" height="10" fill="currentColor"/>
                                            <rect x="10" y="6" width="2" height="8" fill="currentColor"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-sm pixel-text-shadow">EMBEDDED MUSIC</h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        ADD SPOTIFY TRACKS OR UPLOAD YOUR OWN CHIPTUNE SOUNDTRACK
                                    </p>
                                </div>
                            </PixelCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section ref={stepsRef} className="py-16 px-4 relative z-10">
                <div className="container mx-auto">
                    <h2 className="text-xl md:text-2xl text-center pixel-text-shadow mb-12">HOW IT WORKS</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {step: "01", title: "SIGN UP", desc: "CREATE YOUR FREE ACCOUNT"},
                            {step: "02", title: "CUSTOMIZE", desc: "CHOOSE WALLPAPER & ICONS"},
                            {step: "03", title: "ADD MUSIC", desc: "EMBED YOUR SOUNDTRACK"},
                            {step: "04", title: "PUBLISH", desc: "SHARE YOUR PORTFOLIO"},
                        ].map((item, i) => (
                            <div key={i} className="relative step-card">
                                <PixelCard className="text-center space-y-3">
                                    <div className="text-3xl text-primary pixel-text-shadow">{item.step}</div>
                                    <h3 className="text-sm pixel-text-shadow">{item.title}</h3>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                                </PixelCard>
                                {i < 3 && (
                                    <div
                                        className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                                        <div className="text-2xl text-primary">→</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Portfolio Carousel */}
            <section ref={examplesRef} className="py-16 px-4 bg-muted relative z-10">
                <div className="container mx-auto">
                    <h2 className="text-xl md:text-2xl text-center pixel-text-shadow mb-12">EXAMPLE PORTFOLIOS</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {name: "PLAYER_ONE", color: "#8B5CF6", theme: "PURPLE DREAM"},
                            {name: "PIXEL_DEV", color: "#EC4899", theme: "PINK PARADISE"},
                            {name: "CODE_NINJA", color: "#FBBF24", theme: "GOLDEN HOUR"},
                        ].map((portfolio, i) => (
                            <div key={i} className="example-card">
                                <PixelCard>
                                    <div className="space-y-4">
                                        {/* Mock desktop preview */}
                                        <div
                                            className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] p-4 relative">
                                            <div className="absolute top-2 left-2">
                                                <PixelCharacter color={portfolio.color} size={24}/>
                                            </div>
                                            <div
                                                className="absolute bottom-2 right-2 text-[8px] text-white pixel-text-shadow">
                                                {portfolio.theme}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm pixel-text-shadow">{portfolio.name}</h3>
                                            <p className="text-[10px] text-muted-foreground">THEME: {portfolio.theme}</p>
                                        </div>
                                        <PixelButton variant="secondary" className="w-full text-[10px]">
                                            VIEW PORTFOLIO
                                        </PixelButton>
                                    </div>
                                </PixelCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="py-20 px-4 relative overflow-hidden">
                <div className="cta-content container mx-auto text-center space-y-8 relative z-10">
                    <h2 className="text-xl md:text-2xl pixel-text-shadow leading-relaxed">
                        READY TO BUILD
                        <br/>
                        YOUR PIXEL PORTFOLIO?
                    </h2>

                    <Link href="/auth/signup">
                        <PixelButton variant="primary" className="text-sm">
                            START FOR FREE
                        </PixelButton>
                    </Link>
                </div>

                {/* Bottom cityscape */}
                <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#8B5CF6] to-[#EC4899]"/>
                    <div className="absolute bottom-0 w-full flex justify-around items-end">
                        {ctaBuildings.map((height, i) => (
                            <div
                                key={i}
                                className="bg-[#6D28D9]"
                                style={{
                                    width: "30px",
                                    height: `${height}px`,
                                    opacity: 0.7,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t-4 border-border bg-card py-8 px-4 relative z-10">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-3">
                            <h3 className="text-sm pixel-text-shadow">AETHER PORTFOLIO</h3>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                CREATE PIXEL-PERFECT PORTFOLIOS WITH RETRO STYLE
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[10px] pixel-text-shadow">QUICK LINKS</h3>
                            <div className="space-y-2 text-[10px]">
                                <div>
                                    <Link href="/auth/signup" className="text-primary hover:underline">
                                        SIGN UP
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/auth/login" className="text-primary hover:underline">
                                        LOG IN
                                    </Link>
                                </div>
                                <div>
                                    <Link href="#features" className="text-primary hover:underline">
                                        FEATURES
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[10px] pixel-text-shadow">CONNECT</h3>
                            <div className="flex gap-3">
                                {["TW", "IG", "GH"].map((social) => (
                                    <div key={social}
                                         className="w-8 h-8 bg-primary flex items-center justify-center text-[8px]">
                                        {social}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-[10px] text-muted-foreground border-t-2 border-border pt-6">
                        © 2025 AETHER PORTFOLIO. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    )
}
