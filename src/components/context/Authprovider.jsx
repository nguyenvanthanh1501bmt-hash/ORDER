'use client'

import { createContext, useEffect, useMemo, useState } from 'react'
import client from '@/api/client'

const AuthContext = createContext(null)

function isSameUser(a, b) {
  return a?.id === b?.id && a?.email === b?.email
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const applySession = (session) => {
      if (!mounted) return

      const nextUser = session?.user ?? null

      setUser((prev) => {
        return isSameUser(prev, nextUser) ? prev : nextUser
      })

      setAccessToken(session?.access_token ?? null)
      setLoading(false)
    }

    client.auth
      .getSession()
      .then(({ data }) => {
        applySession(data.session)
      })
      .catch(() => {
        if (mounted) setLoading(false)
      })

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      applySession(session)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
    }),
    [user, accessToken, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }