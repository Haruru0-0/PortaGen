"use client"

import {PixelCard} from "@/components/pixel-card"
import {PixelClouds} from "@/components/pixel-clouds"
import {useRouter, useSearchParams} from "next/navigation"

export default function PrivacyPolicyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams.get("from")

    const handleBack = () => {
        router.back()
    }

    const getBackLabel = () => {
        if (from) {
            return `← Back to ${from}`
        }
        return "← Back"
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <PixelClouds/>
            <div className="fixed bottom-0 left-0 right-0 h-48 z-0">
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#8B5CF6] to-[#EC4899]"/>
                <div className="absolute bottom-0 w-full flex justify-around items-end">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#6D28D9]"
                            style={{
                                width: "40px",
                                height: `${Math.random() * 60 + 40}px`,
                                opacity: 0.8,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <PixelCard>
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl pixel-text-shadow">PRIVACY POLICY</h1>
                            <p className="text-xs text-muted-foreground mt-2">
                                Last updated: January 14, 2026
                            </p>
                        </div>

                        <div className="text-xs space-y-4 text-left p-4 border-2 border-border bg-input/50">
                            <h2 className="font-bold text-sm">1. Introduction</h2>
                            <p>
                                Welcome to PortaGen. We are committed to protecting your
                                personal information and your right to privacy. If you have any
                                questions or concerns about our policy, or our practices with
                                regards to your personal information, please contact us.
                            </p>

                            <h2 className="font-bold text-sm">2. Information We Collect</h2>
                            <p>
                                We collect personal information that you voluntarily provide to
                                us when you register on the website, express an interest in
                                obtaining information about us or our products and services,
                                when you participate in activities on the website or otherwise
                                when you contact us.
                            </p>
                            <p>
                                The personal information that we collect depends on the context
                                of your interactions with us and the website, the choices you
                                make and the products and features you use. The personal
                                information we collect may include the following: name, email
                                address, username, password, and contact preferences.
                            </p>

                            <h2 className="font-bold text-sm">3. How We Use Your Information</h2>
                            <p>
                                We use personal information collected via our website for a
                                variety of business purposes described below. We process your
                                personal information for these purposes in reliance on our
                                legitimate business interests, in order to enter into or
                                perform a contract with you, with your consent, and/or for
                                compliance with our legal obligations.
                            </p>

                            <h2 className="font-bold text-sm">4. Will Your Information Be Shared?</h2>
                            <p>
                                We only share information with your consent, to comply with
                                laws, to provide you with services, to protect your rights, or
                                to fulfill business obligations.
                            </p>

                            <h2 className="font-bold text-sm">5. Do We Use Cookies?</h2>
                            <p>
                                We may use cookies and similar tracking technologies to access
                                or store information. Specific information about how we use such
                                technologies is set out in our Cookie Policy (not yet created).
                            </p>

                            <h2 className="font-bold text-sm">6. How Long Do We Keep Your Information?</h2>
                            <p>
                                We keep your information for as long as necessary to fulfill
                                the purposes outlined in this privacy policy unless otherwise
                                required by law.
                            </p>

                            <h2 className="font-bold text-sm">7. How Do We Keep Your Information Safe?</h2>
                            <p>
                                We aim to protect your personal information through a system of
                                organizational and technical security measures.
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleBack}
                                className="text-primary hover:underline text-xs"
                            >
                                {getBackLabel()}
                            </button>
                        </div>
                    </div>
                </PixelCard>
            </div>
        </div>
    )
}
