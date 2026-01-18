import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useGoogleDrive() {
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase])

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