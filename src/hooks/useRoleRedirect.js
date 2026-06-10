'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '@/api/client'
import useAuth from '@/hooks/useAuth'

export default function useRoleRedirect(requiredRole, redirectTo = '/pages') {
  const { user, loading } = useAuth()
  const router = useRouter()

  const roleKey = useMemo(() => {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

    return roles
      .map((role) => String(role).toLowerCase())
      .join('|')
  }, [requiredRole])

  const [checkingRole, setCheckingRole] = useState(true)
  const [roleReady, setRoleReady] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      setCheckingRole(false)
      setRoleReady(false)
      router.replace(redirectTo)
      return
    }

    let cancelled = false

    const cacheKey = `role-ok:${user.id}:${roleKey}`
    const cachedOk =
      typeof window !== 'undefined' &&
      sessionStorage.getItem(cacheKey) === '1'

    if (cachedOk) {
      setRoleReady(true)
      setCheckingRole(false)
    } else {
      setCheckingRole(true)
    }

    async function checkRole() {
      const allowedRoles = roleKey.split('|')

      const { data, error } = await client
        .from('staff')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (cancelled) return

      const dbRole = data?.role?.toLowerCase()
      const ok = !error && allowedRoles.includes(dbRole)

      if (!ok) {
        sessionStorage.removeItem(cacheKey)
        setRoleReady(false)
        setCheckingRole(false)
        router.replace(redirectTo)
        return
      }

      sessionStorage.setItem(cacheKey, '1')
      setRoleReady(true)
      setCheckingRole(false)
    }

    checkRole()

    return () => {
      cancelled = true
    }
  }, [loading, user?.id, roleKey, redirectTo, router])

  return {
    user,
    loading,
    checkingRole: !roleReady && checkingRole,
  }
}