"use client"

import { useState } from 'react'
import { PixelButton } from '@/components/pixel-button'
import { PixelModal } from '@/components/pixel-modal'

interface GoogleDriveConnectProps {
    portfolioId: number
}

export function GoogleDriveConnect({ portfolioId }: GoogleDriveConnectProps) {
    const [isConnecting, setIsConnecting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const response = await fetch(`/api/drive/connect?portfolioId=${portfolioId}`)
            const data = await response.json()

            if (data.authUrl) {
                window.location.href = data.authUrl
            }
        } catch (error) {
            console.error('Failed to connect Google Drive:', error)
        } finally {
            setIsConnecting(false)
        }
    }

    return (
        <>
            <PixelButton
                variant="primary"
                className="text-[10px]"
                onClick={() => setIsModalOpen(true)}
                disabled={isConnecting}
            >
                {isConnecting ? 'CONNECTING...' : 'CONNECT GOOGLE DRIVE'}
            </PixelButton>

            <PixelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="CONNECT GOOGLE DRIVE"
            >
                <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground">
                        Connect your Google Drive to store and manage assets for this portfolio.
                        Files will be organized in a portfolio-specific folder.
                    </p>
                    <PixelButton
                        variant="primary"
                        className="w-full"
                        onClick={handleConnect}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'CONNECTING...' : 'CONNECT WITH GOOGLE'}
                    </PixelButton>
                </div>
            </PixelModal>
        </>
    )
}