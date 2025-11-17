'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import client from '@/api/client'
import useAuth from '@/hooks/useAuth'

export default function useRoleRedirect(requiredRole, redirectTo = '/pages') {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      if (!loading) {
        if (!user) {
          router.push(redirectTo)
          return
        }

        try {
          const { data, error } = await client
            .from('staff')
            .select('role')
            .eq('email', user.email)
            .single()

          if (error || !data || data.role !== requiredRole) {
            router.push(redirectTo)
            return
          }

          setCheckingRole(false)
        } catch (err) {
          console.error(err)
          router.push(redirectTo)
        }
      }
    }

    checkRole()
  }, [user, loading, router, requiredRole, redirectTo])

  return { user, loading, checkingRole }
}
