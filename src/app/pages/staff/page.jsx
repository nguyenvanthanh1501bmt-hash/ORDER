'use client'

import useRoleRedirect from '@/hooks/useRoleRedirect'
import { Button } from '@/components/ui/button'
import client from '@/api/client'

export default function StaffPage() {
  const { user, loading, checkingRole } = useRoleRedirect('staff')

  if (loading || checkingRole) return <h1>Loading...</h1>
  if (!user) return null // đang redirect

  const handleLogout = async () => {
    try {
      const { error } = await client.auth.signOut()
      if (error) {
        console.error('Logout error:', error.message)
        return
      }
      window.location.href = '/pages'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="p-4">
      <h1>Welcome, Staff!</h1>
      <Button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600">
        Logout
      </Button>
    </div>
  )
}
