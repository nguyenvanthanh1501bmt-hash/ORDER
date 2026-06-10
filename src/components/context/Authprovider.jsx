"use client"

import { createContext, useEffect, useState } from "react"
import client from "@/api/client"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data, error } = await client.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error("Get session error:", error)
      }

      setUser(data.session?.user || null)
      setAccessToken(data.session?.access_token || null)
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setAccessToken(session?.access_token || null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, accessToken, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }