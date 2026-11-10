"use client"

import {Suspense} from "react"
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import {useRouter, useSearchParams} from "next/navigation"

function PrivacyPolicyContent() {
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
        <div className="persona-privacy min-h-screen relative flex items-center justify-center px-4 py-12 text-[#fffef5]">

            <div className="relative z-10 w-full max-w-4xl">
                <PixelCard>
                    <div className="space-y-6">
                        <button
                            onClick={handleBack}
                            className="text-[#44e4ff] hover:underline text-sm min-h-10 py-2"
                        >
                            {getBackLabel()}
                        </button>
                        <div className="text-center">
                            <h1 className="persona-page-title" data-page-heading>Privacy policy</h1>
                            <p className="font-[family-name:var(--font-workspace-body)] text-sm text-[#bdd3f3] mt-2">
                                Last updated: January 14, 2026
                            </p>
                            {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                                <p className="font-[family-name:var(--font-workspace-body)] text-sm mt-1">
                                    Questions? Email{" "}
                                    <a
                                        className="text-[#44e4ff] underline"
                                        href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                                    >
                                        {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                                    </a>
                                </p>
                            )}
                        </div>

                        <div className="font-[family-name:var(--font-workspace-body)] text-base leading-relaxed space-y-4 text-left [&_p]:max-w-[68ch] [&_li]:max-w-[68ch]">
                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">1. Introduction</h2>
                            <p>
                                Welcome to PortaGen. We are committed to protecting your
                                personal information and your right to privacy. If you have any
                                questions or concerns about our policy, or our practices with
                                regards to your personal information, please contact us.
                            </p>

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">2. Information We Collect</h2>
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

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">3. How We Use Your Information</h2>
                            <p>
                                We use personal information collected via our website for a
                                variety of business purposes described below. We process your
                                personal information for these purposes in reliance on our
                                legitimate business interests, in order to enter into or
                                perform a contract with you, with your consent, and/or for
                                compliance with our legal obligations.
                            </p>

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">4. Will Your Information Be Shared?</h2>
                            <p>
                                We only share information with your consent, to comply with
                                laws, to provide you with services, to protect your rights, or
                                to fulfill business obligations.
                            </p>

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">5. Do We Use Cookies?</h2>
                            <p>
                                We may use cookies and similar tracking technologies to access
                                or store information, for example to keep you signed in.
                            </p>

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">6. How Long Do We Keep Your Information?</h2>
                            <p>
                                We keep your information for as long as necessary to fulfill
                                the purposes outlined in this privacy policy unless otherwise
                                required by law.
                            </p>

                            <h2 className="font-bold text-base pt-4 border-t-2 border-border first:pt-0 first:border-t-0">7. How Do We Keep Your Information Safe?</h2>
                            <p>
                                We aim to protect your personal information through a system of
                                organizational and technical security measures.
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleBack}
                                className="text-[#44e4ff] hover:underline text-sm min-h-10 py-2"
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

export default function PrivacyPolicyPage() {
    return (
        <Suspense fallback={<div>Loading privacy policy...</div>}>
            <PrivacyPolicyContent/>
        </Suspense>
    )
}
