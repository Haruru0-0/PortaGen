import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export function useGoogleDrive() {
    const { user } = useUser()
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)

    useEffect(() => {
        if (user) {
            checkConnection()
        }
    }, [user])

    const checkConnection = async () => {
        try {
            const res = await fetch('/api/auth/google/status')
            if (res.ok) {
                const data = await res.json()
                setConnected(data.connected && !data.tokenExpired)
            }
        } catch (error) {
            console.error('Failed to check connection:', error)
        } finally {
            setLoading(false)
        }
    }

    const connectDrive = async () => {
        setConnecting(true)
        try {
            const res = await fetch('/api/auth/google/connect')
            if (res.ok) {
                const { authUrl } = await res.json()
                window.location.href = authUrl
            }
        } catch (error) {
            console.error('Failed to connect:', error)
            setConnecting(false)
        }
    }

    const disconnectDrive = async () => {
        try {
            const res = await fetch('/api/auth/google/disconnect', {
                method: 'POST',
            })
            if (res.ok) {
                setConnected(false)
            }
        } catch (error) {
            console.error('Failed to disconnect:', error)
        }
    }

    return {
        connected,
        loading,
        connecting,
        connectDrive,
        disconnectDrive,
        checkConnection,
    }
}