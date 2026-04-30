'use client'

import { createContext, useState, useEffect } from "react"
import client from "@/api/client"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        client.auth.getSession().then(({ data }) => {
            setUser(data.session?.user || null)
            setAccessToken(data.session?.access_token || null)
            setLoading(false)
        })

        const { data: listener } = client.auth.onAuthStateChange((e, session) => {
            setUser(session?.user || null)
            setAccessToken(session?.access_token || null)
        })

        return () => {
            listener.subscription.unsubscribe() 
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, accessToken, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
